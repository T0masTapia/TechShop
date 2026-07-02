import CategoryNav from "@/components/CategoryNav";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/Supabase";

export default async function Home() {
  const { data: mostViewedProducts, error } = await supabase
    .from('product')
    .select('*')
    .limit(3);
  //.order('views', {ascending: false})

  return (
    <main className="min-h-screen bg-black text-white">
      <CategoryNav />
      <HeroCarousel />
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            Lo más <span className="text-blue-500">visto</span>
          </h2>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-600 to-transparent"></div>
        </div>
        {error && (
          <div className="bg-red-900/20 border border-red-500 p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-2 text-red-500">Error al cargar el inventario</h2>
            <p className="text-gray-400 text-sm mt-1">{error.message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {mostViewedProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {mostViewedProducts?.length === 0 && !error && (
          <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl">
            <h2 className="text-gray-500 font-medium">No hay productos para mostrar</h2>
          </div>
        )}
      </section>
    </main>
  )
}

















// import { supabase } from '@/lib/Supabase';
// import ProductCard from '@/components/ProductCard';
// import HeroCarousel from '@/components/HeroCarousel';
// import { mostViewed } from '@/data/mockProducts';

// export default async function Home() {
//   // Traemos los datos de la tabla 'product'
//   const { data: products, error } = await supabase
//     .from('product')
//     .select('*')
//     .order('name');

//   if (error) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center text-white p-10">
//         <div className="bg-red-900/20 border border-red-500 p-6 rounded-2xl">
//           <h2 className="text-xl font-bold mb-2 text-red-500">Error de conexión</h2>
//           <p className="text-sm text-red-200/60">{error.message}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-black text-white">
//       <HeroCarousel />
//       <section className="max-w-7xl mx-auto px-6 py-16">
//         {/* Título de la sección */}
//         <div className="flex items-center gap-4 mb-10">
//           <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
//             Lo más <span className="text-blue-500">visto</span>
//           </h2>
//           <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-600 to-transparent"></div>
//         </div>

//         {/* El contenedor de "Lo más visto" */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//           {mostViewed.map((item) => (
//             <div key={item.id} className="group relative">
//               {/* Efecto de brillo de fondo */}
//               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

//               {/* La tarjeta en sí */}
//               <div className="relative bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
//                 <div className="aspect-video bg-[#111] overflow-hidden">
//                   <img
//                     src={item.image_url}
//                     alt={item.name}
//                     className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
//                   />
//                 </div>

//                 <div className="p-6">
//                   <span className="text-blue-500 text-[10px] font-bold tracking-widest uppercase">{item.brand}</span>
//                   <h3 className="text-white text-xl font-bold mt-1">{item.name}</h3>
//                   <p className="text-2xl font-black text-white mt-4 italic">
//                     ${item.price.toLocaleString('es-CL')}
//                   </p>

//                   <button className="w-full mt-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all uppercase text-sm">
//                     Ver detalle
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </main>
//   );
// }