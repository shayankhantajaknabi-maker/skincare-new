"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/cart-provider";
import StoreFooter from "@/app/store-footer";
import StoreHeader from "@/app/store-header";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  postalCode: "",
  notes: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, promo, clearCart } = useCart();

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const discountAmount = promo
    ? Math.round((total * promo.discountPercent) / 100)
    : 0;

  const discountedSubtotal = Math.max(0, total - discountAmount);
  const deliveryFee = discountedSubtotal >= 3000 ? 0 : 200;
  const grandTotal = discountedSubtotal + deliveryFee;

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: form,
          promoCode: promo?.code || "",
          items: items.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to place your order.");
        return;
      }

      clearCart();

      router.push(
        `/order-confirmed?order=${encodeURIComponent(
          data.order.orderNumber
        )}`
      );
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="nm-store">
        <StoreHeader />

        <main className="nm-checkout-page">
          <div className="nm-container">
            <section className="nm-empty-cart">
              <h1>Your cart is empty</h1>
              <p>Add a serum pack before proceeding to checkout.</p>

              <Link href="/shop" className="nm-button nm-button-primary">
                Back to Shop
              </Link>
            </section>
          </div>
        </main>

        <StoreFooter showCta={false} />
      </div>
    );
  }

  return (
    <div className="nm-store">
      <StoreHeader />

      <main className="nm-checkout-page">
        <div className="nm-container">
          <div className="nm-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/cart">Cart</Link>
            <span>/</span>
            <span>Checkout</span>
          </div>

          <h1 className="nm-page-title">Checkout</h1>

          <p className="nm-checkout-steps">
            <strong>1. Cart</strong> → <strong>2. Details</strong> → 3.
            Confirmation
          </p>

          <form onSubmit={handleSubmit} className="nm-checkout-grid">
            <section className="nm-checkout-form">
              <h2>Shipping Details</h2>

              <label>
                Full Name
                <input
                  required
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="e.g. Ali Raza"
                />
              </label>

              <div className="nm-form-two-columns">
                <label>
                  Phone Number
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    placeholder="03xx-xxxxxxx"
                  />
                </label>

                <label>
                  Email (optional)
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <label>
                Street Address
                <input
                  required
                  value={form.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  placeholder="House #, Street, Area"
                />
              </label>

              <div className="nm-form-two-columns">
                <label>
                  City
                  <input
                    required
                    value={form.city}
                    onChange={(event) => updateField("city", event.target.value)}
                    placeholder="e.g. Lahore"
                  />
                </label>

                <label>
                  Postal Code (optional)
                  <input
                    value={form.postalCode}
                    onChange={(event) =>
                      updateField("postalCode", event.target.value)
                    }
                    placeholder="e.g. 54000"
                  />
                </label>
              </div>

              <label>
                Order Notes (optional)
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(event) =>
                    updateField("notes", event.target.value)
                  }
                  placeholder="Delivery instructions, landmark, etc."
                />
              </label>

              <div className="nm-payment-method">
                <p>Payment Method</p>

                <div>
                  <strong>Cash on Delivery</strong>
                  <span>Pay when your order arrives</span>
                </div>
              </div>

              {message ? <p className="nm-form-error">{message}</p> : null}

              <button
                type="submit"
                disabled={submitting}
                className="nm-button nm-button-primary nm-place-order"
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
            </section>

            <aside className="nm-order-summary">
              <h2>Order Summary</h2>

              <div className="nm-checkout-products">
                {items.map((item) => (
                  <div key={item._id} className="nm-checkout-product">
                    <span>
                      {item.name}
                      <small>Qty {item.quantity}</small>
                    </span>

                    <strong>
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="nm-summary-row">
                <span>Subtotal</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>

              {promo ? (
                <div className="nm-summary-row nm-discount-row">
                  <span>
                    Promo ({promo.code} · {promo.discountPercent}%)
                  </span>
                  <span>− Rs. {discountAmount.toLocaleString()}</span>
                </div>
              ) : null}

              <div className="nm-summary-row">
                <span>Shipping</span>
                <span>
                  {deliveryFee === 0 ? "Free" : `Rs. ${deliveryFee}`}
                </span>
              </div>

              <div className="nm-summary-total">
                <span>Total</span>
                <strong>Rs. {grandTotal.toLocaleString()}</strong>
              </div>
            </aside>
          </form>
        </div>
      </main>

      <StoreFooter showCta={false} />
    </div>
  );
}