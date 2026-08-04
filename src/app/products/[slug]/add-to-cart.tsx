"use client";

import { useState } from "react";
import { useCart, type CartProduct } from "@/app/cart-provider";

type AddToCartProps = {
  product: CartProduct;
  className?: string;
  label?: string;
};

export default function AddToCart({
  product,
  className,
  label = "Add to Cart",
}: AddToCartProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addItem(product);
    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1800);
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={product.stock < 1}
      className={
        className ||
        "w-full rounded-xl bg-[#1b4d3e] px-5 py-4 font-semibold text-white transition hover:bg-[#123529] disabled:cursor-not-allowed disabled:opacity-50"
      }
    >
      {product.stock < 1
        ? "Out of stock"
        : added
          ? "Added to cart ✓"
          : label}
    </button>
  );
}