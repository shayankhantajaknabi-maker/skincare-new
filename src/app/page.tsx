import Link from "next/link";
import Image from "next/image";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import MobileNav from "./mobile-nav";
import heroImage from "../../public/hero-serum.png";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await connectToDatabase();

  const product = await Product.findOne({
    isActive: true,
  })
    .sort({ featured: -1, createdAt: -1 })
    .lean();

  const productHref = product ? `/products/${product.slug}` : "/shop";

  return (
    <main className="min-h-screen bg-[#f5f2eb] text-[#123529]">
      <header className="relative border-b border-[#1b4d3e]/10 bg-[#f5f2eb]/95 px-5 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold">NM</span>
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8a9a86]">
              Skin Care
            </span>
          </Link>

          <nav
            className="hidden items-center text-sm font-medium lg:flex"
            style={{ gap: "36px" }}
          >
            <a href="#benefits">Benefits</a>
            <a href="#ritual">The Ritual</a>
            <a href="#reviews">Reviews</a>
            <a href="#offer">Offer</a>
            <Link href="/faq">FAQ</Link>
          </nav>

          <div className="hidden items-center md:flex">
            <Link
              href={productHref}
              className="rounded-full bg-[#1b4d3e] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(27,77,62,0.22)] transition hover:bg-[#123529]"
            >
              Order Now
            </Link>
          </div>

          <MobileNav productHref={productHref} />
        </div>
      </header>

      <section className="overflow-hidden px-5 py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8a9a86]">
              Pure & natural · Made in Pakistan
            </p>

            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.04] tracking-tight md:text-7xl">
              Skin that glows the way{" "}
              <span className="font-serif italic text-[#1b4d3e]">
                nature
              </span>{" "}
              intended.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-neutral-600">
              A simple, gentle daily serum created to support soft,
              healthy-looking skin — one mindful drop at a time.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={productHref}
                className="rounded-full bg-[#1b4d3e] px-7 py-4 font-semibold text-white shadow-[0_10px_22px_rgba(27,77,62,0.18)]"
              >
                Shop the serum
              </Link>

              <a
                href="#ritual"
                className="rounded-full border border-[#1b4d3e]/25 bg-white px-7 py-4 font-semibold"
              >
                See how it works
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-[#1b4d3e]/15 pt-6">
              <div>
                <p className="text-2xl font-semibold">10,000+</p>
                <p className="mt-1 text-xs text-neutral-500">
                  Happy customers
                </p>
              </div>

              <div>
                <p className="text-2xl font-semibold">100%</p>
                <p className="mt-1 text-xs text-neutral-500">
                  Pure & natural
                </p>
              </div>

              <div>
                <p className="text-2xl font-semibold">PK</p>
                <p className="mt-1 text-xs text-neutral-500">
                  Registered product
                </p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-8 rounded-full border border-[#8a9a86]/30" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#e9e3d7] shadow-xl">
              <Image
                src={heroImage}
                alt="NM Skin Care serum"
                priority
                placeholder="blur"
                className="h-full w-full object-contain p-6"
              />
            </div>

            <div className="absolute -left-5 top-14 rounded-2xl bg-white px-4 py-3 text-sm font-semibold shadow-lg">
              <span className="mr-2 text-[#c69a2d]">●</span>
              Lab-tested formula
            </div>

            <div className="absolute -right-5 bottom-8 rounded-2xl bg-white px-4 py-3 text-sm font-semibold shadow-lg">
              <span className="mr-2 text-[#c69a2d]">●</span>
              10,000+ happy skins
            </div>
          </div>
        </div>
      </section>

      <section
        id="benefits"
        className="border-y border-[#1b4d3e]/10 bg-white px-5 py-16"
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-xs font-bold uppercase tracking-[0.24em] text-[#8a9a86]">
            Why NM Skin Care
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl text-center text-4xl font-semibold">
            A calm, uncomplicated approach to daily skin care.
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [
                "Gentle daily care",
                "Made to fit easily into your morning and evening routine.",
              ],
              [
                "Thoughtfully formulated",
                "A lightweight feel without an overcomplicated ritual.",
              ],
              [
                "Made with intention",
                "Prepared for people who want simple, consistent care.",
              ],
            ].map(([title, text], index) => (
              <article key={title} className="rounded-3xl bg-[#f5f2eb] p-6">
                <p className="text-sm font-bold text-[#8a9a86]">
                  0{index + 1}
                </p>

                <h3 className="mt-5 text-xl font-semibold">{title}</h3>

                <p className="mt-3 leading-7 text-neutral-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="ritual" className="px-5 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8a9a86]">
              The daily ritual
            </p>

            <h2 className="mt-4 text-4xl font-semibold">
              Just a few drops. A little consistency.
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-neutral-600">
              Keep your routine simple: cleanse, apply a small amount of serum,
              and let your skin enjoy the care.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["01", "Cleanse", "Start with clean, dry skin."],
              ["02", "Apply", "Use a few gentle drops."],
              ["03", "Repeat", "Make it part of your daily ritual."],
            ].map(([number, title, text]) => (
              <div key={number} className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-[#8a9a86]">{number}</p>

                <h3 className="mt-6 text-xl font-semibold">{title}</h3>

                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="bg-[#1b4d3e] px-5 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#c8d1c5]">
            Real results
          </p>

          <h2 className="mt-4 max-w-2xl text-4xl font-semibold">
            Loved by over 10,000 customers
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              ["“My skin feels softer and more refreshed.”", "Verified customer"],
              [
                "“Simple to use and easy to add to my routine.”",
                "Verified customer",
              ],
              [
                "“I love the lightweight, comfortable feel.”",
                "Verified customer",
              ],
            ].map(([quote, customer]) => (
              <blockquote
                key={quote}
                className="rounded-3xl border border-white/15 bg-white/5 p-6"
              >
                <p className="text-xl leading-8">{quote}</p>

                <footer className="mt-6 text-sm text-[#c8d1c5]">
                  {customer}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="offer" className="bg-[#f5f2eb] px-5 py-16 md:py-24">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-8 shadow-sm md:p-12">
          <p className="text-center text-xs font-bold uppercase tracking-[0.24em] text-[#8a9a86]">
            Limited time
          </p>

          <h2 className="mt-4 text-center text-4xl font-semibold">
            Bring home your bottle today
          </h2>

          <div className="mt-10 flex flex-col items-center justify-center gap-7 md:flex-row">
            <div className="w-full max-w-xs rounded-3xl bg-[#f5f2eb] p-7">
              <Image
                src={heroImage}
                alt="NM Skin Care serum"
                className="h-64 w-full object-contain"
              />
            </div>

            <div className="max-w-md">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a9a86]">
                NM Skin Care · 20ml
              </p>

              <h3 className="mt-3 text-3xl font-semibold">
                Pure & Natural Serum
              </h3>

              <p className="mt-4 text-neutral-600">
                Gentle everyday care with cash on delivery available nationwide.
              </p>

              <Link
                href={productHref}
                className="mt-6 inline-flex rounded-full bg-[#c69a2d] px-7 py-4 font-semibold text-[#123529]"
              >
                Order Now — Cash on Delivery
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#123529] px-5 py-10 text-[#e8eee4]">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div>
              <p className="text-xl font-semibold">NM Skin Care</p>

              <p className="mt-2 max-w-xs text-sm leading-6 text-[#c8d1c5]">
                Gentle, thoughtful skin care for your everyday ritual.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-[#c8d1c5]">
              <Link href="/shop">Shop</Link>
              <Link href="/cart">Cart</Link>
              <Link href="/track-order">Track order</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/shipping-returns">Shipping & returns</Link>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-sm text-[#c8d1c5]">
            © 2026 NM Skin Care. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}