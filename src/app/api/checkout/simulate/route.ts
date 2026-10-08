// app/api/checkout/simulate/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/Supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customer, userId } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    // 1. Validar stock y calcular monto total en el servidor
    let totalAmount = 0;

    for (const item of items) {
      const { data: prod, error: prodErr } = await supabase
        .from('product')
        .select('id, price, stock, name')
        .eq('id', item.id)
        .single();

      if (prodErr || !prod) {
        return NextResponse.json(
          { error: `El producto ${item.name || item.id} no existe.` },
          { status: 400 }
        );
      }

      if ((prod.stock ?? 0) < item.quantity) {
        return NextResponse.json(
          { error: `No hay suficiente stock para "${prod.name}". Disponibles: ${prod.stock}` },
          { status: 400 }
        );
      }

      totalAmount += prod.price * item.quantity;
    }

    // 2. Insertar en la tabla 'order'
    const { data: newOrder, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id: userId || null,
        customer_name: customer?.fullName || null,
        customer_email: customer?.email || null,
        customer_phone: customer?.phone || null,
        customer_address: customer?.address || null,
        total_amount: totalAmount,
        status: 'completed',
        payment_id: `SIM-${Date.now()}`
      })
      .select('id')
      .single();

    if (orderErr || !newOrder) {
      console.error("Error al crear order:", orderErr);
      return NextResponse.json({ error: 'Error al registrar la orden' }, { status: 500 });
    }

    // 3. Insertar items y descontar stock
    for (const item of items) {
      await supabase.from('order_item').insert({
        order_id: newOrder.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price
      });

      // Descontar inventario
      const { data: currentProd } = await supabase
        .from('product')
        .select('stock')
        .eq('id', item.id)
        .single();

      if (currentProd) {
        const updatedStock = Math.max(0, (currentProd.stock ?? 0) - item.quantity);
        await supabase
          .from('product')
          .update({ stock: updatedStock })
          .eq('id', item.id);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      total: totalAmount
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}