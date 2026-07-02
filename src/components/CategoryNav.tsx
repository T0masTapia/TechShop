'use client'

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { categories } from "@/data/CategoriesData"

export default function CategoryNav() {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const toggleDropdown = (idx: number) => {
    setActiveDropdown(activeDropdown === idx ? null : idx);
  }

  return (
    // Es clave que este nav tenga 'relative' para que la barra se mantenga en su eje
    <nav className="w-full bg-[#050505] border-b border-gray-900 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-center justify-start lg:justify-center gap-2 md:gap-6 h-12 overflow-x-auto no-scrollbar whitespace-nowrap py-2">

          {categories.map((cat, idx) => {
            const isOpen = activeDropdown === idx;

            return (
              <div
                key={idx}
                className="flex items-center"
              // onMouseLeave={() => setActiveDropdown(null)}
              >
                {/* BOTÓN DE LA CATEGORÍA */}
                <button
                  type="button"
                  onClick={() => toggleDropdown(idx)}
                  className={`text-xs md:text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors tracking-tight flex items-center gap-1 focus:outline-none ${isOpen ? 'text-white' : `text-gray-400 ${cat.hoverColor}`
                    }`}
                >
                  {cat.name}
                  <ChevronDown
                    size={14}
                    strokeWidth="2.5"
                    className={`text-gray-600 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-current' : 'group-hover:text-current group-hover:rotate-180'
                      }`}
                  />
                </button>

                {isOpen && (
                  <>
                  <div 
                  className="fixed inset-0 bg-transparent z-[90]"
                  onClick={() => setActiveDropdown(null)}/> 

                    <div className="absolute top-10 left-0 right-0 w-full h-auto bg-[#0c0c0e] border-b border-gray-800 shadow-[0_20px_40px_rgba(0,0,0,0.9)] opacity-100 visible z-[100] py-6 px-12 transition-all">

                      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-6 whitespace-normal">

                        {cat.section.map((section, secIdx) => (
                          <div key={secIdx} className="flex flex-col gap-2.5">

                            <h4 className="text-xs md:text-sm font-black text-[#1e1b4b] dark:text-blue-400 uppercase tracking-tight select-none">
                              {section.title}
                            </h4>

                            <div className="flex flex-col gap-1.5">
                              {section.items.map((item, itemIdx) => (
                                <Link
                                  key={itemIdx}
                                  href={`/search?q=${item.toLowerCase().replace(/ /g, '-')}`}
                                  onClick={() => setActiveDropdown(null)}
                                  className="text-xs font-medium text-gray-400 hover:text-blue-500 transition-colors block text-left leading-snug"
                                >
                                  {item}
                                </Link>
                              ))}
                            </div>

                          </div>
                        ))}

                      </div>
                    </div>
                  </>
                )}
                <div className={`absolute bottom-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent transition-opacity duration-300 ${isOpen ? 'opacity-100 px-6' : 'opacity-0'
                  }`} />

              </div>
            );
          })}
          <div className="cursor-pointer px-3 py-1.5 text-xs md:text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors tracking-tight uppercase italic ml-auto lg:ml-0">
            Ofertas Imperdibles
          </div>

        </div>
      </div>
    </nav>
  )
}