'use client'
import useEmblaCarousel from 'embla-carousel-react'
import React from 'react'
// Suponiendo que usas Embla, esto va dentro del mapa de tus slides

const slides = [
  {
    title: "PRECISIÓN MECÁNICA",
    subtitle: "Teclados RGB con Switch Blue",
    button: "Explorar",
    // Esta imagen debe estar en tu carpeta public/
    image: "/Gemini_Generated_Image_nzne9dnzne9dnzne.png", 
    // Gradiente que va de un rojo oscuro a negro
    color: "from-[#200505] to-black" 
  }
]

export default function HeroCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true })

  return (
    <div className="overflow-hidden bg-black" ref={emblaRef}>
      <div className="flex">
        {slides.map((slide, index) => (
          <div key={index} className={`flex-[0_0_100%] min-w-0 relative h-[550px] bg-gradient-to-br ${slide.color}`}>
            
            {/* CAPA 1: Textura de Fondo Sutil (puntos tecnológicos) */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Contenedor Principal (Grid de 2 columnas) */}
            <div className="relative h-full max-w-7xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
              
              {/* COLUMNA IZQUIERDA: Texto y Botón */}
              <div className="z-10 space-y-4">
                <h2 className="text-6xl sm:text-7xl font-black text-white italic tracking-tighter leading-none">
                  {slide.title}
                </h2>
                <p className="text-xl text-gray-400 font-medium pb-4">
                  {slide.subtitle}
                </p>
                <button className="bg-white text-black font-bold px-10 py-4 rounded-full hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 shadow-lg shadow-white/5">
                  {slide.button}
                </button>
              </div>

              {/* COLUMNA DERECHA: El Producto Estrella (Oculto en móvil) */}
              <div className="hidden lg:block relative group">
                {/* CAPA 2: Brillo de Fondo Neón (Glow) */}
                <div className="absolute -inset-10 bg-red-600/20 blur-[120px] rounded-full group-hover:bg-red-600/30 transition-colors duration-500"></div>
                
                {/* CAPA 3: La Imagen del Producto */}
                <img 
                  src={slide.image} 
                  alt="Teclado Mecánico Flotando" 
                  // Perspectiva y sombra para dar profundidad
                  className="relative w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)] transform group-hover:translate-y-[-10px] transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}