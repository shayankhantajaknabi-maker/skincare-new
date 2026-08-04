import Link from "next/link";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
const whatsappMessage = encodeURIComponent(
  "Assalam-o-Alaikum, mujhe NM Skin Care ke bare mein help chahiye."
);

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f5f2eb] px-5 py-10 text-[#123529]">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
              NM Skin Care
            </p>
            <h1 className="mt-2 text-4xl font-semibold">We are here to help</h1>
            <p className="mt-3 max-w-2xl leading-7 text-neutral-600">
              Need product guidance, order support or help tracking a delivery?
              Message us on WhatsApp and our team will assist you.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-[#1b4d3e]/20 bg-white px-4 py-3 text-sm font-semibold"
          >
            Back to home
          </Link>
        </div>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl bg-[#1b4d3e] p-7 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#c8d1c5]">
              Fastest support
            </p>

            <h2 className="mt-3 text-2xl font-semibold">Chat on WhatsApp</h2>

            <p className="mt-3 leading-7 text-[#dce6d7]">
              Contact us directly for product questions, delivery details and
              order assistance.
            </p>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-[#123529]"
            >
              Open WhatsApp
            </a>
          </article>

          <article className="rounded-3xl bg-white p-7 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a9a86]">
              Existing order
            </p>

            <h2 className="mt-3 text-2xl font-semibold">Track your delivery</h2>

            <p className="mt-3 leading-7 text-neutral-600">
              Use the order number received after checkout and your order phone
              number to view its current status.
            </p>

            <Link
              href="/track-order"
              className="mt-7 inline-flex rounded-xl border border-[#1b4d3e]/20 px-5 py-3 font-semibold"
            >
              Track order
            </Link>
          </article>
        </section>

        <section className="mt-8 rounded-3xl bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-semibold">Before you message us</h2>
          <p className="mt-3 leading-7 text-neutral-600">
            For order support, please keep your order number and the phone
            number used at checkout ready. You can also visit our FAQ page for
            quick answers.
          </p>

          <Link
            href="/faq"
            className="mt-6 inline-flex rounded-xl bg-[#f5f2eb] px-5 py-3 font-semibold"
          >
            View FAQ
          </Link>
        </section>
      </div>
    </main>
  );
}