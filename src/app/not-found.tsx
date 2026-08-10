import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f2eb] px-5 text-[#123529]">
      <section className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a9a86]">
          ORINOCA NATURAL
        </p>

        <h1 className="mt-4 text-5xl font-semibold">404</h1>

        <h2 className="mt-3 text-2xl font-semibold">Page not found</h2>

        <p className="mt-3 leading-7 text-neutral-600">
          The page you are looking for does not exist or may have moved.
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex rounded-xl bg-[#1b4d3e] px-5 py-3 font-semibold text-white"
        >
          Back to home
        </Link>
      </section>
    </main>
  );
}