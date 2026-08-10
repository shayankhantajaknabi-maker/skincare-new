import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import StoreFooter from "../../store-footer";
import StoreHeader from "../../store-header";
import ProductPurchase from "./product-purchase";

export const dynamic = "force-dynamic";

type StoreProduct = {
  _id: unknown;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price: number;
  compareAtPrice?: number | null;
  images?: string[];
  stock: number;
  packType?: "single" | "twin" | "family";
  units?: number;
  badge?: string;
};

function formatPrice(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectToDatabase();

  const rawProduct = await Product.findOne({ slug, isActive: true }).lean();

  if (!rawProduct) {
    notFound();
  }

  const product = rawProduct as unknown as StoreProduct;
  const rawRelated = await Product.find({
    isActive: true,
    _id: { $ne: product._id },
  })
    .sort({ createdAt: 1 })
    .limit(2)
    .lean();

  const relatedProducts = rawRelated as unknown as StoreProduct[];
  const image = product.images?.[0];
  const units = product.units || 1;
  const oldPrice =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? product.compareAtPrice
      : null;
  const discount =
    oldPrice && oldPrice > 0
      ? Math.round(((oldPrice - product.price) / oldPrice) * 100)
      : null;

  return (
    <div className="nm-store">
      <StoreHeader />

      <main>
        <section className="bg-white px-5 pb-16 pt-10 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-10 flex items-center gap-2 text-sm text-[#6d766f]">
              <Link href="/" className="hover:text-[#005746]">Home</Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-[#005746]">Shop</Link>
              <span>/</span>
              <span>{product.name}</span>
            </div>

            <div className="grid items-start gap-12 lg:grid-cols-[0.93fr_1.07fr] lg:gap-16">
              <div className="rounded-[28px] bg-[#f5f2eb] p-7 sm:p-12">
                <div className="flex min-h-[370px] items-center justify-center sm:min-h-[500px]">
                  {image ? (
                    <img src={image} alt={product.name} className="max-h-[440px] max-w-full object-contain" />
                  ) : (
                    <div className="flex h-64 w-52 flex-col items-center justify-center rounded-2xl bg-[#ebe4d6] text-center text-[#123529]">
                      <strong className="text-4xl" style={{ fontFamily: "var(--nm-serif)" }}>NM</strong>
                      <span className="mt-2 text-sm tracking-[0.18em]">SKIN CARE</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#005746]">— ORINOCA NATURAL · Pure &amp; Natural</p>
                <div className="mt-5 flex items-center gap-3 text-sm">
                  <span className="tracking-[0.12em] text-[#e5ad1b]">★★★★★</span>
                  <span className="text-[#8a8f8b]">4.9 out of 5 · 1,240 reviews</span>
                </div>
                <h1 className="mt-3 text-[42px] leading-[1.08] text-[#123529] sm:text-[52px]" style={{ fontFamily: "var(--nm-serif)" }}>{product.name}</h1>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="text-[38px] leading-none text-[#123529] sm:text-[46px]" style={{ fontFamily: "var(--nm-serif)" }}>{formatPrice(product.price)}</span>
                  {oldPrice ? (
                    <>
                      <span className="text-lg text-[#9b9c99] line-through">{formatPrice(oldPrice)}</span>
                      {discount ? <span className="rounded-full bg-[#edf2ee] px-3 py-1 text-xs font-semibold text-[#266b59]">Save {discount}%</span> : null}
                    </>
                  ) : null}
                </div>
                <p className="mt-6 max-w-[610px] text-[16px] leading-7 text-[#5d625e]">
                  {product.description || product.shortDescription || "A lightweight, fast-absorbing botanical serum formulated to nourish, repair and restore your skin’s natural radiance."}
                </p>

                <div className="mt-8">
                  <p className="mb-3 font-serif text-[13px] font-semibold uppercase tracking-[0.16em] text-[#123529]">Choose your pack</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Link href="/shop" className="rounded-2xl border border-[#005746] bg-[#eff5f1] px-4 py-4 text-left">
                      <strong className="block text-sm text-[#123529]">{product.packType === "single" ? "Single Bottle" : product.name}</strong>
                      <span className="mt-1 block text-xs text-[#68716b]">{units} × 20ml</span>
                    </Link>
                    <Link href="/shop" className="rounded-2xl border border-[#d3ded9] bg-white px-4 py-4 text-left transition hover:border-[#005746]">
                      <strong className="block text-sm text-[#123529]">Twin Pack</strong>
                      <span className="mt-1 block text-xs text-[#68716b]">2 × 20ml</span>
                    </Link>
                    <Link href="/shop" className="rounded-2xl border border-[#d3ded9] bg-white px-4 py-4 text-left transition hover:border-[#005746]">
                      <strong className="block text-sm text-[#123529]">Family Pack</strong>
                      <span className="mt-1 block text-xs text-[#68716b]">3 × 20ml</span>
                    </Link>
                  </div>
                </div>

                <ProductPurchase product={{ _id: String(product._id), name: product.name, slug: product.slug, price: product.price, stock: product.stock, image }} />
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[#edf0ed] bg-[#fafafa] px-5 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1180px]">
            <div className="border-b border-[#d8e2dd]">
              <div className="flex flex-wrap gap-7 text-sm font-medium text-[#737873]">
                <span className="border-b-2 border-[#e5ad1b] pb-4 text-[#123529]">Description</span>
                <span className="pb-4">Ingredients</span><span className="pb-4">How to Use</span><span className="pb-4">Reviews (1,240)</span>
              </div>
            </div>
            <div className="max-w-[850px] py-10 text-[15.5px] leading-8 text-[#5b605d]">
              <p>{product.description || "ORINOCA NATURAL Serum is crafted in small batches from natural plant extracts and oils. It is made to nourish dry patches, support an even-looking tone and help your skin feel soft and refreshed."}</p>
              <ul className="mt-7 space-y-2"><li>— 100% pure &amp; natural formula</li><li>— Lightweight, fast-absorbing texture</li><li>— Suitable for normal, dry and combination skin</li><li>— Free from parabens and synthetic fragrance</li></ul>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 ? (
          <section className="bg-white px-5 py-20 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-[1180px]">
              <div className="text-center"><span className="nm-eyebrow">Complete your ritual</span><h2 className="mt-4 text-4xl text-[#123529] sm:text-5xl" style={{ fontFamily: "var(--nm-serif)" }}>Other packs you might like</h2></div>
              <div className="mx-auto mt-12 grid max-w-[760px] gap-7 sm:grid-cols-2">
                {relatedProducts.map((related) => {
                  const relatedImage = related.images?.[0];
                  return (
                    <article key={String(related._id)} className="overflow-hidden rounded-[22px] border border-[#edf0ed] bg-white">
                      <div className="relative flex h-64 items-center justify-center bg-[#f5f2eb] p-7">
                        <span className="absolute left-4 top-4 rounded-full bg-[#e8b32a] px-3 py-1 text-[10px] font-bold tracking-[0.1em] text-[#123529]">{related.badge || "BEST VALUE"}</span>
                        {relatedImage ? <img src={relatedImage} alt={related.name} className="h-48 max-w-full object-contain" /> : null}
                      </div>
                      <div className="p-6">
                        <div className="text-sm tracking-[0.12em] text-[#e5ad1b]">★★★★★</div>
                        <h3 className="mt-3 text-2xl text-[#123529]" style={{ fontFamily: "var(--nm-serif)" }}>{related.name}</h3>
                        <p className="mt-2 text-sm text-[#68716b]">{related.shortDescription || "Pure & Natural Serum pack for your daily ritual."}</p>
                        <p className="mt-4 text-2xl text-[#123529]" style={{ fontFamily: "var(--nm-serif)" }}>{formatPrice(related.price)}</p>
                        <Link href={`/products/${related.slug}`} className="mt-5 block rounded-full bg-[#005746] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#003f33]">View Product</Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <StoreFooter ctaTitle="Ready to start your skincare ritual?" ctaDescription="Join 10,000+ customers already using ORINOCA NATURAL daily." ctaButtonText="Shop Now" ctaHref="/shop" />
    </div>
  );
}
