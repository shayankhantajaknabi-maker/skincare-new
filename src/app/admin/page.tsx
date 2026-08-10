import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import AdminShell from "./admin-shell";

type DashboardOrder = {
  _id: unknown;
  orderNumber: string;
  customer?: {
    name?: string;
  };
  total: number;
  status: string;
  createdAt: Date | string;
};

type DashboardProduct = {
  _id: unknown;
  name: string;
  price: number;
  stock: number;
  images?: string[];
  isActive?: boolean;
  featured?: boolean;
};

function money(value: number) {
  return `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;
}

function statusClass(status: string) {
  switch (status) {
    case "delivered":
      return "border-emerald-100 bg-emerald-50 text-emerald-700";

    case "shipped":
      return "border-sky-100 bg-sky-50 text-sky-700";

    case "processing":
      return "border-violet-100 bg-violet-50 text-violet-700";

    case "confirmed":
      return "border-blue-100 bg-blue-50 text-blue-700";

    case "cancelled":
      return "border-red-100 bg-red-50 text-red-700";

    default:
      return "border-[#ead9a4] bg-[#fff8e7] text-[#9a741a]";
  }
}

function StatIcon({
  type,
}: {
  type: "revenue" | "orders" | "products" | "pending";
}) {
  if (type === "revenue") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-5 w-5"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 9.5c0-1.2 1.2-2 3.3-2 1.9 0 3.2.7 3.2 2 0 3-6.5 1.2-6.5 4.8 0 1.4 1.4 2.2 3.6 2.2 2.1 0 3.5-.8 3.5-2.2M12 5.5v13" />
      </svg>
    );
  }

  if (type === "orders") {
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

  if (type === "products") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-5 w-5"
      >
        <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
        <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5M12 16.5v.5" />
    </svg>
  );
}

function getGreeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      hour12: false,
      timeZone: "Asia/Karachi",
    }).format(new Date())
  );

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function AdminDashboardPage() {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  await connectToDatabase();

  const sevenDaysAgo = new Date();

  sevenDaysAgo.setHours(0, 0, 0, 0);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const [
    productCount,
    orderCount,
    pendingCount,
    lowStockCount,
    outOfStockCount,
    deliveredOrders,
    recentOrdersRaw,
    chartOrdersRaw,
    featuredProductRaw,
  ] = await Promise.all([
    Product.countDocuments(),

    Order.countDocuments(),

    Order.countDocuments({
      status: "pending",
    }),

    Product.countDocuments({
      stock: { $gt: 0, $lte: 5 },
    }),

    Product.countDocuments({
      stock: { $lte: 0 },
    }),

    Order.find({
      status: "delivered",
    })
      .select("total")
      .lean(),

    Order.find({})
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .select(
        "orderNumber customer total status createdAt"
      )
      .lean(),

    Order.find({
      createdAt: {
        $gte: sevenDaysAgo,
      },
      status: {
        $ne: "cancelled",
      },
    })
      .select("total status createdAt")
      .lean(),

    Product.findOne({
      isActive: true,
    })
      .sort({
        featured: -1,
        createdAt: 1,
      })
      .select(
        "name price stock images isActive featured"
      )
      .lean(),
  ]);

  const recentOrders =
    recentOrdersRaw as unknown as DashboardOrder[];

  const chartOrders =
    chartOrdersRaw as unknown as DashboardOrder[];

  const featuredProduct =
    featuredProductRaw as unknown as DashboardProduct | null;

  const totalRevenue = (
    deliveredOrders as unknown as {
      total?: number;
    }[]
  ).reduce(
    (sum, order) =>
      sum + Number(order.total || 0),
    0
  );

  const chartData = Array.from({
    length: 7,
  }).map((_, index) => {
    const date = new Date(sevenDaysAgo);

    date.setDate(
      sevenDaysAgo.getDate() + index
    );

    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    const dailyOrders = chartOrders.filter(
      (order) => {
        const orderDate = new Date(
          order.createdAt
        );

        const orderKey = `${orderDate.getFullYear()}-${orderDate.getMonth()}-${orderDate.getDate()}`;

        return orderKey === dateKey;
      }
    );

    return {
      label: date.toLocaleDateString(
        "en-US",
        {
          weekday: "short",
        }
      ),
      value: dailyOrders.reduce(
        (sum, order) =>
          sum + Number(order.total || 0),
        0
      ),
    };
  });

  const maxChartValue = Math.max(
    ...chartData.map(
      (item) => item.value
    ),
    1
  );

  const chartPoints = chartData
    .map((item, index) => {
      const x =
        chartData.length === 1
          ? 50
          : (index /
              (chartData.length - 1)) *
            100;

      const y =
        90 -
        (item.value / maxChartValue) *
          70;

      return `${x},${y}`;
    })
    .join(" ");

  const greeting = getGreeting();

  return (
    <AdminShell adminEmail={admin.email}>
      <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-10">
        {/* HEADER */}

        <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
              Store Overview
            </p>

            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {greeting}, ORINOCA Admin
            </h1>

            <p className="mt-3 text-sm text-[#69726e] sm:text-base">
              Here&apos;s what&apos;s happening
              with your store today.
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
              href="/admin/products"
              className="rounded-xl bg-[#073c31] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#073c31]/10 transition hover:bg-[#123529]"
            >
              + Add Product
            </Link>
          </div>
        </header>

        {/* STATS */}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5 shadow-[0_10px_35px_rgba(18,53,41,0.04)] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[#6c7570]">
                  Total Revenue
                </p>

                <p className="mt-3 break-words text-2xl font-semibold tracking-tight sm:text-3xl">
                  {money(totalRevenue)}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff4d1] text-[#987117]">
                <StatIcon type="revenue" />
              </div>
            </div>

            <p className="mt-5 text-xs text-[#8a938f]">
              Delivered orders
            </p>
          </article>

          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5 shadow-[0_10px_35px_rgba(18,53,41,0.04)] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[#6c7570]">
                  Total Orders
                </p>

                <p className="mt-3 text-3xl font-semibold">
                  {orderCount}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf3ef] text-[#073c31]">
                <StatIcon type="orders" />
              </div>
            </div>

            <p className="mt-5 text-xs text-[#8a938f]">
              All customer orders
            </p>
          </article>

          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5 shadow-[0_10px_35px_rgba(18,53,41,0.04)] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[#6c7570]">
                  Products
                </p>

                <p className="mt-3 text-3xl font-semibold">
                  {productCount}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf3ef] text-[#073c31]">
                <StatIcon type="products" />
              </div>
            </div>

            <p className="mt-5 text-xs text-[#8a938f]">
              Catalogue items
            </p>
          </article>

          <article className="rounded-[22px] border border-[#123529]/10 bg-white p-5 shadow-[0_10px_35px_rgba(18,53,41,0.04)] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[#6c7570]">
                  Pending Orders
                </p>

                <p className="mt-3 text-3xl font-semibold text-[#9a741a]">
                  {pendingCount}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff8e7] text-[#9a741a]">
                <StatIcon type="pending" />
              </div>
            </div>

            <p className="mt-5 text-xs text-[#8a938f]">
              Need your attention
            </p>
          </article>
        </section>

        {/* NEEDS ATTENTION */}

        <section className="mt-6 overflow-hidden rounded-[26px] border border-[#123529]/10 bg-white shadow-[0_16px_50px_rgba(18,53,41,0.05)]">
          <div className="flex flex-col gap-3 border-b border-[#123529]/10 bg-[#fbfaf6] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
                Priority Center
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold">
                Needs Attention
              </h2>

              <p className="mt-1 text-xs text-[#8a938f]">
                Important store tasks that may need action.
              </p>
            </div>

            {pendingCount === 0 &&
            lowStockCount === 0 &&
            outOfStockCount === 0 ? (
              <span className="w-fit rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700">
                Everything looks good
              </span>
            ) : (
              <span className="w-fit rounded-full border border-[#ead9a4] bg-[#fff8e7] px-3 py-1.5 text-[10px] font-semibold text-[#9a741a]">
                Action recommended
              </span>
            )}
          </div>

          <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-3">
            <Link
              href="/admin/orders"
              className={`group rounded-[20px] border p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(18,53,41,0.06)] ${
                pendingCount > 0
                  ? "border-[#ead9a4] bg-[#fffaf0]"
                  : "border-[#123529]/10 bg-[#fbfaf7]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a938f]">
                    Orders
                  </p>

                  <p className="mt-3 text-3xl font-semibold text-[#123529]">
                    {pendingCount}
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    Pending orders
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff4d1] text-[#987117]">
                  <StatIcon type="pending" />
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-[#747d78]">
                {pendingCount > 0
                  ? "Review and process orders waiting for action."
                  : "No pending orders right now."}
              </p>

              <p className="mt-4 text-xs font-semibold text-[#073c31]">
                Review Orders →
              </p>
            </Link>

            <Link
              href="/admin/products"
              className={`group rounded-[20px] border p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(18,53,41,0.06)] ${
                lowStockCount > 0
                  ? "border-amber-200 bg-amber-50/50"
                  : "border-[#123529]/10 bg-[#fbfaf7]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a938f]">
                    Inventory
                  </p>

                  <p className="mt-3 text-3xl font-semibold text-[#123529]">
                    {lowStockCount}
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    Low stock products
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff4d1] text-[#987117]">
                  <StatIcon type="products" />
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-[#747d78]">
                {lowStockCount > 0
                  ? "Products with 1–5 units remaining may need restocking."
                  : "No products are currently low on stock."}
              </p>

              <p className="mt-4 text-xs font-semibold text-[#073c31]">
                Manage Stock →
              </p>
            </Link>

            <Link
              href="/admin/products"
              className={`group rounded-[20px] border p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(18,53,41,0.06)] ${
                outOfStockCount > 0
                  ? "border-red-200 bg-red-50/50"
                  : "border-[#123529]/10 bg-[#fbfaf7]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a938f]">
                    Critical Stock
                  </p>

                  <p
                    className={`mt-3 text-3xl font-semibold ${
                      outOfStockCount > 0
                        ? "text-red-700"
                        : "text-[#123529]"
                    }`}
                  >
                    {outOfStockCount}
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    Out of stock
                  </p>
                </div>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    outOfStockCount > 0
                      ? "bg-red-100 text-red-700"
                      : "bg-[#edf3ef] text-[#073c31]"
                  }`}
                >
                  <StatIcon type="products" />
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-[#747d78]">
                {outOfStockCount > 0
                  ? "These products have no stock available and need attention."
                  : "All products currently have stock available."}
              </p>

              <p className="mt-4 text-xs font-semibold text-[#073c31]">
                Manage Products →
              </p>
            </Link>
          </div>
        </section>

        {/* GRAPH + FEATURED PRODUCT */}

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_0.75fr]">
          {/* GRAPH */}

          <article className="overflow-hidden rounded-[26px] border border-[#123529]/10 bg-white shadow-[0_16px_50px_rgba(18,53,41,0.05)]">
            <div className="flex flex-col gap-3 border-b border-[#123529]/10 bg-[#fbfaf6] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
                  Performance
                </p>

                <h2 className="mt-1 font-serif text-2xl font-semibold">
                  Sales Overview
                </h2>

                <p className="mt-1 text-xs text-[#8a938f]">
                  Order value across the last 7 days
                </p>
              </div>

              <span className="w-fit rounded-full bg-[#edf3ef] px-3 py-1.5 text-[10px] font-semibold text-[#073c31]">
                Last 7 days
              </span>
            </div>

            <div className="p-4 sm:p-6">
              <div className="relative h-[260px] overflow-hidden rounded-[20px] border border-[#123529]/8 bg-[#fbfaf7] p-4 sm:h-[310px] sm:p-5">
                <div className="pointer-events-none absolute inset-x-5 top-[25%] border-t border-[#123529]/6" />
                <div className="pointer-events-none absolute inset-x-5 top-[50%] border-t border-[#123529]/6" />
                <div className="pointer-events-none absolute inset-x-5 top-[75%] border-t border-[#123529]/6" />

                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-x-5 bottom-12 top-5 h-[calc(100%-68px)] w-[calc(100%-40px)] overflow-visible"
                >
                  <defs>
                    <linearGradient
                      id="orinocaArea"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#0b4a3b"
                        stopOpacity="0.18"
                      />

                      <stop
                        offset="100%"
                        stopColor="#0b4a3b"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>

                  <polygon
                    points={`0,100 ${chartPoints} 100,100`}
                    fill="url(#orinocaArea)"
                  />

                  <polyline
                    points={chartPoints}
                    fill="none"
                    stroke="#0b4a3b"
                    strokeWidth="2.2"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {chartData.map(
                    (item, index) => {
                      const x =
                        chartData.length === 1
                          ? 50
                          : (index /
                              (chartData.length -
                                1)) *
                            100;

                      const y =
                        90 -
                        (item.value /
                          maxChartValue) *
                          70;

                      return (
                        <circle
                          key={`${item.label}-${index}`}
                          cx={x}
                          cy={y}
                          r="1.6"
                          fill="#d4af37"
                          stroke="#073c31"
                          strokeWidth="0.7"
                          vectorEffect="non-scaling-stroke"
                        />
                      );
                    }
                  )}
                </svg>

                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-7 gap-1">
                  {chartData.map(
                    (item, index) => (
                      <div
                        key={`${item.label}-${index}`}
                        className="min-w-0 text-center"
                      >
                        <p className="text-[9px] font-semibold text-[#8a938f] sm:text-[10px]">
                          {item.label}
                        </p>

                        <p className="mt-1 hidden truncate text-[9px] text-[#123529] sm:block">
                          {item.value > 0
                            ? money(
                                item.value
                              )
                            : "—"}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </article>

          {/* FEATURED PRODUCT */}

          <aside className="overflow-hidden rounded-[26px] border border-[#123529]/10 bg-white shadow-[0_16px_50px_rgba(18,53,41,0.05)]">
            <div className="border-b border-[#123529]/10 bg-[#fbfaf6] px-5 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
                Featured
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold">
                ORINOCA NATURAL
              </h2>
            </div>

            <div className="p-5">
              <div className="grid min-h-[220px] place-items-center overflow-hidden rounded-[22px] bg-[#f3efe5] p-5">
                {featuredProduct
                  ?.images?.[0] ? (
                  <img
                    src={
                      featuredProduct.images[0]
                    }
                    alt={
                      featuredProduct.name
                    }
                    className="max-h-[220px] w-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white font-serif text-xl font-semibold text-[#073c31]">
                      ON
                    </div>

                    <p className="mt-4 text-xs text-[#8a938f]">
                      Product image
                    </p>
                  </div>
                )}
              </div>

              {featuredProduct ? (
                <>
                  <h3 className="mt-5 break-words font-serif text-xl font-semibold">
                    {featuredProduct.name}
                  </h3>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-[#fbfaf7] p-4">
                      <p className="text-[9px] uppercase tracking-[0.14em] text-[#8a938f]">
                        Price
                      </p>

                      <p className="mt-2 text-sm font-semibold">
                        {money(
                          featuredProduct.price
                        )}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#fbfaf7] p-4">
                      <p className="text-[9px] uppercase tracking-[0.14em] text-[#8a938f]">
                        Stock
                      </p>

                      <p
                        className={`mt-2 text-sm font-semibold ${
                          featuredProduct.stock <=
                          5
                            ? "text-red-600"
                            : "text-[#073c31]"
                        }`}
                      >
                        {
                          featuredProduct.stock
                        }{" "}
                        units
                      </p>
                    </div>
                  </div>

                  {featuredProduct.stock <=
                  5 ? (
                    <div className="mt-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                      Low stock — consider
                      restocking soon.
                    </div>
                  ) : null}
                </>
              ) : null}

              <Link
                href="/admin/products"
                className="mt-5 flex items-center justify-between rounded-2xl bg-[#073c31] px-4 py-3.5 text-sm font-semibold text-white"
              >
                <span>Manage Product</span>
                <span>→</span>
              </Link>
            </div>
          </aside>
        </section>

        {/* RECENT ORDERS + QUICK ACTIONS */}

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_0.75fr]">
          {/* RECENT ORDERS */}

          <article className="overflow-hidden rounded-[26px] border border-[#123529]/10 bg-white shadow-[0_16px_50px_rgba(18,53,41,0.05)]">
            <div className="flex items-center justify-between gap-4 border-b border-[#123529]/10 bg-[#fbfaf6] px-5 py-5 sm:px-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
                  Fulfilment
                </p>

                <h2 className="mt-1 font-serif text-2xl font-semibold">
                  Recent Orders
                </h2>
              </div>

              <Link
                href="/admin/orders"
                className="text-xs font-semibold text-[#073c31]"
              >
                View All →
              </Link>
            </div>

            <div className="p-4 sm:p-5">
              {recentOrders.length === 0 ? (
                <div className="rounded-[20px] bg-[#fbfaf7] p-8 text-center">
                  <p className="text-sm text-[#8a938f]">
                    No orders received yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentOrders.map(
                    (order) => (
                      <div
                        key={String(
                          order._id
                        )}
                        className="flex flex-col gap-4 rounded-[18px] border border-[#123529]/8 bg-[#fbfaf7] p-4 transition hover:bg-white sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-serif text-base font-semibold">
                              {
                                order.orderNumber
                              }
                            </p>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold capitalize ${statusClass(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <p className="mt-2 truncate text-xs text-[#717a75]">
                            {order.customer
                              ?.name ||
                              "Customer"}
                          </p>

                          <p className="mt-1 text-[10px] text-[#9aa09d]">
                            {new Date(
                              order.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                          <p className="text-[9px] uppercase tracking-[0.12em] text-[#8a938f]">
                            Amount
                          </p>

                          <p className="mt-1 font-semibold text-[#073c31]">
                            {money(
                              order.total
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </article>

          {/* QUICK ACTIONS */}

          <aside className="rounded-[26px] border border-[#123529]/10 bg-white p-5 shadow-[0_16px_50px_rgba(18,53,41,0.05)] sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
              Shortcuts
            </p>

            <h2 className="mt-1 font-serif text-2xl font-semibold">
              Quick Actions
            </h2>

            <p className="mt-2 text-xs leading-5 text-[#8a938f]">
              Jump directly to your most common
              store tasks.
            </p>

            <div className="mt-5 space-y-3">
              <Link
                href="/admin/products"
                className="group flex items-center justify-between rounded-2xl border border-[#123529]/10 bg-[#fbfaf7] px-4 py-4 text-sm font-semibold transition hover:border-[#d4af37]/50 hover:bg-white"
              >
                <span>Add Product</span>

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/admin/orders"
                className="group flex items-center justify-between rounded-2xl border border-[#123529]/10 bg-[#fbfaf7] px-4 py-4 text-sm font-semibold transition hover:border-[#d4af37]/50 hover:bg-white"
              >
                <span>Review Orders</span>

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/admin/promos"
                className="group flex items-center justify-between rounded-2xl border border-[#123529]/10 bg-[#fbfaf7] px-4 py-4 text-sm font-semibold transition hover:border-[#d4af37]/50 hover:bg-white"
              >
                <span>Create Promo</span>

                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/"
                target="_blank"
                className="group flex items-center justify-between rounded-2xl bg-[#073c31] px-4 py-4 text-sm font-semibold text-white transition hover:bg-[#123529]"
              >
                <span>Open Store</span>
                <span>↗</span>
              </Link>
            </div>

            <div className="mt-5 rounded-[20px] border border-[#d4af37]/15 bg-[#fffaf0] p-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9a741a]">
                ORINOCA NATURAL
              </p>

              <p className="mt-2 text-xs leading-5 text-[#71674d]">
                Store management is ready and
                connected to live catalogue and
                orders.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </AdminShell>
  );
}