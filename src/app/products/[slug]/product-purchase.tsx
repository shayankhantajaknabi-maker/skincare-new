"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCart,
  type CartProduct,
} from "@/app/cart-provider";

type ProductPurchaseProps = {
  product: CartProduct;
};

export default function ProductPurchase({
  product,
}: ProductPurchaseProps) {
  const { addItem } = useCart();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const outOfStock = product.stock < 1;

  function increaseQuantity() {
    setQuantity((current) =>
      Math.min(
        current + 1,
        product.stock
      )
    );
  }

  function decreaseQuantity() {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  }

  function addSelectedQuantity() {
    if (outOfStock) {
      return;
    }

    for (
      let index = 0;
      index < quantity;
      index += 1
    ) {
      addItem(product);
    }

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1800);
  }

  function buyNow() {
    if (outOfStock) {
      return;
    }

    for (
      let index = 0;
      index < quantity;
      index += 1
    ) {
      addItem(product);
    }

    router.push("/checkout");
  }

  return (
    <>
      <div className="mt-8">
        {/* QUANTITY */}

        <p className="mb-3 font-serif text-[13px] font-semibold uppercase tracking-[0.16em] text-[#123529]">
          Quantity
        </p>

        <div className="flex h-11 w-[118px] items-center justify-between rounded-full border border-[#b9d0c8] px-4 text-[#123529]">
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={
              quantity <= 1 || outOfStock
            }
            className="text-xl leading-none disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            −
          </button>

          <span className="text-sm font-medium">
            {quantity}
          </span>

          <button
            type="button"
            onClick={increaseQuantity}
            disabled={
              quantity >= product.stock ||
              outOfStock
            }
            className="text-xl leading-none disabled:opacity-40"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* DESKTOP / NORMAL BUTTONS */}

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={addSelectedQuantity}
            disabled={outOfStock}
            className="rounded-full border border-[#8fb3a7] bg-white px-5 py-4 text-sm font-semibold text-[#123529] transition hover:bg-[#f5f2eb] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {outOfStock
              ? "Out of stock"
              : added
                ? "Added to cart ✓"
                : "Add to Cart"}
          </button>

          <button
            type="button"
            onClick={buyNow}
            disabled={outOfStock}
            className="rounded-full bg-[#005746] px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_20px_rgba(0,87,70,0.18)] transition hover:bg-[#003f33] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {outOfStock
              ? "Out of stock"
              : "Buy Now"}
          </button>
        </div>

        {/* STOCK INFO */}

        <div className="mt-4">
          {outOfStock ? (
            <p className="text-sm font-semibold text-red-600">
              Currently out of stock
            </p>
          ) : product.stock <= 5 ? (
            <p className="text-sm font-semibold text-[#a36d00]">
              Only {product.stock} left in stock
            </p>
          ) : (
            <p className="text-sm font-medium text-[#47806e]">
              In stock
            </p>
          )}
        </div>

        {/* TRUST INFO */}

        <div className="mt-7 space-y-3 border-t border-[#dbe5e0] pt-6 text-sm text-[#5f625f]">
          <p>
            ☷ &nbsp; Cash on Delivery
            available nationwide
          </p>

          <p>
            ▣ &nbsp; Delivered across
            Pakistan in 2–4 working days
          </p>

          <p>
            ♢ &nbsp; Laboratory tested
            &amp; registered in Pakistan
          </p>
        </div>
      </div>

      {/* =========================================
          MOBILE STICKY BUY BAR
      ========================================== */}

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#dbe5e0] bg-white/95 p-3 shadow-[0_-10px_30px_rgba(18,53,41,0.10)] backdrop-blur-md sm:hidden">
        <div className="mx-auto flex max-w-[540px] items-center gap-3">
          {/* PRODUCT */}

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-[#123529]">
              {product.name}
            </p>

            <p className="mt-1 text-sm font-semibold text-[#005746]">
              Rs.{" "}
              {product.price.toLocaleString(
                "en-PK"
              )}
            </p>
          </div>

          {/* ADD */}

          <button
            type="button"
            onClick={addSelectedQuantity}
            disabled={outOfStock}
            className="shrink-0 rounded-full border border-[#8fb3a7] bg-white px-4 py-3 text-xs font-semibold text-[#123529] disabled:opacity-50"
          >
            {added ? "Added ✓" : "Cart"}
          </button>

          {/* BUY */}

          <button
            type="button"
            onClick={buyNow}
            disabled={outOfStock}
            className="shrink-0 rounded-full bg-[#005746] px-5 py-3 text-xs font-semibold text-white shadow-[0_8px_18px_rgba(0,87,70,0.18)] disabled:opacity-50"
          >
            {outOfStock
              ? "Sold Out"
              : "Buy Now"}
          </button>
        </div>
      </div>

      {/* MOBILE BOTTOM SPACE
          so sticky bar does not cover page/footer */}

      <div className="h-24 sm:hidden" />
    </>
  );
}