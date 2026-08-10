"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/app/cart-provider";
import StoreFooter from "@/app/store-footer";
import StoreHeader from "@/app/store-header";

export default function CartPage() {
  const {
    items,
    total,
    promo,
    setPromo,
    removeItem,
    updateQuantity,
  } = useCart();

  const [promoInput, setPromoInput] = useState(promo?.code || "");
  const [promoMessage, setPromoMessage] = useState("");
  const [checkingPromo, setCheckingPromo] = useState(false);

  const discountAmount = promo
    ? Math.round((total * promo.discountPercent) / 100)
    : 0;

  const discountedSubtotal = Math.max(0, total - discountAmount);
  const deliveryFee = discountedSubtotal >= 3000 ? 0 : 200;
  const grandTotal = discountedSubtotal + deliveryFee;

  async function applyPromo() {
    const code = promoInput.trim().toUpperCase();

    if (!code) {
      setPromo(null);
      setPromoMessage("Enter a promo code first.");
      return;
    }

    setCheckingPromo(true);
    setPromoMessage("");

    try {
      const params = new URLSearchParams({
        code,
        subtotal: String(total),
      });

      const response = await fetch(`/api/promos/validate?${params}`);
      const data = await response.json();

      if (!response.ok) {
        setPromo(null);
        setPromoMessage(data.message || "Promo code could not be applied.");
        return;
      }

      setPromo({
        code: data.promo.code,
        discountPercent: data.promo.discountPercent,
      });

      setPromoInput(data.promo.code);
      setPromoMessage(
        `${data.promo.discountPercent}% discount applied successfully.`
      );
    } catch {
      setPromo(null);
      setPromoMessage("Unable to validate promo code. Please try again.");
    } finally {
      setCheckingPromo(false);
    }
  }

  function removePromo() {
    setPromo(null);
    setPromoInput("");
    setPromoMessage("Promo code removed.");
  }

  return (
    <div className="nm-store">
      <StoreHeader />

      <main className="nm-cart-page">
        <div className="nm-container">
          <div className="nm-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Cart</span>
          </div>

          <div className="nm-cart-heading">
            <h1>Your Cart</h1>

            <Link href="/shop" className="nm-button nm-button-primary">
              Continue Shopping
            </Link>
          </div>

          {items.length === 0 ? (
            <section className="nm-empty-cart">
              <h2>Your cart is empty</h2>
              <p>Browse our serum packs and find what fits your routine.</p>

              <Link href="/shop" className="nm-button nm-button-primary">
                Shop ORINOCA NATURAL
              </Link>
            </section>
          ) : (
            <div className="nm-cart-grid">
              <section className="nm-cart-items">
                <div className="nm-cart-table-head">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                </div>

                {items.map((item) => (
                  <article key={item._id} className="nm-cart-item">
                    <div className="nm-cart-product">
                      <div className="nm-cart-image">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={96}
                            height={96}
                            unoptimized
                          />
                        ) : (
                          <span>NM</span>
                        )}
                      </div>

                      <div>
                        <h2>{item.name}</h2>
                        <p>Premium serum pack</p>
                      </div>
                    </div>

                    <p className="nm-cart-price">
                      Rs. {item.price.toLocaleString()}
                    </p>

                    <div className="nm-cart-actions">
                      <div className="nm-quantity">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="nm-remove-button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeItem(item._id)}
                      >
                        ×
                      </button>
                    </div>
                  </article>
                ))}
              </section>

              <aside className="nm-order-summary">
                <h2>Order Summary</h2>

                <div className="nm-summary-row">
                  <span>Subtotal ({items.length} items)</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>

                <div className="nm-summary-row">
                  <span>Shipping</span>
                  <span>
                    {deliveryFee === 0 ? "Free" : `Rs. ${deliveryFee}`}
                  </span>
                </div>

                <div className="nm-promo-box">
                  <label htmlFor="promo-code">Promo code</label>

                  <div className="nm-promo-actions">
                    <input
                      id="promo-code"
                      value={promoInput}
                      onChange={(event) => setPromoInput(event.target.value)}
                      placeholder="Enter promo code"
                      disabled={checkingPromo}
                    />

                    <button
                      type="button"
                      onClick={applyPromo}
                      disabled={checkingPromo || total <= 0}
                    >
                      {checkingPromo ? "Checking..." : "Apply"}
                    </button>
                  </div>

                  {promo ? (
                    <div className="nm-promo-success">
                      <span>
                        {promo.code} · {promo.discountPercent}% off
                      </span>

                      <button type="button" onClick={removePromo}>
                        Remove
                      </button>
                    </div>
                  ) : null}

                  {promoMessage ? (
                    <p
                      className={
                        promo ? "nm-promo-message success" : "nm-promo-message"
                      }
                    >
                      {promoMessage}
                    </p>
                  ) : null}
                </div>

                {promo ? (
                  <div className="nm-summary-row nm-discount-row">
                    <span>Promo discount</span>
                    <span>− Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                ) : null}

                <div className="nm-summary-total">
                  <span>Total</span>
                  <strong>Rs. {grandTotal.toLocaleString()}</strong>
                </div>

                <Link
                  href="/checkout"
                  className="nm-button nm-button-primary nm-checkout-button"
                >
                  Proceed to Checkout
                </Link>

                <p className="nm-free-shipping-note">
                  {discountedSubtotal >= 3000
                    ? "You qualify for free shipping."
                    : "Free shipping on orders above Rs. 3,000"}
                </p>
              </aside>
            </div>
          )}
        </div>
      </main>

      <StoreFooter
        ctaTitle="Not done browsing?"
        ctaDescription="Explore every serum pack and find what fits your routine."
        ctaButtonText="Back to Shop"
        ctaHref="/shop"
      />
    </div>
  );
}