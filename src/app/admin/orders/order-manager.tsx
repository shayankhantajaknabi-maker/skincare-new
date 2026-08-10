"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminShell from "../admin-shell";

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

function statusStyle(status: string) {
  switch (status) {
    case "confirmed":
      return "border-blue-100 bg-blue-50 text-blue-700";

    case "processing":
      return "border-violet-100 bg-violet-50 text-violet-700";

    case "shipped":
      return "border-sky-100 bg-sky-50 text-sky-700";

    case "delivered":
      return "border-emerald-100 bg-emerald-50 text-emerald-700";

    case "cancelled":
      return "border-red-100 bg-red-50 text-red-700";

    default:
      return "border-[#ead9a4] bg-[#fff8e7] text-[#9a741a]";
  }
}

function OrderIcon() {
  return (
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
  );
}

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  async function loadOrders() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to load orders."
        );
        return;
      }

      setOrders(data.orders || []);
    } catch {
      setMessage("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(
    orderId: string,
    status: string
  ) {
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/orders",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to update order."
        );
        return;
      }

      setOrders((current) =>
        current.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: data.order.status,
              }
            : order
        )
      );
    } catch {
      setMessage("Unable to update order.");
    }
  }

  const pendingCount = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const processingCount = orders.filter(
    (order) =>
      order.status === "confirmed" ||
      order.status === "processing"
  ).length;

  const deliveredCount = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  const normalizedSearch = search
    .trim()
    .toLowerCase();

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" ||
      order.status === statusFilter;

    const matchesSearch =
      !normalizedSearch ||
      order.orderNumber
        .toLowerCase()
        .includes(normalizedSearch) ||
      order.customer.name
        .toLowerCase()
        .includes(normalizedSearch) ||
      order.customer.phone
        .toLowerCase()
        .includes(normalizedSearch) ||
      (order.customer.email || "")
        .toLowerCase()
        .includes(normalizedSearch);

    return matchesStatus && matchesSearch;
  });

  const hasActiveFilters =
    Boolean(normalizedSearch) ||
    statusFilter !== "all";

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-10">
        {/* HEADER */}

        <header className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a9a86]">
              Fulfilment
            </p>

            <h1 className="mt-2 font-serif text-4xl font-semibold sm:text-5xl">
              Orders
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#68716d]">
              Review customer orders, delivery
              information and fulfilment status.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              target="_blank"
              className="rounded-xl border border-[#123529]/15 bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-[#faf8f2]"
            >
              View Store ↗
            </Link>

            <Link
              href="/admin"
              className="rounded-xl bg-[#073c31] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#073c31]/10 transition hover:bg-[#123529]"
            >
              Dashboard
            </Link>
          </div>
        </header>

        {/* STATS */}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5 shadow-[0_10px_35px_rgba(18,53,41,0.04)]">
            <p className="text-xs uppercase tracking-[0.15em] text-[#8a938f]">
              Total Orders
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {orders.length}
            </p>
          </article>

          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5 shadow-[0_10px_35px_rgba(18,53,41,0.04)]">
            <p className="text-xs uppercase tracking-[0.15em] text-[#8a938f]">
              Pending
            </p>

            <p className="mt-3 text-3xl font-semibold text-[#9a741a]">
              {pendingCount}
            </p>
          </article>

          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5 shadow-[0_10px_35px_rgba(18,53,41,0.04)]">
            <p className="text-xs uppercase tracking-[0.15em] text-[#8a938f]">
              Processing
            </p>

            <p className="mt-3 text-3xl font-semibold text-violet-700">
              {processingCount}
            </p>
          </article>

          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5 shadow-[0_10px_35px_rgba(18,53,41,0.04)]">
            <p className="text-xs uppercase tracking-[0.15em] text-[#8a938f]">
              Delivered
            </p>

            <p className="mt-3 text-3xl font-semibold text-emerald-700">
              {deliveredCount}
            </p>
          </article>
        </section>

        {message ? (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
            {message}
          </div>
        ) : null}

        {/* SEARCH + FILTER */}

        <section className="mt-6 rounded-[24px] border border-[#123529]/10 bg-white p-4 shadow-[0_10px_35px_rgba(18,53,41,0.04)] sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative flex-1">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a938f]"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search order #, customer, phone or email"
                className="w-full rounded-2xl border border-[#123529]/12 bg-[#fbfaf7] py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#a1a7a4] focus:border-[#073c31] focus:bg-white focus:ring-4 focus:ring-[#073c31]/5"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="w-full rounded-2xl border border-[#123529]/12 bg-[#fbfaf7] px-4 py-3.5 text-sm font-semibold capitalize outline-none focus:border-[#073c31] sm:w-auto"
              >
                <option value="all">
                  All statuses
                </option>

                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>

              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-2xl border border-[#123529]/12 bg-white px-4 py-3.5 text-sm font-semibold transition hover:bg-[#f7f4ed]"
                >
                  Clear Filters
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-[#123529]/8 pt-4 text-xs text-[#7d8581] sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing{" "}
              <span className="font-semibold text-[#123529]">
                {filteredOrders.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#123529]">
                {orders.length}
              </span>{" "}
              orders
            </p>

            {statusFilter !== "all" ? (
              <p className="capitalize">
                Filter: {statusFilter}
              </p>
            ) : null}
          </div>
        </section>

        {/* ORDERS */}

        <section className="mt-6">
          {loading ? (
            <div className="rounded-[26px] border border-[#123529]/10 bg-white p-10 text-center shadow-[0_16px_50px_rgba(18,53,41,0.05)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf3ef] text-[#073c31]">
                <OrderIcon />
              </div>

              <p className="mt-4 text-sm text-[#7a827e]">
                Loading orders...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-[26px] border border-dashed border-[#123529]/15 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf3ef] text-[#073c31]">
                <OrderIcon />
              </div>

              <h2 className="mt-5 font-serif text-2xl font-semibold">
                No orders yet
              </h2>

              <p className="mt-2 text-sm text-[#8a938f]">
                Customer orders will appear here
                automatically.
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="rounded-[26px] border border-dashed border-[#123529]/15 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf3ef] text-[#073c31]">
                <OrderIcon />
              </div>

              <h2 className="mt-5 font-serif text-2xl font-semibold">
                No matching orders
              </h2>

              <p className="mt-2 text-sm text-[#8a938f]">
                Try another search or clear the
                active filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-[#073c31] px-4 py-2.5 text-sm font-semibold text-white"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredOrders.map((order) => (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-[26px] border border-[#123529]/10 bg-white shadow-[0_14px_45px_rgba(18,53,41,0.05)]"
                >
                  {/* ORDER HEADER */}

                  <div className="flex flex-col gap-5 border-b border-[#123529]/10 bg-[#fbfaf6] p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-serif text-2xl font-semibold">
                          {order.orderNumber}
                        </h2>

                        <span
                          className={`rounded-full border px-3 py-1 text-[10px] font-semibold capitalize ${statusStyle(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-[#8a938f]">
                        {new Date(
                          order.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="sm:text-right">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-[#8a938f]">
                          Order Total
                        </p>

                        <p className="mt-1 text-xl font-semibold">
                          Rs.{" "}
                          {order.total.toLocaleString()}
                        </p>
                      </div>

                      <select
                        value={order.status}
                        onChange={(event) =>
                          updateStatus(
                            order._id,
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-[#123529]/15 bg-white px-4 py-3 text-sm font-semibold capitalize outline-none focus:border-[#1b4d3e] sm:w-auto"
                      >
                        {statuses.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  {/* BODY */}

                  <div className="grid gap-8 p-5 sm:p-6 xl:grid-cols-[0.9fr_1.1fr]">
                    {/* CUSTOMER */}

                    <section>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
                        Customer Information
                      </p>

                      <div className="mt-4 rounded-[20px] border border-[#123529]/8 bg-[#fbfaf7] p-5">
                        <h3 className="font-serif text-xl font-semibold">
                          {order.customer.name}
                        </h3>

                        <div className="mt-4 space-y-2 text-sm leading-6 text-[#68716d]">
                          <p>
                            <span className="font-semibold text-[#123529]">
                              Phone:
                            </span>{" "}
                            {order.customer.phone}
                          </p>

                          {order.customer.email ? (
                            <p className="break-all">
                              <span className="font-semibold text-[#123529]">
                                Email:
                              </span>{" "}
                              {order.customer.email}
                            </p>
                          ) : null}

                          <p>
                            <span className="font-semibold text-[#123529]">
                              Address:
                            </span>{" "}
                            {order.customer.address},{" "}
                            {order.customer.city}
                          </p>

                          {order.customer
                            .postalCode ? (
                            <p>
                              <span className="font-semibold text-[#123529]">
                                Postal Code:
                              </span>{" "}
                              {
                                order.customer
                                  .postalCode
                              }
                            </p>
                          ) : null}
                        </div>

                        {order.customer.notes ? (
                          <div className="mt-5 rounded-2xl border border-[#d4af37]/15 bg-[#fffaf0] p-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9a741a]">
                              Customer Note
                            </p>

                            <p className="mt-2 text-sm leading-6 text-[#6d674f]">
                              {order.customer.notes}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </section>

                    {/* PRODUCTS */}

                    <section>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
                        Order Items
                      </p>

                      <div className="mt-4 space-y-3">
                        {order.items.map(
                          (item, index) => (
                            <div
                              key={`${order._id}-${index}`}
                              className="flex flex-col gap-4 rounded-[18px] border border-[#123529]/8 bg-[#fbfaf7] p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div className="flex min-w-0 items-center gap-4">
                                {item.image ? (
                                  <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[#123529]/8 bg-white">
                                    <img
                                      src={
                                        item.image
                                      }
                                      alt={
                                        item.name
                                      }
                                      className="h-full w-full object-contain p-1.5"
                                    />
                                  </div>
                                ) : (
                                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[#edf3ef] font-serif text-sm font-semibold text-[#073c31]">
                                    ON
                                  </div>
                                )}

                                <div className="min-w-0">
                                  <p className="break-words font-semibold">
                                    {item.name}
                                  </p>

                                  <p className="mt-1 text-xs text-[#8a938f]">
                                    Quantity:{" "}
                                    {item.quantity}
                                  </p>

                                  <p className="mt-1 text-xs text-[#8a938f]">
                                    Rs.{" "}
                                    {item.price.toLocaleString()}{" "}
                                    each
                                  </p>
                                </div>
                              </div>

                              <p className="shrink-0 text-base font-semibold text-[#073c31]">
                                Rs.{" "}
                                {(
                                  item.price *
                                  item.quantity
                                ).toLocaleString()}
                              </p>
                            </div>
                          )
                        )}
                      </div>

                      {/* PAYMENT SUMMARY */}

                      <div className="mt-4 rounded-[20px] bg-[#073c31] p-5 text-white">
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between gap-5 text-white/60">
                            <span>Subtotal</span>

                            <span>
                              Rs.{" "}
                              {order.subtotal.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex justify-between gap-5 text-white/60">
                            <span>
                              Delivery Fee
                            </span>

                            <span>
                              Rs.{" "}
                              {order.deliveryFee.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex justify-between gap-5 text-white/60">
                            <span>
                              Payment Method
                            </span>

                            <span className="text-right capitalize">
                              {order.paymentMethod ||
                                "Cash on delivery"}
                            </span>
                          </div>

                          <div className="flex justify-between gap-5 text-white/60">
                            <span>
                              Payment Status
                            </span>

                            <span className="capitalize">
                              {
                                order.paymentStatus
                              }
                            </span>
                          </div>
                        </div>

                        <div className="mt-5 border-t border-white/10 pt-5">
                          <div className="flex items-end justify-between gap-4">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">
                                Total Amount
                              </p>

                              <p className="mt-1 font-serif text-2xl font-semibold text-[#f1d898]">
                                Rs.{" "}
                                {order.total.toLocaleString()}
                              </p>
                            </div>

                            <span
                              className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold capitalize ${statusStyle(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}