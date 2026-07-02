'use client';

import Link from "next/link";
import { useState } from "react";
import {useCart} from "@/context/CartContext"; 

export default function ProductCard({ product }: { product: any }) {

  const [showToast, setShowToast] = useState(false);
  const {addToCart} = useCart();

  // Formateador para moneda chilena
  const formatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  });

  const handleAddToCart = () => {

    // console.log("¡BOTÓN PRESIONADO! Intentando agregar el producto:", product.name);
    addToCart(product);
    setShowToast(true);
    // setTimeout(() => {
    //   setShowToast(false);
    // }, 3000);
  }

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 rounded-[2.05rem] blur opacity-0 group-hover:opacity-25 transition duration-500 z-0"></div>
      <div className="bg-[#0a0a0a] border border-gray-800 rounded-[2rem] p-5 hover:border-blue-500/50 transition-all group flex flex-col h-full shadow-2xl">

        {/* Contenedor de Imagen */}
        <div className="aspect-square bg-[#111] rounded-2xl mb-5 overflow-hidden relative border border-gray-900 flex items-center justify-center p-6">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl transform group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-800 text-[10px] uppercase font-bold tracking-widest">No Image</div>
          )}
        </div>

        {/* Contenido */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">{product.brand}</span>
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>

          <h3 className="text-white font-bold text-xl leading-tight mb-3 group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>

          {/* Renderizado de Especificaciones Técnicas (JSONB) */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="bg-gray-900/50 border border-gray-800 px-2 py-1 rounded-md">
                <p className="text-[9px] text-gray-500 uppercase font-bold leading-none mb-0.5">{key}</p>
                <p className="text-[11px] text-gray-300 font-medium leading-none">{String(value)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer de la tarjeta */}
        <div className="mt-auto pt-5 flex items-center justify-between border-t border-gray-900">
          <span className="text-2xl font-black text-white italic">
            {formatter.format(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            className="relative z-30 bg-white text-black p-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-90 shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
          </button>
        </div>
      </div>

      {/* TOAST DE AVISO */}
      {showToast && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 pointer-events-auto animate-fade-in">
          
          {/* TARJETA DEL AVISO */}
          <div className="bg-[#0c0c0e] border-2 border-blue-500 text-white p-6 rounded-2xl shadow-[0_0_60px_rgba(59,130,246,0.35)] flex flex-col gap-5 w-full max-w-lg mx-4 relative">
            
            {/* Cabecera con título y el BOTÓN DE CIERRE (X) */}
            <div className="flex items-center justify-between border-b border-gray-900 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
                <p className="text-sm font-black text-blue-500 uppercase tracking-[0.2em] m-0">
                  ¡Producto Agregado al carrito!
                </p>
              </div>

              {/* BOTÓN X PARA CERRAR EL MODAL */}
              <button
                onClick={() => setShowToast(false)}
                className="text-gray-500 hover:text-white text-xl font-medium p-1 px-2.5 rounded-lg hover:bg-gray-900/50 transition-all active:scale-90"
                title="Cerrar ventana"
              >
                ✕
              </button>
            </div>

            {/* RECTÁNGULO HORIZONTAL (Imagen + Info) */}
            <div className="flex items-center gap-6 bg-[#111115]/60 border border-gray-800/60 p-5 rounded-xl w-full">
              
              {/* Izquierda: Imagen */}
              <div className="w-24 h-24 bg-[#16161a] rounded-xl overflow-hidden border border-gray-800 flex-shrink-0 flex items-center justify-center p-3 shadow-inner">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-gray-700 text-[10px] uppercase font-bold tracking-wider">
                    No Image
                  </div>
                )}
              </div>
              
              {/* Derecha: Información */}
              <div className="flex flex-col flex-1 justify-center min-w-0 text-left">
                {product.brand && (
                  <span className="text-xs text-gray-500 font-black uppercase tracking-widest mb-1">
                    {product.brand}
                  </span>
                )}
                
                <h4 className="text-xl font-black text-white leading-tight tracking-tight mb-2 truncate">
                  {product.name}
                </h4>
                
                <p className="text-lg font-black text-blue-400 italic tracking-wide m-0">
                  {formatter.format(product.price)}
                </p>
              </div>

            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-between gap-4 bg-[#111115]/80 border border-gray-800/60 p-4 rounded-xl w-full mt-1">
              
              {/* Seguir explorando */}
              <button 
                onClick={() => setShowToast(false)} 
                className="text-gray-400 hover:text-white font-black uppercase tracking-widest text-[11px] px-4 py-3 rounded-lg hover:bg-gray-900/50 transition-all active:scale-95 border border-transparent hover:border-gray-800"
              >
                Continuar explorando
              </button>

              {/* Ir al carrito */}
              <Link 
               href="/cart"
                className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[11px] px-6 py-3 rounded-lg transition-all active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
              >
                Ir al carrito
              </Link>

            </div>
            {/* Pie de la ventana
            <p className="text-xs text-gray-500 m-0 text-right italic font-medium tracking-wide">
              Haz clic en la ✕ de arriba para continuar explorando.
            </p> */}

          </div>

        </div>
      )}

    </div>
  );
}