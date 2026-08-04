import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { PromoCode } from "@/models/PromoCode";
import LogoutButton from "./logout-button";

export default async function AdminDashboardPage() {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  await connectToDatabase();

  const [productCount, orderCount, promoCount] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    PromoCode.countDocuments(),
  ]);

  return (
    <main className="min-h-screen bg-[#f5f2eb] px-5 py-10 text-[#123529]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
              NM Skin Care Admin
            </p>

            <h1 className="mt-2 text-4xl font-semibold">Welcome back</h1>

            <p className="mt-2 text-neutral-600">
              Signed in as {admin.email}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-xl border border-[#1b4d3e]/20 bg-white px-4 py-3 text-sm font-semibold"
            >
              View store
            </Link>

            <LogoutButton />
          </div>
        </div>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-500">Products</p>
            <p className="mt-2 text-3xl font-semibold">{productCount}</p>
          </article>

          <article className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-500">Orders</p>
            <p className="mt-2 text-3xl font-semibold">{orderCount}</p>
          </article>

          <article className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-500">Promo codes</p>
            <p className="mt-2 text-3xl font-semibold">{promoCount}</p>
          </article>

          <article className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-500">Store status</p>
            <p className="mt-2 text-xl font-semibold text-emerald-700">
              Live database
            </p>
          </article>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <Link
            href="/admin/products"
            className="rounded-3xl bg-[#1b4d3e] p-6 text-white transition hover:bg-[#123529]"
          >
            <p className="text-sm uppercase tracking-[0.15em] text-white/70">
              Catalogue
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Manage products</h2>
            <p className="mt-2 text-sm text-white/80">
              Add serum packs, upload images, update pricing and stock.
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5"
          >
            <p className="text-sm uppercase tracking-[0.15em] text-[#8a9a86]">
              Fulfilment
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Manage orders</h2>
            <p className="mt-2 text-sm text-neutral-600">
              View customer orders and update delivery status.
            </p>
          </Link>

          <Link
            href="/admin/promos"
            className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5"
          >
            <p className="text-sm uppercase tracking-[0.15em] text-[#8a9a86]">
              Marketing
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Promo codes</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Create discounts, expiry dates and minimum order rules.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}