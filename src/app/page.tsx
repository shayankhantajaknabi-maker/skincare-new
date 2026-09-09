import Link from "next/link";
import { getHomepageProducts } from "@/lib/homepage-products";
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
  showOnHomepage?: boolean;
  homepageOrder?: number;
};

const ritualMeta = [
  {
    label: "NOURISH",
    text: "Begin with a clean routine and give your skin the botanical care it needs.",
  },
  {
    label: "REVIVE",
    text: "Use consistently and let your ORINOCA NATURAL product become part of your daily ritual.",
  },
  {
    label: "STRENGTHEN",
    text: "Consistency and thoughtful care are the foundation of a healthy-looking routine.",
  },
];

function formatPrice(value: number) {
  return `Rs. ${Number(value).toLocaleString("en-PK", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}`;
}

function formatSaving(value: number) {
  return Number(value).toLocaleString("en-PK", {
    maximumFractionDigits: 0,
  });
}

export default async function HomePage() {
  const products =
    (await getHomepageProducts()) as HomeProduct[];

  const firstProduct =
    products[0];

  const productHref =
    firstProduct
      ? `/products/${firstProduct.slug}`
      : "/shop";

  const ritualProducts =
    products.slice(0, 3);

  const scienceImage =
    firstProduct?.images?.[0] ||
    null;

  return (
    <div className="nm-store">
      <StoreHeader />

      <main>
        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="orinoca-hero">
          <div className="orinoca-hero-grid">
            <div className="orinoca-hero-copy">
              <div className="orinoca-hero-eyebrow">
                <span className="orinoca-eyebrow-line" />

                <span>
                  PURE &amp; NATURAL · LAB TESTED · MADE IN PAKISTAN
                </span>
              </div>

              <h1>
                Skin that glows
                <br />
                the way <em>nature</em>
                <br />
                intended.
              </h1>

              <p className="orinoca-hero-description">
                ORINOCA NATURAL Serum is a botanical serum crafted
                in small batches and independently lab-tested —
                formulated to nourish, repair and bring out your
                skin&apos;s natural radiance, one drop at a time.
              </p>

              <div className="orinoca-hero-actions">
                <Link
                  href={productHref}
                  className="orinoca-hero-primary"
                >
                  Shop the Serum — 20ml
                </Link>

                <Link
                  href={productHref}
                  className="orinoca-hero-secondary"
                >
                  View Product Details
                </Link>
              </div>

              <div className="orinoca-hero-trust">
                <div className="orinoca-trust-item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>

                  <strong>10,000+</strong>
                  <span>Satisfied Customers</span>
                </div>

                <div className="orinoca-trust-item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 3 21 4 21 4s1 5.5-2.1 11.2A7 7 0 0 1 11 20Z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-7.48C9.62 11.85 13 10 18 8" />
                  </svg>

                  <strong>100%</strong>
                  <span>Pure &amp; Natural</span>
                </div>

                <div className="orinoca-trust-item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M9 3h6" />
                    <path d="M10 3v6l-5.5 9.2A1.8 1.8 0 0 0 6 21h12a1.8 1.8 0 0 0 1.5-2.8L14 9V3" />
                    <path d="M7.5 15h9" />
                  </svg>

                  <strong>Lab</strong>
                  <span>Tested Formula</span>
                </div>

                <div className="orinoca-trust-item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 22s8-3.6 8-10V5l-8-3-8 3v7c0 6.4 8 10 8 10Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>

                  <strong>PK</strong>
                  <span>Registered Product</span>
                </div>
              </div>
            </div>

            <div
              className="orinoca-hero-visual"
              role="img"
              aria-label="ORINOCA NATURAL Face Serum"
            />
          </div>

          <svg
            className="orinoca-hero-curve"
            viewBox="0 0 1440 64"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="
                M -10 12
                C 300 48,
                  920 65,
                  1450 8
                L 1450 64
                L -10 64
                Z
              "
              fill="#fffaf3"
            />

            <path
              d="
                M -10 12
                C 300 48,
                  920 65,
                  1450 8
              "
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1"
              opacity="0.75"
            />
          </svg>
        </section>

        {/* =====================================================
            TRUST BAR
        ===================================================== */}

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

              <span>
                Verified for purity &amp; safety
              </span>
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

              <b>
                Registered in Pakistan
              </b>

              <span>
                Manufactured &amp; certified locally
              </span>
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

              <b>
                10,000+ Customers
              </b>

              <span>
                Trusted across Pakistan
              </span>
            </div>

            <div className="nm-trust-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />

                <circle
                  cx="12"
                  cy="12"
                  r="4"
                />
              </svg>

              <b>100% Natural</b>

              <span>
                No harsh chemicals, ever
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            PRODUCTS
        ===================================================== */}

        <section
          className="nm-ref-shop-preview orinoca-home-products"
          id="products"
        >
          <div className="nm-wrap">
            <div className="nm-ref-sec-head">
              <span className="nm-eyebrow">
                Our Collection
              </span>

              <h2>
                Shop ORINOCA NATURAL
              </h2>

              <p>
                Discover carefully selected products
                created for quality, consistency and
                your everyday routine.
              </p>
            </div>

            {products.length > 0 ? (
              <div className="nm-product-grid nm-home-product-grid">
                {products.map((product) => {
                  const image =
                    product.images?.[0];

                  const oldPrice =
                    product.compareAtPrice &&
                      Number(
                        product.compareAtPrice
                      ) > product.price
                      ? Number(
                        product.compareAtPrice
                      )
                      : null;

                  const savingAmount =
                    oldPrice
                      ? Math.max(
                        0,
                        oldPrice -
                        product.price
                      )
                      : 0;

                  const isOnSale =
                    savingAmount > 0;

                  const customBadge =
                    product.badge?.trim() ||
                    "";

                  const displayBadge =
                    customBadge
                      ? customBadge
                      : isOnSale
                        ? `SAVE RS. ${formatSaving(
                          savingAmount
                        )}`
                        : "";

                  return (
                    <article
                      key={String(
                        product._id
                      )}
                      className="nm-home-product-card"
                    >
                      <Link
                        href={`/products/${product.slug}`}
                        className="nm-home-product-image-link"
                        aria-label={`View ${product.name}`}
                      >
                        <div className="nm-home-product-image-area">
                          {displayBadge ? (
                            <span className="nm-home-product-save">
                              {displayBadge}
                            </span>
                          ) : null}

                          {isOnSale ? (
                            <span className="nm-home-product-sale">
                              SALE
                            </span>
                          ) : null}

                          <div className="nm-home-product-visual">
                            {image ? (
                              <img
                                src={image}
                                alt={
                                  product.name
                                }
                                className="nm-home-product-image"
                                loading="lazy"
                              />
                            ) : (
                              <div className="nm-home-product-no-image">
                                ORINOCA
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>

                      <div className="nm-home-product-info">
                        <Link
                          href={`/products/${product.slug}`}
                          className="nm-home-product-name"
                        >
                          {product.name}
                        </Link>

                        <p className="nm-home-product-brand">
                          ORINOCA NATURAL
                        </p>

                        {product.shortDescription ? (
                          <p className="nm-home-product-description">
                            {
                              product.shortDescription
                            }
                          </p>
                        ) : null}

                        <div className="nm-home-product-price-row">
                          {oldPrice ? (
                            <span className="nm-home-product-old-price">
                              {formatPrice(
                                oldPrice
                              )}
                            </span>
                          ) : null}

                          <span
                            className={
                              isOnSale
                                ? "nm-home-product-price nm-home-product-price-sale"
                                : "nm-home-product-price"
                            }
                          >
                            {formatPrice(
                              product.price
                            )}
                          </span>
                        </div>

                        <div className="nm-home-product-actions">
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
                Products will appear here once they are active.
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

        {/* =====================================================
            REVIEWS
        ===================================================== */}

        <section
          className="nm-ref-testimonials orinoca-home-reviews"
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
                A few words from people who made
                ORINOCA NATURAL part of their daily
                routine.
              </p>
            </div>

            <div className="nm-ref-testimonial-grid">
              <article className="nm-ref-testimonial-card">
                <div className="nm-stars">
                  ★★★★★
                </div>

                <p>
                  &quot;My skin feels noticeably softer
                  and more even within a month. A little
                  goes a long way with this dropper.&quot;
                </p>

                <div className="nm-ref-author">
                  <span className="nm-ref-avatar">
                    A
                  </span>

                  <div>
                    <b>Ayesha K.</b>
                    <small>
                      Verified Buyer
                    </small>
                  </div>
                </div>
              </article>

              <article className="nm-ref-testimonial-card">
                <div className="nm-stars">
                  ★★★★★
                </div>

                <p>
                  &quot;Finally a local product that&apos;s
                  actually tested and doesn&apos;t
                  irritate sensitive skin. It&apos;s part
                  of my daily routine now.&quot;
                </p>

                <div className="nm-ref-author">
                  <span className="nm-ref-avatar">
                    H
                  </span>

                  <div>
                    <b>Hamza R.</b>
                    <small>
                      Verified Buyer
                    </small>
                  </div>
                </div>
              </article>

              <article className="nm-ref-testimonial-card">
                <div className="nm-stars">
                  ★★★★★
                </div>

                <p>
                  &quot;Lightweight, absorbs fast, no
                  greasy feel. My dull patches have
                  visibly reduced after consistent
                  use.&quot;
                </p>

                <div className="nm-ref-author">
                  <span className="nm-ref-avatar">
                    S
                  </span>

                  <div>
                    <b>Sana M.</b>
                    <small>
                      Verified Buyer
                    </small>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* =====================================================
            GLOW RITUAL
        ===================================================== */}

        {ritualProducts.length > 0 ? (
          <section className="orinoca-ritual">
            <div className="nm-wrap orinoca-ritual-inner">
              <div className="orinoca-ritual-intro">
                <span className="orinoca-editorial-eyebrow">
                  Glow Ritual
                </span>

                <h2>
                  Your Ritual.
                  <br />
                  Naturally Better.
                </h2>

                <p>
                  Build a simple routine around the
                  ORINOCA NATURAL products already
                  available in your collection.
                </p>

                <Link
                  href="/shop"
                  className="orinoca-ritual-button"
                >
                  Shop the Routine
                  <span>→</span>
                </Link>
              </div>

              <div className="orinoca-ritual-products">
                {ritualProducts.map(
                  (
                    product,
                    index
                  ) => {
                    const meta =
                      ritualMeta[index] ||
                      ritualMeta[
                      ritualMeta.length -
                      1
                      ];

                    const image =
                      product.images?.[0];

                    return (
                      <Link
                        key={String(
                          product._id
                        )}
                        href={`/products/${product.slug}`}
                        className="orinoca-ritual-product"
                      >
                        <span className="orinoca-ritual-number">
                          0{index + 1}
                        </span>

                        <div className="orinoca-ritual-product-photo">
                          <div className="orinoca-ritual-photo-ring" />

                          <div className="orinoca-ritual-photo-core">
                            {image ? (
                              <img
                                src={image}
                                alt={
                                  product.name
                                }
                                loading="lazy"
                                className="orinoca-ritual-product-img"
                              />
                            ) : (
                              <span className="orinoca-ritual-no-image">
                                ORINOCA
                              </span>
                            )}
                          </div>

                          <span className="orinoca-ritual-symbol">
                            {index === 0
                              ? "✦"
                              : index === 1
                                ? "☼"
                                : "❧"}
                          </span>
                        </div>

                        <div className="orinoca-ritual-product-copy">
                          <span className="orinoca-ritual-label">
                            {meta.label}
                          </span>

                          <h3>
                            {product.name}
                          </h3>

                          <p>
                            {product.shortDescription ||
                              meta.text}
                          </p>

                          <strong>
                            View Product →
                          </strong>
                        </div>
                      </Link>
                    );
                  }
                )}
              </div>
            </div>
          </section>
        ) : null}

        {/* =====================================================
            BOTANICAL SCIENCE
        ===================================================== */}

        <section className="orinoca-science">
          <div className="nm-wrap orinoca-science-grid">
            <div className="orinoca-science-copy">
              <span className="orinoca-editorial-eyebrow">
                Botanical Science
              </span>

              <h2>
                Nature Meets
                <br />
                Lab-Tested Care
              </h2>

              <p className="orinoca-science-lead">
                Thoughtful botanical care deserves
                thoughtful formulation. ORINOCA NATURAL
                brings together a nature-led approach,
                quality-focused production and
                independently tested care.
              </p>

              <div className="orinoca-science-points">
                <div>
                  <span className="orinoca-science-point-icon">
                    ❧
                  </span>

                  <strong>
                    Botanical Care
                  </strong>

                  <small>
                    Nature-led daily routine
                  </small>
                </div>

                <div>
                  <span className="orinoca-science-point-icon">
                    ♙
                  </span>

                  <strong>
                    Lab Tested
                  </strong>

                  <small>
                    Quality focused
                  </small>
                </div>

                <div>
                  <span className="orinoca-science-point-icon">
                    ◇
                  </span>

                  <strong>
                    Carefully Made
                  </strong>

                  <small>
                    Purposeful formulations
                  </small>
                </div>

                <div>
                  <span className="orinoca-science-point-icon">
                    ♢
                  </span>

                  <strong>
                    Pakistan Registered
                  </strong>

                  <small>
                    Made locally
                  </small>
                </div>
              </div>
            </div>

            <div className="orinoca-science-visual">
              <div className="orinoca-science-ring orinoca-science-ring-one" />

              <div className="orinoca-science-ring orinoca-science-ring-two" />

              <span className="orinoca-science-leaf leaf-one">
                ❧
              </span>

              <span className="orinoca-science-leaf leaf-two">
                ❧
              </span>

              <span className="orinoca-science-flower flower-one">
                ✿
              </span>

              <span className="orinoca-science-flower flower-two">
                ✾
              </span>

              {scienceImage ? (
                <div className="orinoca-science-product">
                  <img
                    src={scienceImage}
                    alt={
                      firstProduct?.name ||
                      "ORINOCA NATURAL product"
                    }
                    loading="lazy"
                  />
                </div>
              ) : null}

              <div className="orinoca-science-floating-list">
                <div>
                  <span>01</span>

                  <p>
                    <strong>
                      Pure &amp; Natural
                    </strong>

                    <small>
                      Nature-led care
                    </small>
                  </p>
                </div>

                <div>
                  <span>02</span>

                  <p>
                    <strong>
                      Lab Verified
                    </strong>

                    <small>
                      Quality first
                    </small>
                  </p>
                </div>

                <div>
                  <span>03</span>

                  <p>
                    <strong>
                      Gentle Routine
                    </strong>

                    <small>
                      Everyday care
                    </small>
                  </p>
                </div>

                <div>
                  <span>04</span>

                  <p>
                    <strong>
                      Made in Pakistan
                    </strong>

                    <small>
                      Locally crafted
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FAQ
        ===================================================== */}

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
                  Is ORINOCA NATURAL Serum suitable for
                  all skin types?

                  <span>+</span>
                </summary>

                <p>
                  Yes. The formula is made from natural,
                  lab-tested ingredients and is gentle
                  enough for normal, dry, and combination
                  skin. If you have known sensitivities,
                  we recommend a small patch test first.
                </p>
              </details>

              <details>
                <summary>
                  How long until I see results?

                  <span>+</span>
                </summary>

                <p>
                  Most customers notice softer, more
                  even-toned skin within 2–3 weeks of
                  consistent morning and night use.
                </p>
              </details>

              <details>
                <summary>
                  Do you offer Cash on Delivery?

                  <span>+</span>
                </summary>

                <p>
                  Yes, Cash on Delivery is available
                  nationwide across Pakistan, typically
                  delivered within 2–4 working days.
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

      <style>{`

        /* =====================================================
           HERO
        ===================================================== */

        /*
         * HERO ONLY FIX
         *
         * Rest of homepage intentionally untouched.
         * These width resets stop any older/global rule
         * from restricting the hero grid and creating
         * the blank white strip on the right side.
         */

        .nm-store main > .orinoca-hero {
          position: relative !important;
          display: block !important;

          box-sizing: border-box !important;

          width: 100vw !important;
          min-width: 100vw !important;
          max-width: none !important;

          height: 520px !important;

          left: auto !important;
          right: auto !important;

          margin:
            0 0 14px
            calc(50% - 50vw) !important;

          padding: 0 !important;

          overflow: hidden !important;

          background: #ffffff !important;

          border: 0 !important;
          border-radius: 0 !important;

          box-shadow: none !important;

          transform: none !important;
        }

        .nm-store
        main
        >
        .orinoca-hero
        >
        .orinoca-hero-grid {
          position: absolute !important;

          inset: 0 !important;

          display: grid !important;

          box-sizing: border-box !important;

          width: 100% !important;
          min-width: 100% !important;
          max-width: none !important;

          height: 100% !important;
          min-height: 100% !important;
          max-height: none !important;

          grid-template-columns:
            minmax(0, 50%)
            minmax(0, 50%) !important;

          margin: 0 !important;
          padding: 0 !important;

          overflow: hidden !important;

          transform: none !important;
        }

        .orinoca-hero-copy {
          position: relative !important;
          z-index: 5;

          display: flex !important;

          width: 100% !important;
          min-width: 0 !important;
          max-width: none !important;

          height: 100% !important;

          box-sizing: border-box !important;

          flex-direction: column;

          justify-content: center;

          margin: 0 !important;

          padding:
            30px
            clamp(32px, 4vw, 64px)
            62px
            clamp(58px, 7.5vw, 112px);

          background: #ffffff;
        }

        .orinoca-hero-eyebrow {
          display: flex;
          align-items: center;

          gap: 11px;

          margin-bottom: 16px;

          color: #006557;

          font-size: 9px;
          font-weight: 700;

          letter-spacing: 0.16em;

          text-transform: uppercase;
        }

        .orinoca-eyebrow-line {
          display: block;

          width: 24px;
          height: 1px;

          flex: 0 0 24px;

          background: #d7a334;
        }

        .orinoca-hero-copy h1 {
          max-width: 470px;

          margin: 0 0 16px;

          color: #064d40;

          font-family:
            var(--font-display),
            Georgia,
            serif !important;

          font-size:
            clamp(
              43px,
              3.7vw,
              54px
            );

          font-weight: 450;

          line-height: 0.97;

          letter-spacing: -0.045em;
        }

        .orinoca-hero-copy h1 em {
          font-weight: 400;
          font-style: italic;
        }

        .orinoca-hero-description {
          max-width: 430px;

          margin: 0;

          color: #363b38;

          font-size: 11.5px;

          line-height: 1.5;
        }

        .orinoca-hero-actions {
          display: flex;
          align-items: center;

          flex-wrap: wrap;

          gap: 13px;

          margin-top: 18px;
        }

        .orinoca-hero-primary,
        .orinoca-hero-secondary {
          display: inline-flex;

          min-height: 38px;

          box-sizing: border-box;

          align-items: center;
          justify-content: center;

          border: 1px solid #006557;

          border-radius: 999px;

          padding:
            9px 20px;

          background: #006557;

          color: #ffffff !important;

          font-size: 10.5px;

          font-weight: 600;

          text-decoration: none;

          box-shadow:
            0 7px 16px
            rgba(
              0,
              101,
              87,
              0.14
            );
        }

        .orinoca-hero-primary:hover,
        .orinoca-hero-secondary:hover {
          background: #004e43;
        }

        .orinoca-hero-trust {
          display: grid;

          width: 100%;
          max-width: 440px;

          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );

          gap: 9px;

          margin-top: 20px;
        }

        .orinoca-trust-item {
          display: flex;

          min-width: 0;

          flex-direction: column;

          align-items: center;

          text-align: center;
        }

        .orinoca-trust-item svg {
          display: block;

          width: 20px;
          height: 20px;

          margin-bottom: 3px;

          color: #047568;
        }

        .orinoca-trust-item strong {
          color: #2f3532;

          font-size: 9.5px;
        }

        .orinoca-trust-item span {
          max-width: 80px;

          margin-top: 2px;

          color: #505653;

          font-size: 7.5px;
        }

        .nm-store
        main
        >
        .orinoca-hero
        .orinoca-hero-visual {
          position: relative !important;
          z-index: 2;

          display: block !important;

          width: 100% !important;
          min-width: 100% !important;
          max-width: none !important;

          height: 100% !important;
          min-height: 100% !important;

          box-sizing: border-box !important;

          margin: 0 !important;
          padding: 0 !important;

          overflow: hidden !important;

          background-color: #f1d8bd !important;

          background-image:
            url("/orinoca-hero-approved-right.webp") !important;

          background-repeat:
            no-repeat !important;

          background-size:
            cover !important;

          background-position:
            53% center !important;

          transform: none !important;
        }

        .orinoca-hero-visual::before {
          position: absolute;

          z-index: 5;

          top: 0;
          bottom: 0;
          left: 0;

          width: 92px;

          content: "";

          pointer-events: none;

          background:
            linear-gradient(
              90deg,
              #ffffff 0%,
              rgba(255,255,255,0.96) 10%,
              rgba(255,255,255,0.78) 30%,
              rgba(255,255,255,0.46) 53%,
              rgba(255,255,255,0.15) 76%,
              transparent 100%
            );
        }

        .nm-store
        main
        >
        .orinoca-hero
        >
        .orinoca-hero-curve {
          position: absolute !important;

          z-index: 20 !important;

          bottom: -1px !important;
          left: 50% !important;

          display: block !important;

          width: 100vw !important;
          min-width: 100vw !important;
          max-width: none !important;

          height: 53px !important;

          margin: 0 !important;
          padding: 0 !important;

          transform:
            translateX(-50%) !important;

          pointer-events: none;
        }


        /* =====================================================
           PRODUCTS
        ===================================================== */

        .nm-store
        .orinoca-home-products {
          padding-top:
            50px !important;

          padding-bottom:
            50px !important;
        }

        .nm-store
        .orinoca-home-products
        .nm-home-product-grid {
          display: grid !important;

          width: 100% !important;

          max-width:
            1000px !important;

          grid-template-columns:
            repeat(
              auto-fit,
              minmax(
                270px,
                300px
              )
            ) !important;

          justify-content:
            center !important;

          gap:
            22px !important;

          margin:
            34px auto
            0 !important;
        }


        /* =====================================================
           PRODUCT CARD
        ===================================================== */

        .nm-store
        .orinoca-home-products
        .nm-home-product-card {
          display: flex !important;

          width: 100% !important;

          max-width:
            300px !important;

          flex-direction:
            column !important;

          overflow:
            hidden !important;

          border:
            1px solid
            rgba(
              7,
              60,
              49,
              0.09
            ) !important;

          border-radius:
            22px !important;

          background:
            #ffffff !important;

          box-shadow:
            0 16px 38px
            rgba(
              18,
              53,
              41,
              0.075
            ) !important;

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease !important;
        }

        .nm-store
        .orinoca-home-products
        .nm-home-product-card:hover {
          transform:
            translateY(-5px) !important;

          box-shadow:
            0 24px 48px
            rgba(
              18,
              53,
              41,
              0.12
            ) !important;
        }

        .nm-store
        .orinoca-home-products
        .nm-home-product-image-link {
          display: block !important;

          width: 100% !important;

          text-decoration:
            none !important;
        }


        /* =====================================================
           PRODUCT IMAGE — FINAL
        ===================================================== */

        .nm-store
        .orinoca-home-products
        .nm-home-product-image-area {
          position:
            relative !important;

          display:
            flex !important;

          width:
            100% !important;

          height:
            235px !important;

          min-height:
            235px !important;

          box-sizing:
            border-box !important;

          align-items:
            center !important;

          justify-content:
            center !important;

          overflow:
            hidden !important;

          padding:
            8px 14px !important;

          background:
            #ffffff !important;
        }

        .nm-store
        .orinoca-home-products
        .nm-home-product-visual {
          display:
            flex !important;

          width:
            100% !important;

          height:
            215px !important;

          align-items:
            center !important;

          justify-content:
            center !important;

          overflow:
            visible !important;

          background:
            #ffffff !important;
        }

        /*
         * Important:
         *
         * - No square drop-shadow.
         * - No stretched width/height.
         * - Natural proportion.
         * - Product slightly zoomed.
         */

        .nm-store
        .orinoca-home-products
        .nm-home-product-image {
          display:
            block !important;

          width:
            auto !important;

          height:
            auto !important;

          max-width:
            88% !important;

          max-height:
            205px !important;

          margin:
            auto !important;

          object-fit:
            contain !important;

          object-position:
            center center !important;

          background:
            transparent !important;

          filter:
            none !important;

          mix-blend-mode:
            normal !important;

          transform:
            scale(1.22) !important;

          transform-origin:
            center center !important;

          transition:
            transform 0.28s ease !important;
        }

        .nm-store
        .orinoca-home-products
        .nm-home-product-card:hover
        .nm-home-product-image {
          transform:
            scale(1.27) !important;
        }

        .nm-home-product-no-image {
          display: grid;

          width: 130px;
          height: 150px;

          place-items: center;

          border:
            1px solid
            rgba(
              0,
              91,
              76,
              0.10
            );

          border-radius: 18px;

          color: #54766c;

          font-size: 11px;

          font-weight: 700;

          letter-spacing:
            0.12em;
        }


        /* =====================================================
           PRODUCT BADGES
        ===================================================== */

        .nm-store
        .orinoca-home-products
        .nm-home-product-save {
          position:
            absolute !important;

          z-index:
            8 !important;

          top:
            0 !important;

          left:
            0 !important;

          border-radius:
            0 0
            11px 0 !important;
        }

        .nm-store
        .orinoca-home-products
        .nm-home-product-sale {
          position:
            absolute !important;

          z-index:
            8 !important;

          bottom:
            12px !important;

          left:
            13px !important;
        }


        /* =====================================================
           PRODUCT INFO
        ===================================================== */

        .nm-store
        .orinoca-home-products
        .nm-home-product-info {
          display:
            flex !important;

          width:
            100% !important;

          box-sizing:
            border-box !important;

          flex-direction:
            column !important;

          align-items:
            center !important;

          padding:
            15px
            18px
            18px !important;

          text-align:
            center !important;

          background:
            #ffffff !important;
        }

        .nm-store
        .orinoca-home-products
        .nm-home-product-name {
          color:
            #073f34 !important;

          font-size:
            15px !important;

          font-weight:
            700 !important;

          text-decoration:
            none !important;
        }

        .nm-store
        .orinoca-home-products
        .nm-home-product-brand {
          margin:
            7px 0
            0 !important;

          color:
            #638f84 !important;

          font-size:
            9px !important;

          font-weight:
            700 !important;

          letter-spacing:
            0.18em !important;
        }

        .nm-store
        .orinoca-home-products
        .nm-home-product-description {
          display:
            -webkit-box !important;

          width:
            100% !important;

          min-height:
            32px !important;

          margin:
            6px 0
            0 !important;

          overflow:
            hidden !important;

          color:
            #606965 !important;

          font-size:
            10px !important;

          line-height:
            1.45 !important;

          -webkit-line-clamp:
            2 !important;

          -webkit-box-orient:
            vertical !important;
        }

        .nm-store
        .orinoca-home-products
        .nm-home-product-price-row {
          display:
            flex !important;

          min-height:
            25px !important;

          align-items:
            center !important;

          justify-content:
            center !important;

          flex-wrap:
            wrap !important;

          gap:
            7px !important;

          margin-top:
            11px !important;
        }

        .nm-store
        .orinoca-home-products
        .nm-home-product-old-price {
          font-size:
            10px !important;
        }

        .nm-store
        .orinoca-home-products
        .nm-home-product-price {
          font-size:
            17px !important;

          font-weight:
            700 !important;
        }

        .nm-store
        .orinoca-home-products
        .nm-home-product-actions {
          display:
            grid !important;

          width:
            100% !important;

          grid-template-columns:
            repeat(
              2,
              1fr
            ) !important;

          gap:
            8px !important;

          margin-top:
            12px !important;
        }

        .nm-store
        .orinoca-home-products
        .nm-home-product-actions
        .nm-btn {
          display:
            inline-flex !important;

          width:
            100% !important;

          min-height:
            39px !important;

          align-items:
            center !important;

          justify-content:
            center !important;

          padding:
            9px 10px !important;

          font-size:
            10px !important;
        }


        /* =====================================================
           REVIEWS
        ===================================================== */

        .nm-store
        .orinoca-home-reviews {
          margin-top:
            0 !important;

          padding-top:
            58px !important;

          padding-bottom:
            64px !important;
        }


        /* =====================================================
           EDITORIAL LABEL
        ===================================================== */

        .orinoca-editorial-eyebrow {
          display:
            inline-flex;

          align-items:
            center;

          gap:
            10px;

          color:
            #006557;

          font-size:
            10px;

          font-weight:
            700;

          letter-spacing:
            0.20em;

          text-transform:
            uppercase;
        }

        .orinoca-editorial-eyebrow::before {
          width:
            24px;

          height:
            1px;

          content:
            "";

          background:
            #d4af37;
        }


        /* =====================================================
           GLOW RITUAL
        ===================================================== */

        .orinoca-ritual {
          position:
            relative;

          overflow:
            hidden;

          padding:
            58px 0;

          background:
            linear-gradient(
              115deg,
              #f7f3e9 0%,
              #fcfaf4 52%,
              #efe8d8 100%
            );
        }

        .orinoca-ritual::before {
          position:
            absolute;

          top:
            -210px;

          right:
            -170px;

          width:
            420px;

          height:
            420px;

          border:
            1px solid
            rgba(
              212,
              175,
              55,
              0.18
            );

          border-radius:
            50%;

          content:
            "";
        }

        .orinoca-ritual::after {
          position:
            absolute;

          bottom:
            -250px;

          left:
            -180px;

          width:
            410px;

          height:
            410px;

          border:
            1px solid
            rgba(
              0,
              91,
              76,
              0.08
            );

          border-radius:
            50%;

          content:
            "";
        }

        .orinoca-ritual-inner {
          position:
            relative;

          z-index:
            2;

          display:
            grid;

          max-width:
            1120px !important;

          grid-template-columns:
            minmax(
              250px,
              0.58fr
            )
            minmax(
              0,
              1.42fr
            );

          gap:
            30px;

          align-items:
            center;
        }

        .orinoca-ritual-intro h2 {
          max-width:
            330px;

          margin:
            12px 0
            14px;

          color:
            #073f34;

          font-family:
            var(--font-display),
            Georgia,
            serif;

          font-size:
            clamp(
              38px,
              3vw,
              47px
            );

          font-weight:
            450;

          line-height:
            0.98;

          letter-spacing:
            -0.04em;
        }

        .orinoca-ritual-intro p {
          max-width:
            315px;

          margin:
            0;

          color:
            #5c625e;

          font-size:
            12px;

          line-height:
            1.65;
        }

        .orinoca-ritual-button {
          display:
            inline-flex;

          min-height:
            44px;

          align-items:
            center;

          justify-content:
            center;

          gap:
            30px;

          margin-top:
            22px;

          border-radius:
            10px;

          padding:
            11px 18px;

          background:
            #005b4c;

          color:
            #ffffff !important;

          font-size:
            11px;

          font-weight:
            700;

          text-decoration:
            none;

          box-shadow:
            0 10px 22px
            rgba(
              0,
              91,
              76,
              0.13
            );
        }

        .orinoca-ritual-products {
          display:
            grid;

          width:
            100%;

          max-width:
            760px;

          grid-template-columns:
            repeat(
              auto-fit,
              minmax(
                230px,
                1fr
              )
            );

          gap:
            16px;
        }

        .orinoca-ritual-product {
          position:
            relative;

          display:
            flex;

          min-height:
            365px;

          flex-direction:
            column;

          align-items:
            center;

          overflow:
            hidden;

          border:
            1px solid
            rgba(
              212,
              175,
              55,
              0.55
            );

          border-radius:
            24px;

          padding:
            18px
            18px
            20px;

          background:
            rgba(
              255,
              255,
              255,
              0.88
            );

          color:
            inherit;

          text-align:
            center;

          text-decoration:
            none;

          box-shadow:
            0 16px 38px
            rgba(
              40,
              65,
              53,
              0.06
            );
        }

        .orinoca-ritual-product:hover {
          transform:
            translateY(-4px);

          box-shadow:
            0 22px 42px
            rgba(
              40,
              65,
              53,
              0.10
            );
        }

        .orinoca-ritual-number {
          position:
            absolute;

          z-index:
            4;

          top:
            14px;

          left:
            16px;

          color:
            #dfbd5b;

          font-family:
            Georgia,
            serif;

          font-size:
            29px;
        }


        /* =====================================================
           RITUAL PRODUCT IMAGE — FINAL
        ===================================================== */

        .orinoca-ritual-product-photo {
          position:
            relative !important;

          display:
            flex !important;

          width:
            188px !important;

          height:
            188px !important;

          flex:
            0 0
            188px !important;

          align-items:
            center !important;

          justify-content:
            center !important;

          margin:
            4px auto
            14px !important;
        }

        .orinoca-ritual-photo-ring {
          position:
            absolute !important;

          inset:
            0 !important;

          border:
            1px solid
            rgba(
              212,
              175,
              55,
              0.72
            ) !important;

          border-radius:
            50% !important;

          background:
            radial-gradient(
              circle at 50% 42%,
              #ffffff 0%,
              #fbf8f0 62%,
              #f0e7d6 100%
            ) !important;

          box-shadow:
            inset 0 0 0 8px
            rgba(
              255,
              255,
              255,
              0.45
            ) !important;
        }

        .orinoca-ritual-photo-core {
          position:
            relative !important;

          z-index:
            2 !important;

          display:
            flex !important;

          width:
            158px !important;

          height:
            158px !important;

          box-sizing:
            border-box !important;

          align-items:
            center !important;

          justify-content:
            center !important;

          overflow:
            hidden !important;

          border-radius:
            50% !important;

          padding:
            5px !important;

          background:
            #ffffff !important;
        }

        /*
         * Product large but full bottle visible.
         *
         * Drop-shadow removed so no
         * fake rectangular white box.
         */

        .orinoca-ritual-product-img {
          display:
            block !important;

          width:
            auto !important;

          height:
            auto !important;

          max-width:
            92% !important;

          max-height:
            148px !important;

          margin:
            auto !important;

          object-fit:
            contain !important;

          object-position:
            center center !important;

          background:
            transparent !important;

          filter:
            none !important;

          mix-blend-mode:
            normal !important;

          transform:
            scale(1.13) !important;

          transform-origin:
            center center !important;
        }

        .orinoca-ritual-no-image {
          color:
            #6d8179;

          font-size:
            9px;

          font-weight:
            700;

          letter-spacing:
            0.1em;
        }

        .orinoca-ritual-symbol {
          position:
            absolute;

          z-index:
            3;

          top:
            0 !important;

          right:
            2px !important;

          display:
            flex;

          width:
            42px !important;

          height:
            42px !important;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            50%;

          background:
            #005b4c;

          color:
            #ffffff;

          font-size:
            17px;
        }

        .orinoca-ritual-product-copy {
          display:
            flex;

          flex-direction:
            column;

          align-items:
            center;
        }

        .orinoca-ritual-label {
          color:
            #82785f;

          font-size:
            8px;

          font-weight:
            700;

          letter-spacing:
            0.22em;
        }

        .orinoca-ritual-product-copy h3 {
          margin:
            6px 0
            8px;

          color:
            #073f34;

          font-family:
            var(--font-display),
            Georgia,
            serif;

          font-size:
            20px;

          font-weight:
            500;
        }

        .orinoca-ritual-product-copy p {
          display:
            -webkit-box;

          max-width:
            225px;

          margin:
            0;

          overflow:
            hidden;

          color:
            #656a66;

          font-size:
            9.5px;

          line-height:
            1.5;

          -webkit-line-clamp:
            3;

          -webkit-box-orient:
            vertical;
        }

        .orinoca-ritual-product-copy strong {
          margin-top:
            14px;

          color:
            #005b4c;

          font-size:
            9.5px;
        }


        /* =====================================================
           BOTANICAL SCIENCE
        ===================================================== */

        .orinoca-science {
          position:
            relative;

          overflow:
            hidden;

          padding:
            76px 0;

          background:
            #f8f5ed;
        }

        .orinoca-science-grid {
          display:
            grid;

          grid-template-columns:
            0.9fr
            1.1fr;

          gap:
            65px;

          align-items:
            center;
        }

        .orinoca-science-copy h2 {
          margin:
            14px 0
            18px;

          color:
            #073f34;

          font-family:
            var(--font-display),
            Georgia,
            serif;

          font-size:
            clamp(
              40px,
              3.5vw,
              54px
            );

          font-weight:
            450;

          line-height:
            1;

          letter-spacing:
            -0.04em;
        }

        .orinoca-science-lead {
          max-width:
            470px;

          margin:
            0;

          color:
            #5d625e;

          font-size:
            13px;

          line-height:
            1.75;
        }

        .orinoca-science-points {
          display:
            grid;

          max-width:
            520px;

          grid-template-columns:
            repeat(
              2,
              1fr
            );

          gap:
            24px 28px;

          margin-top:
            30px;
        }

        .orinoca-science-points > div {
          display:
            grid;

          grid-template-columns:
            38px 1fr;

          align-items:
            center;

          column-gap:
            10px;
        }

        .orinoca-science-point-icon {
          display:
            flex;

          width:
            36px;

          height:
            36px;

          grid-row:
            1 / 3;

          align-items:
            center;

          justify-content:
            center;

          border:
            1px solid
            rgba(
              0,
              91,
              76,
              0.18
            );

          border-radius:
            12px;

          background:
            #ffffff;

          color:
            #006557;

          font-size:
            18px;
        }

        .orinoca-science-points strong {
          color:
            #173e34;

          font-size:
            11px;
        }

        .orinoca-science-points small {
          color:
            #777d78;

          font-size:
            9px;
        }

        .orinoca-science-visual {
          position:
            relative;

          min-height:
            440px;

          overflow:
            hidden;

          border:
            1px solid
            rgba(
              212,
              175,
              55,
              0.24
            );

          border-radius:
            34px;

          background:
            radial-gradient(
              circle at 44% 46%,
              #fffdf7 0%,
              #efe8d7 48%,
              #e5ddca 100%
            );
        }

        .orinoca-science-ring {
          position:
            absolute;

          border:
            1px solid
            rgba(
              212,
              175,
              55,
              0.38
            );

          border-radius:
            50%;
        }

        .orinoca-science-ring-one {
          top:
            65px;

          left:
            65px;

          width:
            300px;

          height:
            300px;
        }

        .orinoca-science-ring-two {
          top:
            105px;

          left:
            105px;

          width:
            220px;

          height:
            220px;
        }

        .orinoca-science-product {
          position:
            absolute;

          z-index:
            4;

          top:
            40px;

          left:
            68px;

          display:
            flex;

          width:
            290px;

          height:
            350px;

          align-items:
            center;

          justify-content:
            center;
        }

        .orinoca-science-product img {
          display:
            block;

          width:
            auto;

          height:
            auto;

          max-width:
            78%;

          max-height:
            320px;

          object-fit:
            contain;

          object-position:
            center;

          filter:
            drop-shadow(
              0 20px 18px
              rgba(
                67,
                54,
                33,
                0.16
              )
            );
        }

        .orinoca-science-leaf,
        .orinoca-science-flower {
          position:
            absolute;

          z-index:
            2;

          color:
            rgba(
              4,
              117,
              104,
              0.58
            );
        }

        .leaf-one {
          top:
            36px;

          left:
            25px;

          font-size:
            68px;

          transform:
            rotate(-35deg);
        }

        .leaf-two {
          right:
            28px;

          bottom:
            15px;

          font-size:
            92px;

          transform:
            rotate(24deg);
        }

        .flower-one {
          bottom:
            22px;

          left:
            28px;

          color:
            rgba(
              212,
              175,
              55,
              0.55
            );

          font-size:
            54px;
        }

        .flower-two {
          top:
            24px;

          right:
            42px;

          color:
            rgba(
              212,
              175,
              55,
              0.45
            );

          font-size:
            44px;
        }

        .orinoca-science-floating-list {
          position:
            absolute;

          z-index:
            6;

          top:
            45px;

          right:
            25px;

          display:
            grid;

          width:
            205px;

          gap:
            8px;
        }

        .orinoca-science-floating-list > div {
          display:
            flex;

          align-items:
            center;

          gap:
            10px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.70
            );

          border-radius:
            15px;

          padding:
            11px 12px;

          background:
            rgba(
              255,
              255,
              255,
              0.82
            );
        }

        .orinoca-science-floating-list
        >
        div
        >
        span {
          display:
            flex;

          width:
            29px;

          height:
            29px;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            50%;

          background:
            #005b4c;

          color:
            #ffffff;

          font-size:
            8px;

          font-weight:
            700;
        }

        .orinoca-science-floating-list p {
          display:
            flex;

          margin:
            0;

          flex-direction:
            column;
        }

        .orinoca-science-floating-list strong {
          color:
            #173e34;

          font-size:
            9px;
        }

        .orinoca-science-floating-list small {
          margin-top:
            2px;

          color:
            #7d827e;

          font-size:
            7.5px;
        }


        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 900px) {

          .nm-store main > .orinoca-hero {
            height:
              auto !important;
          }

          .nm-store
          main
          >
          .orinoca-hero
          >
          .orinoca-hero-grid {
            position:
              relative !important;

            inset:
              auto !important;

            display:
              block !important;

            width:
              100% !important;

            min-width:
              100% !important;

            max-width:
              none !important;

            height:
              auto !important;

            min-height:
              0 !important;

            grid-template-columns:
              1fr !important;

            overflow:
              hidden !important;
          }

          .orinoca-hero-copy {
            align-items:
              center;

            width:
              100% !important;

            height:
              auto !important;

            padding:
              40px
              28px
              48px;

            text-align:
              center;
          }

          .nm-store
          main
          >
          .orinoca-hero
          .orinoca-hero-visual {
            width:
              100% !important;

            min-width:
              100% !important;

            height:
              420px !important;

            min-height:
              420px !important;

            background-position:
              center center !important;
          }

          .orinoca-hero-actions {
            justify-content:
              center;
          }

          .orinoca-hero-trust {
            margin-right:
              auto;

            margin-left:
              auto;
          }


          /* Product cards */

          .nm-store
          .orinoca-home-products
          .nm-home-product-image {
            max-width:
              88% !important;

            max-height:
              198px !important;

            transform:
              scale(1.18) !important;
          }


          /* Ritual */

          .orinoca-ritual-inner {
            grid-template-columns:
              1fr;

            gap:
              30px;
          }

          .orinoca-ritual-intro {
            text-align:
              center;
          }

          .orinoca-ritual-intro h2,
          .orinoca-ritual-intro p {
            margin-right:
              auto;

            margin-left:
              auto;
          }

          .orinoca-ritual-products {
            max-width:
              650px;

            margin:
              0 auto;
          }

          .orinoca-ritual-product-photo {
            width:
              180px !important;

            height:
              180px !important;

            flex-basis:
              180px !important;
          }

          .orinoca-ritual-photo-core {
            width:
              152px !important;

            height:
              152px !important;
          }

          .orinoca-ritual-product-img {
            max-width:
              92% !important;

            max-height:
              142px !important;

            transform:
              scale(1.1) !important;
          }


          /* Science */

          .orinoca-science-grid {
            grid-template-columns:
              1fr;

            gap:
              42px;
          }

          .orinoca-science-copy {
            text-align:
              center;
          }

          .orinoca-science-lead,
          .orinoca-science-points {
            margin-right:
              auto;

            margin-left:
              auto;
          }

          .orinoca-science-visual {
            width:
              100%;

            max-width:
              680px;

            margin:
              0 auto;
          }
        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 640px) {

          .orinoca-hero-copy {
            padding:
              30px
              18px
              42px;
          }

          .orinoca-hero-copy h1 {
            font-size:
              clamp(
                37px,
                11.5vw,
                46px
              );
          }

          .orinoca-hero-actions {
            width:
              100%;

            flex-direction:
              column;
          }

          .orinoca-hero-primary,
          .orinoca-hero-secondary {
            width:
              100%;
          }

          .orinoca-hero-trust {
            grid-template-columns:
              repeat(
                2,
                1fr
              );

            gap:
              18px 12px;
          }

          .nm-store
          main
          >
          .orinoca-hero
          .orinoca-hero-visual {
            height:
              350px !important;

            min-height:
              350px !important;
          }


          /* Products */

          .nm-store
          .orinoca-home-products
          .nm-home-product-grid {
            max-width:
              315px !important;

            grid-template-columns:
              1fr !important;
          }

          .nm-store
          .orinoca-home-products
          .nm-home-product-card {
            max-width:
              315px !important;
          }

          .nm-store
          .orinoca-home-products
          .nm-home-product-image-area {
            height:
              230px !important;

            min-height:
              230px !important;
          }

          .nm-store
          .orinoca-home-products
          .nm-home-product-visual {
            height:
              210px !important;
          }

          .nm-store
          .orinoca-home-products
          .nm-home-product-image {
            max-width:
              88% !important;

            max-height:
              198px !important;

            transform:
              scale(1.16) !important;
          }

          .nm-store
          .orinoca-home-products
          .nm-home-product-card:hover
          .nm-home-product-image {
            transform:
              scale(1.18) !important;
          }


          /* Ritual */

          .orinoca-ritual-products {
            max-width:
              350px;

            grid-template-columns:
              1fr;
          }

          .orinoca-ritual-product-photo {
            width:
              176px !important;

            height:
              176px !important;

            flex-basis:
              176px !important;
          }

          .orinoca-ritual-photo-core {
            width:
              148px !important;

            height:
              148px !important;
          }

          .orinoca-ritual-product-img {
            max-width:
              92% !important;

            max-height:
              138px !important;

            transform:
              scale(1.08) !important;
          }


          /* Science */

          .orinoca-science {
            padding:
              56px 0;
          }

          .orinoca-science-points {
            grid-template-columns:
              1fr;

            max-width:
              320px;
          }

          .orinoca-science-visual {
            min-height:
              610px;
          }

          .orinoca-science-product {
            top:
              35px;

            left:
              50%;

            width:
              260px;

            height:
              300px;

            transform:
              translateX(-50%);
          }

          .orinoca-science-product img {
            max-height:
              270px;
          }

          .orinoca-science-floating-list {
            top:
              auto;

            right:
              18px;

            bottom:
              20px;

            left:
              18px;

            width:
              auto;

            grid-template-columns:
              1fr 1fr;
          }
        }


        @media (max-width: 430px) {

          .nm-store
          main
          >
          .orinoca-hero
          .orinoca-hero-visual {
            height:
              310px !important;

            min-height:
              310px !important;
          }

          .orinoca-science-visual {
            min-height:
              660px;
          }

          .orinoca-science-floating-list {
            grid-template-columns:
              1fr;
          }
        }

      `}</style>
    </div>
  );
}