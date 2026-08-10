import Image from "next/image";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import StoreHeader from "./store-header";
import StoreFooter from "./store-footer";

export const dynamic = "force-dynamic";

type HomeProduct = {
  _id: unknown;
  name: string;
  slug: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number | null;
  images?: string[];
  badge?: string;
};

function formatPrice(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

export default async function HomePage() {
  await connectToDatabase();

  const rawProducts = await Product.find({
    isActive: true,
  })
    .sort({ featured: -1, createdAt: 1 })
    .limit(3)
    .lean();

  const products = rawProducts as unknown as HomeProduct[];

  const firstProduct = products[0];

  const productHref = firstProduct
    ? `/products/${firstProduct.slug}`
    : "/shop";

  return (
    <div className="nm-store">
      <StoreHeader />

      <main>
        {/* HERO */}
        <section className="nm-ref-hero">
          <div className="nm-wrap nm-ref-hero-grid">
            <div className="nm-ref-hero-copy">
              <span className="nm-eyebrow">
                Pure &amp; Natural · Lab Tested · Made in Pakistan
              </span>

              <h1>
                Skin that glows the way <em>nature</em> intended.
              </h1>

              <p>
                ORINOCA NATURAL Serum is a botanical serum crafted in small
                batches and independently lab-tested — formulated to nourish,
                repair and bring out your skin&apos;s natural radiance, one
                drop at a time.
              </p>

              <div className="nm-ref-hero-actions">
                <Link
                  href={productHref}
                  className="nm-btn nm-btn-primary"
                >
                  Shop the Serum — 20ml
                </Link>

                <Link
                  href={productHref}
                  className="nm-btn nm-btn-ghost"
                >
                  View Product Details
                </Link>
              </div>

              <div className="nm-ref-hero-trust">
                <div>
                  <b>10,000+</b>
                  <span>Satisfied Customers</span>
                </div>

                <div>
                  <b>100%</b>
                  <span>Pure &amp; Natural</span>
                </div>

                <div>
                  <b>Lab</b>
                  <span>Tested Formula</span>
                </div>

                <div>
                  <b>PK</b>
                  <span>Registered Product</span>
                </div>
              </div>
            </div>

            <div className="nm-ref-hero-visual">
              <div className="nm-ref-glow" />
              <div className="nm-ref-ring" />

              <Image
                src="/hero-serum-new.png"
                alt="ORINOCA NATURAL Pure and Natural Serum, 20ml dropper bottle"
                width={800}
                height={1200}
                priority
                className="nm-ref-hero-bottle"
              />

              <div className="nm-ref-float-badge nm-ref-badge-one">
                <span />
                Lab-Tested Formula
              </div>

              <div className="nm-ref-float-badge nm-ref-badge-two">
                <span />
                10,000+ Happy Skins
              </div>
            </div>
          </div>
        </section>

        <div className="nm-drop-divider">
          <svg viewBox="0 0 34 64" fill="none">
            <path
              d="M17 2C17 2 4 24 4 40C4 50.4934 9.92487 58 17 58C24.0751 58 30 50.4934 30 40C30 24 17 2 17 2Z"
              stroke="#8A9A86"
              strokeWidth="1.3"
            />
          </svg>
        </div>

        {/* TRUST STRIP */}
        <section className="nm-trust-strip">
          <div className="nm-wrap nm-trust-grid">
            <div className="nm-trust-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M9 3h6M10 3v5.5L4.5 18a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 8.5V3" />
              </svg>

              <b>Laboratory Tested</b>
              <span>Verified for purity &amp; safety</span>
            </div>

            <div className="nm-trust-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z" />
              </svg>

              <b>Registered in Pakistan</b>
              <span>Manufactured &amp; certified locally</span>
            </div>

            <div className="nm-trust-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 21s-7-4.35-9.5-9C.5 7.5 3 3.5 7 3.5c2 0 3.7 1.1 5 3 1.3-1.9 3-3 5-3 4 0 6.5 4 4.5 8.5-2.5 4.65-9.5 9-9.5 9Z" />
              </svg>

              <b>10,000+ Customers</b>
              <span>Trusted across Pakistan</span>
            </div>

            <div className="nm-trust-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
                <circle cx="12" cy="12" r="4" />
              </svg>

              <b>100% Natural</b>
              <span>No harsh chemicals, ever</span>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section
          className="nm-ref-benefits"
          id="benefits"
        >
          <div className="nm-wrap">
            <div className="nm-ref-sec-head">
              <span className="nm-eyebrow">
                Why ORINOCA NATURAL
              </span>

              <h2>
                Formulated to work, gentle enough for every day
              </h2>

              <p>
                Every bottle is built around one idea: real botanical
                ingredients, dosed precisely, with nothing artificial to get
                in the way of results.
              </p>
            </div>

            <div className="nm-ref-benefit-grid">
              <article className="nm-ref-benefit-card">
                <div className="nm-ref-benefit-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M4 21c4-1 7-4 8-8-4 1-7 4-8 8Z" />
                    <path d="M13.5 3.5c3 3 3 8-1 12-3-3-3-8 1-12Z" />
                  </svg>
                </div>

                <h3>Deep Nourishment</h3>

                <p>
                  Restores moisture at the skin&apos;s surface, reducing
                  dryness and dullness with continued use.
                </p>
              </article>

              <article className="nm-ref-benefit-card">
                <div className="nm-ref-benefit-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                </div>

                <h3>Visible in Weeks</h3>

                <p>
                  Consistent daily drops help even out tone and texture — most
                  customers notice a difference within 2–3 weeks.
                </p>
              </article>

              <article className="nm-ref-benefit-card">
                <div className="nm-ref-benefit-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 3c-3 3-7 6-7 11a7 7 0 0 0 14 0c0-5-4-8-7-11Z" />
                  </svg>
                </div>

                <h3>No Harsh Chemicals</h3>

                <p>
                  Free from parabens and synthetic fragrance — just
                  plant-derived actives your skin recognises.
                </p>
              </article>

              <article className="nm-ref-benefit-card">
                <div className="nm-ref-benefit-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6l-9-4Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>

                <h3>Lab-Verified Safety</h3>

                <p>
                  Independently tested and registered in Pakistan, so quality
                  is never something you have to guess at.
                </p>
              </article>
            </div>
          </div>
        </section>

        <div className="nm-drop-divider">
          <svg viewBox="0 0 34 64" fill="none">
            <path
              d="M17 2C17 2 4 24 4 40C4 50.4934 9.92487 58 17 58C24.0751 58 30 50.4934 30 40C30 24 17 2 17 2Z"
              stroke="#D4AF37"
              strokeWidth="1.3"
            />
          </svg>
        </div>

        {/* PRODUCT PREVIEW */}
        <section className="nm-ref-shop-preview">
          <div className="nm-wrap">
            <div className="nm-ref-sec-head">
              <span className="nm-eyebrow">
                Choose Your Pack
              </span>

              <h2>Stock up and save</h2>

              <p>
                One bottle to start, or a bundle to make it part of your daily
                ritual for longer.
              </p>
            </div>

            {products.length > 0 ? (
              <div className="nm-product-grid">
                {products.map((product) => {
                  const image = product.images?.[0];

                  const oldPrice =
                    product.compareAtPrice &&
                    product.compareAtPrice > product.price
                      ? product.compareAtPrice
                      : null;

                  return (
                    <article
                      className="nm-product-card"
                      key={String(product._id)}
                    >
                      <div className="nm-product-thumb">
                        <span className="nm-product-tag">
                          {product.badge || "POPULAR"}
                        </span>

                        {image ? (
                          <img
                            src={image}
                            alt={product.name}
                          />
                        ) : (
                          <Image
                            src="/hero-serum-new.png"
                            alt={product.name}
                            width={800}
                            height={1200}
                            className="nm-preview-default-image"
                          />
                        )}
                      </div>

                      <div className="nm-product-body">
                        <div className="nm-stars">
                          ★★★★★
                        </div>

                        <h2>{product.name}</h2>

                        <p className="nm-product-description">
                          {product.shortDescription ||
                            "Pure & Natural Serum for your everyday skincare ritual."}
                        </p>

                        <div className="nm-price-row">
                          <span className="nm-price-new">
                            {formatPrice(product.price)}
                          </span>

                          {oldPrice ? (
                            <span className="nm-price-old">
                              {formatPrice(oldPrice)}
                            </span>
                          ) : null}
                        </div>

                        <div className="nm-card-actions">
                          <Link
                            href={`/products/${product.slug}`}
                            className="nm-btn nm-btn-ghost"
                          >
                            Details
                          </Link>

                          <Link
                            href={`/products/${product.slug}`}
                            className="nm-btn nm-btn-primary"
                          >
                            Add to Cart
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="nm-ref-no-products">
                Products added from the admin panel will appear here.
              </div>
            )}

            <div className="nm-ref-view-shop">
              <Link
                href="/shop"
                className="nm-btn nm-btn-primary"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section
          className="nm-ref-testimonials"
          id="reviews"
        >
          <div className="nm-wrap">
            <div className="nm-ref-sec-head">
              <span className="nm-eyebrow">
                Real Results
              </span>

              <h2>
                Loved by over 10,000 customers
              </h2>

              <p>
                A few words from people who made ORINOCA NATURAL part of their
                daily routine.
              </p>
            </div>

            <div className="nm-ref-testimonial-grid">
              <article className="nm-ref-testimonial-card">
                <div className="nm-stars">
                  ★★★★★
                </div>

                <p>
                  &quot;My skin feels noticeably softer and more even within a
                  month. A little goes a long way with this dropper.&quot;
                </p>

                <div className="nm-ref-author">
                  <span className="nm-ref-avatar">
                    A
                  </span>

                  <div>
                    <b>Ayesha K.</b>
                    <small>Verified Buyer</small>
                  </div>
                </div>
              </article>

              <article className="nm-ref-testimonial-card">
                <div className="nm-stars">
                  ★★★★★
                </div>

                <p>
                  &quot;Finally a local product that&apos;s actually tested and
                  doesn&apos;t irritate sensitive skin. It&apos;s part of my
                  daily routine now.&quot;
                </p>

                <div className="nm-ref-author">
                  <span className="nm-ref-avatar">
                    H
                  </span>

                  <div>
                    <b>Hamza R.</b>
                    <small>Verified Buyer</small>
                  </div>
                </div>
              </article>

              <article className="nm-ref-testimonial-card">
                <div className="nm-stars">
                  ★★★★★
                </div>

                <p>
                  &quot;Lightweight, absorbs fast, no greasy feel. My dull
                  patches have visibly reduced after consistent use.&quot;
                </p>

                <div className="nm-ref-author">
                  <span className="nm-ref-avatar">
                    S
                  </span>

                  <div>
                    <b>Sana M.</b>
                    <small>Verified Buyer</small>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          className="nm-ref-faq"
          id="faq"
        >
          <div className="nm-wrap">
            <div className="nm-ref-sec-head">
              <span className="nm-eyebrow">
                Good to Know
              </span>

              <h2>
                Frequently asked questions
              </h2>
            </div>

            <div className="nm-ref-faq-list">
              <details open>
                <summary>
                  Is ORINOCA NATURAL Serum suitable for all skin types?
                  <span>+</span>
                </summary>

                <p>
                  Yes. The formula is made from natural, lab-tested ingredients
                  and is gentle enough for normal, dry, and combination skin.
                  If you have known sensitivities, we recommend a small patch
                  test first.
                </p>
              </details>

              <details>
                <summary>
                  How long until I see results?
                  <span>+</span>
                </summary>

                <p>
                  Most customers notice softer, more even-toned skin within
                  2–3 weeks of consistent morning and night use.
                </p>
              </details>

              <details>
                <summary>
                  Do you offer Cash on Delivery?
                  <span>+</span>
                </summary>

                <p>
                  Yes, Cash on Delivery is available nationwide across
                  Pakistan, typically delivered within 2–4 working days.
                </p>
              </details>
            </div>
          </div>
        </section>
      </main>

      <StoreFooter
        ctaTitle="Join 10,000+ customers who trust their skin to ORINOCA NATURAL."
        ctaDescription="Pure & natural, laboratory tested, and made right here in Pakistan."
        ctaButtonText="Order Your Bottle Today"
        ctaHref="/shop"
      />
    </div>
  );
}