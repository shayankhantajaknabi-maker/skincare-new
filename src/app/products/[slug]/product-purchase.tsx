"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartProduct } from "@/app/cart-provider";

type ProductPurchaseProps = {
  product: CartProduct;
};

export default function ProductPurchase({ product }: ProductPurchaseProps) {
  const { addItem } = useCart();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function increaseQuantity() {
    setQuantity((current) => Math.min(current + 1, product.stock));
  }

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function addSelectedQuantity() {
    for (let index = 0; index < quantity; index += 1) {
      addItem(product);
    }

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1800);
  }

  function buyNow() {
    addSelectedQuantity();
    router.push("/cart");
  }

  return (
    <div className="mt-7">
      <p className="mb-3 font-serif text-[13px] font-semibold uppercase tracking-[0.16em] text-[#123529]">
        Quantity
      </p>

      <div className="flex h-11 w-[118px] items-center justify-between rounded-full border border-[#b9d0c8] px-4 text-[#123529]">
        <button
          type="button"
          onClick={decreaseQuantity}
          className="text-xl leading-none"
          aria-label="Decrease quantity"
        >
          −
        </button>

        <span className="text-sm font-medium">{quantity}</span>

        <button
          type="button"
          onClick={increaseQuantity}
          disabled={quantity >= product.stock}
          className="text-xl leading-none disabled:opacity-40"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={addSelectedQuantity}
          disabled={product.stock < 1}
          className="rounded-full border border-[#8fb3a7] bg-white px-5 py-4 text-sm font-semibold text-[#123529] transition hover:bg-[#f5f2eb] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {product.stock < 1
            ? "Out of stock"
            : added
              ? "Added to cart ✓"
              : "Add to Cart"}
        </button>

        <button
          type="button"
          onClick={buyNow}
          disabled={product.stock < 1}
          className="rounded-full bg-[#005746] px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_20px_rgba(0,87,70,0.18)] transition hover:bg-[#003f33] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buy Now
        </button>
      </div>

      <div className="mt-7 space-y-3 border-t border-[#dbe5e0] pt-6 text-sm text-[#5f625f]">
        <p>☷ &nbsp; Cash on Delivery available nationwide</p>
        <p>▣ &nbsp; Delivered across Pakistan in 2–4 working days</p>
        <p>♢ &nbsp; Laboratory tested &amp; registered in Pakistan</p>
      </div>
    </div>
  );
}