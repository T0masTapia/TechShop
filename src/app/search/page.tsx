// app/search/page.tsx
import { supabase } from "@/lib/Supabase";
import Brandfilter from "@/components/BrandFilter";
import Link from "next/link";
import PriceFilter from "@/components/PriceFilters";
import MobileFilters from "@/components/MobileFilter";
import ProductCard from "@/components/ProductCard";

interface SearchPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    p?: string;
    s?: string;
    brand?: string;
    min?: string;
    max?: string;
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
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const searchTerm = params?.q || params?.category || "";
  const parentCategory = params?.p || "";
  const sectionCategory = params?.s || "";
  
  // Soportamos marcas separadas por comas (ej: "Razer,Logitech")
  const brandParam = params?.brand || "";
  const selectedBrands = brandParam ? brandParam.split(",").map((b) => b.trim()).filter(Boolean) : [];
  
  const minPrice = params?.min || "";
  const maxPrice = params?.max || "";

  let products: Product[] = [];
  let categoryName = "Catálogo de Productos";
  let availableBrands: string[] = [];

  if (searchTerm) {
    const { data: catData, error: catError } = await supabase
      .from("categorie")
      .select("id, name")
      .ilike("slug", `%${searchTerm.trim()}%`)
      .maybeSingle();

    if (catError) console.log("Error al buscar categoría:", catError.message);

    if (catData) {
      categoryName = catData.name;

      // 1. Obtenemos TODOS los productos base de esta categoría para saber qué marcas existen
      const { data: baseProducts } = await supabase
        .from("product")
        .select("brand")
        .eq("category_id", catData.id);

      if (baseProducts) {
        availableBrands = Array.from(
          new Set(baseProducts.map((p) => p.brand).filter(Boolean))
        ).sort();
      }

      // 2. Consulta de productos aplicando filtros
      let query = supabase
        .from("product")
        .select("*")
        .eq("category_id", catData.id);

      if (selectedBrands.length > 0) {
        query = query.in("brand", selectedBrands);
      }
      if (minPrice) query = query.gte("price", Number(minPrice));
      if (maxPrice) query = query.lte("price", Number(maxPrice));

      const { data: prodData } = await query;
      if (prodData) products = prodData as Product[];

    } else {
      categoryName = `Resultados para: "${searchTerm}"`;

      // 1. Obtenemos las marcas base de la búsqueda por texto
      const { data: baseProducts } = await supabase
        .from("product")
        .select("brand")
        .or(`name.ilike.%${searchTerm.trim()}%,brand.ilike.%${searchTerm.trim()}%`);

      if (baseProducts) {
        availableBrands = Array.from(
          new Set(baseProducts.map((p) => p.brand).filter(Boolean))
        ).sort();
      }

      // 2. Consulta filtrada
      let query = supabase
        .from("product")
        .select("*")
        .or(`name.ilike.%${searchTerm.trim()}%,brand.ilike.%${searchTerm.trim()}%`);

      if (selectedBrands.length > 0) {
        query = query.in("brand", selectedBrands);
      }
      if (minPrice) query = query.gte("price", Number(minPrice));
      if (maxPrice) query = query.lte("price", Number(maxPrice));

      const { data: prodData, error: prodError } = await query;
      if (prodError) console.log("Error al buscar por nombre/marca:", prodError.message);
      if (prodData) products = prodData as Product[];
    }
  } else {
    // 1. Obtenemos marcas base de todo el catálogo
    const { data: baseProducts } = await supabase
      .from("product")
      .select("brand");

    if (baseProducts) {
      availableBrands = Array.from(
        new Set(baseProducts.map((p) => p.brand).filter(Boolean))
      ).sort();
    }

    // 2. Consulta filtrada
    let query = supabase.from("product").select("*");

    if (selectedBrands.length > 0) {
      query = query.in("brand", selectedBrands);
    }
    if (minPrice) query = query.gte("price", Number(minPrice));
    if (maxPrice) query = query.lte("price", Number(maxPrice));

    const { data: allProducts } = await query;
    if (allProducts) products = allProducts as Product[];
  }

  return (
    <>
      <main className="min-h-screen bg-[#050505] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-medium select-none">
            <Link href="/" className="hover:text-blue-500 transition-colors">
              Home
            </Link>
            <span>&gt;</span>

            {parentCategory && (
              <>
                <span className="text-gray-500">{parentCategory}</span>
                <span>&gt;</span>
              </>
            )}

            {sectionCategory && (
              <>
                <span className="text-gray-400">{sectionCategory}</span>
                <span>&gt;</span>
              </>
            )}

            {searchTerm ? (
              <span className="text-gray-400 capitalize">
                {categoryName.replace("Resultados para: ", "").replace(/"/g, "")}
              </span>
            ) : (
              <span className="text-gray-400">Catálogo</span>
            )}
          </nav>

          {/* Encabezado dinámico */}
          <div className="mb-10 border-b border-gray-900 pb-6">
            <h1 className="text-2xl font-black uppercase tracking-wider text-white">
              {categoryName}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {products.length}{" "}
              {products.length === 1
                ? "producto encontrado"
                : "productos encontrados"}
            </p>
          </div>

          {/* Layout Principal del Catálogo */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Barra Lateral de Filtros */}
            <aside className="hidden lg:block lg:col-span-3 bg-[#0c0c0e] border border-gray-800 rounded-2xl p-5 h-fit sticky top-24">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-500 mb-3">
                Filtros
              </h3>
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold uppercase tracking-tight text-gray-400 select-none">
                  Marcas
                </h4>
                <Brandfilter brands={availableBrands} />
                <PriceFilter />
              </div>
            </aside>

            {/* Grilla de Tarjetas de Productos */}
            <div className="lg:col-span-9">
              {products.length === 0 ? (
                <div className="text-center py-20 bg-[#0c0c0e] border border-gray-900 rounded-2xl">
                  <p className="text-sm text-gray-400">
                    No se encontraron productos para los filtros seleccionados.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <MobileFilters brands={availableBrands} />
    </>
  );
}