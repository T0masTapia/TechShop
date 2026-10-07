'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { UserCheck, UserX, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CheckoutEntryPage() {
  const { cart } = useCart();
  
  // 'choice': pantalla con las 2 opciones | 'guest_form': formulario de invitado
  const [step, setStep] = useState<'choice' | 'guest_form'>('choice');

  // Datos del invitado listos para cuando se conecte la orden
  const [guestData, setGuestData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  const total = cart.reduce((acc: number, item: any) => acc + item.price * (item.quantity || 1), 0);

  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestData({ ...guestData, [e.target.name]: e.target.value });
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos de invitado listos para el checkout:', guestData);
    // Aquí más adelante lo mandarás al resumen de pago final
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-black mb-3">Tu carrito está vacío</h1>
        <p className="text-gray-400 text-sm mb-6">Agrega productos antes de comenzar la compra.</p>
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all"
        >
          Volver al Catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabecera */}
        <div className="text-center mb-10">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-500">
            Paso 1 de 2 • Identificación
          </span>
          <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase mt-1">
            ¿Cómo deseas <span className="text-blue-500">continuar?</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">
            Elige una opción para gestionar tu pedido y el comprobante de compra.
          </p>
        </div>

        {/* ─── PANTALLA 1: ELECCIÓN (LOGIN vs INVITADO) ─── */}
        {step === 'choice' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Opción A: Iniciar Sesión */}
            <div className="bg-[#0b0b0f] border border-white/[0.06] hover:border-purple-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden shadow-xl">
              <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-purple-500/10 blur-3xl rounded-full group-hover:bg-purple-500/20 transition-all pointer-events-none" />
              
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5">
                  <UserCheck size={24} />
                </div>
                <h2 className="text-xl font-bold mb-2">Ya tengo una cuenta</h2>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
                  Inicia sesión para usar tus direcciones guardadas y acumular el historial de tus pedidos en tu perfil.
                </p>
              </div>

              <Link
                href="/login?redirect=/checkout"
                className="w-full inline-flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-purple-600 border border-white/10 hover:border-transparent text-white font-bold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-wider transition-all duration-300"
              >
                <span>Iniciar Sesión</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Opción B: Continuar como Invitado */}
            <div className="bg-[#0b0b0f] border border-white/[0.06] hover:border-blue-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden shadow-xl">
              <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all pointer-events-none" />
              
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5">
                  <UserX size={24} />
                </div>
                <h2 className="text-xl font-bold mb-2">Comprar como Invitado</h2>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
                  Compra de forma rápida y sin crear contraseñas. Solo te pediremos los datos esenciales para tu entrega y boleta.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep('guest_form')}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(59,130,246,0.3)] transition-all duration-300"
              >
                <span>Continuar como Invitado</span>
                <ArrowRight size={16} />
              </button>
            </div>

          </div>
        )}

        {/* ─── PANTALLA 2: FORMULARIO RÁPIDO DE INVITADO ─── */}
        {step === 'guest_form' && (
          <div className="bg-[#0b0b0f] border border-white/[0.06] rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                  Modo Invitado
                </span>
                <h2 className="text-xl font-bold mt-0.5">Información de Envío y Contacto</h2>
              </div>
              <button
                type="button"
                onClick={() => setStep('choice')}
                className="text-xs text-gray-400 hover:text-white underline transition-colors"
              >
                Cambiar opción
              </button>
            </div>

            <form onSubmit={handleGuestSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Nombre completo */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={guestData.fullName}
                    onChange={handleGuestChange}
                    placeholder="Ej. Matías González"
                    className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Email (para la boleta) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Correo Electrónico (para tu boleta)
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={guestData.email}
                    onChange={handleGuestChange}
                    placeholder="correo@ejemplo.cl"
                    className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={guestData.phone}
                    onChange={handleGuestChange}
                    placeholder="+56 9 8765 4321"
                    className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Dirección */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Dirección de Entrega
                  </label>
                  <input
                    type="text"
                    required
                    name="address"
                    value={guestData.address}
                    onChange={handleGuestChange}
                    placeholder="Calle, número de casa/depto"
                    className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Ciudad / Comuna */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Comuna / Ciudad
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={guestData.city}
                    onChange={handleGuestChange}
                    placeholder="Ej. Quillota, Viña del Mar, etc."
                    className="w-full bg-[#121216] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Aviso de seguridad */}
              <div className="flex items-center gap-2 pt-2 text-xs text-gray-500">
                <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                <span>Tus datos solo se usarán para el envío y la emisión de tu comprobante.</span>
              </div>

              {/* Botón para continuar */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.06]">
                <div className="text-left w-full sm:w-auto">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">Total a pagar</span>
                  <span className="text-xl font-black text-white">${total.toLocaleString('es-CL')}</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3.5 px-8 rounded-xl text-xs uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(59,130,246,0.3)]"
                >
                  Continuar al Resumen →
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </main>
  );
}