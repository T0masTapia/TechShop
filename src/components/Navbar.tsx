'use client'
import { useEffect, useState } from 'react';
import { LogOut, Search, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/Supabase';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const { cart } = useCart();
  const cantidadTotal = cart.reduce((total, item) => total + item.quantity, 0);


  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name || user.email;
        setUserName(name);
      } else {
        setUserName(null);
      }
    };

    getUserData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const name = session.user.user_metadata?.full_name || session.user.email;
        setUserName(name)
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
  }

  if (pathname === '/login') {
    return null
  };

  return (
    <nav className="bg-[#0a0a0a] border-b border-gray-800 py-3 px-6 flex items-center justify-between sticky top-0 z-50">

      {/* Icono y Nombre */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
          <span className="text-white font-black text-xl">T</span>
        </div>
        <Link href="/" className="text-white font-black text-lg sm:text-xl tracking-tight hover:text-blue-500 transition-colors">
          Tech-Shop
        </Link>
      </div>

      {/* Barra de Búsqueda */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar mouses, teclados..."
            className="w-full bg-gray-900 border border-gray-700 text-sm text-gray-200 rounded-full py-2 px-5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-400">
            <Search size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Links de navegación */}
      <div className="flex items-center gap-6 flex-shrink-0">
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-400">
          {/* <Link href="/" className="hover:text-white transition-colors">Home</Link> */}

          <div className="relative">

            <Link
              href="/login"
              onClick={(e) => {
                if (userName) {
                  e.preventDefault();
                  setMenuOpen(!menuOpen);
                }
              }}
              className="text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-gray-900/4">

              <User size={35} />
              <span className="hidden md:flex flex-col items-start leading-tight text-left">

                <span className="text-[15px] text-gray-300/80 font-medium">
                  {userName ? '¡Hola!' : 'Hola!'}
                </span>

                <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                  {userName ? userName : 'Inicia Sesión'}
                </span>
              </span>
            </Link>

            {/* Dropdown */}
            {userName && menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[#0c0c0e] border border-gray-800 rounded-xl shadow-2xl py-1 z-50">
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
        </div>

        {/* Botón Carrito */}
        <Link
          href="/cart"
          className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <ShoppingCart size={30} />
          {cantidadTotal > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-[10px] text-white font-bold px-1.5 rounded-full">
              {cantidadTotal}
            </span>
          )}

        </Link>
      </div>

    </nav>
  );
}