'use client';

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext"; 
import { supabase } from "@/lib/Supabase";

export default function ProductCard({ product }: { product: any }) {
  const [showToast, setShowToast] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { addToCart } = useCart();


  // Formateador para moneda chilena (remueve espacios extras para estética de UI)
  const formatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  });

  const handleAddToCart = async (e: React.MouseEvent) => {
    // Evitamos que cualquier evento de click se propague hacia la tarjeta principal
    e.stopPropagation();

    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    addToCart(product);
    setShowToast(true);
  }

  return (
    <div className="group relative w-full flex flex-col h-full rounded-[24px] transition-all duration-500 ease-out">
      
      {/* Glow externo ultra suave y sofisticado (Estilo Linear) */}
      <div className="absolute -inset-px rounded-[24px] bg-gradient-to-b from-blue-500/20 to-purple-600/0 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 ease-out pointer-events-none z-0" />
      
      {/* Borde sutil reactivo */}
      <div className="absolute -inset-px rounded-[24px] bg-[#1a1a1f] group-hover:bg-gradient-to-b group-hover:from-blue-500/30 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none z-0" />

      {/* Contenedor Principal (Glassmorphism oscuro refinado) */}
      <div className="relative flex flex-col h-full w-full bg-[#070709]/80 backdrop-blur-md rounded-[24px] p-4.5 transition-all duration-500 ease-out z-10 flex-1 justify-between">
        
        {/* ─── ENLACE AL DETALLE (Imagen + Info) ─── */}
        <Link href={`/product/${product.slug}`} className="flex-1 flex flex-col cursor-pointer group/link">
          
          {/* Contenedor de Imagen Premium */}
          <div className="relative aspect-square w-full bg-[#0d0d11] rounded-2xl mb-4 overflow-hidden border border-white/[0.03] group-hover/link:border-white/[0.06] flex items-center justify-center p-6 shadow-[inset_0_2px_12px_rgba(0,0,0,0.5)] transition-colors duration-500">
            
            {/* Gradiente de profundidad en la imagen */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />

            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain rounded-xl transform group-hover/link:scale-[1.05] group-hover:rotate-1 transition-all duration-700 ease-out z-0"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px] uppercase font-black tracking-widest">
                No Image
              </div>
            )}
          </div>

          {/* Contenido de Texto */}
          <div className="flex-1 flex flex-col">
            
            {/* Header de la Info: Marca y Estado de Stock */}
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.25em] select-none">
                {product.brand}
              </span>
              
              {/* Badge de disponibilidad ultra refinado */}
              <div className="flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.04] py-0.5 px-2 rounded-full">
                <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`} />
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                  {product.stock > 0 ? 'Stock' : 'Agotado'}
                </span>
              </div>
            </div>

            {/* Nombre del Producto */}
            <h3 className="text-white font-bold text-lg leading-snug mb-4 group-hover/link:text-blue-400/90 transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>

            {/* Especificaciones Técnicas con estilo Chip Modular */}
            <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
              {product.specifications && Object.entries(product.specifications).slice(0, 3).map(([key, value]) => (
                <div 
                  key={key} 
                  className="bg-white/[0.02] border border-white/[0.03] hover:border-white/[0.08] hover:bg-white/[0.04] px-2.5 py-1 rounded-lg transition-all duration-300"
                >
                  <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest leading-none mb-0.5">
                    {key.replace(/_/g, " ")}
                  </p>
                  <p className="text-[10.5px] text-gray-300 font-semibold leading-tight">
                    {String(value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Link>

        {/* Footer de la tarjeta */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/[0.04] relative z-20">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mb-0.5 select-none">Valor Efectivo</span>
            <span className="text-xl font-black text-white tracking-tight">
              {formatter.format(product.price)}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="group/btn flex items-center justify-center w-11 h-11 bg-white text-black rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-[0.92] duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.05)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.3)] border border-white/10 hover:border-blue-500/20"
            title="Añadir rápido al carrito"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="transform group-hover/btn:rotate-90 transition-transform duration-300"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
        </div>
      </div>

      {/* ─── MODAL DE AUTENTICACIÓN (AVISO DE LOGIN) ─── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto animate-in fade-in duration-300 p-4">
          <div className="bg-[#0b0b0f] border border-white/[0.08] text-white p-7 rounded-[28px] shadow-[0_24px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(59,130,246,0.15)] flex flex-col items-center text-center max-w-sm w-full relative overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Glow decorativo de fondo */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/15 blur-[60px] rounded-full pointer-events-none" />

            {/* Ícono de candado / usuario */}
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 relative z-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>

            <h3 className="text-xl font-bold tracking-tight mb-2 relative z-10">
              Inicia sesión para comprar
            </h3>
            
            <p className="text-sm text-gray-400 mb-6 leading-relaxed relative z-10">
              Debes tener una cuenta activa para poder añadir productos al carrito y continuar con tu compra.
            </p>

            <div className="flex flex-col gap-2.5 w-full relative z-10">
              <Link
                href="/login"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[11px] py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(59,130,246,0.3)]"
              >
                Iniciar Sesión
              </Link>
              
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-full text-gray-400 hover:text-white font-black uppercase tracking-widest text-[10px] py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] transition-all active:scale-[0.98]"
              >
                Seguir mirando
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TOAST MODAL DE AVISO (Estilo Glassmorphic Apple/Stripe) */}
      {showToast && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 backdrop-blur-md pointer-events-auto animate-in fade-in duration-300">
          
          {/* TARJETA DEL AVISO */}
          <div className="bg-[#0b0b0f]/95 border border-white/[0.08] text-white p-6 rounded-[28px] shadow-[0_24px_80px_rgba(0,0,0,0.8),0_0_40px_rgba(59,130,246,0.15)] flex flex-col gap-5 w-full max-w-lg mx-4 relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-400 ease-out">
            
            {/* Efecto de luz de fondo en el modal */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-60 h-60 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Cabecera */}
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
                <p className="text-xs font-black text-blue-500 uppercase tracking-[0.25em] m-0">
                  ¡Producto Agregado!
                </p>
              </div>

              {/* Botón X de Cierre */}
              <button
                onClick={() => setShowToast(false)}
                className="text-gray-500 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.03] text-sm font-semibold w-8 h-8 rounded-full transition-all active:scale-90 flex items-center justify-center"
                title="Cerrar ventana"
              >
                ✕
              </button>
            </div>

            {/* Tarjeta de Producto Interna */}
            <div className="flex items-center gap-5 bg-white/[0.02] border border-white/[0.03] p-4.5 rounded-2xl w-full relative z-10">
              
              {/* Contenedor Imagen */}
              <div className="w-20 h-20 bg-[#121216] rounded-xl overflow-hidden border border-white/[0.04] flex-shrink-0 flex items-center justify-center p-3 shadow-inner">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-white/20 text-[10px] uppercase font-bold tracking-wider">
                    No Image
                  </div>
                )}
              </div>
              
              {/* Información */}
              <div className="flex flex-col flex-1 justify-center min-w-0 text-left">
                {product.brand && (
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 select-none">
                    {product.brand}
                  </span>
                )}
                
                <h4 className="text-lg font-bold text-white leading-tight tracking-tight mb-2 truncate">
                  {product.name}
                </h4>
                
                <p className="text-lg font-black text-blue-400 italic tracking-wide m-0">
                  {formatter.format(product.price)}
                </p>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-1 relative z-10">
              
              {/* Seguir Explorando */}
              <button 
                onClick={() => setShowToast(false)} 
                className="w-full sm:w-auto flex-1 text-gray-400 hover:text-white font-black uppercase tracking-widest text-[10px] px-5 py-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.08] transition-all active:scale-[0.97]"
              >
                Seguir explorando
              </button>

              {/* Ir al Carrito */}
              <Link 
                href="/cart"
                className="w-full sm:w-auto flex-1 text-center bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] px-6 py-3.5 rounded-xl transition-all active:scale-[0.97] shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.45)] border border-blue-500/20"
              >
                Ir al carrito
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}