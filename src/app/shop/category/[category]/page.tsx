import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { formatPrice } from "@/lib/format-price";
import StoreFooter from "../../../store-footer";
import StoreHeader from "../../../store-header";
import StoreFilters from "../../store-filters";

export const dynamic = "force-dynamic";

type StoreProduct = {
  _id: unknown;
  name: string;
  slug: string;
  category?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number | null;
  stock?: number;
  images?: string[];
  featured?: boolean;
  badge?: string;
  createdAt?: Date | string;
};

type CategorySearchParams = {
  availability?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
};

function normalizeCategory(value?: string) {
  return value?.trim() || "General";
}

function createCategorySlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function filterAvailability(
  products: StoreProduct[],
  availability: string
) {
  if (availability === "in-stock") {
    return products.filter(
      (product) =>
        Number(product.stock || 0) > 0
    );
  }

  if (availability === "out-of-stock") {
    return products.filter(
      (product) =>
        Number(product.stock || 0) <= 0
    );
  }

  return products;
}

function filterPriceRange(
  products: StoreProduct[],
  minPrice: string,
  maxPrice: string
) {
  const parsedMin =
    minPrice.trim() !== ""
      ? Number(minPrice)
      : null;

  const parsedMax =
    maxPrice.trim() !== ""
      ? Number(maxPrice)
      : null;

  const validMin =
    parsedMin !== null &&
    Number.isFinite(parsedMin) &&
    parsedMin >= 0
      ? parsedMin
      : null;

  const validMax =
    parsedMax !== null &&
    Number.isFinite(parsedMax) &&
    parsedMax >= 0
      ? parsedMax
      : null;

  return products.filter((product) => {
    const price =
      Number(product.price || 0);

    if (
      validMin !== null &&
      price < validMin
    ) {
      return false;
    }

    if (
      validMax !== null &&
      price > validMax
    ) {
      return false;
    }

    return true;
  });
}

function sortProducts(
  products: StoreProduct[],
  sort: string
) {
  const result = [...products];

  if (sort === "newest") {
    return result.sort((a, b) => {
      const first = new Date(
        a.createdAt || 0
      ).getTime();

      const second = new Date(
        b.createdAt || 0
      ).getTime();

      return second - first;
    });
  }

  if (sort === "price-asc") {
    return result.sort(
      (a, b) => a.price - b.price
    );
  }

  if (sort === "price-desc") {
    return result.sort(
      (a, b) => b.price - a.price
    );
  }

  if (sort === "name-asc") {
    return result.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  return result.sort((a, b) => {
    const featuredDifference =
      Number(Boolean(b.featured)) -
      Number(Boolean(a.featured));

    if (featuredDifference !== 0) {
      return featuredDifference;
    }

    const first = new Date(
      a.createdAt || 0
    ).getTime();

    const second = new Date(
      b.createdAt || 0
    ).getTime();

    return second - first;
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{
    category: string;
  }>;

  searchParams?: Promise<CategorySearchParams>;
}) {
  await connectToDatabase();

  const resolvedParams =
    await params;

  const resolvedSearchParams =
    searchParams
      ? await searchParams
      : {};

  const categorySlug =
    resolvedParams.category;

  const availability =
    resolvedSearchParams
      .availability ||
    "all";

  const minPrice =
    resolvedSearchParams
      .minPrice ||
    "";

  const maxPrice =
    resolvedSearchParams
      .maxPrice ||
    "";

  const sort =
    resolvedSearchParams
      .sort ||
    "featured";

  const databaseProducts =
    (await Product.find({
      isActive: true,
    })
      .sort({
        createdAt: -1,
      })
      .lean()) as unknown as StoreProduct[];

  /*
    All categories stay dynamic.
  */

  const categories = Array.from(
    new Set(
      databaseProducts.map((product) =>
        normalizeCategory(
          product.category
        )
      )
    )
  ).sort((a, b) =>
    a.localeCompare(b)
  );

  const categoryOptions =
    categories.map((category) => ({
      name: category,
      slug:
        createCategorySlug(
          category
        ),
    }));

  const currentCategory =
    categories.find(
      (category) =>
        createCategorySlug(
          category
        ) ===
        categorySlug
    );

  if (!currentCategory) {
    notFound();
  }

  /*
    Important:
    first create the unfiltered
    product collection for this
    category.

    This is what we use to calculate
    price limits and stock counts.
  */

  const categoryProducts =
    databaseProducts.filter(
      (product) =>
        createCategorySlug(
          normalizeCategory(
            product.category
          )
        ) ===
        categorySlug
    );

  /*
    Dynamic category-specific
    filter information.
  */

  const totalProductCount =
    categoryProducts.length;

  const inStockCount =
    categoryProducts.filter(
      (product) =>
        Number(
          product.stock || 0
        ) > 0
    ).length;

  const outOfStockCount =
    categoryProducts.filter(
      (product) =>
        Number(
          product.stock || 0
        ) <= 0
    ).length;

  const highestPrice =
    categoryProducts.reduce(
      (highest, product) =>
        Math.max(
          highest,
          Number(
            product.price || 0
          )
        ),
      0
    );

  /*
    Apply selected filters.
  */

  let products =
    filterAvailability(
      categoryProducts,
      availability
    );

  products =
    filterPriceRange(
      products,
      minPrice,
      maxPrice
    );

  products =
    sortProducts(
      products,
      sort
    );

  return (
    <div className="nm-store">
      <StoreHeader />

      <main>
        {/* HERO */}

        <section className="nm-page-hero nm-catalog-hero">
          <div className="nm-wrap">

            <div className="nm-breadcrumb">

              <Link href="/">
                Home
              </Link>

              <span>/</span>

              <Link href="/shop">
                Shop
              </Link>

              <span>/</span>

              <span>
                {
                  currentCategory
                }
              </span>

            </div>

            <div className="mt-5">
              <span className="nm-eyebrow">
                ORINOCA COLLECTION
              </span>
            </div>

            <h1>
              {
                currentCategory
              }
            </h1>

            <p className="nm-catalog-intro">
              Explore our{" "}
              {currentCategory.toLowerCase()}{" "}
              collection.
            </p>

          </div>
        </section>

        {/* CATEGORY NAVIGATION */}

        <section className="nm-category-navigation">
          <div className="nm-wrap">

            <div className="nm-catalog-categories">

              <Link
                href="/shop"
                className="nm-category-pill"
              >
                All Products
              </Link>

              {categories.map(
                (category) => {
                  const slug =
                    createCategorySlug(
                      category
                    );

                  return (
                    <Link
                      key={
                        category
                      }
                      href={`/shop/category/${slug}`}
                      className={
                        slug ===
                        categorySlug
                          ? "nm-category-pill active"
                          : "nm-category-pill"
                      }
                    >
                      {
                        category
                      }
                    </Link>
                  );
                }
              )}

            </div>

          </div>
        </section>

        {/* PRODUCTS */}

        <section
          className="nm-catalog-section"
          id="products"
        >
          <div className="nm-wrap">

            <StoreFilters
              availability={
                availability
              }
              minPrice={
                minPrice
              }
              maxPrice={
                maxPrice
              }
              sort={
                sort
              }
              productCount={
                products.length
              }
              totalProductCount={
                totalProductCount
              }
              highestPrice={
                highestPrice
              }
              inStockCount={
                inStockCount
              }
              outOfStockCount={
                outOfStockCount
              }
              categories={
                categoryOptions
              }
              currentCategorySlug={
                categorySlug
              }
            />

            {products.length === 0 ? (
              <div className="nm-catalog-empty">

                <h2>
                  No matching products
                </h2>

                <p>
                  Try changing the
                  availability or price
                  range.
                </p>

                <Link
                  href={`/shop/category/${categorySlug}`}
                  className="nm-btn nm-btn-primary"
                >
                  Clear Filters
                </Link>

              </div>
            ) : (
              <div className="nm-catalog-grid">

                {products.map(
                  (product) => {
                    const image =
                      product
                        .images?.[0] ||
                      "";

                    const oldPrice =
                      product.compareAtPrice &&
                      Number(
                        product.compareAtPrice
                      ) >
                        product.price
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

                    const onSale =
                      savingAmount > 0;

                    const outOfStock =
                      Number(
                        product.stock ||
                          0
                      ) <= 0;

                    const category =
                      normalizeCategory(
                        product.category
                      );

                    return (
                      <article
                        key={String(
                          product._id
                        )}
                        className="nm-pro-card"
                      >

                        <Link
                          href={`/products/${product.slug}`}
                          className="nm-pro-card-link"
                          aria-label={`View ${product.name}`}
                        >

                          {/* IMAGE */}

                          <div className="nm-pro-image">

                            {/* AUTOMATIC SAVING */}

                            {onSale ? (
                              <span className="nm-pro-save">
                                SAVE RS.{" "}
                                {savingAmount.toLocaleString(
                                  "en-PK",
                                  {
                                    maximumFractionDigits:
                                      0,
                                  }
                                )}
                              </span>
                            ) : product.badge ? (
                              <span className="nm-pro-save">
                                {
                                  product.badge
                                }
                              </span>
                            ) : null}

                            {/* AUTOMATIC SALE */}

                            {onSale ? (
                              <span className="nm-pro-sale">
                                SALE
                              </span>
                            ) : null}

                            {/* STOCK */}

                            {outOfStock ? (
                              <span className="nm-pro-sold">
                                SOLD OUT
                              </span>
                            ) : null}

                            {image ? (
                              <img
                                src={
                                  image
                                }
                                alt={
                                  product.name
                                }
                                loading="lazy"
                              />
                            ) : (
                              <div className="nm-pro-placeholder">

                                <strong>
                                  ORINOCA
                                </strong>

                                <span>
                                  NATURAL
                                </span>

                              </div>
                            )}

                          </div>

                          {/* DETAILS */}

                          <div className="nm-pro-info">

                            <p className="nm-pro-category">
                              {
                                category
                              }
                            </p>

                            <h2 className="nm-pro-title">
                              {
                                product.name
                              }
                            </h2>

                            <p className="nm-pro-brand">
                              ORINOCA NATURAL
                            </p>

                            <div className="nm-pro-prices">

                              {oldPrice ? (
                                <del>
                                  {formatPrice(
                                    oldPrice
                                  )}
                                </del>
                              ) : null}

                              <strong>
                                {formatPrice(
                                  product.price
                                )}
                              </strong>

                            </div>

                          </div>

                        </Link>

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