'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/Supabase';
import { Download, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  product?: {
    name: string;
    brand?: string;
  };
}

interface OrderData {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  payment_id: string;
  order_item: OrderItem[];
}

export default function OrderInvoicePage() {
  const params = useParams();
  const orderId = params?.id as string;

  const invoicePrintRef = useRef<HTMLDivElement>(null);

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;

      try {
        setLoading(true);
        setError(null);

        // 1. Obtener datos de la orden
        const { data: orderData, error: orderErr } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderErr || !orderData) {
          throw new Error(orderErr?.message || 'No se pudo encontrar la orden solicitada.');
        }

        // 2. Obtener items de la orden
        const { data: itemsData, error: itemsErr } = await supabase
          .from('order_item')
          .select('*')
          .eq('order_id', orderId);

        if (itemsErr) {
          throw new Error(itemsErr.message || 'Error al obtener los items.');
        }

        // 3. Obtener nombres de productos
        const productIds = (itemsData || []).map((it: any) => it.product_id).filter(Boolean);
        let productsMap: Record<string, any> = {};

        if (productIds.length > 0) {
          const { data: prodsData } = await supabase
            .from('product')
            .select('id, name, brand')
            .in('id', productIds);

          if (prodsData) {
            productsMap = prodsData.reduce((acc: any, p: any) => {
              acc[p.id] = p;
              return acc;
            }, {});
          }
        }

        // 4. Estructurar detalle
        const formattedItems = (itemsData || []).map((it: any) => ({
          id: it.id,
          quantity: it.quantity,
          price_at_purchase: it.price_at_purchase,
          product: productsMap[it.product_id] || { name: 'Producto', brand: '' },
        }));

        setOrder({
          ...orderData,
          order_item: formattedItems,
        });

      } catch (err: any) {
        console.error('Error cargando boleta:', err);
        setError(err.message || 'Error al cargar el comprobante');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  // Descargar PDF con formato formal de documento
  const handleDownloadPDF = async () => {
    if (!invoicePrintRef.current) return;

    try {
      setDownloading(true);

      const { toPng } = await import('html-to-image');
      const { jsPDF } = await import('jspdf');

      const dataUrl = await toPng(invoicePrintRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (invoicePrintRef.current.offsetHeight * pdfWidth) / invoicePrintRef.current.offsetWidth;

      // Centrado con márgenes limpios
      pdf.addImage(dataUrl, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`Boleta-TechShop-${orderId.slice(0, 8).toUpperCase()}.pdf`);

    } catch (err) {
      console.error('Error al generar PDF:', err);
      alert('Hubo un error al generar la descarga del PDF.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white p-6">
        <p className="text-red-400 font-bold mb-4">{error || 'Orden no encontrada'}</p>
        <Link href="/" className="px-5 py-2.5 bg-blue-600 rounded-xl text-xs uppercase font-bold">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const total = order.total_amount || 0;
  const neto = Math.round(total / 1.19);
  const iva = total - neto;

  return (
    <div className="min-h-screen bg-[#09090b] py-10 px-4 sm:px-6 text-white">
      <div className="max-w-3xl mx-auto">

        {/* Barra superior de navegación y descarga */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Volver a la tienda
          </Link>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer"
          >
            {downloading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Generando PDF...
              </>
            ) : (
              <>
                <Download size={16} /> Descargar Boleta PDF
              </>
            )}
          </button>
        </div>

        {/* VISTA 1: LA QUE VES EN PANTALLA (Modo Gamer Oscuro) */}
        <div className="bg-[#0c0c0e] border border-gray-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-gray-800">
            <div>
              <span className="text-2xl font-black tracking-tight text-white uppercase">
                Tech<span className="text-blue-500">Shop</span>
              </span>
              <p className="text-xs text-gray-400 mt-1">Periféricos y Hardware de Alto Rendimiento</p>
              <p className="text-[11px] text-gray-500">Ventas Online • Chile</p>
            </div>

            <div className="border-2 border-red-500/80 rounded-xl p-4 text-center min-w-[220px] bg-red-500/5">
              <span className="text-xs font-black uppercase tracking-wider text-red-500 block">R.U.T.: 76.845.123-K</span>
              <h2 className="text-sm font-black uppercase text-red-400 my-1">Boleta Electrónica</h2>
              <span className="text-xs font-mono font-bold text-gray-300 block">N° {order.id?.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-gray-800 text-xs">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block mb-1">Cliente:</span>
              <p className="font-bold text-gray-200 text-sm">{order.customer_name || 'Cliente Invitado'}</p>
              <p className="text-gray-400">{order.customer_email}</p>
              <p className="text-gray-400">{order.customer_phone}</p>
            </div>
            <div className="sm:text-right">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block mb-1">Detalles del Pedido:</span>
              <p className="text-gray-300 font-semibold">
                Fecha: {order.created_at ? new Date(order.created_at).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Reciente'}
              </p>
              <p className="text-gray-400">Dirección: {order.customer_address || 'Retiro en Tienda'}</p>
              <p className="text-[11px] text-gray-500">Cod. Pago: {order.payment_id}</p>
            </div>
          </div>

          <div className="py-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-800 text-[10px] uppercase font-bold text-gray-400">
                  <th className="pb-3">Descripción</th>
                  <th className="pb-3 text-center">Cant.</th>
                  <th className="pb-3 text-right">P. Unitario</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {order.order_item?.map((item) => (
                  <tr key={item.id} className="text-gray-300">
                    <td className="py-3">
                      <span className="font-semibold block text-white">{item.product?.name || 'Producto'}</span>
                      {item.product?.brand && <span className="text-[10px] text-blue-400 uppercase font-bold">{item.product.brand}</span>}
                    </td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right font-mono">${item.price_at_purchase?.toLocaleString('es-CL')}</td>
                    <td className="py-3 text-right font-mono font-bold text-white">
                      ${((item.price_at_purchase || 0) * (item.quantity || 1)).toLocaleString('es-CL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-6 border-t border-gray-800 flex justify-end">
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-gray-400"><span>Monto Neto:</span><span className="font-mono text-gray-200">${neto.toLocaleString('es-CL')}</span></div>
              <div className="flex justify-between text-gray-400"><span>IVA (19%):</span><span className="font-mono text-gray-200">${iva.toLocaleString('es-CL')}</span></div>
              <div className="h-px bg-gray-800 my-2" />
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-sm font-black text-white uppercase">Total Pagado:</span>
                <span className="text-lg font-black text-blue-400 font-mono">${total.toLocaleString('es-CL')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* VISTA 2: PLANTILLA EXCLUSIVA PARA EL PDF (Fondo blanco, formato legal timbrado) */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div
            ref={invoicePrintRef}
            style={{
              width: '800px',
              backgroundColor: '#ffffff',
              color: '#000000',
              padding: '40px 50px',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            {/* Cabecera */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '25px', borderBottom: '2px solid #e5e7eb' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '900', color: '#111827', textTransform: 'uppercase' }}>
                  TECH<span style={{ color: '#2563eb' }}>SHOP</span>
                </h1>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#4b5563' }}>Periféricos y Hardware de Alto Rendimiento</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#6b7280' }}>Ventas Online • Chile</p>
              </div>

              <div style={{ border: '2px solid #dc2626', padding: '12px 20px', textAlign: 'center', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#dc2626', display: 'block' }}>R.U.T.: 76.845.123-K</span>
                <span style={{ fontSize: '14px', fontWeight: '900', color: '#dc2626', textTransform: 'uppercase', display: 'block', margin: '4px 0' }}>BOLETA ELECTRÓNICA</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>N° {order.id?.slice(0, 8).toUpperCase()}</span>
              </div>
            </div>

            {/* Datos */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid #e5e7eb', fontSize: '12px' }}>
              <div>
                <span style={{ fontWeight: 'bold', color: '#6b7280', fontSize: '10px', textTransform: 'uppercase' }}>SEÑOR(A) / CLIENTE:</span>
                <p style={{ margin: '4px 0 2px 0', fontWeight: 'bold', fontSize: '14px', color: '#111827' }}>{order.customer_name || 'Cliente Invitado'}</p>
                <p style={{ margin: '2px 0', color: '#4b5563' }}>{order.customer_email}</p>
                <p style={{ margin: '2px 0', color: '#4b5563' }}>{order.customer_phone}</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: 'bold', color: '#6b7280', fontSize: '10px', textTransform: 'uppercase' }}>DETALLES DEL PEDIDO:</span>
                <p style={{ margin: '4px 0 2px 0', fontWeight: '600', color: '#111827' }}>
                  Fecha: {order.created_at ? new Date(order.created_at).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Reciente'}
                </p>
                <p style={{ margin: '2px 0', color: '#4b5563' }}>Dirección: {order.customer_address || 'Retiro en Tienda'}</p>
                <p style={{ margin: '2px 0', fontSize: '11px', color: '#6b7280' }}>Cod. Pago: {order.payment_id}</p>
              </div>
            </div>

            {/* Tabla de ítems */}
            <div style={{ padding: '20px 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', color: '#6b7280', fontSize: '10px', textTransform: 'uppercase' }}>
                    <th style={{ paddingBottom: '8px' }}>Descripción</th>
                    <th style={{ paddingBottom: '8px', textAlign: 'center' }}>Cant.</th>
                    <th style={{ paddingBottom: '8px', textAlign: 'right' }}>P. Unitario</th>
                    <th style={{ paddingBottom: '8px', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_item?.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px 0' }}>
                        <span style={{ fontWeight: 'bold', display: 'block', color: '#111827' }}>{item.product?.name}</span>
                        {item.product?.brand && <span style={{ fontSize: '10px', color: '#2563eb', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.product.brand}</span>}
                      </td>
                      <td style={{ padding: '12px 0', textAlign: 'center', color: '#374151' }}>{item.quantity}</td>
                      <td style={{ padding: '12px 0', textAlign: 'right', color: '#374151' }}>${item.price_at_purchase?.toLocaleString('es-CL')}</td>
                      <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 'bold', color: '#111827' }}>
                        ${((item.price_at_purchase || 0) * (item.quantity || 1)).toLocaleString('es-CL')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totales */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '15px', borderTop: '2px solid #e5e7eb' }}>
              <div style={{ width: '250px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', marginBottom: '6px' }}>
                  <span>Monto Neto:</span>
                  <span style={{ fontWeight: 'bold' }}>${neto.toLocaleString('es-CL')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', marginBottom: '8px' }}>
                  <span>IVA (19%):</span>
                  <span style={{ fontWeight: 'bold' }}>${iva.toLocaleString('es-CL')}</span>
                </div>
                <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '900', color: '#111827' }}>
                  <span>TOTAL:</span>
                  <span style={{ color: '#2563eb' }}>${total.toLocaleString('es-CL')}</span>
                </div>
              </div>
            </div>

            {/* Pie */}
            <div style={{ marginTop: '40px', paddingTop: '15px', borderTop: '1px solid #e5e7eb', textAlign: 'center', fontSize: '10px', color: '#6b7280' }}>
              <p style={{ margin: '2px 0' }}>Comprobante de compra electrónico emitido por TechShop.</p>
              <p style={{ margin: '2px 0' }}>Gracias por preferir nuestros productos de computación y gaming.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}