import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f5f2eb] px-5 py-10 text-[#123529]">
      <article className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
              NM Skin Care
            </p>
            <h1 className="mt-2 text-4xl font-semibold">
              Terms & Conditions
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
              Using this website
            </h2>
            <p className="mt-2">
              By using the NM Skin Care website or placing an order, you agree
              to use the store lawfully and provide accurate information for
              order processing and delivery.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#123529]">
              Products and availability
            </h2>
            <p className="mt-2">
              Product availability, prices, images and stock can change. We aim
              to keep all information accurate, but may update product details
              when needed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#123529]">
              Orders
            </h2>
            <p className="mt-2">
              An order placed through the website is subject to confirmation.
              We may contact you using the provided phone number to verify
              delivery details before dispatch.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#123529]">
              Cash on delivery
            </h2>
            <p className="mt-2">
              Cash on delivery orders must be paid to the courier when the
              order is delivered. Please ensure your provided delivery details
              are correct.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#123529]">
              Support
            </h2>
            <p className="mt-2">
              For questions about an order, delivery or product information,
              please contact our support team through the Contact page.
            </p>

            <Link
              href="/contact"
              className="mt-5 inline-flex rounded-xl bg-[#1b4d3e] px-5 py-3 font-semibold text-white"
            >
              Contact support
            </Link>
          </section>
        </div>
      </article>
    </main>
  );
}