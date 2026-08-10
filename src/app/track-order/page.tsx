"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type TrackedOrder = {
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setOrder(null);

    try {
      const params = new URLSearchParams({
        orderNumber: orderNumber.trim(),
        phone: phone.trim(),
      });

      const response = await fetch(`/api/orders/track?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to find this order.");
        return;
      }

      setOrder(data.order);
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f2eb] px-5 py-10 text-[#123529]">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
              ORINOCA NATURAL
            </p>
            <h1 className="mt-2 text-4xl font-semibold">Track your order</h1>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-[#1b4d3e]/20 bg-white px-4 py-3 text-sm font-semibold"
          >
            Home
          </Link>
        </div>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <p className="leading-7 text-neutral-600">
            Enter the order number from your confirmation page and the phone
            number used at checkout.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              required
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value)}
              placeholder="Order number — e.g. NM-12345678-ABCD"
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-[#1b4d3e]"
            />

            <input
              required
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone number used for the order"
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none focus:border-[#1b4d3e]"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#1b4d3e] px-5 py-4 font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Checking order..." : "Track order"}
            </button>
          </form>

          {message ? (
            <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {message}
            </p>
          ) : null}
        </section>

        {order ? (
          <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-neutral-500">Order number</p>
                <h2 className="mt-1 text-xl font-semibold">
                  {order.orderNumber}
                </h2>
              </div>

              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold capitalize text-emerald-700">
                {order.status}
              </span>
            </div>

            <p className="mt-4 text-sm text-neutral-500">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>

            <div className="mt-6 border-t border-neutral-100 pt-5">
              <h3 className="font-semibold">Items</h3>

              <div className="mt-3 space-y-2">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex justify-between gap-4 text-sm text-neutral-600"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-between border-t border-neutral-100 pt-4 text-lg font-semibold">
                <span>Total</span>
                <span>Rs. {order.total.toLocaleString()}</span>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}