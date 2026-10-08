'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/Supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Package, 
  Receipt, 
  Calendar, 
  ChevronRight, 
  LogOut, 
  ArrowLeft, 
  Loader2, 
  ShieldCheck 
} from 'lucide-react';

interface PurchasedItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  product?: {
    name: string;
    brand?: string;
    image_url?: string;
  };
}

interface OrderWithProducts {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  customer_address: string;
  items: PurchasedItem[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<OrderWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true);

        // 1. Verificar sesión del usuario
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          router.push('/login?redirect=/profile');
          return;
        }

        setUser(user);

        // 2. Traer las órdenes del usuario
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('id, created_at, total_amount, status, customer_address')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (ordersError || !ordersData || ordersData.length === 0) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const orderIds = ordersData.map((o: any) => o.id);

        // 3. Traer todos los items de esas órdenes
        const { data: itemsData } = await supabase
          .from('order_item')
          .select('id, order_id, product_id, quantity, price_at_purchase')
          .in('order_id', orderIds);

        // 4. Traer información de los productos involucrados
        const productIds = Array.from(
          new Set((itemsData || []).map((it: any) => it.product_id).filter(Boolean))
        );

        let productsMap: Record<string, any> = {};
        if (productIds.length > 0) {
          const { data: prodsData } = await supabase
            .from('product')
            .select('id, name, brand, image_url')
            .in('id', productIds);

          if (prodsData) {
            productsMap = prodsData.reduce((acc: any, p: any) => {
              acc[p.id] = p;
              return acc;
            }, {});
          }
        }

        // 5. Ensamblar los pedidos con sus productos correspondientes
        const formattedOrders: OrderWithProducts[] = ordersData.map((ord: any) => {
          const orderItems = (itemsData || [])
            .filter((it: any) => it.order_id === ord.id)
            .map((it: any) => ({
              id: it.id,
              quantity: it.quantity,
              price_at_purchase: it.price_at_purchase,
              product: productsMap[it.product_id] || { name: 'Producto', brand: '' },
            }));

          return {
            id: ord.id,
            created_at: ord.created_at,
            total_amount: ord.total_amount,
            status: ord.status,
            customer_address: ord.customer_address,
            items: orderItems,
          };
        });

        setOrders(formattedOrders);

      } catch (err) {
        console.error('Error cargando perfil:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Barra superior de navegación */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800/80">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Volver a la tienda
          </Link>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors bg-red-950/20 border border-red-500/20 px-3.5 py-1.5 rounded-lg cursor-pointer"
          >
            <LogOut size={14} /> Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Tarjeta de Cuenta (Izquierda) */}
          <div className="lg:col-span-4 bg-[#0c0c0e] border border-gray-800 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <User size={28} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">
                  Mi Cuenta
                </span>
                <h2 className="text-base font-bold text-white truncate max-w-[200px]">
                  {user?.user_metadata?.full_name || 'Usuario'}
                </h2>
                <p className="text-xs text-gray-400 truncate max-w-[200px]">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-800/80 text-xs">
              <div className="flex justify-between items-center text-gray-400">
                <span>Total de compras:</span>
                <span className="font-bold text-white bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
                  {orders.length}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>Estado:</span>
                <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-bold">
                  <ShieldCheck size={14} /> Verificado
                </span>
              </div>
            </div>
          </div>

          {/* Lista de Pedidos con Productos (Derecha) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                <Package className="text-blue-500" size={20} /> Historial de Compras
              </h3>
              <span className="text-xs text-gray-500">
                {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="bg-[#0c0c0e] border border-gray-800 rounded-3xl p-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 text-gray-500 flex items-center justify-center mx-auto mb-3">
                  <Package size={24} />
                </div>
                <h4 className="text-sm font-bold text-gray-300 mb-1">Aún no tienes compras</h4>
                <p className="text-xs text-gray-500 mb-6">
                  Tus productos comprados y boletas aparecerán aquí.
                </p>
                <Link
                  href="/"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Ir al Catálogo
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#0c0c0e] border border-gray-800/80 rounded-2xl p-5 shadow-lg"
                  >
                    {/* Encabezado del Pedido */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-800/80">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-gray-200">
                          N° {order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">
                          {order.status || 'Completada'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <Calendar size={13} className="text-gray-500" />
                        <span>
                          {new Date(order.created_at).toLocaleDateString('es-CL', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Lista de Productos Comprados en este Pedido */}
                    <div className="py-3 divide-y divide-gray-800/40">
                      {order.items.map((it) => (
                        <div key={it.id} className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            {it.product?.image_url ? (
                              <img
                                src={it.product.image_url}
                                alt={it.product.name}
                                className="w-10 h-10 object-contain rounded-lg bg-[#121216] border border-gray-800 p-1 shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0 text-gray-600">
                                <Package size={16} />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-gray-200 truncate">
                                {it.product?.name}
                              </p>
                              <p className="text-[10px] text-gray-500">
                                Cantidad: {it.quantity} • ${it.price_at_purchase.toLocaleString('es-CL')} c/u
                              </p>
                            </div>
                          </div>

                          <span className="text-xs font-mono font-bold text-gray-300 shrink-0">
                            ${(it.price_at_purchase * it.quantity).toLocaleString('es-CL')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Pie de la Orden: Total y Enlace a Boleta */}
                    <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                          Total Pagado
                        </span>
                        <span className="font-black text-sm text-blue-400 font-mono">
                          ${order.total_amount.toLocaleString('es-CL')}
                        </span>
                      </div>

                      <Link
                        href={`/order/${order.id}`}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-[#18181b] hover:bg-[#27272a] border border-gray-800 text-gray-200 hover:text-white rounded-xl text-xs font-bold transition-all"
                      >
                        <Receipt size={14} className="text-blue-400" />
                        <span>Ver Boleta</span>
                        <ChevronRight size={14} className="text-gray-500" />
                      </Link>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}