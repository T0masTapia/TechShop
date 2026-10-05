'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

const slides = [
  {
    tag: "NUEVO INGRESO",
    title: "PRECISIÓN\nMECÁNICA",
    subtitle: "Teclados RGB con switches de alta respuesta para nivel competitivo",
    buttonText: "Explorar Teclados",
    href: "/search?q=teclado",
    image: "/Gemini_Generated_Image_nzne9dnzne9dnzne-removebg-preview.png",
    accentColor: "text-red-500",
    glowColor: "bg-red-600/30",
    btnColor: "hover:bg-red-600 hover:text-white",
    gradient: "from-[#220404] via-[#100303] to-[#050505]",
  },
  {
    tag: "CONFORT & RENDIMIENTO",
    title: "SILLAS\nERGONÓMICAS",
    subtitle: "Soporte lumbar 4D y materiales premium para largas sesiones de juego",
    buttonText: "Ver Sillas Gamer",
    href: "/search?category=silla-gamer",
    image: "https://media.spdigital.cl/thumbnails/products/wzhtdgu6_18208b72_thumbnail_256.png",
    accentColor: "text-blue-500",
    glowColor: "bg-blue-600/30",
    btnColor: "hover:bg-blue-600 hover:text-white",
    gradient: "from-[#051124] via-[#040814] to-[#050505]",
  },
  {
    tag: "ALTA PRECISIÓN",
    title: "SENSORES\nÓPTICOS",
    subtitle: "Mouses ultraligeros con hasta 25K DPI y switches ópticos sin latencia",
    buttonText: "Ver Mouses",
    href: "/search?category=mouses",
    image: "/images__1_-removebg-preview.png",
    accentColor: "text-purple-500",
    glowColor: "bg-purple-600/30",
    btnColor: "hover:bg-purple-600 hover:text-white",
    gradient: "from-[#1a0826] via-[#0d0414] to-[#050505]",
  }
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || isHovered) return;
    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [emblaApi, isHovered]);

  return (
    <div
      className="relative overflow-hidden bg-[#050505] group/hero select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Contenedor del Carrusel Embla */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`flex-[0_0_100%] min-w-0 relative h-[520px] sm:h-[580px] lg:h-[620px] bg-gradient-to-b ${slide.gradient} transition-colors duration-700`}
            >
              {/* Textura sutil tecnológica */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

              {/* Grid 6 + 6 = 12 exactos (siempre uno al lado del otro en PC) */}
              <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-10 grid grid-cols-1 md:grid-cols-12 items-center gap-6 z-10">

                {/* Columna Izquierda: 6 de 12 */}
                <div className="md:col-span-6 space-y-4 text-center md:text-left pt-6 md:pt-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className={`text-[10px] sm:text-xs font-black tracking-widest uppercase ${slide.accentColor}`}>
                      {slide.tag}
                    </span>
                  </div>

                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white italic tracking-tighter leading-tight drop-shadow-md whitespace-pre-line">
                    {slide.title}
                  </h2>

                  <p className="text-sm sm:text-base lg:text-lg text-gray-300 font-normal max-w-lg mx-auto md:mx-0 leading-relaxed">
                    {slide.subtitle}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={slide.href}
                      className={`inline-flex items-center gap-2 bg-white text-black font-extrabold px-8 py-3.5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl shadow-black/40 ${slide.btnColor}`}
                    >
                      <span>{slide.buttonText}</span>
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>

                {/* Columna Derecha: 6 de 12 (Teclado grande al lado) */}
                <div className="md:col-span-6 relative flex items-center justify-center h-[260px] sm:h-[360px] lg:h-[460px]">
                  {/* Glow detrás de la imagen */}
                  <div
                    className={`absolute w-72 h-72 sm:w-96 sm:h-96 ${slide.glowColor} blur-[110px] rounded-full pointer-events-none transition-all duration-700`}
                  />

                  {/* Imagen optimizada y sin bordes cortados */}
                  <div className="relative w-full h-full max-w-[540px] flex items-center justify-center transition-transform duration-500 hover:scale-105">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      unoptimized
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 540px"
                      className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
                    />
                  </div>
                </div>

              </div>

              {/* Capa de fusión degradada hacia la sección inferior */}
              <div className="absolute -bottom-1 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none z-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Flechas laterales */}
      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Slide anterior"
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 border border-white/10 text-white items-center justify-center backdrop-blur-md opacity-0 group-hover/hero:opacity-100 hover:bg-white hover:text-black transition-all"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        onClick={scrollNext}
        aria-label="Siguiente slide"
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 border border-white/10 text-white items-center justify-center backdrop-blur-md opacity-0 group-hover/hero:opacity-100 hover:bg-white hover:text-black transition-all"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots de paginación */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => scrollTo(idx)}
            aria-label={`Ir al slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${selectedIndex === idx
                ? "w-8 bg-blue-500"
                : "w-2 bg-white/30 hover:bg-white/60"
              }`}
          />
        ))}
      </div>
    </div>
  )
}