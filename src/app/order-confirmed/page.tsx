import Link from "next/link";

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <main className="flex min-h-screen items-center bg-[#f5f2eb] px-5 py-10 text-[#123529]">
      <section className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl text-emerald-700">
          ✓
        </div>

        <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
          ORINOCA NATURAL
        </p>

        <h1 className="mt-3 text-4xl font-semibold">
          Order received!
        </h1>

        <p className="mx-auto mt-4 max-w-lg leading-7 text-neutral-600">
          Thank you for your order. Our team will confirm it shortly. You will
          pay through cash on delivery when your order arrives.
        </p>

        {order ? (
          <div className="mt-7 rounded-2xl bg-[#f5f2eb] p-5">
            <p className="text-sm text-neutral-500">Your order number</p>
            <p className="mt-1 text-xl font-semibold">{order}</p>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/shop"
            className="rounded-xl bg-[#1b4d3e] px-5 py-3 font-semibold text-white"
          >
            Continue shopping
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-[#1b4d3e]/20 px-5 py-3 font-semibold"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}