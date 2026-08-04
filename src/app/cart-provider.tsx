"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartProduct = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image?: string;
};

export type CartItem = CartProduct & {
  quantity: number;
};

export type AppliedPromo = {
  code: string;
  discountPercent: number;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  total: number;
  promo: AppliedPromo | null;
  setPromo: (promo: AppliedPromo | null) => void;
  addItem: (product: CartProduct) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promo, setPromo] = useState<AppliedPromo | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("nm_skin_care_cart");
    const savedPromo = localStorage.getItem("nm_skin_care_promo");

    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem("nm_skin_care_cart");
      }
    }

    if (savedPromo) {
      try {
        setPromo(JSON.parse(savedPromo));
      } catch {
        localStorage.removeItem("nm_skin_care_promo");
      }
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem("nm_skin_care_cart", JSON.stringify(items));

    if (promo) {
      localStorage.setItem("nm_skin_care_promo", JSON.stringify(promo));
    } else {
      localStorage.removeItem("nm_skin_care_promo");
    }
  }, [items, promo, loaded]);

  function addItem(product: CartProduct) {
    setItems((current) => {
      const existing = current.find((item) => item._id === product._id);

      if (existing) {
        return current.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, item.stock),
              }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  }

  function removeItem(productId: string) {
    setItems((current) => current.filter((item) => item._id !== productId));
  }

  function updateQuantity(productId: string, quantity: number) {
    setItems((current) =>
      current.map((item) =>
        item._id === productId
          ? {
              ...item,
              quantity: Math.max(1, Math.min(quantity, item.stock)),
            }
          : item
      )
    );
  }

  function clearCart() {
    setItems([]);
    setPromo(null);
  }

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
      total: items.reduce(
        (amount, item) => amount + item.price * item.quantity,
        0
      ),
      promo,
      setPromo,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, promo]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}