'use client'

import { useRef, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselContainerProps {
  children: React.ReactNode;
  autoPlayInterval?: number; // tiempo en milisegundos (por defecto 3.5 segundos)
}

export default function CarouselContainer({ 
  children, 
  autoPlayInterval = 3500 
}: CarouselContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const scrollAmount = 350;

      if (direction === "right") {
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      } else {
        if (scrollLeft <= 10) {
          containerRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" });
        } else {
          containerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
      }
    }
  };

  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      scroll("right");
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isHovered, autoPlayInterval]);

  return (
    <div 
      className="relative group/carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Flecha Izquierda: responde a group-hover/carousel */}
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Anterior"
        className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#121214] border border-gray-800 text-white flex items-center justify-center shadow-2xl hover:bg-blue-600 hover:border-blue-500 transition-all opacity-0 group-hover/carousel:opacity-100 focus:outline-none"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Contenedor sin scrollbar visible */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto pt-4 pb-6 px-2 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {/* Flecha Derecha: responde a group-hover/carousel */}
      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Siguiente"
        className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#121214] border border-gray-800 text-white flex items-center justify-center shadow-2xl hover:bg-blue-600 hover:border-blue-500 transition-all opacity-0 group-hover/carousel:opacity-100 focus:outline-none"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}