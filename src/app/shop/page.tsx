import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import StoreFooter from "../store-footer";
import StoreHeader from "../store-header";

export const dynamic = "force-dynamic";

type PackType =
  | "single"
  | "twin"
  | "family";

type StoreProduct = {
  _id: unknown;
  name: string;
  slug: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number | null;
  images?: string[];
  packType?: PackType;
  units?: number;
  badge?: string;
};

const packOrder: Record<PackType, number> = {
  single: 1,
  twin: 2,
  family: 3,
};

const defaultBadge: Record<PackType, string> = {
  single: "POPULAR",
  twin: "BEST VALUE",
  family: "SAVE MORE",
};

function formatPrice(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

export default async function ShopPage() {
  await connectToDatabase();

  const rawProducts = (
    await Product.find({
      isActive: true,
    })
      .sort({
        createdAt: 1,
      })
      .lean()
  ) as unknown as StoreProduct[];

  const products = [...rawProducts].sort(
    (first, second) => {
      const firstPack =
        first.packType || "single";

      const secondPack =
        second.packType || "single";

      return (
        packOrder[firstPack] -
        packOrder[secondPack]
      );
    }
  );

  return (
    <div className="nm-store">
      <StoreHeader />

      <main>
        <section className="nm-page-hero">
          <div className="nm-wrap">
            <div className="nm-breadcrumb">
              <Link href="/">
                Home
              </Link>

              <span>/</span>
              <span>Shop</span>
            </div>

            <div className="mt-5">
              <span className="nm-eyebrow">
                The Collection
              </span>
            </div>

            <h1>
              Shop ORINOCA NATURAL
            </h1>

            <p className="mx-auto mt-4 max-w-[520px] text-[15.5px] leading-7 text-[#5c5c58]">
              Pure and natural serum,
              available as a single bottle
              or as a bundle for
              uninterrupted daily use.
            </p>
          </div>
        </section>

        <section className="nm-trust-strip">
          <div className="nm-wrap nm-trust-grid">
            <article className="nm-trust-item">
              <span className="nm-trust-icon">
                ♧
              </span>

              <h2
                style={{
                  color: "#ffffff",
                }}
              >
                Laboratory Tested
              </h2>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.82)",
                }}
              >
                Verified for purity &amp;
                safety
              </p>
            </article>

            <article className="nm-trust-item">
              <span className="nm-trust-icon">
                ♢
              </span>

              <h2
                style={{
                  color: "#ffffff",
                }}
              >
                Registered in Pakistan
              </h2>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.82)",
                }}
              >
                Manufactured &amp;
                certified locally
              </p>
            </article>

            <article className="nm-trust-item">
              <span className="nm-trust-icon">
                ♡
              </span>

              <h2
                style={{
                  color: "#ffffff",
                }}
              >
                10,000+ Customers
              </h2>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.82)",
                }}
              >
                Trusted across Pakistan
              </p>
            </article>

            <article className="nm-trust-item">
              <span className="nm-trust-icon">
                ≡
              </span>

              <h2>Cash on Delivery</h2>

              <p>Nationwide, 2–4 working days</p>
            </article>
          </div>
        </section>

        <section className="nm-shop-section" id="products">
          <div className="nm-wrap">
            <div className="nm-shop-toolbar">
              <span className="text-[13.5px] text-[#6a6a67]">
                {products.length}{" "}
                {products.length === 1
                  ? "product"
                  : "products"}
              </span>

              <div className="flex items-center gap-3">
                <span className="nm-eyebrow">
                  Sort
                </span>

                <select
                  className="rounded-full border border-[#c7d7d2] bg-white px-5 py-3 text-sm text-[#123529] outline-none"
                  defaultValue="popular"
                >
                  <option value="popular">
                    Most Popular
                  </option>

                  <option value="low">
                    Price: Low to High
                  </option>

                  <option value="high">
                    Price: High to Low
                  </option>
                </select>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="rounded-[22px] border border-[#e7e1d6] bg-white px-6 py-16 text-center">
                <h2 className="font-serif text-3xl text-[#123529]">
                  Products are coming soon
                </h2>

                <p className="mt-3 text-[#6a6a67]">
                  Please check back shortly.
                </p>
              </div>
            ) : (
              <div className="nm-product-grid">
                {products.map(
                  (product) => {
                    const packType =
                      product.packType ||
                      "single";

                    const units =
                      product.units ||
                      packOrder[packType];

                    const image =
                      product.images?.[0];

                    const oldPrice =
                      product.compareAtPrice &&
                      product.compareAtPrice >
                        product.price
                        ? product.compareAtPrice
                        : null;

                    return (
                      <article
                        key={String(
                          product._id
                        )}
                        className="nm-product-card"
                      >
                        <div className="nm-product-thumb">
                          <span className="nm-product-tag">
                            {product.badge ||
                              defaultBadge[
                                packType
                              ]}
                          </span>

                          {image ? (
                            <img
                              src={image}
                              alt={
                                product.name
                              }
                              loading="lazy"
                            />
                          ) : (
                            <div className="nm-product-image-fallback">
                              NM
                              <span>
                                Skin Care
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="nm-product-body">
                          <div className="nm-stars">
                            ★★★★★
                          </div>

                          <h2>
                            {product.name}
                          </h2>

                          <p className="nm-product-description">
                            {product.shortDescription ||
                              `${units} × 20ml dropper bottle${
                                units > 1
                                  ? "s"
                                  : ""
                              } of Pure & Natural Serum.`}
                          </p>

                          <div className="nm-price-row">
                            <span className="nm-price-new">
                              {formatPrice(
                                product.price
                              )}
                            </span>

                            {oldPrice ? (
                              <span className="nm-price-old">
                                {formatPrice(
                                  oldPrice
                                )}
                              </span>
                            ) : null}
                          </div>

                          <div className="nm-card-actions">
                            <Link
                              href={`/products/${product.slug}`}
                              className="nm-btn nm-btn-outline"
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
                  }
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}