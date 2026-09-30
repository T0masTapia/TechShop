// app/page.tsx
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import { parseAppError } from "@/lib/errorHandler";
import { supabase } from "@/lib/Supabase";
import Link from "next/link";

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

export default async function Home() {

  const { data: mostViewedProducts, error } = await supabase
    .from('product')
    .select('*')
    .limit(3)
    .order('views', { ascending: false });

  const { data: newProducts } = await supabase
    .from('product')
    .select('*')
    .order('id', { ascending: false })
    .limit(3);

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-12 sm:pb-20">
      
      {/* 1. Carrusel Principal (Ajusta solo en móvil/tablet) */}
      <HeroCarousel />

      {/* 2. CONTENEDOR ENCAJONADO (max-w-7xl mx-auto centra obligatoriamente en PC) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ─── SECCIÓN 1: LO MÁS VISTO ─── */}
        <section className="py-8 sm:py-16">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-3xl font-black italic uppercase tracking-tighter text-white">
              Lo más <span className="text-blue-500">visto</span>
            </h2>
            <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-600 to-transparent"></div>
          </div>
          
          {error && (
            <div className="bg-red-900/20 border border-red-500 p-4 sm:p-6 rounded-2xl">
              <h2 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 text-red-500">Error al cargar el inventario</h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">{parseAppError(error)}</p>
            </div>
          )}

          {/* Grilla: 1 col en celular, 2 en tablet (sm), 3 en PC (lg) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            {mostViewedProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {mostViewedProducts?.length === 0 && !error && (
            <div className="text-center py-12 sm:py-16 border border-dashed border-gray-800 rounded-2xl">
              <h2 className="text-gray-500 text-sm sm:text-base font-medium">No hay productos para mostrar</h2>
            </div>
          )}
        </section>

        {/* ─── SECCIÓN 2: BENTO GRID DE CATEGORÍAS ─── */}
        <section className="py-6 sm:py-12">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10 select-none">
            <h2 className="text-xl sm:text-3xl font-black italic uppercase tracking-tighter text-white">
              Explora <span className="text-blue-500">Categorias</span>
            </h2>
            <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-600 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            
            {/* Bloque: Mouses */}
            <Link
              href="/search?category=mouses"
              className="group relative md:col-span-7 h-56 sm:h-64 rounded-2xl sm:rounded-3xl border border-white/[0.04] bg-gradient-to-br from-[#0c0c0e] to-[#141419] p-6 sm:p-8 flex flex-col justify-between transition-all duration-500 hover:border-blue-500/40 shadow-xl overflow-hidden"
            >
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full group-hover:bg-blue-500/20 transition-all duration-700 pointer-events-none" />
              <div>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-blue-500">Perifericos de Precision</span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-1 text-white group-hover:text-blue-400 transition-colors">Mouses</h3>
                <p className="text-xs text-gray-400 mt-1 sm:mt-2 max-w-xs">Optimiza tu velocidad y punteria con sensores opticos avanzados</p>
              </div>
              <span className="text-xs font-bold tracking-wider text-white bg-white/[0.04] border border-white/[0.06] py-2 px-4 rounded-xl w-fit group-hover:bg-blue-600 group-hover:border-transparent transition-all">
                Ver Catalogo →
              </span>
            </Link>

            {/* Bloque: Sillas Gamer */}
            <Link
              href="/search?category=sillas-gamer"
              className="group relative md:col-span-5 h-56 sm:h-64 rounded-2xl sm:rounded-3xl border border-white/[0.04] bg-gradient-to-br from-[#0c0c0e] to-[#141419] p-6 sm:p-8 flex flex-col justify-between transition-all duration-500 hover:border-purple-500/40 shadow-xl overflow-hidden"
            >
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full group-hover:bg-purple-500/20 transition-all duration-700 pointer-events-none" />
              <div>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-purple-500">Ergonomia & Confort</span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-1 text-white group-hover:text-purple-400 transition-colors">Sillas Gamer</h3>
                <p className="text-xs text-gray-400 mt-1 sm:mt-2 max-w-xs">Soporte lumbar premium para extensas jornadas de juego o trabajo</p>
              </div>
              <span className="text-xs font-bold tracking-wider text-white bg-white/[0.04] border border-white/[0.06] py-2 px-4 rounded-xl w-fit group-hover:bg-purple-600 group-hover:border-transparent transition-all">
                Ver Catalogo →
              </span>
            </Link>

          </div>
        </section>

        {/* ─── SECCIÓN 3: ÚLTIMAS NOVEDADES ─── */}
        <section className="py-8 sm:py-16">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-3xl font-black italic uppercase tracking-tighter text-white">
              Últimos <span className="text-blue-500">Ingresos</span>
            </h2>
            <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-600 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            {newProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {newProducts?.length === 0 && (
            <div className="text-center py-12 sm:py-16 border border-dashed border-gray-800 rounded-2xl">
              <h2 className="text-gray-500 text-sm sm:text-base font-medium">No hay novedades disponibles</h2>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}