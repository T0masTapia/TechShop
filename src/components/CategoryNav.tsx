'use client'

import { useState } from "react"
import { ChevronDown, ChevronRight, X, Sparkles } from "lucide-react"
import Link from "next/link"
import { categories } from "@/data/CategoriesData"
import { usePathname } from "next/navigation"

interface CategoryNavProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function CategoryNav({ isOpenMobile = false, onCloseMobile }: CategoryNavProps) {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null); // Para móvil

  const pathname = usePathname();
  const rutasSinNavbar = ["/login", "/register", "/cart"];

  if (rutasSinNavbar.includes(pathname)) {
    return null;
  }

  const toggleDropdown = (idx: number) => {
    setActiveDropdown(activeDropdown === idx ? null : idx);
  };

  const toggleAccordion = (idx: number) => {
    setOpenAccordion(openAccordion === idx ? null : idx);
  };

  return (
    <>
      {/* ─── VISTA DESKTOP: BARRA HORIZONTAL CONTINUA ─── */}
      <nav className="relative hidden md:block w-full bg-[#050505] border-b border-gray-900 sticky top-[61px] z-40">
        <div className="container-page">
          <div className="flex items-center justify-center gap-6 h-12 py-2">

            {categories.map((cat, idx) => {
              const isOpen = activeDropdown === idx;

              return (
                /* IMPORTANTE: este div NO lleva 'relative' para no achicar el submenú */
                <div key={idx} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => toggleDropdown(idx)}
                    className={`text-xs md:text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors tracking-tight flex items-center gap-1.5 focus:outline-none ${isOpen ? 'text-white bg-gray-900/60' : `text-gray-400 ${cat.hoverColor}`
                      }`}
                  >
                    {cat.name}
                    <ChevronDown
                      size={14}
                      strokeWidth="2.5"
                      className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : ''
                        }`}
                    />
                  </button>

                  {/* Mega Menú: pegado al ras de CategoryNav con top-full */}
                  {isOpen && (
                    <>
                      <div
                        className="fixed inset-0 top-[120px] bg-black/50 z-40"
                        onClick={() => setActiveDropdown(null)}
                      />

                      {/* Mega Menú: contenedor a lo ancho completo */}
                      <div className="absolute top-full left-0 right-0 w-full bg-[#0c0c0e] border-b border-gray-800 shadow-2xl z-50 py-8">
                        {/* Contenedor centrado con max-w y mx-auto */}
                        <div className="max-w-6xl mx-auto px-6 sm:px-8">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-12 justify-center">

                            {cat.section.map((section, secIdx) => (
                              <div key={secIdx} className="flex flex-col gap-3 min-w-0">
                                <h4 className="text-xs font-black text-blue-400 uppercase tracking-wider select-none">
                                  {section.title}
                                </h4>

                                <div className="flex flex-col gap-2">
                                  {section.items.map((item, itemIdx) => (
                                    <Link
                                      key={itemIdx}
                                      href={`/search?q=${item.slug}&p=${encodeURIComponent(cat.name)}&s=${encodeURIComponent(section.title)}`}
                                      onClick={() => setActiveDropdown(null)}
                                      className="text-xs font-medium text-gray-400 hover:text-white transition-colors block leading-relaxed"
                                    >
                                      {item.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}

                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            <Link
              href="/search?offers=true"
              className="px-3 py-1.5 text-xs md:text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors tracking-tight uppercase italic flex items-center gap-1.5"
            >
              <Sparkles size={14} />
              Ofertas Imperdibles
            </Link>

          </div>
        </div>
      </nav>

      {/* ─── VISTA MÓVIL: DESPLEGABLE LATERAL (AL TOCAR HAMBURGUESA) ─── */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99] md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-[#0a0a0c] border-r border-gray-800 z-[100] flex flex-col justify-between transition-transform duration-300 md:hidden ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="p-5 overflow-y-auto flex-1">

          {/* Header del Menú Móvil */}
          <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
            <span className="text-sm font-black uppercase tracking-wider text-gray-300 flex items-center gap-2">
              Categorías
            </span>
            <button
              onClick={onCloseMobile}
              className="p-1 text-gray-400 hover:text-white"
            >
              <X size={22} />
            </button>
          </div>

          {/* Lista Acordeón Móvil */}
          <div className="flex flex-col gap-2">
            {categories.map((cat, idx) => {
              const isAccordionOpen = openAccordion === idx;

              return (
                <div key={idx} className="border-b border-gray-900/80 pb-2">
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between py-2.5 px-1 text-sm font-bold text-gray-200 hover:text-blue-400 transition-colors text-left"
                  >
                    <span>{cat.name}</span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 transition-transform duration-200 ${isAccordionOpen ? 'rotate-180 text-blue-400' : ''
                        }`}
                    />
                  </button>

                  {/* Sub-secciones desplegables en móvil */}
                  {isAccordionOpen && (
                    <div className="pl-3 pr-1 py-2 flex flex-col gap-4 bg-gray-950/50 rounded-xl my-1 border border-gray-900">
                      {cat.section.map((section, secIdx) => (
                        <div key={secIdx} className="flex flex-col gap-1.5">
                          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                            {section.title}
                          </span>
                          <div className="flex flex-col gap-1 pl-2 border-l border-gray-800">
                            {section.items.map((item, itemIdx) => (
                              <Link
                                key={itemIdx}
                                href={`/search?q=${item.slug}&p=${encodeURIComponent(cat.name)}&s=${encodeURIComponent(section.title)}`}
                                onClick={onCloseMobile}
                                className="text-xs text-gray-400 hover:text-white py-1 transition-colors flex items-center justify-between"
                              >
                                <span>{item.name}</span>
                                <ChevronRight size={12} className="text-gray-600" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              href="/search?offers=true"
              onClick={onCloseMobile}
              className="mt-4 p-3 bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-between"
            >
              <span>🔥 Ofertas Imperdibles</span>
              <ChevronRight size={14} />
            </Link>
          </div>

        </div>
      </aside>
    </>
  );
}