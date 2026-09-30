"use client";
import { useEffect, useState } from "react";
import { LogOut, ShoppingCart, User, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/Supabase";
import { useCart } from "@/context/CartContext";
import SearchBar from "./SearchBar";

interface NavbarProps {
  onToggleCategoryNav?: () => void;
}

export default function Navbar({ onToggleCategoryNav }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const { cart } = useCart();
  const cantidadTotal = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name || user.email;
        setUserName(name);
      } else {
        setUserName(null);
      }
    };

    getUserData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const name =
          session.user.user_metadata?.full_name || session.user.email;
        setUserName(name);
      } else {
        setUserName(null);
        setMenuOpen(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await supabase.auth.signOut();
    setUserName(null);
    setMenuOpen(false);
    router.refresh();
  };

  if (pathname === "/login") {
    return null;
  }

  return (
    <nav className="bg-[#0a0a0a] border-b border-gray-800 py-3 px-4 sm:px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* ─── FILA SUPERIOR: Hamburguesa | Logo ────── Buscador (PC) ────── Usuario & Carrito ─── */}
        <div className="flex items-center justify-between w-full gap-4">
          {/* Lado Izquierdo: Hamburguesa (Móvil) + Separador + Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={onToggleCategoryNav}
              className="p-1 text-gray-300 hover:text-white transition-colors md:hidden"
              aria-label="Abrir categorías"
            >
              <Menu size={28} />
            </button>

            {/* Separador estilo SP Digital en móvil */}
            <div className="h-5 w-[1px] bg-gray-800 md:hidden" />

            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <span className="text-white font-black text-xl">T</span>
            </div>
            <Link
              href="/"
              className="text-white font-black text-lg sm:text-xl tracking-tight hover:text-blue-500 transition-colors"
            >
              Tech-Shop
            </Link>
          </div>

          {/* Barra de Búsqueda (En PC se muestra aquí) */}
          <div className="hidden md:block flex-1 max-w-xl mx-4 lg:mx-8">
            <SearchBar />
          </div>

          {/* Lado Derecho: Usuario & Carrito */}
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
            {/* Usuario con icono original User(35) */}
            <div className="relative">
              <Link
                href="/login"
                onClick={(e) => {
                  if (userName) {
                    e.preventDefault();
                    setMenuOpen(!menuOpen);
                  }
                }}
                className="text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-gray-900/40"
              >
                <User size={35} />
                <span className="hidden md:flex flex-col items-start leading-tight text-left">
                  <span className="text-[15px] text-gray-300/80 font-medium">
                    {userName ? "¡Hola!" : "Hola!"}
                  </span>
                  <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                    {userName ? userName : "Inicia Sesión"}
                  </span>
                </span>
              </Link>

              {/* ─── DESPLEGABLE EN DESKTOP ─── */}
              {userName && menuOpen && (
                <div className="hidden md:block absolute right-0 mt-2 w-44 bg-[#0c0c0e] border border-gray-800 rounded-xl shadow-2xl py-1 z-50">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-400 hover:text-red-400 hover:bg-red-950/10 gap-2 transition-colors flex items-center"
                  >
                    <LogOut size={18} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>

            {/* Carrito con icono original ShoppingCart(30) */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ShoppingCart size={30} />
              {cantidadTotal > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-[10px] text-white font-bold px-1.5 rounded-full">
                  {cantidadTotal}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ─── FILA INFERIOR (Solo en celular): Buscador ocupando todo el ancho ─── */}
        <div className="md:hidden w-full">
          <SearchBar />
        </div>
      </div>

      {/* ─── LÁMINA INFERIOR MÓVIL (BOTTOM SHEET) CON Z-INDEX GLOBAL ─── */}
      {userName && menuOpen && (
        <div className="md:hidden">
          {/* Fondo oscuro traslúcido cubriendo TODA la pantalla */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998]"
            onClick={() => setMenuOpen(false)}
          />
          {/* Lámina desde abajo */}
          <div className="fixed bottom-0 left-0 right-0 bg-[#0c0c0e] border-t border-gray-800 rounded-t-2xl p-6 z-[9999] flex flex-col gap-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-1" />
            <div className="flex items-center gap-3 pb-3 border-b border-gray-800">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">
                  Sesión iniciada como
                </span>
                <span className="text-sm font-bold text-white">
                  {userName}
                </span>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full py-3 px-4 bg-red-950/20 border border-red-500/30 text-red-400 hover:bg-red-900/30 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}