import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f5f2eb] px-5 py-10 text-[#123529]">
      <article className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
              NM Skin Care
            </p>
            <h1 className="mt-2 text-4xl font-semibold">Privacy Policy</h1>
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
              Information we collect
            </h2>
            <p className="mt-2">
              When you place an order, we collect details such as your name,
              phone number, email address if provided, delivery address and
              order information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#123529]">
              How we use your information
            </h2>
            <p className="mt-2">
              We use your information to process orders, arrange delivery,
              provide customer support, confirm order status and improve our
              store experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#123529]">
              Data protection
            </h2>
            <p className="mt-2">
              We take reasonable steps to protect your order information. Only
              authorised store administration uses order details for fulfilment
              and customer support.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#123529]">
              Third-party services
            </h2>
            <p className="mt-2">
              Our store uses trusted technical services to operate the website,
              store order information and host product images. These services
              process information only as needed to provide the store.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#123529]">
              Contact us
            </h2>
            <p className="mt-2">
              For privacy questions or order support, please contact us through
              our WhatsApp support channel.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}