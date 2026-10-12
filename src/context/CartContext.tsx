'use client'

import { createContext, useContext, useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  brand?: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  decreaseQuantity: (productId: string) => void; // <-- Nueva función para restar de a 1
  removeFromCart: (productId: string) => void;    // <-- Elimina todo el producto sin importar la cantidad
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Añadir al carrito (suma unidades)
  const addToCart = (product: any, quantityToAdd: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: quantityToAdd }];
    });
  };

  // Restar 1 unidad (si llega a 1 y restas, se elimina)
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

      // Si la cantidad era 1, lo remueve del carrito
      return prevCart.filter((item) => item.id !== productId);
    });
  };

  // Eliminar producto completamente (ej: botón del basurero)
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