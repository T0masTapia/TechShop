'use client'

import { useRouter, useSearchParams } from "next/navigation";

interface BrandFilterProps {
  brands: string[];
}

export default function BrandFilter({ brands }: BrandFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentBrand = searchParams.get("brand") || "";

  const handleBrandChange = (brandName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentBrand === brandName) {
      params.delete("brand");
    } else {
      params.set("brand", brandName);
    }
    router.push(`/search?${params.toString()}`);
  };

  if (brands.length === 0) {
    return <p className="text-xs text-gray-600 italic">No hay marcas disponibles</p>;
  }

  return (
  <div className="flex flex-col gap-2.5">
    {brands.map((brandName) => {
      const isChecked = currentBrand === brandName;
      return (
        <label 
          key={brandName} 
          className={`group flex items-center gap-3 text-xs font-medium cursor-pointer select-none py-1.5 px-2 rounded-xl transition-all duration-200 ${
            isChecked 
              ? 'text-blue-400 bg-blue-500/5 font-semibold' 
              : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
          }`}
        >
          {/* Contenedor personalizado para el Checkbox */}
          <div className="relative flex items-center justify-center">
            <input 
              type="checkbox" 
              checked={isChecked}
              onChange={() => handleBrandChange(brandName)}
              className="peer opacity-0 absolute w-5 h-5 cursor-pointer z-10"
            />
            
            {/* El cuadrito visual del Checkbox (Falso Checkbox estilizado) */}
            <div className={`w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center ${
              isChecked 
                ? 'border-blue-500 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                : 'border-gray-800 bg-[#121214] group-hover:border-gray-600'
            }`}>
              {/* Check (✔) en SVG blanco que solo se muestra si está activo */}
              {isChecked && (
                <svg 
                  className="w-2.5 h-2.5 text-white stroke-[3]" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>

          {/* Nombre de la marca */}
          <span className="tracking-wide">{brandName}</span>
        </label>
      );
    })}
  </div>
);
}