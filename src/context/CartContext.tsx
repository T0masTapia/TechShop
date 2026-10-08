'use client'

import { createContext, useContext, useState } from "react";

interface CartItem {
    id: string,
    name: string,
    price: number,
    image_url: string,
    brand?: string,
    quantity: number
}

interface CartContextType {
    cart: CartItem[],
    addToCart: (product: any) => void,
    removeFromCart: (productID: string) => void,
    clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (product: any) => {
        setCart((prevCart) => {

            const existingItem = prevCart.find((item) =>
                item.id === product.id)

            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id ? {
                        ...item,
                        quantity: item.quantity + 1
                    } : item)
            }

            return [...prevCart, { ...product, quantity: 1 }];

        });
    };

    const removeFromCart = (productId: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
    };

    const clearCart = () => setCart([]);

    return(
        <CartContext.Provider value={{cart, addToCart, removeFromCart, clearCart}}>
            {children}
        </CartContext.Provider>
    );
}

 export function useCart(){
    const context = useContext(CartContext);
    if (!context){
        throw new Error('useCart debe ser usado dentro de un CartProvider')
    }
    return context;
 }
