import Link from "next/link";

type StoreFooterProps = {
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaHref?: string;
  showCta?: boolean;
};

export default function StoreFooter({
  ctaTitle = "Not sure which pack is right for you?",
  ctaDescription = "See full ingredients, usage steps and real reviews on the product page.",
  ctaButtonText = "View Full Product Details",
  ctaHref = "/shop",
  showCta = true,
}: StoreFooterProps) {
  return (
    <>
      {showCta ? (
        <section className="bg-[#005b49] px-5 py-20 text-center text-white">
          <div className="mx-auto max-w-3xl">
            <h2
               className="font-serif text-4xl leading-tight md:text-5xl"
               style={{ color: "#ffffff" }}
            >
              {ctaTitle}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-white/80">
              {ctaDescription}
            </p>

            <Link
              href={ctaHref}
              className="mt-8 inline-flex rounded-full bg-[#e5b52d] px-9 py-4 font-semibold text-[#123529] transition hover:bg-[#f0c44a]"
            >
              {ctaButtonText}
            </Link>
          </div>
        </section>
      ) : null}

      <footer className="bg-[#003d32] px-5 py-14 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href="/" className="font-serif text-3xl text-white">
                NM <span className="text-sm tracking-[0.28em] text-[#9db4a8]">SKIN CARE</span>
              </Link>

              <p className="mt-5 max-w-xs text-sm leading-7 text-white/70">
                A pure &amp; natural skincare serum, formulated and lab-tested
                for everyday radiance. Proudly registered in Pakistan.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <h3 className="mb-2 font-semibold uppercase tracking-[0.18em] text-[#e5b52d]">
                Shop
              </h3>
              <Link className="text-white/80 hover:text-white" href="/shop">All Packs</Link>
              <Link className="text-white/80 hover:text-white" href="/shop">Product Details</Link>
              <Link className="text-white/80 hover:text-white" href="/cart">Your Cart</Link>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <h3 className="mb-2 font-semibold uppercase tracking-[0.18em] text-[#e5b52d]">
                Support
              </h3>
              <Link className="text-white/80 hover:text-white" href="/track-order">Order Tracking</Link>
              <Link className="text-white/80 hover:text-white" href="/shipping-returns">Delivery Info</Link>
              <Link className="text-white/80 hover:text-white" href="/contact">Contact Us</Link>
            </div>

            <div>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#e5b52d]">
                Connect
              </h3>

              <div className="flex gap-3">
                <a href="#" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/80 hover:bg-white hover:text-[#003d32]">f</a>
                <a href="#" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/80 hover:bg-white hover:text-[#003d32]">◎</a>
                <a href="#" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/80 hover:bg-white hover:text-[#003d32]">◔</a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-7 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
            <span>© {new Date().getFullYear()} NM Skin Care. All rights reserved.</span>
            <span>Pure &amp; Natural · Lab Tested · Registered in Pakistan</span>
          </div>
        </div>
      </footer>
    </>
  );
}