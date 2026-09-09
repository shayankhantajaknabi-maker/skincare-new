"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/cart-provider";
import StoreFooter from "@/app/store-footer";
import StoreHeader from "@/app/store-header";
import { formatPrice } from "@/lib/format-price";

export default function CartPage() {
  const {
    items,
    total,
    removeItem,
    updateQuantity,
  } = useCart();

  const deliveryFee =
    total >= 3000 ? 0 : 200;

  const grandTotal =
    total + deliveryFee;

  return (
    <div>
      <StoreHeader />

      <main className="nm-cart-page">
        <div className="nm-container">
          <div className="nm-breadcrumb">
            <Link href="/">
              Home
            </Link>

            <span>/</span>

            <span>
              Cart
            </span>
          </div>

          <div className="nm-cart-heading">
            <h1>
              Your Cart
            </h1>

            <Link
              href="/shop"
              className="nm-button nm-button-primary"
            >
              Continue Shopping
            </Link>
          </div>

          {items.length === 0 ? (
            <section className="nm-empty-cart">
              <h2>
                Your cart is empty
              </h2>

              <p>
                Browse our products and find
                what fits your routine.
              </p>

              <Link
                href="/shop"
                className="nm-button nm-button-primary"
              >
                Shop ORINOCA NATURAL
              </Link>
            </section>
          ) : (
            <div className="nm-cart-grid">
              <section className="nm-cart-items">
                <div className="nm-cart-table-head">
                  <span>
                    Product
                  </span>

                  <span>
                    Price
                  </span>

                  <span>
                    Quantity
                  </span>
                </div>

                {items.map((item) => (
                  <article
                    key={item._id}
                    className="nm-cart-item"
                  >
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
                          <span>
                            ON
                          </span>
                        )}
                      </div>

                      <div>
                        <h2>
                          {item.name}
                        </h2>

                        <p>
                          ORINOCA NATURAL
                        </p>
                      </div>
                    </div>

                    <p className="nm-cart-price">
                      {formatPrice(
                        item.price
                      )}
                    </p>

                    <div className="nm-cart-actions">
                      <div className="nm-quantity">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.quantity - 1
                            )
                          }
                          disabled={
                            item.quantity <= 1
                          }
                        >
                          −
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.quantity + 1
                            )
                          }
                          disabled={
                            item.quantity >=
                            item.stock
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="nm-remove-button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() =>
                          removeItem(
                            item._id
                          )
                        }
                      >
                        ×
                      </button>
                    </div>
                  </article>
                ))}
              </section>

              <aside className="nm-order-summary">
                <h2>
                  Order Summary
                </h2>

                <div className="nm-summary-row">
                  <span>
                    Subtotal (
                    {items.length}{" "}
                    {items.length === 1
                      ? "item"
                      : "items"}
                    )
                  </span>

                  <span>
                    {formatPrice(total)}
                  </span>
                </div>

                <div className="nm-summary-row">
                  <span>
                    Shipping
                  </span>

                  <span>
                    {deliveryFee === 0
                      ? "Free"
                      : formatPrice(
                          deliveryFee
                        )}
                  </span>
                </div>

                <div className="nm-summary-total">
                  <span>
                    Total
                  </span>

                  <strong>
                    {formatPrice(
                      grandTotal
                    )}
                  </strong>
                </div>

                <Link
                  href="/checkout"
                  className="nm-button nm-button-primary nm-checkout-button"
                >
                  Proceed to Checkout
                </Link>

                <p className="nm-free-shipping-note">
                  {total >= 3000
                    ? "You qualify for free shipping."
                    : "Free shipping on orders above Rs. 3,000.0"}
                </p>
              </aside>
            </div>
          )}
        </div>
      </main>

      <StoreFooter
        ctaTitle="Not done browsing?"
        ctaDescription="Explore the ORINOCA NATURAL collection and discover what fits your routine."
        ctaButtonText="Back to Shop"
        ctaHref="/shop"
      />
    </div>
  );
}