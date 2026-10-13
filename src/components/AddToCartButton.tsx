'use client'

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  image_url: string | null;
  slug: string;
}

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { cart, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Cuántas unidades de este producto ya están en el carro
  const itemEnCarrito = cart.find((item) => item.id === product.id);
  const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.quantity : 0;
  
  // Stock restante disponible para agregar
  const stockDisponible = Math.max(0, (Number(product.stock) || 0) - cantidadEnCarrito);

  const handleIncrease = () => {
    if (quantity < stockDisponible) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAdd = () => {
    if (stockDisponible <= 0) return;

    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        slug: product.slug,
        brand: product.brand,
        stock: product.stock, // Enviamos el stock real
      },
      Math.min(quantity, stockDisponible)
    );

    setAdded(true);
    setQuantity(1); // Resetea el contador tras agregar
    setTimeout(() => setAdded(false), 2000);
  };

  // Si no hay stock en base de datos o si ya agregaron el stock completo al carro
  if (product.stock <= 0 || stockDisponible <= 0) {
    return (
      <button
        disabled
        className="w-full bg-gray-900 border border-gray-800 text-gray-600 font-bold py-4 px-6 rounded-2xl text-xs uppercase tracking-wider cursor-not-allowed"
      >
        {product.stock <= 0 ? "Sin Stock Disponible" : "Máximo en el Carrito"}
      </button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      {/* Selector de cantidad */}
      <div className="flex items-center justify-between bg-[#0c0c0e] border border-gray-900 rounded-2xl p-1.5 shrink-0 sm:w-32">
        <button
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className="p-2 text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <Minus size={16} />
        </button>
        <span className="text-xs font-black select-none text-white w-8 text-center">
          {quantity}
        </span>
        <button
          onClick={handleIncrease}
          disabled={quantity >= stockDisponible}
          className="p-2 text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Botón de acción */}
      <button
        onClick={handleAdd}
        className={`flex-1 flex items-center justify-center gap-2 font-bold py-4 px-6 rounded-2xl text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer ${
          added
            ? "bg-green-600 text-white shadow-[0_0_20px_rgba(22,163,74,0.2)]"
            : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.15)] hover:shadow-[0_0_25px_rgba(37,99,235,0.3)]"
        }`}
      >
        {added ? (
          <>
            <Check size={18} strokeWidth={3} className="animate-bounce" />
            ¡Agregado con éxito!
          </>
        ) : (
          <>
            <ShoppingCart size={18} />
            Añadir al Carrito
          </>
        )}
      </button>
    </div>
  );
}