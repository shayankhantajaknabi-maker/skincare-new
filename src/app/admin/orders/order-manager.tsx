"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type OrderItem = {
  _id?: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type Order = {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    postalCode?: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
};

const statuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadOrders() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to load orders.");
        return;
      }

      setOrders(data.orders);
    } catch {
      setMessage("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(orderId: string, status: string) {
    setMessage("");

    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to update order.");
        return;
      }

      setOrders((current) =>
        current.map((order) =>
          order._id === orderId ? { ...order, status: data.order.status } : order
        )
      );
    } catch {
      setMessage("Unable to update order.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f2eb] px-5 py-10 text-[#123529]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
              NM Skin Care Admin
            </p>
            <h1 className="mt-2 text-4xl font-semibold">Orders</h1>
            <p className="mt-2 text-neutral-600">
              Review customer orders and update delivery status.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-xl border border-[#1b4d3e]/20 bg-white px-4 py-3 text-sm font-semibold"
          >
            Back to dashboard
          </Link>
        </div>

        {message ? (
          <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {message}
          </p>
        ) : null}

        <section className="mt-8 space-y-5">
          {loading ? (
            <div className="rounded-3xl bg-white p-8 text-neutral-500 shadow-sm">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-neutral-500 shadow-sm">
              No orders received yet.
            </div>
          ) : (
            orders.map((order) => (
              <article
                key={order._id}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <p className="text-sm text-neutral-500">Order number</p>
                    <h2 className="mt-1 text-xl font-semibold">
                      {order.orderNumber}
                    </h2>
                    <p className="mt-2 text-sm text-neutral-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold">
                      Rs. {order.total.toLocaleString()}
                    </span>

                    <select
                      value={order.status}
                      onChange={(event) =>
                        updateStatus(order._id, event.target.value)
                      }
                      className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold capitalize outline-none focus:border-[#1b4d3e]"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 border-t border-neutral-100 pt-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold">Customer details</h3>
                    <div className="mt-3 space-y-1 text-sm leading-6 text-neutral-600">
                      <p>{order.customer.name}</p>
                      <p>{order.customer.phone}</p>
                      {order.customer.email ? <p>{order.customer.email}</p> : null}
                      <p>
                        {order.customer.address}, {order.customer.city}
                      </p>
                      {order.customer.postalCode ? (
                        <p>Postal code: {order.customer.postalCode}</p>
                      ) : null}
                      {order.customer.notes ? (
                        <p>Note: {order.customer.notes}</p>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold">Products</h3>
                    <div className="mt-3 space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={`${order._id}-${index}`}
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

                    <div className="mt-4 border-t border-neutral-100 pt-3 text-sm">
                      <p>Payment: Cash on delivery</p>
                      <p className="mt-1 capitalize">
                        Current status: {order.status}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}