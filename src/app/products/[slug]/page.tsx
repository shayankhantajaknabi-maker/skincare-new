import Link from "next/link";
import { notFound } from "next/navigation";

import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { formatPrice } from "@/lib/format-price";

import StoreFooter from "../../store-footer";
import StoreHeader from "../../store-header";
import ProductPurchase from "./product-purchase";

export const dynamic = "force-dynamic";

type StoreProduct = {
  _id: unknown;
  name: string;
  slug: string;
  category?: string;
  shortDescription?: string;
  description?: string;

  benefits?: string[];

  ingredients?: {
    name: string;
    description: string;
    image?: string;
  }[];

  howToUse?: {
    title: string;
    description: string;
    image?: string;
  }[];

  story?: string;
  beforeAfter?: {
    beforeImage: string;
    afterImage: string;
    description: string;
  };

  price: number;
  compareAtPrice?: number | null;
  images?: string[];
  stock: number;
  packType?: "single" | "twin" | "family";
  units?: number;
  badge?: string;
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;

  await connectToDatabase();

  const rawProduct = await Product.findOne({
    slug,
    isActive: true,
  }).lean();

  if (!rawProduct) {
    notFound();
  }

  const product =
    rawProduct as unknown as StoreProduct;

  const rawRelated = await Product.find({
    isActive: true,
    _id: {
      $ne: product._id,
    },
  })
    .sort({
      createdAt: -1,
    })
    .limit(2)
    .lean();

  const relatedProducts =
    rawRelated as unknown as StoreProduct[];

  const image =
    product.images?.[0] || "";

  const oldPrice =
    product.compareAtPrice &&
      product.compareAtPrice > product.price
      ? product.compareAtPrice
      : null;

  const discount =
    oldPrice && oldPrice > 0
      ? Math.round(
        ((oldPrice - product.price) / oldPrice) *
        100
      )
      : null;

  const heroDescription =
    product.shortDescription?.trim() ||
    product.description?.trim() ||
    "";

  const fullDescription =
    product.description?.trim() ||
    product.shortDescription?.trim() ||
    "";

  return (
    <div className="nm-store">
      <StoreHeader />



      <main>
        <section
          id="product"
          className="bg-white px-4 pb-10 pt-4 sm:px-6 sm:pb-12 sm:pt-5 lg:px-8 lg:pb-12 lg:pt-4"
        >
          <div className="mx-auto max-w-[1160px]">
            <div className="mb-5 flex flex-wrap items-center gap-2 text-[13px] text-[#7a827e] sm:mb-6">
              <Link
                href="/"
                className="transition hover:text-[#005746]"
              >
                Home
              </Link>

              <span className="text-[#bbc0bd]">
                /
              </span>

              <Link
                href="/shop"
                className="transition hover:text-[#005746]"
              >
                Shop
              </Link>

              <span className="text-[#bbc0bd]">
                /
              </span>

              <span className="truncate text-[#315147]">
                {product.name}
              </span>
            </div>

            <div className="grid items-start gap-7 lg:grid-cols-[440px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[420px_minmax(0,1fr)] xl:gap-10">
              <div className="w-full">
                <div
                  className="
                    relative
                    mx-auto
                    flex
                    h-[360px]
                    w-full
                    max-w-[520px]
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-[#123529]/[0.07]
                    bg-white
                    px-4
                    py-4
                    shadow-[0_14px_40px_rgba(18,53,41,0.045)]

                    sm:h-[390px]
                    sm:max-w-[420px]
                    sm:px-3
                    sm:py-3

                    lg:mx-[-78px]
                    lg:h-[410px]
                    lg:max-w-[420px]

                    xl:h-[420px]
                    xl:max-w-[430px]
                  "
                >
                  {product.badge ? (
                    <span
                      className="
                        absolute
                        left-5
                        top-5
                        z-10
                        rounded-full
                        bg-[#005746]
                        px-3
                        py-1.5
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.08em]
                        text-white
                      "
                    >
                      {product.badge}
                    </span>
                  ) : null}

                  {image ? (
                    <img
                      src={image}


                      alt={product.name}
                      className="
                        block
                        h-auto
                        w-auto
                        object-contain
                        object-center
                        max-h-[390px]
                        max-w-[95%]
                        sm:max-h-[430px]
                        sm:max-w-[95%]
                        lg:max-h-[460px]
                        lg:max-w-[95%]
                        xl:max-h-[480px]
                        xl:max-w-[95%]
                      "
                    />
                  ) : (
                    <div className="flex h-[210px] w-[170px] flex-col items-center justify-center rounded-2xl bg-[#f4f6f4] text-center text-[#123529]">
                      <strong className="text-3xl font-semibold">
                        ON
                      </strong>

                      <span className="mt-2 text-[10px] uppercase tracking-[0.18em]">
                        ORINOCA
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="min-w-0 lg:pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="h-px w-5 bg-[#d4af37]" />

                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#005746]">
                    ORINOCA NATURAL
                  </p>

                  {product.category ? (
                    <>
                      <span className="text-[#a3aaa6]">
                        ·
                      </span>

                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#70827a]">
                        {product.category}
                      </p>
                    </>
                  ) : null}
                </div>

                <h1
                  className="mt-3 text-[38px] leading-none text-[#123529] sm:text-[42px] lg:text-[44px]"
                  style={{
                    fontFamily:
                      "var(--nm-serif)",
                  }}
                >
                  {product.name}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span
                    className="text-[32px] leading-none text-[#123529] sm:text-[36px]"
                    style={{
                      fontFamily:
                        "var(--nm-serif)",
                    }}
                  >
                    {formatPrice(
                      product.price
                    )}
                  </span>

                  {oldPrice ? (
                    <span className="text-[14px] text-[#999f9b] line-through">
                      {formatPrice(
                        oldPrice
                      )}
                    </span>
                  ) : null}

                  {discount ? (
                    <span className="rounded-full bg-[#edf5f1] px-3 py-1.5 text-[9px] font-semibold text-[#17604d]">
                      Save {discount}%
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${product.stock > 0
                      ? "bg-[#168566]"
                      : "bg-red-500"
                      }`}
                  />

                  <span className="text-[11px] font-medium text-[#68736e]">
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </span>
                </div>

                {heroDescription ? (
                  <p className="mt-4 max-w-[650px] text-[13.5px] leading-[1.65] text-[#5f6863]">
                    {heroDescription}
                  </p>
                ) : null}

                <div className="mt-5 border-t border-[#e5ebe8] pt-5">
                  <ProductPurchase
                    product={{
                      _id: String(
                        product._id
                      ),
                      name:
                        product.name,
                      slug:
                        product.slug,
                      price:
                        product.price,
                      stock:
                        product.stock,
                      image,
                    }}
                  />
                </div>

                <div className="mt-5 grid gap-3 border-t border-[#e9eeeb] pt-4 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] font-semibold text-[#123529]">
                      Secure Order
                    </p>
                    <p className="mt-0.5 text-[9px] leading-4 text-[#89918d]">
                      Simple checkout
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-[#123529]">
                      Cash on Delivery
                    </p>
                    <p className="mt-0.5 text-[9px] leading-4 text-[#89918d]">
                      Pay on arrival
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-[#123529]">
                      Nationwide
                    </p>
                    <p className="mt-0.5 text-[9px] leading-4 text-[#89918d]">
                      Delivery in Pakistan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {product.benefits &&
          product.benefits.length > 0 ? (
          <section
            id="benefits"
            className="relative overflow-hidden bg-white px-4 py-12 sm:px-6 lg:px-8"
          >
            <div
              aria-hidden="true"
              className="
    pointer-events-none
    absolute
    -right-24
    top-8
    z-0
    h-[380px]
    w-[420px]
    opacity-[0.06]
    blur-[4px]
  "
            >
              <div
                className="
      absolute
      right-10
      top-8
      h-[240px]
      w-[95px]
      rotate-[38deg]
      rounded-[100%_0_100%_0]
      bg-[#8f9991]
    "
              />

              <div
                className="
      absolute
      right-28
      top-[125px]
      h-[190px]
      w-[72px]
      rotate-[-32deg]
      rounded-[100%_0_100%_0]
      bg-[#8f9991]
    "
              />

              <div
                className="
      absolute
      right-2
      top-[215px]
      h-[165px]
      w-[65px]
      rotate-[42deg]
      rounded-[100%_0_100%_0]
      bg-[#8f9991]
    "
              />
            </div>


            <div className="mx-auto max-w-[1160px]">

              <span className="nm-eyebrow">
                Benefits
              </span>

              <h2
                className="mt-3 text-3xl text-[#123529] sm:text-4xl"
                style={{
                  fontFamily: "var(--nm-serif)",
                }}
              >
                Why choose ORINOCA NATURAL?
              </h2>


              <div
                className={`mt-10 ${product.benefits.length === 1
                  ? "flex justify-center"
                  : "grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
                  }`}
              >

                {product.benefits.map(
                  (item, index) => (

                    <div
                      key={index}
                      className={`
                        group
                        w-full
                        ${(product.benefits?.length ?? 0) === 1
                          ? "max-w-none"
                          : "max-w-[420px] mx-auto"
                        }
                        rounded-[26px]
                        border
                        border-[#e7ece9]
                        bg-[#fafafa]
                        p-7
                        transition-all
                        duration-300
                        hover:-translate-y-2
                        hover:bg-white
                        hover:shadow-[0_20px_50px_rgba(18,53,41,0.08)]
                      `}
                    >

                      <div
                        className="
flex
h-11
w-11
items-center
justify-center
rounded-full
bg-[#edf5f1]
text-xs
font-semibold
text-[#005746]
"
                      >
                        0{index + 1}
                      </div>


                      <h3
                        className="
mt-5
text-lg
text-[#123529]
"
                        style={{
                          fontFamily: "var(--nm-serif)"
                        }}
                      >
                        {
                          item.split(" ").slice(0, 3).join(" ")
                        }
                      </h3>


                      <p
                        className="
mt-3
text-sm
leading-6
text-[#5f6863]
"
                      >
                        {
                          item
                        }
                      </p>


                    </div>

                  )

                )}

              </div>

            </div>

          </section>

        ) : null}



        {product.ingredients &&
          product.ingredients.length > 0 ? (
          <section
            id="ingredients"
            className="bg-[#fafafa] px-4 py-12 sm:px-6 lg:px-8"
          >

            <div className="mx-auto max-w-[1100px]">

              <span className="nm-eyebrow">
                Ingredients
              </span>

              <h2
                className="mt-3 text-3xl text-[#123529] sm:text-4xl"
                style={{
                  fontFamily:
                    "var(--nm-serif)",
                }}
              >
                Powered by nature
              </h2>


              <div
                className={`mt-7 ${product.ingredients.length === 1
                  ? "flex justify-center"
                  : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  }`}
              >

                {product.ingredients.map(
                  (item, index) => (

                    <div
                      key={index}
                      className={`
    group
    w-full
    ${(product.ingredients?.length ?? 0) === 1
                          ? "max-w-none"
                          : "max-w-[520px] mx-auto"
                        }
    min-h-[340px]
    rounded-[26px]
    border
    border-[#e7ece9]
    bg-white
    p-5
    transition-all
    duration-300
    hover:-translate-y-2
    hover:shadow-[0_20px_50px_rgba(18,53,41,0.08)]
  `}
                    >

                      <div
                        className="
    flex
    h-12
    w-12
    items-center
    justify-center
    rounded-full
    bg-[#edf5f1]
    text-xs
    font-semibold
    tracking-[0.15em]
    text-[#005746]
  "
                      >
                        0{index + 1}
                      </div>

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="
                            mt-4
                            h-[170px]
                            w-[320px]
                            max-w-full
                            rounded-[20px]
                            object-cover
                            object-center
                          "
                        />
                      ) : null}


                      <h3
                        className="
    mt-4
    text-xl
    text-[#123529]
  "
                        style={{
                          fontFamily: "var(--nm-serif)"
                        }}
                      >
                        {item.name}
                      </h3>


                      <p
                        className="
    mt-2
    text-sm
    leading-6
    text-[#5f6863]
  "
                      >
                        {item.description}
                      </p>


                      <div
                        className="
    mt-4
    h-px
    w-12
    bg-[#d8c9a3]
    transition-all
    duration-300
    group-hover:w-20
  "
                      />


                    </div>

                  ))}

              </div>

            </div>

          </section>
        ) : null}




        {product.howToUse &&
          product.howToUse.length > 0 ? (
          <section
            id="how-to-use"
            className="bg-white px-4 py-12 sm:px-6 lg:px-8"
          >

            <div className="mx-auto max-w-[1160px]">

              <span className="nm-eyebrow">
                How To Use
              </span>

              <h2
                className="mt-3 text-3xl text-[#123529] sm:text-4xl"
                style={{
                  fontFamily:
                    "var(--nm-serif)",
                }}
              >
                Simple steps for your routine
              </h2>


              <div
                className={`mt-10 ${product.howToUse.length === 1
                  ? "flex justify-center"
                  : "grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                  }`}
              >

                {product.howToUse.map(
                  (step, index) => (

                    <div
                      key={index}
                      className={`
    group
    relative
    flex
    min-h-[340px]
    w-full
    ${(product.howToUse?.length ?? 0) === 1
                          ? "max-w-none"
                          : "max-w-[520px] mx-auto"
                        }
    flex-col
    rounded-[26px]
    border
    border-[#e7ece9]
    bg-white
    p-5
    transition-all
    duration-300
    hover:-translate-y-2
    hover:shadow-[0_20px_50px_rgba(18,53,41,0.08)]
  `}
                    >

                      <div
                        className="
 absolute
 top-5
 right-5
 text-5xl
 font-serif
 text-[#edf0ed]
 "
                      >
                        0{index + 1}
                      </div>

                      {step.image ? (
                        <img
                          src={step.image}
                          alt={step.title}
                          className="
                            mb-5
                            h-[170px]
                            w-[320px]
                            max-w-full
                            rounded-[20px]
                            object-cover
                            object-center
                          "
                        />
                      ) : null}


                      <span
                        className="
text-[10px]
font-semibold
uppercase
tracking-[0.18em]
text-[#005746]
"
                      >
                        Step {String(index + 1).padStart(2, "0")}
                      </span>


                      <h3
                        className="
mt-3
text-xl
text-[#123529]
"
                        style={{
                          fontFamily: "var(--nm-serif)"
                        }}
                      >
                        {step.title}
                      </h3>


                      <p
                        className="
mt-2
text-sm
leading-6
text-[#5f6863]
"
                      >
                        {step.description}
                      </p>


                      <div
                        className="
mt-4  
h-px
w-12
bg-[#d8c9a3]
group-hover:w-20
transition-all
duration-300
"
                      />


                    </div>

                  ))}

              </div>

            </div>

          </section>
        ) : null}

        {product.beforeAfter?.beforeImage && (
          <section
            id="results"
            className="
    mt-14
    px-4
    sm:px-6
    lg:px-8
  "
          >

            <div className="mx-auto max-w-[1160px]">


              <span
                className="
        text-[11px]
        uppercase
        tracking-[0.35em]
        font-semibold
        text-[#005746]
      "
              >
                Results
              </span>


              <h2
                className="
        mt-3
        text-3xl
        sm:text-5xl
        text-[#123529]
      "
                style={{
                  fontFamily: "var(--nm-serif)"
                }}
              >
                Visible transformation with ORINOCA NATURAL
              </h2>



              <div
                className="
    mx-auto
    mt-6
    grid
    max-w-[760px]
    
    gap-4
    md:grid-cols-2
  "
              >


                {/* BEFORE */}

                <div
                  className="
    overflow-hidden
    rounded-[24px]
    border
    border-[#edf0ed]
    bg-white
    shadow-[0_20px_50px_rgba(18,53,41,0.06)]
  "
                >

                  <div className="relative">

                    <span
                      className="
        absolute
        left-5
        top-5
        z-10
        rounded-full
        bg-white/90
        px-4
        py-2
        text-[10px]
        font-semibold
        uppercase
        tracking-[0.25em]
        text-[#123529]
      "
                    >
                      Before
                    </span>


                    <img
                      src={product.beforeAfter.beforeImage}
                      alt="Before result"
                      className="
    mx-auto
    block
    h-[200px]
    w-full
    object-cover
    object-center
  "
                    />

                  </div>


                  <div className="p-5">

                    <h3
                      className="
        text-xl
        text-[#123529]
      "
                      style={{
                        fontFamily: "var(--nm-serif)"
                      }}
                    >
                      Before starting routine
                    </h3>


                    <p
                      className="
        mt-3
        text-sm
        leading-7
        text-[#5f6863]
      "
                    >
                      Skin concerns, uneven texture and visible imperfections before starting a consistent skincare routine.
                    </p>

                  </div>

                </div>




                {/* AFTER */}

                <div
                  className="
    overflow-hidden
    rounded-[24px]
    border
    border-[#edf0ed]
    bg-white
    shadow-[0_20px_50px_rgba(18,53,41,0.06)]
  "
                >

                  <div className="relative">

                    <span
                      className="
        absolute
        left-5
        top-5
        z-10
        rounded-full
        bg-[#005746]
        px-4
        py-2
        text-[10px]
        font-semibold
        uppercase
        tracking-[0.25em]
        text-white
      "
                    >
                      After
                    </span>


                    <img
                      src={product.beforeAfter.afterImage}
                      alt="After result"
                      className="
    mx-auto
    block
    h-[200px]
    w-full
    object-cover
    object-center
  "
                    />

                  </div>


                  <div className="p-5">

                    <h3
                      className="
        text-xl
        text-[#123529]
      "
                      style={{
                        fontFamily: "var(--nm-serif)"
                      }}
                    >
                      Visible improvement
                    </h3>


                    <p
                      className="
        mt-3
        text-sm
        leading-7
        text-[#5f6863]
      "
                    >
                      {product.beforeAfter.description}
                    </p>

                  </div>

                </div>


              </div>

            </div>


          </section>
        )}


        {product.story ? (
          <section
            id="our-story"
            className="
              mt-24
              rounded-[36px]
              bg-[#f8f7f3]
              px-6
              py-24
              sm:px-10
              lg:px-16
            "
          >

            <div
              className="
        mx-auto
        max-w-[900px]
        text-center
      "
            >

              <span
                className="
          text-[11px]
          font-semibold
          uppercase
          tracking-[0.35em]
          text-[#005746]
        "
              >
                Our Story
              </span>


              <h2
                className="
                  mt-5
                  text-4xl
                  sm:text-5xl
                  text-[#123529]
                "
                style={{
                  fontFamily: "var(--nm-serif)"
                }}
              >
                Inspired by nature, created for your skin
              </h2>


              <p
                className="
                  max-w-4xl
                  mt-10
                  text-[15px]
                  leading-9
                  text-[#59635e]
                  sm:text-base
                "
              >
                {product.story}
              </p>

              <div className="mt-10 h-px w-24 mx-auto bg-[#d8c9a3]" />


            </div>

          </section>
        ) : null}

        <section className="border-t border-[#edf0ed] bg-[#fafafa] px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-[1160px]">
            <div className="border-b border-[#d8e2dd]">
              <div className="flex gap-6 overflow-x-auto text-sm font-medium text-[#737873] [scrollbar-width:none]">
                <span className="shrink-0 border-b-2 border-[#d4af37] pb-3 text-[#123529]">
                  Description
                </span>
              </div>
            </div>

            {fullDescription ? (
              <div className="max-w-[820px] py-7 text-[14px] leading-7 text-[#5b605d] sm:py-8">
                <p>
                  {fullDescription}
                </p>
              </div>
            ) : null}
          </div>
        </section>

        {relatedProducts.length > 0 ? (
          <section className="bg-white px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
            <div className="mx-auto max-w-[1160px]">
              <div className="text-center">
                <span className="nm-eyebrow">
                  Complete your ritual
                </span>

                <h2
                  className="mt-3 text-3xl text-[#123529] sm:text-4xl"
                  style={{
                    fontFamily:
                      "var(--nm-serif)",
                  }}
                >
                  You may also like
                </h2>
              </div>

              <div className="mx-auto mt-8 grid max-w-[720px] gap-5 sm:grid-cols-2">
                {relatedProducts.map(
                  (related) => {
                    const relatedImage =
                      related.images?.[0] ||
                      "";

                    return (
                      <article
                        key={String(
                          related._id
                        )}
                        className="overflow-hidden rounded-[20px] border border-[#edf0ed] bg-white transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(18,53,41,0.08)]"
                      >
                        <div className="relative flex h-[225px] items-center justify-center overflow-hidden bg-white p-3">
                          {related.badge ? (
                            <span className="absolute left-4 top-4 z-10 rounded-full bg-[#005746] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.08em] text-white">
                              {
                                related.badge
                              }
                            </span>
                          ) : null}

                          {relatedImage ? (
                            <img
                              src={
                                relatedImage
                              }
                              alt={
                                related.name
                              }
                              className="block h-auto w-auto max-h-[210px] max-w-[90%] object-contain object-center"
                            />
                          ) : (
                            <div className="grid h-[150px] w-[130px] place-items-center rounded-xl bg-[#f4f6f4] text-sm font-semibold text-[#123529]">
                              ORINOCA
                            </div>
                          )}
                        </div>

                        <div className="p-5">
                          {related.category ? (
                            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#769087]">
                              {
                                related.category
                              }
                            </p>
                          ) : null}

                          <h3 className="mt-2 text-lg font-semibold text-[#123529]">
                            {related.name}
                          </h3>

                          {related.shortDescription ? (
                            <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-[#68716b]">
                              {
                                related.shortDescription
                              }
                            </p>
                          ) : null}

                          <p className="mt-3 text-lg font-semibold text-[#005746]">
                            {formatPrice(
                              related.price
                            )}
                          </p>

                          <Link
                            href={`/products/${related.slug}`}
                            className="mt-4 block rounded-full bg-[#005746] px-5 py-2.5 text-center text-xs font-semibold text-white transition hover:bg-[#003f33]"
                          >
                            View Product
                          </Link>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <StoreFooter
        ctaTitle="Ready to start your skincare ritual?"
        ctaDescription="Explore ORINOCA NATURAL products and find the right addition to your routine."
        ctaButtonText="Shop Now"
        ctaHref="/shop"
      />
    </div>
  );
}