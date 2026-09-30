'use client'

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/Supabase";
import Image from "next/image";
import Link from "next/link";

interface SuggestedProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string | null;
  slug: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Cerrar el buscador flotante si el usuario hace clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Efecto con Debouncing para buscar sugerencias en Supabase
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from("product")
          .select("id, name, brand, price, image_url, slug")
          .ilike("name", `%${query.trim()}%`)
          .limit(5); // Limitamos a 5 sugerencias rápidas

        if (error) throw error;

        if (data) {
          setSuggestions(data as SuggestedProduct[]);
        }
      } catch (err) {
        console.error("Error al buscar sugerencias:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Espera 300ms después de que el usuario deja de escribir

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Manejar el submit del formulario (cuando presionan Enter)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md z-50">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder="Buscar periféricos, sillas, mouses..."
          className="w-full bg-[#0c0c0e] text-white border border-gray-900 rounded-xl pl-4 pr-10 py-2.5 text-xs font-medium focus:outline-none focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-200 placeholder:text-gray-600"
        />
        {/* Lupa / Cargando */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500">
          {isLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </form>

      {/* Caja de Sugerencias Flotante */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-[#0c0c0e] border border-gray-900 rounded-xl overflow-hidden shadow-2xl divide-y divide-gray-900/50 animate-in fade-in slide-in-from-top-1 duration-200">
          {suggestions.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500 italic">
              {isLoading ? "Buscando..." : "No se encontraron resultados"}
            </div>
          ) : (
            <>
              <div className="flex flex-col">
                {suggestions.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/product/${prod.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Miniatura de Imagen */}
                    <div className="relative w-8 h-8 bg-[#121214] rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={prod.image_url || "/placeholder.png"}
                        alt={prod.name}
                        fill
                        sizes="32px"
                        className="object-contain p-1"
                      />
                    </div>

                    {/* Información resumida */}
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[9px] text-blue-500 font-bold uppercase tracking-wider">
                        {prod.brand}
                      </span>
                      <span className="text-xs text-gray-300 font-semibold truncate group-hover:text-white transition-colors">
                        {prod.name}
                      </span>
                    </div>

                    {/* Precio */}
                    <span className="text-xs font-black text-white shrink-0">
                      ${prod.price.toLocaleString("es-CL")}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Botón de ver todos los resultados */}
              <button
                onClick={handleSubmit}
                className="w-full text-center py-2.5 bg-blue-500/5 hover:bg-blue-500/10 text-[10px] text-blue-400 font-bold uppercase tracking-wider transition-colors border-t border-gray-900"
              >
                Ver todos los resultados para "{query}"
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}