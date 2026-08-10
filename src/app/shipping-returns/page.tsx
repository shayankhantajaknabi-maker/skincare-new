import Link from "next/link";

export default function ShippingReturnsPage() {
  return (
    <main className="min-h-screen bg-[#f5f2eb] px-5 py-10 text-[#123529]">
      <article className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
              ORINOCA NATURAL
            </p>
            <h1 className="mt-2 text-4xl font-semibold">
              Shipping & Returns
            </h1>
            <p className="mt-3 text-neutral-600">Last updated: August 2026</p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-[#1b4d3e]/20 bg-white px-4 py-3 text-sm font-semibold"
          >
            Back to home
          </Link>
        </div>

        <div className="mt-8 space-y-6 rounded-3xl bg-white p-7 leading-7 text-neutral-700 shadow-sm md:p-10">
          <section>
            <h2 className="text-xl font-semibold text-[#123529]">
              Order confirmation
            </h2>
            <p className="mt-2">
              After you place a cash on delivery order, our team may contact
              you to confirm the delivery details before dispatch.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#123529]">
              Delivery
            </h2>
            <p className="mt-2">
              Delivery availability and timing can vary by city, courier route
              and order confirmation. The applicable delivery fee is shown at
              checkout before you place the order.
            </p>
            <p className="mt-2">
              Orders above Rs. 2,000 qualify for free delivery according to the
              current checkout offer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#123529]">
              Order changes or cancellation
            </h2>
            <p className="mt-2">
              If you need to change or cancel an order, contact us as soon as
              possible. We will assist where the order has not already been
              dispatched.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#123529]">
              Returns and concerns
            </h2>
            <p className="mt-2">
              If you receive an incorrect, damaged or problematic item, contact
              us promptly on WhatsApp with your order number and relevant
              details. Each concern is reviewed by our support team.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#123529]">
              Need help?
            </h2>
            <p className="mt-2">
              You can track your order online or contact our WhatsApp support
              team for assistance.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/track-order"
                className="rounded-xl bg-[#1b4d3e] px-5 py-3 font-semibold text-white"
              >
                Track order
              </Link>

              <Link
                href="/contact"
                className="rounded-xl border border-[#1b4d3e]/20 px-5 py-3 font-semibold"
              >
                Contact support
              </Link>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}