'use client';

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/Supabase";
import { UserCheck, UserX, ArrowLeft, Check, ShieldCheck } from "lucide-react";

export default function ProductCard({ product }: { product: any }) {
  const [showToast, setShowToast] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // 'selection': elegir entre Login o Invitado | 'guest_form': formulario de datos
  const [modalStep, setModalStep] = useState<'selection' | 'guest_form'>('selection');

  // Datos del invitado
  const [guestInfo, setGuestInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  const { addToCart } = useCart();

  const formatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  });

  const confirmAddToCart = () => {
    addToCart(product);
    setShowToast(true);
  };

  const handleAddToCartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Comprobar si hay sesión iniciada en Supabase
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setModalStep('selection');
      setShowAuthModal(true);
      return;
    }

    confirmAddToCart();
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Guardamos la info temporalmente o en memoria si se requiere a futuro
    setShowAuthModal(false);
    confirmAddToCart();
  };

  return (
    <div className="group relative w-full flex flex-col h-full rounded-[24px] transition-all duration-500 ease-out">

      {/* Glow externo */}
      <div className="absolute -inset-px rounded-[24px] bg-gradient-to-b from-blue-500/20 to-purple-600/0 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 ease-out pointer-events-none z-0" />

      {/* Borde reactivo */}
      <div className="absolute -inset-px rounded-[24px] bg-[#1a1a1f] group-hover:bg-gradient-to-b group-hover:from-blue-500/30 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none z-0" />

      {/* Contenedor Principal */}
      <div className="relative flex flex-col h-full w-full bg-[#070709]/80 backdrop-blur-md rounded-[24px] p-4.5 transition-all duration-500 ease-out z-10 flex-1 justify-between">

        {/* Link al detalle */}
        <Link href={`/product/${product.slug}`} className="flex-1 flex flex-col cursor-pointer group/link">

          {/* Contenedor de Imagen */}
          <div className="relative aspect-square w-full bg-[#0d0d11] rounded-2xl mb-4 overflow-hidden border border-white/[0.03] group-hover/link:border-white/[0.06] flex items-center justify-center p-6 shadow-[inset_0_2px_12px_rgba(0,0,0,0.5)] transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />

            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-xl transform group-hover/link:scale-[1.05] group-hover:rotate-1 transition-all duration-700 ease-out z-0"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px] uppercase font-black tracking-widest">
                No Image
              </div>
            )}
          </div>

          {/* Información */}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.25em] select-none">
                {product.brand}
              </span>

              <div className={`flex items-center gap-1.5 border py-0.5 px-2 rounded-full transition-colors ${(product.stock ?? 0) > 0
                  ? 'bg-emerald-500/[0.06] border-emerald-500/20'
                  : 'bg-red-500/[0.06] border-red-500/20'
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${(product.stock ?? 0) > 0
                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                    : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                  }`} />
                <span className={`text-[9px] font-bold uppercase tracking-wider ${(product.stock ?? 0) > 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                  {(product.stock ?? 0) > 0 ? `${product.stock} un.` : 'Agotado'}
                </span>
              </div>
            </div>

            <h3 className="text-white font-bold text-lg leading-snug mb-4 group-hover/link:text-blue-400/90 transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>

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

        {/* Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/[0.04] relative z-20">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mb-0.5 select-none">Valor Efectivo</span>
            <span className="text-xl font-black text-white tracking-tight">
              {formatter.format(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCartClick}
            className="group/btn flex items-center justify-center w-11 h-11 bg-white text-black rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-[0.92] duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.05)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.3)] border border-white/10 hover:border-blue-500/20"
            title="Añadir al carrito"
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

      {/* ─── MODAL: YA TENGO CUENTA O INVITADO ─── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-[#0b0b0f] border border-white/[0.08] text-white p-6 sm:p-7 rounded-[28px] shadow-[0_24px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(59,130,246,0.15)] flex flex-col max-w-md w-full relative overflow-hidden animate-in zoom-in-95 duration-300">

            {/* Glow de fondo */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/15 blur-[60px] rounded-full pointer-events-none" />

            {/* VISTA 1: LAS 2 OPCIONES */}
            {modalStep === 'selection' ? (
              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">
                  Identificación
                </span>
                <h3 className="text-xl font-bold tracking-tight mb-2">
                  ¿Cómo deseas continuar?
                </h3>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Para añadir este producto al carrito puedes identificarte o seguir directamente.
                </p>

                <div className="flex flex-col gap-3 w-full">
                  {/* Opción 1: Iniciar Sesión */}
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-purple-500/40 transition-all duration-300 group/btn"
                  >
                    <div className="flex items-center gap-3.5 text-left">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                        <UserCheck size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover/btn:text-purple-300 transition-colors">
                          Ya tengo una cuenta
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Iniciar sesión para acumular pedidos
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-500 group-hover/btn:translate-x-1 transition-transform">→</span>
                  </Link>

                  {/* Separador O */}
                  <div className="relative my-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/[0.06]" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                      <span className="bg-[#0b0b0f] px-3 text-gray-500">O</span>
                    </div>
                  </div>

                  {/* Opción 2: Continuar como Invitado */}
                  <button
                    type="button"
                    onClick={() => setModalStep('guest_form')}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/25 hover:border-blue-500/50 transition-all duration-300 group/btn text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                        <UserX size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover/btn:text-blue-300 transition-colors">
                          Continuar como invitado
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Rellena tus datos para la boleta y entrega
                        </p>
                      </div>
                    </div>
                    <span className="text-blue-400 group-hover/btn:translate-x-1 transition-transform">→</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="mt-5 text-gray-500 hover:text-gray-300 text-xs font-semibold transition-colors"
                >
                  Seguir mirando productos
                </button>
              </div>
            ) : (
              /* VISTA 2: FORMULARIO DE INVITADO */
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setModalStep('selection')}
                    className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft size={14} />
                    <span>Volver</span>
                  </button>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                    Modo Invitado
                  </span>
                </div>

                <form onSubmit={handleGuestSubmit} className="space-y-3.5">
                  {/* Nombre completo */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={guestInfo.fullName}
                      onChange={(e) => setGuestInfo({ ...guestInfo, fullName: e.target.value })}
                      placeholder="Ej. Carlos Silva"
                      className="w-full bg-[#121216] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Correo */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Correo Electrónico (para boleta y confirmación)
                    </label>
                    <input
                      type="email"
                      required
                      value={guestInfo.email}
                      onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                      placeholder="correo@ejemplo.cl"
                      className="w-full bg-[#121216] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Teléfono de contacto
                    </label>
                    <input
                      type="tel"
                      required
                      value={guestInfo.phone}
                      onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                      placeholder="+56 9 1234 5678"
                      className="w-full bg-[#121216] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Dirección */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Dirección de Entrega
                    </label>
                    <input
                      type="text"
                      required
                      value={guestInfo.address}
                      onChange={(e) => setGuestInfo({ ...guestInfo, address: e.target.value })}
                      placeholder="Calle, número, depto / comuna"
                      className="w-full bg-[#121216] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-500">
                    <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                    <span>Tus datos solo se usarán para este pedido.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[11px] py-3.5 rounded-xl shadow-[0_4px_20px_rgba(59,130,246,0.3)] transition-all"
                  >
                    <Check size={16} />
                    Confirmar y Añadir al Carrito
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

      {/* TOAST MODAL DE AVISO (Producto Agregado) */}
      {showToast && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 backdrop-blur-md pointer-events-auto animate-in fade-in duration-300">
          <div className="bg-[#0b0b0f]/95 border border-white/[0.08] text-white p-6 rounded-[28px] shadow-[0_24px_80px_rgba(0,0,0,0.8),0_0_40px_rgba(59,130,246,0.15)] flex flex-col gap-5 w-full max-w-lg mx-4 relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-400 ease-out">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-60 h-60 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

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

              <button
                onClick={() => setShowToast(false)}
                className="text-gray-500 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.03] text-sm font-semibold w-8 h-8 rounded-full transition-all active:scale-90 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-5 bg-white/[0.02] border border-white/[0.03] p-4.5 rounded-2xl w-full relative z-10">
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

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-1 relative z-10">
              <button
                onClick={() => setShowToast(false)}
                className="w-full sm:w-auto flex-1 text-gray-400 hover:text-white font-black uppercase tracking-widest text-[10px] px-5 py-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.08] transition-all active:scale-[0.97]"
              >
                Seguir explorando
              </button>

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