import Link from "next/link";

const faqs = [
  {
    question: "How do I place an order?",
    answer:
      "Choose a product, add it to your cart, enter your delivery details and place your cash on delivery order.",
  },
  {
    question: "Which payment method is available?",
    answer:
      "Currently we accept cash on delivery. You pay when the order reaches your address.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Use your order number and the phone number used at checkout on our Track Order page.",
  },
  {
    question: "When will my order be delivered?",
    answer:
      "Delivery timing depends on your city and courier route. Our team confirms your order before dispatch.",
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "Contact our support team as soon as possible after placing the order. Changes may not be possible after dispatch.",
  },
  {
    question: "How should I use the serum?",
    answer:
      "Apply a few drops to clean, dry skin and gently massage it into your face. Use consistently as part of your routine.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#f5f2eb] px-5 py-10 text-[#123529]">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
              ORINOCA NATURAL
            </p>
            <h1 className="mt-2 text-4xl font-semibold">
              Frequently asked questions
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-neutral-600">
              Everything you need to know before placing your order.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-[#1b4d3e]/20 bg-white px-4 py-3 text-sm font-semibold"
          >
            Back to home
          </Link>
        </div>

        <section className="mt-8 space-y-4">
          {faqs.map((faq, index) => (
            <article key={faq.question} className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-[#8a9a86]">
                0{index + 1}
              </p>
              <h2 className="mt-3 text-xl font-semibold">{faq.question}</h2>
              <p className="mt-3 leading-7 text-neutral-600">{faq.answer}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl bg-[#1b4d3e] p-7 text-white">
          <h2 className="text-2xl font-semibold">Still need help?</h2>
          <p className="mt-2 text-[#dce6d7]">
            You can track an existing order or continue shopping.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/track-order"
              className="rounded-xl bg-white px-5 py-3 font-semibold text-[#123529]"
            >
              Track order
            </Link>

            <Link
              href="/shop"
              className="rounded-xl border border-white/30 px-5 py-3 font-semibold"
            >
              Shop products
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}