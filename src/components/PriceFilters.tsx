'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PriceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Inicializamos los estados con lo que ya venga en la URL si es que existe
  const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");

  // Si la URL cambia externamente (ej: al limpiar filtros), actualizamos los inputs
  useEffect(() => {
    setMinPrice(searchParams.get("min") || "");
    setMaxPrice(searchParams.get("max") || "");
  }, [searchParams]);

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clonamos los parámetros actuales de la URL para no perder los filtros de marca o categoría
    const currentParams = new URLSearchParams(window.location.search);

    if (minPrice.trim()) {
      currentParams.set("min", minPrice.trim());
    } else {
      currentParams.delete("min");
    }

    if (maxPrice.trim()) {
      currentParams.set("max", maxPrice.trim());
    } else {
      currentParams.delete("max");
    }

    // Navegamos a la nueva URL conservando todo lo demás
    router.push(`/search?${currentParams.toString()}`);
  };

  const handleClearFilter = () => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.delete("min");
    currentParams.delete("max");
    setMinPrice("");
    setMaxPrice("");
    router.push(`/search?${currentParams.toString()}`);
  };

  const hasFilterActive = searchParams.get("min") || searchParams.get("max");

  return (
    <form onSubmit={handleApplyFilter} className="flex flex-col gap-3 mt-4 border-t border-gray-900 pt-4">
      <h4 className="text-sm font-bold uppercase tracking-tight text-gray-400 select-none">
        Rango de Precio
      </h4>
      
      <div className="flex items-center gap-2">
        {/* Input Precio Mínimo */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-bold">$</span>
          <input
            type="number"
            placeholder="Mín"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full bg-[#121214] text-white border border-gray-900 rounded-xl pl-6 pr-2 py-2 text-xs font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <span className="text-gray-700 text-xs font-bold select-none">—</span>

        {/* Input Precio Máximo */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-bold">$</span>
          <input
            type="number"
            placeholder="Máx"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full bg-[#121214] text-white border border-gray-900 rounded-xl pl-6 pr-2 py-2 text-xs font-medium focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-1">
        {hasFilterActive && (
          <button
            type="button"
            onClick={handleClearFilter}
            className="flex-1 bg-white/[0.02] hover:bg-red-500/10 border border-white/[0.04] hover:border-red-500/20 text-gray-400 hover:text-red-400 font-bold uppercase tracking-wider py-2 rounded-xl text-[10px] transition-all active:scale-95"
          >
            Limpiar
          </button>
        )}
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-2 rounded-xl text-[10px] transition-all active:scale-95 shadow-[0_4px_12px_rgba(59,130,246,0.15)] hover:shadow-[0_4px_16px_rgba(59,130,246,0.3)]"
        >
          Aplicar
        </button>
      </div>
    </form>
  );
}