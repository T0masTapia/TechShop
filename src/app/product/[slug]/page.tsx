// app/product/[slug]/page.tsx
import AddToCartButton from "@/components/AddToCartButton";
import { supabase } from "@/lib/Supabase";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    <main className="min-h-screen bg-[#050505] text-white py-12">
      {/* ─── EL CONTENEDOR ENCAJONADO QUE CENTRA TODO ─── */}
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumbs de navegación */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8 font-medium select-none overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link
            href="/"
            className="hover:text-blue-500 transition-colors">
            Home
          </Link>
          <span className="text-gray-600">&gt;</span>
          <Link
            href="/search"
            className="hover:text-blue-500 transition-colors">
            Catalogo
          </Link>
          <span className="text-gray-600">&gt;</span>
          <span className="text-gray-400 truncate max-w-[200px] sm:max-w-xs">
            {prod.name}
          </span>
        </nav>

        {/* Layout en dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Product Image */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="relative w-full aspect-square bg-[#0c0c0e] border border-gray-900 rounded-3xl overflow-hidden p-6 flex items-center justify-center">
              <Image
                src={prod.image_url || "/placeholder.png"}
                alt={prod.name}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-contain p-6"
                priority
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="md:col-span-7 flex flex-col gap-6">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-blue-500 bg-blue-500/5 py-1 px-3 rounded-full border border-blue-500/10">
                {prod.brand}
              </span>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white mt-4 leading-tight">
                {prod.name}
              </h1>
            </div>

            {/* Caja de Precio e Información Básica */}
            <div className="bg-[#0c0c0e] border border-gray-900 rounded-2xl p-6 flex flex-col gap-6">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  ${prod.price.toLocaleString("es-CL")}
                </span>
                <span className="text-xs text-gray-500 font-semibold">
                  Valor Referencial
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-gray-500">
                  Disponibilidad:{" "}
                </span>
                {prod.stock > 0 ? (
                  <span className="text-green-500 font-bold bg-green-500/5 px-2 py-1 rounded-lg border border-green-500/10">
                    {prod.stock} Unidades en Stock
                  </span>
                ) : (
                  <span className="text-red-500 font-bold bg-red-500/5 px-2 py-1 rounded-lg border border-red-500/10">
                    Sin Stock Disponible
                  </span>
                )}
              </div>

              <div className="h-[1px] bg-gray-900 w-full" />

              <AddToCartButton product={prod} />

            </div>

            {/* Especificaciones */}
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-400 mb-3 select-none">
                Especificaciones
              </h2>

              {!prod.specifications || Object.keys(prod.specifications).length === 0 ? (
                <div className="bg-[#0c0c0e] border border-gray-900 rounded-2xl p-6 text-center">
                  <p className="text-xs text-gray-600 italic">
                    No hay especificaciones disponibles para este producto.
                  </p>
                </div>
              ) : (
                <div className="bg-[#0c0c0e] border border-gray-900 rounded-2xl overflow-hidden divide-y divide-gray-900/50">
                  {Object.entries(prod.specifications).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-4 text-xs">
                      <span className="font-bold text-gray-500 capitalize select-none">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="sm:col-span-2 text-gray-300 font-medium">
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