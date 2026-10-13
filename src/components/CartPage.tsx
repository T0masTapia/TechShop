'use client'

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Plus, Minus } from 'lucide-react';

export default function CartPage() {
  const { cart, addToCart, decreaseQuantity, removeFromCart } = useCart();

  const cantidadProductos = cart.reduce((total, item) => total + item.quantity, 0);
  const totalDinero = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <main className="min-h-screen bg-[#09090b] text-white py-8 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Navegación Breadcrumb */}
        <nav className="text-xs sm:text-sm text-gray-500 font-medium mb-6 flex items-center gap-2 select-none">
          <Link href="/" className="hover:text-blue-500 transition-colors">
            Home
          </Link>
          <span>&gt;</span>
          <span className="text-gray-300 font-semibold">Carro</span>
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

          {/* LADO IZQUIERDO: Lista de Productos */}
          <div className="lg:col-span-8 space-y-4">
            {cart.length === 0 ? (
              <div className="p-8 bg-[#0c0c0e] border border-gray-800 rounded-xl text-center">
                <p className="text-gray-500 font-medium">Tu carrito está vacío.</p>
                <Link href="/" className="text-blue-500 hover:underline text-sm font-bold mt-2 inline-block">
                  Volver a la tienda a buscar periféricos
                </Link>
              </div>
            ) : (
              cart.map((producto) => {
                const stockDisponible = Number(producto.stock) || 0;
                const topeAlcanzado = Number(producto.quantity) >= stockDisponible;

                return (
                  <div
                    key={producto.id}
                    className="p-5 bg-[#0c0c0e] border border-gray-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 relative group"
                  >
                    <div className="w-20 h-20 bg-[#121214] border border-gray-800/60 rounded-lg overflow-hidden flex items-center justify-center p-2 flex-shrink-0">
                      <img
                        src={producto.image_url}
                        alt={producto.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 text-center sm:text-left min-w-0">
                      {producto.brand && (
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block mb-0.5">
                          {producto.brand}
                        </span>
                      )}
                      <h3 className="text-sm font-bold text-gray-200 truncate">{producto.name}</h3>

                      <button
                        onClick={() => removeFromCart(producto.id)}
                        className="text-xs text-red-500/70 hover:text-red-400 mt-2 font-bold uppercase tracking-wider transition-colors inline-block cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </div>

                    {/* SELECTOR DE CANTIDAD (+ y -) */}
                    <div className="flex items-center bg-[#121214] border border-gray-800 rounded-lg p-1 shrink-0">
                      <button
                        onClick={() => decreaseQuantity(producto.id)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors cursor-pointer"
                        title="Restar una unidad"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="text-xs font-mono font-bold text-gray-200 px-3 min-w-[2rem] text-center select-none">
                        {producto.quantity}
                      </span>

                      <button
                        onClick={() => addToCart(producto, 1)}
                        disabled={topeAlcanzado}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                        title={topeAlcanzado ? "Stock máximo alcanzado" : "Sumar una unidad"}
                      >
                        <Plus size={14} />  
                      </button>
                    </div>

                    <div className="text-right flex-shrink-0 min-w-[100px]">
                      <p className="text-base font-black italic text-gray-100">
                        ${(producto.price * producto.quantity).toLocaleString('es-CL')}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* LADO DERECHO: Resumen y Enlace a /checkout */}
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

            {cart.length > 0 ? (
              <Link
                href="/checkout"
                className="w-full mt-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl text-xs uppercase tracking-widest text-center inline-block transition-all shadow-[0_4px_20px_rgba(59,130,246,0.25)]"
              >
                Continuar al pago
              </Link>
            ) : (
              <button
                disabled
                className="w-full mt-6 py-3.5 bg-gray-800 text-gray-600 cursor-not-allowed font-black rounded-xl text-xs uppercase tracking-widest text-center"
              >
                Continuar al pago
              </button>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}