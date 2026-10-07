// app/product/[slug]/page.tsx
import AddToCartButton from "@/components/AddToCartButton";
import { supabase } from "@/lib/Supabase";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ShieldCheck, Zap, Truck, Eye } from "lucide-react";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface Product {
  id: string;
  category_id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  image_url: string | null;
  slug: string;
  specifications: Record<string, any> | null;
  views: number;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // 1. REGISTRO DE VISITA: Llamamos a la función de la base de datos
  const { error: rpcError } = await supabase.rpc('increment_product_views', {
    product_slug: slug
  });

  if (rpcError) {
    console.error("Error al registrar la visita en Supabase:", rpcError.message);
  }

  // 2. OBTENCIÓN DE DATOS: Traemos la información del producto
  const { data: product, error } = await supabase
    .from("product")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !product) {
    notFound();
  }

  const prod = product as Product;

  return (
    <main className="min-h-screen bg-[#070709] text-white pt-8 pb-20 relative overflow-hidden">
      {/* Resplandores ambientales superiores (Linear / Glassmorphism) */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[550px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-40 right-10 w-[400px] h-[300px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Contenedor central */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* ─── BREADCRUMBS MODERNO ─── */}
        <nav className="flex items-center gap-2 text-[11px] text-gray-500 mb-8 font-semibold tracking-wider uppercase select-none overflow-x-auto whitespace-nowrap scrollbar-none py-2">
          <Link
            href="/"
            className="hover:text-blue-400 transition-colors"
          >
            Home
          </Link>
          <ChevronRight size={12} className="text-gray-700 shrink-0" />
          <Link
            href="/search"
            className="hover:text-blue-400 transition-colors"
          >
            Catálogo
          </Link>
          <ChevronRight size={12} className="text-gray-700 shrink-0" />
          <span className="text-gray-400 normal-case tracking-normal truncate max-w-[220px] sm:max-w-md">
            {prod.name}
          </span>
        </nav>

        {/* ─── LAYOUT PRINCIPAL DE 2 COLUMNAS ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Columna Izquierda: Showcase de Imagen */}
          <div className="lg:col-span-6 flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="relative w-full aspect-square bg-[#0b0b0e]/90 backdrop-blur-xl border border-white/[0.06] rounded-[32px] overflow-hidden p-8 flex items-center justify-center shadow-[0_24px_80px_rgba(0,0,0,0.8),inset_0_2px_16px_rgba(255,255,255,0.03)] group">
              
              {/* Glow reactivo dentro del marco de la foto */}
              <div className="absolute inset-0 bg-radial from-blue-500/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <Image
                src={prod.image_url || "/placeholder.png"}
                alt={prod.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-8 transform group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                priority
              />

              {/* Tag de Marca flotante sobre la imagen */}
              <div className="absolute top-5 left-5 z-10">
                <span className="bg-[#070709]/80 backdrop-blur-md border border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full select-none shadow-lg">
                  {prod.brand}
                </span>
              </div>

              {/* Indicador sutil de visitas */}
              {prod.views > 0 && (
                <div className="absolute bottom-5 right-5 z-10 flex items-center gap-1.5 bg-[#070709]/80 backdrop-blur-md border border-white/5 px-3 py-1 rounded-full text-[10px] text-gray-400">
                  <Eye size={12} className="text-blue-400" />
                  <span>{prod.views.toLocaleString("es-CL")} vistas</span>
                </div>
              )}
            </div>
          </div>

          {/* Columna Derecha: Información, Compra y Especificaciones */}
          <div className="lg:col-span-6 flex flex-col gap-7">
            
            {/* Header del Producto */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                  <Zap size={11} />
                  Oficial
                </span>
                <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                  SKU: {prod.slug}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                {prod.name}
              </h1>
            </div>

            {/* Caja de Compra Glassmorphism */}
            <div className="relative bg-[#0b0b0e]/80 backdrop-blur-xl border border-white/[0.08] rounded-[28px] p-6 sm:p-7 flex flex-col gap-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              
              {/* Precio y Disponibilidad */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/[0.06]">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">
                    Precio Contado / Transferencia
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      ${prod.price.toLocaleString("es-CL")}
                    </span>
                    <span className="text-xs text-gray-500 font-bold uppercase">
                      CLP
                    </span>
                  </div>
                </div>

                {/* Badge de Stock */}
                <div>
                  {prod.stock > 0 ? (
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      <span className="text-xs text-emerald-400 font-bold">
                        {prod.stock} disponibles
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/25 px-3 py-1.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-xs text-red-400 font-bold">
                        Sin Stock
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón de añadir al carrito */}
              <div>
                <AddToCartButton product={prod} />
              </div>

              {/* Micro-ventajas de confianza */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <Truck size={16} className="text-blue-400 shrink-0" />
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-gray-200 leading-none">Envío Rápido</p>
                    <p className="text-[9.5px] text-gray-500 mt-0.5">A todo Chile</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-gray-200 leading-none">Garantía</p>
                    <p className="text-[9.5px] text-gray-500 mt-0.5">Directa de fabricante</p>
                  </div>
                </div>
              </div>

            </div>

            {/* ─── TABLA DE ESPECIFICACIONES TÉCNICAS ─── */}
            <div className="mt-2">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 select-none">
                  Ficha Técnica
                </h2>
                <div className="flex-1 h-[1px] bg-white/[0.06]" />
              </div>

              {!prod.specifications || Object.keys(prod.specifications).length === 0 ? (
                <div className="bg-[#0b0b0e]/60 border border-white/[0.05] rounded-2xl p-6 text-center">
                  <p className="text-xs text-gray-500 italic">
                    No hay especificaciones técnicas detalladas para este modelo.
                  </p>
                </div>
              ) : (
                <div className="bg-[#0b0b0e]/70 border border-white/[0.06] rounded-2xl overflow-hidden divide-y divide-white/[0.04] backdrop-blur-md">
                  {Object.entries(prod.specifications).map(([key, value]) => (
                    <div 
                      key={key} 
                      className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-4 text-xs hover:bg-white/[0.015] transition-colors"
                    >
                      <span className="font-bold text-gray-500 capitalize select-none text-[11px] tracking-wide">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="sm:col-span-2 text-gray-200 font-medium text-[11.5px] leading-relaxed break-words">
                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}