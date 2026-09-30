'use client'

import { useCart } from '@/context/CartContext';
import Link from 'next/link'

export default function CartPage() {
    // let cantidadProductos = 3;
    const {cart, removeFromCart} = useCart();
    const cantidadProductos = cart.reduce((total, item) => total + item.quantity, 0);
    const totalDinero = cart.reduce((total, item) => total+ (item.price * item.quantity),0)

    return (
        <main className="min-h-screen bg-[#09090b] text-white py-8 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Navegación Breadcrumb */}
                <nav className="text-xs sm:text-sm text-gray-500 font-medium mb-6 flex items-center gap-2 select-none">
                    <Link 
                        href="/" 
                        className="hover:text-blue-500 transition-colors">
                        Home
                    </Link>
                    <span>&gt;</span>
                    <span className="text-gray-300 font-semibold">
                        Carro
                    </span>
                </nav>

                {/* Título Dinámico */}
                <div className="flex items-baseline gap-3 mb-8 select-none">
                    <h1 className="text-2xl sm:text-2xl font-black uppercase tracking-tight text-white">
                        Tu Carro
                    </h1>
                    <span className="text-sm sm:text-base font-bold text-gray-500">
                        ({cantidadProductos} {cantidadProductos === 1 ? 'producto' : 'productos'})
                    </span>
                </div>

                {/* CONTENEDOR GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LADO IZQUIERDO: Lista de Productos Reales */}
                    <div className="lg:col-span-8 space-y-4">
                        {cart.length === 0 ? (
                            <div className="p-8 bg-[#0c0c0e] border border-gray-800 rounded-xl text-center">
                                <p className="text-gray-500 font-medium">Tu carrito está vacío.</p>
                                <Link href="/" className="text-blue-500 hover:underline text-sm font-bold mt-2 inline-block">
                                    Volver a la tienda a buscar periféricos
                                </Link>
                            </div>
                        ) : (
                            cart.map((producto) => (
                                <div
                                    key={producto.id}
                                    className="p-5 bg-[#0c0c0e] border border-gray-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 relative group"
                                >
                                    {/* Contenedor de la Imagen */}
                                    <div className="w-20 h-20 bg-[#121214] border border-gray-800/60 rounded-lg overflow-hidden flex items-center justify-center p-2 flex-shrink-0">
                                        <img 
                                            src={producto.image_url} // Ajustado a tu base de datos de Supabase
                                            alt={producto.name} 
                                            className="w-full h-full object-contain" 
                                        />
                                    </div>

                                    {/* Información del Periférico */}
                                    <div className="flex-1 text-center sm:text-left min-w-0">
                                        {producto.brand && (
                                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block mb-0.5">
                                                {producto.brand}
                                            </span>
                                        )}
                                        <h3 className="text-sm font-bold text-gray-200 truncate">{producto.name}</h3>
                                        
                                        {/* Botón sutil para Eliminar el artículo */}
                                        <button
                                            onClick={() => removeFromCart(producto.id)}
                                            className="text-xs text-red-500/70 hover:text-red-400 mt-2 font-bold uppercase tracking-wider transition-colors block"
                                        >
                                            Eliminar
                                        </button>
                                    </div>

                                    {/* Cantidad */}
                                    <div className="text-xs text-gray-400 bg-[#121214] px-3 py-1.5 rounded border border-gray-800">
                                        Cantidad: {producto.quantity}
                                    </div>

                                    {/* Precio Acumulado (Precio * Cantidad) */}
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-base font-black italic text-gray-100">
                                            ${(producto.price * producto.quantity).toLocaleString('es-CL')}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* LADO DERECHO: Resumen de Compra Dinámico */}
                    <div className="lg:col-span-4 bg-[#0c0c0e] border border-gray-800 rounded-xl p-6 shadow-2xl">
                        <h2 className="text-lg font-bold text-gray-200 mb-6 tracking-tight">
                            Resumen de Compra
                        </h2>

                        <div className="space-y-4 text-sm text-gray-400">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="text-gray-200 font-medium">
                                    ${totalDinero.toLocaleString('es-CL')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Envío</span>
                                <span className="text-green-400 font-medium text-xs bg-green-950/20 px-2 py-0.5 rounded border border-green-500/20">
                                    Gratis
                                </span>
                            </div>

                            <div className="h-[1px] bg-gray-800 my-2"></div>

                            <div className="flex justify-between items-baseline pt-2">
                                <span className="text-base font-bold text-gray-200">Total</span>
                                <span className="text-xl font-black text-white italic">
                                    ${totalDinero.toLocaleString('es-CL')}
                                </span>
                            </div>
                        </div>

                        {/* Botón de acción (Deshabilitado si el carro está vacío) */}
                        <button 
                            disabled={cart.length === 0}
                            className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg text-sm uppercase tracking-wider transition-all"
                        >
                            Continuar al pago
                        </button>
                    </div>

                </div>

            </div>
        </main>
    )
}