"use client";

import Link from "next/link";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";

import AdminShell from "../admin-shell";
import { formatPrice } from "@/lib/format-price";

/* =========================================================
   TYPES
========================================================= */

type OrderItem = {
  _id?: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type ShippingDetails = {
  courier?: string;
  shippingMethod?: string;
  trackingNumber?: string;
  shippedAt?: string | null;
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

  shipping?: ShippingDetails;

  createdAt: string;
};

type PremiumSelectOption = {
  value: string;
  label: string;
  description?: string;

  tone?:
    | "default"
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
};

/* =========================================================
   OPTIONS
========================================================= */

const couriers = [
  "TCS",
  "Leopards Courier",
  "M&P",
  "Trax",
  "PostEx",
  "Pakistan Post",
  "Other",
];

const shippingMethods = [
  "Overnight",
  "Same Day",
  "Second Day",
  "Standard",
  "Other",
];

const statusOptions: PremiumSelectOption[] = [
  {
    value: "pending",
    label: "Pending",
    description: "Order received, awaiting action",
    tone: "pending",
  },
  {
    value: "confirmed",
    label: "Confirmed",
    description: "Order has been confirmed",
    tone: "confirmed",
  },
  {
    value: "processing",
    label: "Processing",
    description: "Preparing the customer order",
    tone: "processing",
  },
  {
    value: "shipped",
    label: "Shipped",
    description: "Dispatch with courier details",
    tone: "shipped",
  },
  {
    value: "delivered",
    label: "Delivered",
    description: "Order delivered successfully",
    tone: "delivered",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    description: "Order will not be fulfilled",
    tone: "cancelled",
  },
];

const filterStatusOptions: PremiumSelectOption[] = [
  {
    value: "all",
    label: "All Statuses",
    description: "Show every customer order",
  },
  ...statusOptions,
];

const courierOptions: PremiumSelectOption[] =
  couriers.map((item) => ({
    value: item,
    label: item,
  }));

const shippingMethodOptions: PremiumSelectOption[] =
  shippingMethods.map((item) => ({
    value: item,
    label: item,
  }));

/* =========================================================
   HELPERS
========================================================= */

function money(value: number) {
  return formatPrice(value);
}

function orderDate(value: string) {
  return new Date(value).toLocaleDateString(
    "en-PK",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

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

function toneDot(
  tone: PremiumSelectOption["tone"]
) {
  switch (tone) {
    case "confirmed":
      return "bg-blue-500";

    case "processing":
      return "bg-violet-500";

    case "shipped":
      return "bg-sky-500";

    case "delivered":
      return "bg-emerald-500";

    case "cancelled":
      return "bg-red-500";

    case "pending":
      return "bg-amber-500";

    default:
      return "bg-[#8a9a86]";
  }
}

/* =========================================================
   ICONS
========================================================= */

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ViewIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />

      <circle
        cx="12"
        cy="12"
        r="2.5"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <path d="M3 6h11v11H3z" />
      <path d="M14 10h4l3 3v4h-7z" />

      <circle
        cx="7"
        cy="18"
        r="2"
      />

      <circle
        cx="18"
        cy="18"
        r="2"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ChevronIcon({
  open,
}: {
  open: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={`h-4 w-4 transition ${
        open ? "rotate-180" : ""
      }`}
    >
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

/* =========================================================
   PREMIUM SELECT
========================================================= */

type PremiumSelectProps = {
  value: string;
  options: PremiumSelectOption[];
  onChange: (value: string) => void;

  label?: string;
  className?: string;
  menuClassName?: string;
  showStatusDot?: boolean;
};

function PremiumSelect({
  value,
  options,
  onChange,
  label,
  className = "",
  menuClassName = "",
  showStatusDot = false,
}: PremiumSelectProps) {
  const [open, setOpen] =
    useState(false);

  const wrapperRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const selected =
    options.find(
      (option) =>
        option.value === value
    ) || null;

  useEffect(() => {
    function closeOutside(
      event: MouseEvent
    ) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      closeOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        closeOutside
      );
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`relative ${className}`}
    >
      <button
        type="button"
        onClick={() =>
          setOpen(
            (current) => !current
          )
        }
        className="flex min-h-[48px] w-full items-center justify-between gap-3 rounded-[14px] border border-[#123529]/12 bg-white px-4 py-2 text-left transition hover:border-[#073c31]/30"
      >
        <span className="min-w-0">
          {label ? (
            <span className="mb-0.5 block text-[8px] font-semibold uppercase tracking-[0.15em] text-[#8a938f]">
              {label}
            </span>
          ) : null}

          <span className="flex items-center gap-2">
            {showStatusDot &&
            selected ? (
              <span
                className={`h-2 w-2 rounded-full ${toneDot(
                  selected.tone
                )}`}
              />
            ) : null}

            <span className="truncate text-[12px] font-semibold text-[#123529]">
              {selected?.label ||
                "Select"}
            </span>
          </span>
        </span>

        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[9px] bg-[#f0f4f2]">
          <ChevronIcon
            open={open}
          />
        </span>
      </button>

      {open ? (
        <div
          className={`absolute right-0 top-[calc(100%+7px)] z-[500] min-w-full overflow-hidden rounded-[16px] border border-[#123529]/10 bg-white p-1 shadow-[0_20px_55px_rgba(18,53,41,0.16)] ${menuClassName}`}
        >
          <div className="max-h-[270px] overflow-y-auto p-1">
            {options.map(
              (option) => {
                const active =
                  option.value ===
                  value;

                return (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() => {
                      onChange(
                        option.value
                      );

                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-[11px] px-3 py-2 text-left transition ${
                      active
                        ? "bg-[#edf5f1]"
                        : "hover:bg-[#f7f5ef]"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        showStatusDot
                          ? toneDot(
                              option.tone
                            )
                          : active
                          ? "bg-[#d4af37]"
                          : "bg-[#ccd5d1]"
                      }`}
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-semibold text-[#123529]">
                        {option.label}
                      </span>

                      {option.description ? (
                        <span className="mt-0.5 block text-[9px] leading-4 text-[#8a938f]">
                          {
                            option.description
                          }
                        </span>
                      ) : null}
                    </span>

                    {active ? (
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#073c31] text-white">
                        <CheckIcon />
                      </span>
                    ) : null}
                  </button>
                );
              }
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function OrderManager() {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [
    selectedOrderId,
    setSelectedOrderId,
  ] = useState<string | null>(
    null
  );

  /* =======================================================
     SHIPPING
  ======================================================= */

  const [
    shippingOrder,
    setShippingOrder,
  ] = useState<Order | null>(
    null
  );

  const [
    courier,
    setCourier,
  ] = useState("TCS");

  const [
    customCourier,
    setCustomCourier,
  ] = useState("");

  const [
    shippingMethod,
    setShippingMethod,
  ] = useState("Overnight");

  const [
    trackingNumber,
    setTrackingNumber,
  ] = useState("");

  const [
    shippingSaving,
    setShippingSaving,
  ] = useState(false);

  const finalCourier =
    courier === "Other"
      ? customCourier.trim()
      : courier.trim();

  /* =======================================================
     LOAD ORDERS
  ======================================================= */

  async function loadOrders() {
    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/admin/orders"
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to load orders."
        );

        return;
      }

      setOrders(
        data.orders || []
      );
    } catch {
      setMessage(
        "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  /* =======================================================
     UPDATE STATUS
  ======================================================= */

  async function updateStatus(
    orderId: string,
    status: string
  ) {
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/admin/orders",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                orderId,
                status,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to update order."
        );

        return;
      }

      setOrders(
        (current) =>
          current.map(
            (order) =>
              order._id ===
              orderId
                ? {
                    ...order,

                    status:
                      data.order
                        .status,

                    shipping:
                      data.order
                        .shipping ??
                      order.shipping,
                  }
                : order
          )
      );
    } catch {
      setMessage(
        "Unable to update order."
      );
    }
  }

  /* =======================================================
     STATUS CHANGE
  ======================================================= */

  function handleStatusChange(
    order: Order,
    status: string
  ) {
    if (
      status === "shipped"
    ) {
      setShippingOrder(
        order
      );

      const existingCourier =
        order.shipping
          ?.courier || "";

      if (
        existingCourier &&
        couriers.includes(
          existingCourier
        ) &&
        existingCourier !==
          "Other"
      ) {
        setCourier(
          existingCourier
        );

        setCustomCourier("");
      } else if (
        existingCourier
      ) {
        setCourier("Other");

        setCustomCourier(
          existingCourier
        );
      } else {
        setCourier("TCS");

        setCustomCourier("");
      }

      setShippingMethod(
        order.shipping
          ?.shippingMethod ||
          "Overnight"
      );

      setTrackingNumber(
        order.shipping
          ?.trackingNumber ||
          ""
      );

      return;
    }

    updateStatus(
      order._id,
      status
    );
  }

  function closeShippingModal() {
    if (
      shippingSaving
    ) {
      return;
    }

    setShippingOrder(null);

    setCourier("TCS");

    setCustomCourier("");

    setShippingMethod(
      "Overnight"
    );

    setTrackingNumber("");
  }

  /* =======================================================
     CONFIRM SHIPPING
  ======================================================= */

  async function confirmShipping() {
    if (!shippingOrder) {
      return;
    }

    if (
      !finalCourier ||
      !shippingMethod.trim() ||
      !trackingNumber.trim()
    ) {
      setMessage(
        "Please complete the shipping details."
      );

      return;
    }

    setShippingSaving(true);

    setMessage("");

    try {
      const response =
        await fetch(
          "/api/admin/orders",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                orderId:
                  shippingOrder._id,

                status:
                  "shipped",

                courier:
                  finalCourier,

                shippingMethod:
                  shippingMethod.trim(),

                trackingNumber:
                  trackingNumber.trim(),
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to ship order."
        );

        return;
      }

      setOrders(
        (current) =>
          current.map(
            (order) =>
              order._id ===
              shippingOrder._id
                ? {
                    ...order,

                    status:
                      data.order
                        .status,

                    shipping:
                      data.order
                        .shipping,
                  }
                : order
          )
      );

      setShippingOrder(null);

      setCourier("TCS");

      setCustomCourier("");

      setShippingMethod(
        "Overnight"
      );

      setTrackingNumber("");
    } catch {
      setMessage(
        "Unable to ship order."
      );
    } finally {
      setShippingSaving(
        false
      );
    }
  }

  /* =======================================================
     COUNTERS
  ======================================================= */

  const pendingCount =
    orders.filter(
      (order) =>
        order.status ===
        "pending"
    ).length;

  const processingCount =
    orders.filter(
      (order) =>
        order.status ===
          "confirmed" ||
        order.status ===
          "processing"
    ).length;

  const deliveredCount =
    orders.filter(
      (order) =>
        order.status ===
        "delivered"
    ).length;

  /* =======================================================
     FILTERING
  ======================================================= */

  const normalizedSearch =
    search
      .trim()
      .toLowerCase();

  const filteredOrders =
    orders.filter(
      (order) => {
        const matchesStatus =
          statusFilter ===
            "all" ||
          order.status ===
            statusFilter;

        const matchesSearch =
          !normalizedSearch ||
          order.orderNumber
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          order.customer.name
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          order.customer.phone
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          (
            order.customer
              .email || ""
          )
            .toLowerCase()
            .includes(
              normalizedSearch
            );

        return (
          matchesStatus &&
          matchesSearch
        );
      }
    );

  const hasActiveFilters =
    Boolean(
      normalizedSearch
    ) ||
    statusFilter !== "all";

  function clearFilters() {
    setSearch("");

    setStatusFilter(
      "all"
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-10">
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a9a86]">
              Fulfilment
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Orders
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#68716d]">
              Review customer
              orders, delivery
              information and
              fulfilment status.
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
              className="rounded-xl bg-[#073c31] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#073c31]/10"
            >
              Dashboard
            </Link>
          </div>
        </header>

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-[#8a938f]">
              Total Orders
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {orders.length}
            </p>
          </article>

          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-[#8a938f]">
              Pending
            </p>

            <p className="mt-3 text-3xl font-semibold text-[#9a741a]">
              {pendingCount}
            </p>
          </article>

          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-[#8a938f]">
              Processing
            </p>

            <p className="mt-3 text-3xl font-semibold text-violet-700">
              {processingCount}
            </p>
          </article>

          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-[#8a938f]">
              Delivered
            </p>

            <p className="mt-3 text-3xl font-semibold text-emerald-700">
              {deliveredCount}
            </p>
          </article>
        </section>

        {/* ERROR MESSAGE */}

        {message ? (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
            {message}
          </div>
        ) : null}

        {/* =================================================
            SEARCH / FILTER
        ================================================= */}

        <section className="relative z-40 mt-6 rounded-[24px] border border-[#123529]/10 bg-white p-5 shadow-[0_10px_35px_rgba(18,53,41,0.04)]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8a938f]">
                <SearchIcon />
              </span>

              <input
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder="Search order #, customer, phone or email"
                className="w-full rounded-2xl border border-[#123529]/12 bg-[#fbfaf7] py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#073c31]"
              />
            </div>

            <PremiumSelect
              value={
                statusFilter
              }
              options={
                filterStatusOptions
              }
              onChange={
                setStatusFilter
              }
              label="Filter Orders"
              showStatusDot={
                statusFilter !==
                "all"
              }
              className="w-full xl:w-[220px]"
              menuClassName="w-[270px]"
            />

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="h-[48px] rounded-[14px] border border-[#123529]/12 bg-white px-4 text-sm font-semibold"
              >
                Clear
              </button>
            ) : null}
          </div>

          <p className="mt-4 border-t border-[#123529]/8 pt-4 text-xs text-[#7d8581]">
            Showing{" "}
            <strong className="text-[#123529]">
              {
                filteredOrders.length
              }
            </strong>{" "}
            of{" "}
            <strong className="text-[#123529]">
              {orders.length}
            </strong>{" "}
            orders
          </p>
        </section>

        {/* =================================================
            ORDERS TABLE
        ================================================= */}

        <section className="mt-6 overflow-hidden rounded-[24px] border border-[#123529]/10 bg-white shadow-[0_14px_45px_rgba(18,53,41,0.045)]">
          {loading ? (
            <div className="p-12 text-center text-sm text-[#7a827e]">
              Loading orders...
            </div>
          ) : filteredOrders.length ===
            0 ? (
            <div className="p-12 text-center">
              <p className="font-semibold">
                No matching orders
              </p>

              <p className="mt-2 text-sm text-[#8a938f]">
                Change your
                search or filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b border-[#123529]/8 bg-[#f8f7f3]">
                    <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a938f]">
                      Order
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a938f]">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a938f]">
                      Date
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a938f]">
                      Items
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a938f]">
                      Total
                    </th>

                    <th className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a938f]">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a938f]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map(
                    (order) => {
                      const active =
                        selectedOrderId ===
                        order._id;

                      const itemCount =
                        order.items.reduce(
                          (
                            total,
                            item
                          ) =>
                            total +
                            item.quantity,
                          0
                        );

                      return (
                        <Fragment
                          key={
                            order._id
                          }
                        >
                          {/* ORDER ROW */}

                          <tr
                            className={`border-b border-[#123529]/7 transition ${
                              active
                                ? "bg-[#edf6f2]"
                                : "hover:bg-[#fbfaf7]"
                            }`}
                          >
                            <td className="px-5 py-4 font-semibold text-[#073c31]">
                              {
                                order.orderNumber
                              }
                            </td>

                            <td className="px-5 py-4">
                              <p className="font-medium text-[#123529]">
                                {
                                  order
                                    .customer
                                    .name
                                }
                              </p>

                              <p className="mt-1 text-xs text-[#8a938f]">
                                {
                                  order
                                    .customer
                                    .phone
                                }
                              </p>
                            </td>

                            <td className="px-5 py-4 text-sm text-[#68716d]">
                              {orderDate(
                                order.createdAt
                              )}
                            </td>

                            <td className="px-5 py-4 text-sm">
                              {
                                itemCount
                              }
                            </td>

                            {/* PRICE NOW ALWAYS DECIMAL */}

                            <td className="px-5 py-4 font-semibold text-[#123529]">
                              {money(
                                order.total
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold capitalize ${statusStyle(
                                  order.status
                                )}`}
                              >
                                {
                                  order.status
                                }
                              </span>
                            </td>

                            <td className="px-5 py-4 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedOrderId(
                                    active
                                      ? null
                                      : order._id
                                  )
                                }
                                className={`inline-flex min-w-[78px] items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                                  active
                                    ? "border-[#073c31] bg-[#073c31] text-white"
                                    : "border-[#073c31]/12 bg-white text-[#073c31] hover:bg-[#edf4f1]"
                                }`}
                              >
                                <ViewIcon />

                                {active
                                  ? "Close"
                                  : "View"}
                              </button>
                            </td>
                          </tr>

                          {/* =================================
                              INLINE ORDER DETAILS
                          ================================= */}

                          {active ? (
                            <tr>
                              <td
                                colSpan={
                                  7
                                }
                                className="border-b border-[#123529]/10 bg-[#f7faf8] p-0"
                              >
                                <div className="bg-white">
                                  {/* DETAIL HEADER */}

                                  <div className="relative z-20 flex flex-col gap-4 border-b border-[#123529]/8 bg-[#fbfaf6] px-6 py-5 xl:flex-row xl:items-center xl:justify-between">
                                    <div>
                                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
                                        Order
                                        Details
                                      </p>

                                      <h3 className="mt-1 text-xl font-semibold text-[#123529]">
                                        {
                                          order.orderNumber
                                        }
                                      </h3>

                                      <p className="mt-1 text-xs text-[#8a938f]">
                                        {new Date(
                                          order.createdAt
                                        ).toLocaleString()}
                                      </p>
                                    </div>

                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                      <div className="sm:text-right">
                                        <p className="text-[9px] uppercase tracking-[0.14em] text-[#8a938f]">
                                          Order
                                          Total
                                        </p>

                                        <p className="mt-1 text-lg font-semibold">
                                          {money(
                                            order.total
                                          )}
                                        </p>
                                      </div>

                                      <PremiumSelect
                                        value={
                                          order.status
                                        }
                                        options={
                                          statusOptions
                                        }
                                        onChange={(
                                          value
                                        ) =>
                                          handleStatusChange(
                                            order,
                                            value
                                          )
                                        }
                                        label="Order Status"
                                        showStatusDot
                                        className="w-full sm:w-[200px]"
                                        menuClassName="w-[270px]"
                                      />
                                    </div>
                                  </div>

                                  {/* DETAIL BODY */}

                                  <div className="grid gap-6 p-6 xl:grid-cols-[0.9fr_1.1fr]">
                                    {/* CUSTOMER */}

                                    <section>
                                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
                                        Customer
                                        Information
                                      </p>

                                      <div className="mt-3 rounded-[18px] border border-[#123529]/8 bg-[#fbfaf7] p-5">
                                        <h3 className="text-lg font-semibold">
                                          {
                                            order
                                              .customer
                                              .name
                                          }
                                        </h3>

                                        <div className="mt-4 space-y-2 text-sm leading-6 text-[#68716d]">
                                          <p>
                                            <strong className="text-[#123529]">
                                              Phone:
                                            </strong>{" "}
                                            {
                                              order
                                                .customer
                                                .phone
                                            }
                                          </p>

                                          {order
                                            .customer
                                            .email ? (
                                            <p className="break-all">
                                              <strong className="text-[#123529]">
                                                Email:
                                              </strong>{" "}
                                              {
                                                order
                                                  .customer
                                                  .email
                                              }
                                            </p>
                                          ) : null}

                                          <p>
                                            <strong className="text-[#123529]">
                                              Address:
                                            </strong>{" "}
                                            {
                                              order
                                                .customer
                                                .address
                                            }

                                            {order
                                              .customer
                                              .city
                                              ? `, ${order.customer.city}`
                                              : ""}
                                          </p>

                                          {order
                                            .customer
                                            .postalCode ? (
                                            <p>
                                              <strong className="text-[#123529]">
                                                Postal
                                                Code:
                                              </strong>{" "}
                                              {
                                                order
                                                  .customer
                                                  .postalCode
                                              }
                                            </p>
                                          ) : null}
                                        </div>

                                        {/* NOTE */}

                                        {order
                                          .customer
                                          .notes ? (
                                          <div className="mt-5 rounded-2xl border border-[#d4af37]/15 bg-[#fffaf0] p-4">
                                            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#9a741a]">
                                              Customer
                                              Note
                                            </p>

                                            <p className="mt-2 text-sm leading-6">
                                              {
                                                order
                                                  .customer
                                                  .notes
                                              }
                                            </p>
                                          </div>
                                        ) : null}

                                        {/* SHIPPING DETAILS */}

                                        {order
                                          .shipping
                                          ?.trackingNumber ? (
                                          <div className="mt-5 overflow-hidden rounded-[18px] border border-[#073c31]/10 bg-white">
                                            <div className="flex items-center gap-3 bg-[#edf4f1] px-4 py-3 text-[#073c31]">
                                              <TruckIcon />

                                              <p className="text-xs font-semibold">
                                                Shipping
                                                Details
                                              </p>
                                            </div>

                                            <div className="grid gap-4 p-4 sm:grid-cols-2">
                                              <div>
                                                <p className="text-[9px] uppercase tracking-[0.12em] text-[#8a938f]">
                                                  Courier
                                                </p>

                                                <p className="mt-1 text-sm font-semibold">
                                                  {order
                                                    .shipping
                                                    ?.courier ||
                                                    "—"}
                                                </p>
                                              </div>

                                              <div>
                                                <p className="text-[9px] uppercase tracking-[0.12em] text-[#8a938f]">
                                                  Method
                                                </p>

                                                <p className="mt-1 text-sm font-semibold">
                                                  {order
                                                    .shipping
                                                    ?.shippingMethod ||
                                                    "—"}
                                                </p>
                                              </div>

                                              <div className="sm:col-span-2">
                                                <p className="text-[9px] uppercase tracking-[0.12em] text-[#8a938f]">
                                                  Tracking
                                                  / CN
                                                  Number
                                                </p>

                                                <p className="mt-1 break-all font-mono text-sm font-semibold text-[#073c31]">
                                                  {
                                                    order
                                                      .shipping
                                                      ?.trackingNumber
                                                  }
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        ) : null}
                                      </div>
                                    </section>

                                    {/* ORDER ITEMS */}

                                    <section>
                                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
                                        Order Items
                                      </p>

                                      <div className="mt-3 space-y-3">
                                        {order.items.map(
                                          (
                                            item,
                                            index
                                          ) => (
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
                                                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[#edf3ef] font-semibold text-[#073c31]">
                                                    ON
                                                  </div>
                                                )}

                                                <div className="min-w-0">
                                                  <p className="font-semibold">
                                                    {
                                                      item.name
                                                    }
                                                  </p>

                                                  <p className="mt-1 text-xs text-[#8a938f]">
                                                    Quantity:{" "}
                                                    {
                                                      item.quantity
                                                    }
                                                  </p>

                                                  {/* ITEM PRICE DECIMAL */}

                                                  <p className="mt-1 text-xs text-[#8a938f]">
                                                    {money(
                                                      item.price
                                                    )}{" "}
                                                    each
                                                  </p>
                                                </div>
                                              </div>

                                              <p className="shrink-0 font-semibold text-[#073c31]">
                                                {money(
                                                  item.price *
                                                    item.quantity
                                                )}
                                              </p>
                                            </div>
                                          )
                                        )}
                                      </div>

                                      {/* PAYMENT TOTALS */}

                                      <div className="mt-4 rounded-[20px] bg-[#073c31] p-5 text-white">
                                        <div className="space-y-3 text-sm">
                                          <div className="flex justify-between gap-5 text-white/60">
                                            <span>
                                              Subtotal
                                            </span>

                                            <span>
                                              {money(
                                                order.subtotal
                                              )}
                                            </span>
                                          </div>

                                          <div className="flex justify-between gap-5 text-white/60">
                                            <span>
                                              Delivery
                                              Fee
                                            </span>

                                            <span>
                                              {money(
                                                order.deliveryFee
                                              )}
                                            </span>
                                          </div>

                                          <div className="flex justify-between gap-5 text-white/60">
                                            <span>
                                              Payment
                                              Method
                                            </span>

                                            <span className="text-right capitalize">
                                              {order.paymentMethod ||
                                                "Cash on delivery"}
                                            </span>
                                          </div>

                                          <div className="flex justify-between gap-5 text-white/60">
                                            <span>
                                              Payment
                                              Status
                                            </span>

                                            <span className="capitalize">
                                              {
                                                order.paymentStatus
                                              }
                                            </span>
                                          </div>
                                        </div>

                                        <div className="mt-5 border-t border-white/10 pt-5">
                                          <p className="text-[9px] uppercase tracking-[0.15em] text-white/40">
                                            Total
                                            Amount
                                          </p>

                                          <p className="mt-1 text-2xl font-semibold text-[#f1d898]">
                                            {money(
                                              order.total
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </section>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ) : null}
                        </Fragment>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* =====================================================
          SHIPPING MODAL
      ===================================================== */}

      {shippingOrder ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#062d25]/50 p-4 backdrop-blur-[4px]"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeShippingModal();
            }
          }}
        >
          <div className="max-h-[92vh] w-full max-w-[540px] overflow-y-auto rounded-[26px] border border-white/40 bg-white shadow-[0_30px_100px_rgba(0,0,0,.24)]">
            {/* HEADER */}

            <div className="flex items-start justify-between border-b border-[#123529]/10 px-6 py-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
                  Fulfil Order
                </p>

                <h2 className="mt-1 text-2xl font-semibold">
                  Shipping Details
                </h2>

                <p className="mt-1 text-xs text-[#8a938f]">
                  {
                    shippingOrder.orderNumber
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeShippingModal
                }
                disabled={
                  shippingSaving
                }
                className="grid h-10 w-10 place-items-center rounded-full border border-[#123529]/10 text-xl"
              >
                ×
              </button>
            </div>

            {/* BODY */}

            <div className="space-y-5 p-6">
              {/* COURIER */}

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Courier / Delivery
                  Service
                </label>

                <PremiumSelect
                  value={
                    courier
                  }
                  options={
                    courierOptions
                  }
                  onChange={(
                    value
                  ) => {
                    setCourier(
                      value
                    );

                    if (
                      value !==
                      "Other"
                    ) {
                      setCustomCourier(
                        ""
                      );
                    }
                  }}
                  label="Courier Service"
                  className="w-full"
                  menuClassName="w-full"
                />

                {courier ===
                "Other" ? (
                  <input
                    type="text"
                    value={
                      customCourier
                    }
                    onChange={(
                      event
                    ) =>
                      setCustomCourier(
                        event.target
                          .value
                      )
                    }
                    placeholder="Enter courier/service name"
                    className="mt-3 w-full rounded-[15px] border border-[#123529]/12 bg-[#fbfaf7] px-4 py-3.5 text-sm outline-none"
                  />
                ) : null}
              </div>

              {/* METHOD */}

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Shipping Method
                </label>

                <PremiumSelect
                  value={
                    shippingMethod
                  }
                  options={
                    shippingMethodOptions
                  }
                  onChange={
                    setShippingMethod
                  }
                  label="Delivery Speed"
                  className="w-full"
                  menuClassName="w-full"
                />
              </div>

              {/* TRACKING */}

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Tracking / CN Number
                </label>

                <input
                  type="text"
                  value={
                    trackingNumber
                  }
                  onChange={(
                    event
                  ) =>
                    setTrackingNumber(
                      event.target.value
                    )
                  }
                  placeholder="Enter tracking / CN number"
                  className="w-full rounded-[15px] border border-[#123529]/12 bg-[#fbfaf7] px-4 py-3.5 text-sm outline-none"
                />
              </div>

              {/* PREVIEW */}

              <div className="rounded-[20px] border border-[#073c31]/10 bg-[#fbfaf7] p-4">
                <div className="flex items-center gap-3 text-[#073c31]">
                  <TruckIcon />

                  <p className="text-xs font-semibold">
                    Dispatch Details
                  </p>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[9px] uppercase text-[#8a938f]">
                      Courier
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {finalCourier ||
                        "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase text-[#8a938f]">
                      Method
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {
                        shippingMethod
                      }
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-[9px] uppercase text-[#8a938f]">
                      Tracking / CN
                    </p>

                    <p className="mt-1 break-all font-mono text-sm font-semibold text-[#073c31]">
                      {trackingNumber ||
                        "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div className="flex flex-col-reverse gap-3 border-t border-[#123529]/10 bg-[#fbfaf7] p-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={
                  shippingSaving
                }
                onClick={
                  closeShippingModal
                }
                className="rounded-xl border border-[#123529]/12 bg-white px-5 py-3 text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  shippingSaving ||
                  !finalCourier ||
                  !shippingMethod.trim() ||
                  !trackingNumber.trim()
                }
                onClick={
                  confirmShipping
                }
                className="rounded-xl bg-[#073c31] px-6 py-3 text-sm font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {shippingSaving
                  ? "Saving Shipment..."
                  : "Confirm Shipment"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}