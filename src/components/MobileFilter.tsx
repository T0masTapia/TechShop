'use client';

import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import Brandfilter from "./BrandFilter";
import PriceFilter from "./PriceFilters"; // Usamos la S al final como lo tienes importado en tu search/page.tsx

interface MobileFiltersProps {
  brands: string[];
}

export default function MobileFilters({ brands }: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Bloqueamos el scroll del body de fondo cuando el panel lateral esté abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Botón Flotante Fijo (Se esconde en pantallas grandes 'lg:hidden') */}
      <div className="fixed bottom-6 right-6 z-40 lg:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest px-5 py-4 rounded-full shadow-[0_8px_30px_rgba(37,99,235,0.4)] active:scale-95 transition-all duration-300 border border-blue-500/20"
        >
          <SlidersHorizontal size={14} strokeWidth={2.5} />
          Filtros
        </button>
      </div>

      {/* Menú Lateral Flotante */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden flex justify-end">
          
          {/* Fondo oscuro traslúcido con blur (Hacer clic aquí también cierra el panel) */}
          <div 
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Panel Deslizante Lateral Derecho */}
          <div className="relative w-full max-w-xs h-full bg-[#070709] border-l border-white/[0.04] p-6 flex flex-col gap-6 shadow-2xl z-10 overflow-y-auto">
            
            {/* Cabecera */}
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-blue-500" strokeWidth={2.5} />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Filtros de Búsqueda
                </h3>
              </div>
              
              {/* Botón de cierre (X) */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-white bg-white/[0.02] border border-white/[0.04] w-8 h-8 rounded-full flex items-center justify-center transition-colors active:scale-90"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Contenido de los filtros acoplados */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold uppercase tracking-tight text-gray-400 select-none">
                  Marcas
                </h4>
                {/* Reutilizamos tu filtro de marcas actual */}
                <Brandfilter brands={brands} />
              </div>

              {/* Reutilizamos tu filtro de precios actual */}
              <PriceFilter />
            </div>

          </div>
        </div>
      )}
    </>
  );
}