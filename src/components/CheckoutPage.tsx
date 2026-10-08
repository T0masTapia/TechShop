'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/Supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Check,
    User,
    Truck,
    CreditCard,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    ShieldCheck
} from 'lucide-react';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, clearCart } = useCart();

    // Estados de navegación y autenticación
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [user, setUser] = useState<any>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    // Datos del cliente / despacho
    const [customer, setCustomer] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: 'Quillota', // Comuna por defecto
    });

    // Estados de la compra
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [orderSuccess, setOrderSuccess] = useState<{ id: string; total: number } | null>(null);

    const totalDinero = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Verificar si hay sesión activa
    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setCustomer(prev => ({
                    ...prev,
                    email: user.email || '',
                    fullName: user.user_metadata?.full_name || ''
                }));
                // Si ya está logueado, pasa directo al paso 2 (Entrega)
                setCurrentStep(2);
            }
            setLoadingUser(false);
        }
        checkUser();
    }, []);

    // Si el carrito está vacío y no hay orden creada, redirigir
    useEffect(() => {
        if (cart.length === 0 && !orderSuccess && !loadingUser) {
            router.push('/cart');
        }
    }, [cart, orderSuccess, loadingUser, router]);

    // Manejar el submit del paso 2 (Despacho)
    const handleDeliverySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customer.fullName || !customer.email || !customer.phone || !customer.address) {
            setErrorMessage('Por favor completa todos los campos de despacho.');
            return;
        }
        setErrorMessage(null);
        setCurrentStep(3); // Pasar al paso de Pago
    };

    // Procesar la orden final
    const handleFinalPayment = async () => {
        setIsProcessing(true);
        setErrorMessage(null);

        try {
            const response = await fetch('/api/checkout/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    customer: customer,
                    userId: user?.id || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ocurrió un error al procesar el pago.');
            }

            if (clearCart) clearCart();
            setOrderSuccess({ id: data.orderId, total: data.total });

        } catch (err: any) {
            setErrorMessage(err.message || 'Error de conexión');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loadingUser) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#09090b] text-white py-10 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">

                {/* STEPPER SUPERIOR (Estilo PC Factory) */}
                <div className="mb-12">
                    <div className="flex items-center justify-center max-w-xl mx-auto relative">
                        {/* Línea conectora de fondo */}
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800 -translate-y-1/2 z-0" />

                        {/* Paso 1: Identificación */}
                        <div className="relative z-10 flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${currentStep > 1
                                    ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                                    : currentStep === 1
                                        ? 'bg-blue-600 text-white ring-4 ring-blue-500/20'
                                        : 'bg-gray-900 border border-gray-700 text-gray-500'
                                }`}>
                                {currentStep > 1 ? <Check size={18} strokeWidth={3} /> : '1'}
                            </div>
                            <span className={`text-[11px] font-bold mt-2 uppercase tracking-wider ${currentStep >= 1 ? 'text-gray-200' : 'text-gray-600'}`}>
                                Identificación
                            </span>
                        </div>

                        {/* Separador elástico */}
                        <div className="flex-1" />

                        {/* Paso 2: Entrega */}
                        <div className="relative z-10 flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${currentStep > 2
                                    ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                                    : currentStep === 2
                                        ? 'bg-blue-600 text-white ring-4 ring-blue-500/20'
                                        : 'bg-gray-900 border border-gray-700 text-gray-500'
                                }`}>
                                {currentStep > 2 ? <Check size={18} strokeWidth={3} /> : '2'}
                            </div>
                            <span className={`text-[11px] font-bold mt-2 uppercase tracking-wider ${currentStep >= 2 ? 'text-gray-200' : 'text-gray-600'}`}>
                                Tipo de Entrega
                            </span>
                        </div>

                        {/* Separador elástico */}
                        <div className="flex-1" />

                        {/* Paso 3: Pago */}
                        <div className="relative z-10 flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${currentStep === 3
                                    ? 'bg-blue-600 text-white ring-4 ring-blue-500/20'
                                    : 'bg-gray-900 border border-gray-700 text-gray-500'
                                }`}>
                                3
                            </div>
                            <span className={`text-[11px] font-bold mt-2 uppercase tracking-wider ${currentStep === 3 ? 'text-gray-200' : 'text-gray-600'}`}>
                                Pago
                            </span>
                        </div>
                    </div>
                </div>

                {/* CONTENEDOR PRINCIPAL: PASO ACTIVO + RESUMEN DERECHA */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LADO IZQUIERDO: CONTENIDO SEGÚN EL PASO */}
                    <div className="lg:col-span-8">

                        {errorMessage && (
                            <div className="mb-6 p-4 bg-red-950/40 border border-red-500/30 rounded-2xl flex items-center gap-3 text-sm text-red-400">
                                <AlertTriangle size={18} className="shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {/* ========================================== */}
                        {/* PASO 1: IDENTIFICACIÓN (Login vs Invitado) */}
                        {/* ========================================== */}
                        {currentStep === 1 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">

                                {/* Opción 1: Iniciar Sesión */}
                                <div className="bg-[#0c0c0e] border border-gray-800 rounded-2xl p-7 flex flex-col justify-between hover:border-gray-700 transition-colors">
                                    <div>
                                        <h3 className="text-base font-bold text-white mb-2">¿Ya eres cliente?</h3>
                                        <p className="text-xs text-gray-400 leading-relaxed mb-6">
                                            Inicia sesión para una compra más rápida y tener guardado todo tu historial de pedidos.
                                        </p>
                                    </div>
                                    <Link
                                        href="/login?redirect=/checkout"
                                        className="w-full py-3.5 bg-[#18181b] hover:bg-[#27272a] text-white font-bold rounded-xl text-xs uppercase tracking-wider text-center border border-gray-700 transition-all"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                </div>

                                {/* Opción 2: Continuar como invitado */}
                                <div className="bg-[#0c0c0e] border border-gray-800 rounded-2xl p-7 flex flex-col justify-between hover:border-blue-500/40 transition-colors">
                                    <div>
                                        <h3 className="text-base font-bold text-white mb-2">¿No tienes cuenta?</h3>
                                        <p className="text-xs text-gray-400 leading-relaxed mb-6">
                                            No te preocupes. Puedes completar tu compra directamente como invitado en menos de 1 minuto.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setCurrentStep(2)}
                                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(59,130,246,0.3)]"
                                    >
                                        Continuar como invitado
                                    </button>
                                </div>

                            </div>
                        )}

                        {/* ========================================== */}
                        {/* PASO 2: TIPO DE ENTREGA / DESPACHO         */}
                        {/* ========================================== */}
                        {currentStep === 2 && (
                            <div className="bg-[#0c0c0e] border border-gray-800 rounded-2xl p-7 animate-in fade-in duration-300">
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <Truck className="text-blue-500" size={20} />
                                        <h3 className="text-base font-bold text-white">Datos de Despacho y Contacto</h3>
                                    </div>
                                    {!user && (
                                        <button
                                            onClick={() => setCurrentStep(1)}
                                            className="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-semibold"
                                        >
                                            <ArrowLeft size={14} /> Cambiar opción
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleDeliverySubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                                                Nombre Completo *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={customer.fullName}
                                                onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                                                placeholder="Ej. Juan Pérez"
                                                className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                                                Correo Electrónico *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={customer.email}
                                                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                                                placeholder="juan@ejemplo.com"
                                                className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                                                Teléfono Móvil *
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={customer.phone}
                                                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                                                placeholder="+56 9 1234 5678"
                                                className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                                                Ciudad / Comuna *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={customer.city}
                                                onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                                                placeholder="Ej. Quillota / Viña del Mar"
                                                className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                                            Dirección de Entrega (Calle, Número, Depto) *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={customer.address}
                                            onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                                            placeholder="Ej. Calle Prat 450, Depto 302"
                                            className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            className="py-3 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(59,130,246,0.3)]"
                                        >
                                            Continuar al Pago
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* ========================================== */}
                        {/* PASO 3: SELECCIÓN DE PAGO                  */}
                        {/* ========================================== */}
                        {currentStep === 3 && (
                            <div className="bg-[#0c0c0e] border border-gray-800 rounded-2xl p-7 animate-in fade-in duration-300">
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="text-blue-500" size={20} />
                                        <h3 className="text-base font-bold text-white">Método de Pago</h3>
                                    </div>
                                    <button
                                        onClick={() => setCurrentStep(2)}
                                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-semibold"
                                    >
                                        <ArrowLeft size={14} /> Editar Despacho
                                    </button>
                                </div>

                                {/* Resumen del destinatario */}
                                <div className="bg-[#121216] border border-white/5 rounded-xl p-4 mb-6 text-xs text-gray-400 flex flex-col sm:flex-row justify-between gap-2">
                                    <div>
                                        <span className="font-bold text-white block">{customer.fullName}</span>
                                        <span>{customer.email} • {customer.phone}</span>
                                    </div>
                                    <div className="sm:text-right">
                                        <span className="text-gray-300">{customer.address}, {customer.city}</span>
                                    </div>
                                </div>

                                {/* Métodos disponibles */}
                                <div className="space-y-3 mb-8">
                                    <label className="flex items-center justify-between p-4 bg-[#121216] border-2 border-blue-500 rounded-xl cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full border-4 border-blue-500 bg-white" />
                                            <div>
                                                <p className="text-xs font-bold text-white">Simulación de Pago Instantáneo</p>
                                                <p className="text-[11px] text-gray-400">Verifica stock y descuenta inventario en tiempo real.</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                                            Modo Sandbox
                                        </span>
                                    </label>
                                </div>

                                <button
                                    onClick={handleFinalPayment}
                                    disabled={isProcessing}
                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(16,185,129,0.3)]"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Confirmando pedido con la pasarela...</span>
                                        </>
                                    ) : (
                                        `Pagar $${totalDinero.toLocaleString('es-CL')}`
                                    )}
                                </button>
                            </div>
                        )}

                    </div>

                    {/* LADO DERECHO: RESUMEN LATERAL (Tal cual PC Factory) */}
                    <div className="lg:col-span-4 bg-[#0c0c0e] border border-gray-800 rounded-2xl p-6 sticky top-8">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                                Tu Carro ({cart.reduce((a, b) => a + b.quantity, 0)} {cart.length === 1 ? 'Producto' : 'Productos'})
                            </h4>
                            <Link href="/cart" className="text-[11px] font-bold text-blue-400 hover:underline">
                                Editar
                            </Link>
                        </div>

                        {/* Lista compacta de items */}
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-6 divide-y divide-gray-800/40">
                            {cart.map((item) => (
                                <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#121216] border border-gray-800 rounded-lg p-1 shrink-0 flex items-center justify-center">
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-gray-200 truncate">{item.name}</p>
                                        <p className="text-[10px] text-gray-500">Cant: {item.quantity}</p>
                                    </div>
                                    <p className="text-xs font-bold text-white">
                                        ${(item.price * item.quantity).toLocaleString('es-CL')}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Desglose de totales */}
                        <div className="pt-4 border-t border-gray-800 space-y-2 text-xs">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span className="text-gray-200">${totalDinero.toLocaleString('es-CL')}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Despacho</span>
                                <span className="text-emerald-400 font-bold">Gratis</span>
                            </div>
                            <div className="h-px bg-gray-800 my-2" />
                            <div className="flex justify-between items-baseline pt-1">
                                <span className="text-sm font-bold text-white">Total a Pagar</span>
                                <span className="text-xl font-black text-blue-400">
                                    ${totalDinero.toLocaleString('es-CL')}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-500">
                            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                            <span>Transacción cifrada y protegida por Supabase.</span>
                        </div>
                    </div>

                </div>

            </div>

            {/* MODAL DE ÉXITO FINAL */}
            {orderSuccess && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-[#0c0c0e] border border-white/10 text-white p-7 rounded-[28px] max-w-md w-full text-center relative overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.9)]">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={32} />
                        </div>

                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
                            Compra Confirmada
                        </span>
                        <h3 className="text-2xl font-black tracking-tight mt-1 mb-2">
                            ¡Gracias por tu compra!
                        </h3>
                        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                            Hemos recibido tu orden y ya está registrada en el sistema.
                        </p>

                        <div className="bg-[#121216] border border-white/5 rounded-2xl p-4 text-left space-y-2 mb-6 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-500 uppercase font-bold text-[10px] tracking-wider">N° de Boleta</span>
                                <span className="font-mono text-gray-300 truncate max-w-[200px]">{orderSuccess.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 uppercase font-bold text-[10px] tracking-wider">Total</span>
                                <span className="font-black text-white">${orderSuccess.total.toLocaleString('es-CL')}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                            <Link
                                href={`/order/${orderSuccess.id}`}
                                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[11px] rounded-xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] text-center"
                            >
                                Ver e Imprimir Boleta
                            </Link>

                            <Link
                                href="/"
                                className="flex-1 py-3.5 bg-[#18181b] hover:bg-[#27272a] text-gray-300 hover:text-white font-black uppercase tracking-widest text-[11px] rounded-xl border border-gray-800 transition-all text-center"
                            >
                                Volver a la tienda
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}