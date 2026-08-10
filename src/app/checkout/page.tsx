"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  AppliedPromo,
  useCart,
} from "@/app/cart-provider";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  postalCode: "",
  notes: "",
};

type FormErrors = {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
};

export default function CheckoutPage() {
  const router = useRouter();

  const {
    items,
    total,
    promo,
    setPromo,
    clearCart,
  } = useCart();

  const [form, setForm] =
    useState(initialForm);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [promoInput, setPromoInput] =
    useState(promo?.code || "");

  const [promoMessage, setPromoMessage] =
    useState("");

  const [checkingPromo, setCheckingPromo] =
    useState(false);

  useEffect(() => {
    setPromoInput(promo?.code || "");
  }, [promo?.code]);

  const discountAmount = promo
    ? Math.round(
        (total * promo.discountPercent) /
          100
      )
    : 0;

  const discountedSubtotal = Math.max(
    0,
    total - discountAmount
  );

  const deliveryFee =
    discountedSubtotal >= 3000
      ? 0
      : 200;

  const grandTotal =
    discountedSubtotal + deliveryFee;

  function updateField(
    field: keyof typeof initialForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (
      field === "name" ||
      field === "phone" ||
      field === "email" ||
      field === "address" ||
      field === "city"
    ) {
      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  }

  function validateForm() {
    const nextErrors: FormErrors = {};

    const name =
      form.name.trim();

    const phone =
      form.phone
        .replace(/\s/g, "")
        .replace(/-/g, "");

    const address =
      form.address.trim();

    const city =
      form.city.trim();

    const email =
      form.email.trim();

    if (name.length < 2) {
      nextErrors.name =
        "Please enter your full name.";
    }

    const validPakistanPhone =
      /^(?:\+92|92|0)?3\d{9}$/.test(
        phone
      );

    if (!validPakistanPhone) {
      nextErrors.phone =
        "Enter a valid Pakistan mobile number, e.g. 03001234567.";
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      nextErrors.email =
        "Please enter a valid email address.";
    }

    if (address.length < 5) {
      nextErrors.address =
        "Please enter your complete delivery address.";
    }

    if (city.length < 2) {
      nextErrors.city =
        "Please enter your city.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  }

  async function applyPromo() {
    const code = promoInput
      .trim()
      .toUpperCase();

    if (!code) {
      setPromoMessage(
        "Enter a promo code first."
      );

      return;
    }

    setCheckingPromo(true);
    setPromoMessage("");

    try {
      const params =
        new URLSearchParams({
          code,
          subtotal: String(total),
        });

      const response = await fetch(
        `/api/promos/validate?${params}`
      );

      const data =
        await response.json();

      if (!response.ok) {
        setPromo(null);

        setPromoMessage(
          data.message ||
            "Promo code could not be applied."
        );

        return;
      }

      setPromo({
        code: data.promo.code,
        discountPercent:
          data.promo.discountPercent,
      });

      setPromoInput(
        data.promo.code
      );

      setPromoMessage(
        `${data.promo.discountPercent}% discount applied successfully.`
      );
    } catch {
      setPromo(null);

      setPromoMessage(
        "Unable to validate promo code. Please try again."
      );
    } finally {
      setCheckingPromo(false);
    }
  }

  function removePromo() {
    setPromo(null);
    setPromoInput("");
    setPromoMessage(
      "Promo code removed."
    );
  }

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    if (items.length === 0) {
      setMessage(
        "Your cart is empty."
      );
      return;
    }

    if (!validateForm()) {
      setMessage(
        "Please check the highlighted fields."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            customer: {
              ...form,
              name: form.name.trim(),
              phone:
                form.phone.trim(),
              email:
                form.email.trim(),
              address:
                form.address.trim(),
              city:
                form.city.trim(),
              postalCode:
                form.postalCode.trim(),
              notes:
                form.notes.trim(),
            },

            promoCode:
              promo?.code || "",

            items: items.map(
              (item) => ({
                productId:
                  item._id,
                quantity:
                  item.quantity,
              })
            ),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to place your order."
        );

        return;
      }

      clearCart();

      router.push(
        `/order-confirmed?order=${encodeURIComponent(
          data.order.orderNumber
        )}`
      );
    } catch {
      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] px-5 py-16 text-[#123529]">
        <div className="mx-auto max-w-[560px] rounded-[28px] border border-[#123529]/10 bg-white p-8 text-center shadow-[0_20px_60px_rgba(18,53,41,0.08)] sm:p-12">
          <p className="font-serif text-3xl font-semibold">
            ORINOCA
          </p>

          <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.35em] text-[#8a9a86]">
            NATURAL
          </p>

          <h1 className="mt-10 font-serif text-3xl font-semibold">
            Your cart is empty
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#747d78]">
            Add an ORINOCA NATURAL
            serum before proceeding to
            checkout.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex rounded-2xl bg-[#073c31] px-6 py-3.5 text-sm font-semibold text-white"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#171b19]">
      <form onSubmit={handleSubmit}>
        <div className="mx-auto grid min-h-screen max-w-[1450px] lg:grid-cols-[1.06fr_0.94fr]">
          {/* LEFT */}

          <section className="px-5 py-7 sm:px-8 lg:border-r lg:border-[#123529]/10 lg:px-12 lg:py-10 xl:px-16">
            <div className="mx-auto max-w-[620px]">
              {/* BRAND */}

              <div className="flex items-center justify-between border-b border-[#123529]/8 pb-7 lg:border-b-0">
                <Link href="/">
                  <p className="font-serif text-[30px] font-semibold leading-none text-[#123529]">
                    ORINOCA
                  </p>

                  <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.35em] text-[#8a9a86]">
                    NATURAL
                  </p>
                </Link>

                <Link
                  href="/cart"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#123529]/15 text-[#123529]"
                  aria-label="Cart"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-5 w-5"
                  >
                    <path d="M6 8h12l1 13H5L6 8Z" />
                    <path d="M9 9V6a3 3 0 0 1 6 0v3" />
                  </svg>
                </Link>
              </div>

              {/* CONTACT */}

              <section className="mt-8">
                <h1 className="text-xl font-semibold">
                  Contact
                </h1>

                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField(
                      "email",
                      event.target.value
                    )
                  }
                  placeholder="Email (optional)"
                  className={`mt-4 w-full rounded-xl border bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#757d79] focus:ring-1 ${
                    errors.email
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-[#cfd4d1] focus:border-[#073c31] focus:ring-[#073c31]"
                  }`}
                />

                {errors.email ? (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.email}
                  </p>
                ) : null}
              </section>

              {/* DELIVERY */}

              <section className="mt-8">
                <h2 className="text-xl font-semibold">
                  Delivery
                </h2>

                <div className="mt-4 rounded-xl border border-[#cfd4d1] px-4 py-3">
                  <p className="text-[11px] text-[#717975]">
                    Country / Region
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    Pakistan
                  </p>
                </div>

                {/* NAME */}

                <input
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="Full name"
                  className={`mt-3 w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition placeholder:text-[#757d79] focus:ring-1 ${
                    errors.name
                      ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-200"
                      : "border-[#cfd4d1] focus:border-[#073c31] focus:ring-[#073c31]"
                  }`}
                />

                {errors.name ? (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.name}
                  </p>
                ) : null}

                {/* ADDRESS */}

                <input
                  value={form.address}
                  onChange={(event) =>
                    updateField(
                      "address",
                      event.target.value
                    )
                  }
                  placeholder="House #, Street, Area"
                  className={`mt-3 w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition placeholder:text-[#757d79] focus:ring-1 ${
                    errors.address
                      ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-200"
                      : "border-[#cfd4d1] focus:border-[#073c31] focus:ring-[#073c31]"
                  }`}
                />

                {errors.address ? (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.address}
                  </p>
                ) : null}

                {/* CITY + POSTAL */}

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <input
                      value={form.city}
                      onChange={(event) =>
                        updateField(
                          "city",
                          event.target.value
                        )
                      }
                      placeholder="City"
                      className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition placeholder:text-[#757d79] focus:ring-1 ${
                        errors.city
                          ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-200"
                          : "border-[#cfd4d1] focus:border-[#073c31] focus:ring-[#073c31]"
                      }`}
                    />

                    {errors.city ? (
                      <p className="mt-2 text-xs font-medium text-red-600">
                        {errors.city}
                      </p>
                    ) : null}
                  </div>

                  <input
                    value={
                      form.postalCode
                    }
                    onChange={(event) =>
                      updateField(
                        "postalCode",
                        event.target.value
                      )
                    }
                    placeholder="Postal code (optional)"
                    className="w-full rounded-xl border border-[#cfd4d1] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#757d79] focus:border-[#073c31] focus:ring-1 focus:ring-[#073c31]"
                  />
                </div>

                {/* PHONE */}

                <input
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value
                    )
                  }
                  placeholder="0300 1234567"
                  className={`mt-3 w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition placeholder:text-[#757d79] focus:ring-1 ${
                    errors.phone
                      ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-200"
                      : "border-[#cfd4d1] focus:border-[#073c31] focus:ring-[#073c31]"
                  }`}
                />

                {errors.phone ? (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    {errors.phone}
                  </p>
                ) : (
                  <p className="mt-2 text-[11px] text-[#8a938f]">
                    Pakistan mobile number,
                    e.g. 03001234567
                  </p>
                )}

                {/* NOTES */}

                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(event) =>
                    updateField(
                      "notes",
                      event.target.value
                    )
                  }
                  placeholder="Delivery notes (optional)"
                  className="mt-3 w-full resize-none rounded-xl border border-[#cfd4d1] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#757d79] focus:border-[#073c31] focus:ring-1 focus:ring-[#073c31]"
                />
              </section>

              {/* SHIPPING */}

              <section className="mt-8">
                <h2 className="text-lg font-semibold">
                  Shipping method
                </h2>

                <div className="mt-4 rounded-xl border-2 border-[#073c31] bg-[#f8faf8] px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">
                        {deliveryFee === 0
                          ? "Free Shipping"
                          : "Standard Shipping"}
                      </p>

                      <p className="mt-1 text-xs text-[#68716d]">
                        Estimated delivery:
                        2–4 working days
                      </p>
                    </div>

                    <span className="shrink-0 text-sm font-semibold">
                      {deliveryFee === 0
                        ? "FREE"
                        : `Rs. ${deliveryFee}`}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#dfe8e3] bg-[#f7faf8] px-4 py-3">
                  <span className="text-lg">
                    ✓
                  </span>

                  <p className="text-xs leading-5 text-[#65706a]">
                    Delivery available
                    across Pakistan.
                  </p>
                </div>
              </section>

              {/* PAYMENT */}

              <section className="mt-8">
                <h2 className="text-xl font-semibold">
                  Payment
                </h2>

                <p className="mt-1 text-sm text-[#777f7b]">
                  Pay securely when your
                  order arrives.
                </p>

                <div className="mt-4 rounded-xl border-2 border-[#073c31] bg-[#f8faf8] px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#073c31]">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#073c31]" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Cash on Delivery
                        (COD)
                      </p>

                      <p className="mt-1 text-xs text-[#7d8581]">
                        Pay when your
                        ORINOCA NATURAL
                        order arrives.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* DIFFERENT BILLING ADDRESS REMOVED */}

              {message ? (
                <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {message}
                </div>
              ) : null}

              {/* MOBILE SUMMARY */}

              <div className="mt-8 rounded-[20px] border border-[#123529]/10 bg-[#f7f5ef] p-5 lg:hidden">
                <h2 className="text-lg font-semibold">
                  Order Summary
                </h2>

                <div className="mt-4 space-y-3">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-start justify-between gap-4"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-[#7d8581]">
                          Qty{" "}
                          {
                            item.quantity
                          }
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-medium">
                        Rs.{" "}
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <PromoBox
                  promo={promo}
                  promoInput={
                    promoInput
                  }
                  setPromoInput={
                    setPromoInput
                  }
                  promoMessage={
                    promoMessage
                  }
                  checkingPromo={
                    checkingPromo
                  }
                  total={total}
                  applyPromo={
                    applyPromo
                  }
                  removePromo={
                    removePromo
                  }
                />

                <div className="mt-5 border-t border-[#123529]/10 pt-4">
                  <SummaryRows
                    subtotal={total}
                    promo={promo}
                    discountAmount={
                      discountAmount
                    }
                    deliveryFee={
                      deliveryFee
                    }
                    grandTotal={
                      grandTotal
                    }
                  />
                </div>
              </div>

              {/* COMPLETE ORDER */}

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#073c31] px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(7,60,49,0.15)] transition hover:bg-[#123529] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Placing Order...
                  </>
                ) : (
                  <>
                    Complete Order · Rs.{" "}
                    {grandTotal.toLocaleString()}
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-[11px] leading-5 text-[#8a938f]">
                By placing your order,
                you confirm that the
                delivery details above
                are correct.
              </p>

              {/* POLICIES */}

              <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#123529]/10 pt-5 text-xs text-[#626b66]">
                <Link href="/privacy">
                  Privacy policy
                </Link>

                <Link href="/shipping-returns">
                  Shipping
                </Link>

                <Link href="/terms">
                  Terms of service
                </Link>
              </div>
            </div>
          </section>

          {/* RIGHT SUMMARY */}

          <aside className="hidden bg-[#f7f5ef] px-8 py-10 lg:block xl:px-12">
            <div className="sticky top-8 mx-auto max-w-[500px]">
              {/* PRODUCTS */}

              <div className="space-y-5">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4"
                  >
                    <div className="relative flex h-[66px] w-[66px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#d7dbd8] bg-white">
                      {item.image ? (
                        <img
                          src={
                            item.image
                          }
                          alt={
                            item.name
                          }
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <span className="font-serif text-sm font-semibold text-[#073c31]">
                          ON
                        </span>
                      )}

                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#073c31] px-1 text-[10px] font-semibold text-white">
                        {
                          item.quantity
                        }
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-5">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-[#7b837f]">
                        ORINOCA NATURAL
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-medium">
                      Rs.{" "}
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* PROMO */}

              <PromoBox
                promo={promo}
                promoInput={
                  promoInput
                }
                setPromoInput={
                  setPromoInput
                }
                promoMessage={
                  promoMessage
                }
                checkingPromo={
                  checkingPromo
                }
                total={total}
                applyPromo={
                  applyPromo
                }
                removePromo={
                  removePromo
                }
              />

              {/* TOTAL */}

              <div className="mt-7">
                <SummaryRows
                  subtotal={total}
                  promo={promo}
                  discountAmount={
                    discountAmount
                  }
                  deliveryFee={
                    deliveryFee
                  }
                  grandTotal={
                    grandTotal
                  }
                />
              </div>

              {/* DELIVERY TRUST */}

              <div className="mt-8 rounded-[20px] border border-[#123529]/10 bg-white p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a9a86]">
                  ORINOCA NATURAL
                </p>

                <p className="mt-2 text-sm leading-6 text-[#65706a]">
                  Your order is packed
                  carefully and delivered
                  across Pakistan.
                </p>

                <div className="mt-4 space-y-2 border-t border-[#123529]/8 pt-4 text-xs text-[#68716d]">
                  <p>
                    ✓ Estimated delivery:
                    2–4 working days
                  </p>

                  <p>
                    ✓ Cash on Delivery
                    available
                  </p>

                  <p>
                    ✓ Secure order
                    processing
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </main>
  );
}

/* ======================
   PROMO BOX
====================== */

function PromoBox({
  promo,
  promoInput,
  setPromoInput,
  promoMessage,
  checkingPromo,
  total,
  applyPromo,
  removePromo,
}: {
  promo: AppliedPromo | null;
  promoInput: string;
  setPromoInput: (
    value: string
  ) => void;
  promoMessage: string;
  checkingPromo: boolean;
  total: number;
  applyPromo: () => Promise<void>;
  removePromo: () => void;
}) {
  return (
    <div className="mt-7">
      <div className="flex gap-2">
        <input
          value={promoInput}
          onChange={(event) =>
            setPromoInput(
              event.target.value
            )
          }
          onKeyDown={(event) => {
            if (
              event.key === "Enter"
            ) {
              event.preventDefault();

              if (
                !checkingPromo &&
                total > 0
              ) {
                applyPromo();
              }
            }
          }}
          placeholder="Discount code"
          disabled={checkingPromo}
          className="min-w-0 flex-1 rounded-xl border border-[#d2d7d4] bg-white px-4 py-3.5 text-sm uppercase outline-none transition placeholder:normal-case placeholder:text-[#7c847f] focus:border-[#073c31] focus:ring-1 focus:ring-[#073c31]"
        />

        <button
          type="button"
          onClick={applyPromo}
          disabled={
            checkingPromo ||
            total <= 0
          }
          className="shrink-0 rounded-xl bg-[#073c31] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#123529] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {checkingPromo
            ? "Checking..."
            : "Apply"}
        </button>
      </div>

      {promo ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-emerald-800">
              {promo.code}
            </p>

            <p className="mt-0.5 text-xs text-emerald-700">
              {
                promo.discountPercent
              }
              % discount applied
            </p>
          </div>

          <button
            type="button"
            onClick={removePromo}
            className="text-xs font-semibold text-emerald-800 underline"
          >
            Remove
          </button>
        </div>
      ) : null}

      {promoMessage ? (
        <p
          className={`mt-2 text-xs ${
            promo
              ? "text-emerald-700"
              : "text-red-600"
          }`}
        >
          {promoMessage}
        </p>
      ) : null}
    </div>
  );
}

/* ======================
   SUMMARY
====================== */

function SummaryRows({
  subtotal,
  promo,
  discountAmount,
  deliveryFee,
  grandTotal,
}: {
  subtotal: number;
  promo: AppliedPromo | null;
  discountAmount: number;
  deliveryFee: number;
  grandTotal: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span>Subtotal</span>

        <span>
          Rs.{" "}
          {subtotal.toLocaleString()}
        </span>
      </div>

      {promo ? (
        <div className="mt-3 flex items-center justify-between gap-4 text-sm text-emerald-700">
          <span>
            Discount ({promo.code})
          </span>

          <span className="shrink-0">
            − Rs.{" "}
            {discountAmount.toLocaleString()}
          </span>
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-between text-sm">
        <span>Shipping</span>

        <span>
          {deliveryFee === 0
            ? "FREE"
            : `Rs. ${deliveryFee}`}
        </span>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#123529]/10 pt-5">
        <span className="text-lg font-semibold">
          Total
        </span>

        <div className="text-right">
          <span className="mr-2 text-xs text-[#7d8581]">
            PKR
          </span>

          <strong className="text-2xl">
            Rs.{" "}
            {grandTotal.toLocaleString()}
          </strong>
        </div>
      </div>
    </div>
  );
}