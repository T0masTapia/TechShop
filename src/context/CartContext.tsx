'use client'

import { createContext, useContext, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  brand?: string;
  slug?: string;
  stock: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  decreaseQuantity: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: any, quantityToAdd: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      // Leemos el stock y aseguramos que sea un número
      const rawStock = product.stock ?? existingItem?.stock;
      const maxStock = rawStock !== undefined && rawStock !== null ? Number(rawStock) : 0;
      const cantidadASumar = Math.max(1, Number(quantityToAdd) || 1);

      // Si el producto no tiene stock en base de datos, no lo añade
      if (maxStock <= 0) return prevCart;

      if (existingItem) {
        // Tope estricto con Math.min: jamás superará maxStock
        const nuevaCantidad = Math.min(existingItem.quantity + cantidadASumar, maxStock);

        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                stock: maxStock,
                quantity: nuevaCantidad,
              }
            : item
        );
      }

      // Si es un producto nuevo en el carrito
      const cantidadInicial = Math.min(cantidadASumar, maxStock);

      return [
        ...prevCart,
        {
          ...product,
          stock: maxStock,
          quantity: cantidadInicial,
        },
      ];
    });
  };

  const decreaseQuantity = (productId: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);

      if (!existingItem) return prevCart;

      if (existingItem.quantity > 1) {
        return prevCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }

      return prevCart.filter((item) => item.id !== productId);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, decreaseQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}