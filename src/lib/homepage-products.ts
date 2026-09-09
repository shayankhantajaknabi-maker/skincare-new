import { unstable_cache } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";

export type CachedHomeProduct = {
  _id: string;
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

function cleanProducts(
  products: any[]
): CachedHomeProduct[] {
  return products.map((product) => ({
    _id: String(product._id),

    name:
      product.name || "",

    slug:
      product.slug || "",

    shortDescription:
      product.shortDescription || "",

    price:
      Number(product.price || 0),

    compareAtPrice:
      product.compareAtPrice === null ||
      product.compareAtPrice === undefined
        ? null
        : Number(
            product.compareAtPrice
          ),

    images:
      Array.isArray(
        product.images
      )
        ? product.images.map(
            (image: unknown) =>
              String(image)
          )
        : [],

    badge:
      product.badge || "",

    showOnHomepage:
      Boolean(
        product.showOnHomepage
      ),

    homepageOrder:
      Number(
        product.homepageOrder ||
          0
      ),
  }));
}

async function loadHomepageProducts() {
  await connectToDatabase();

  /*
   * First priority:
   * products selected from admin.
   */
  const selectedProducts =
    await Product.find({
      isActive: true,
      showOnHomepage: true,
    })
      .select({
        _id: 1,
        name: 1,
        slug: 1,
        shortDescription: 1,
        price: 1,
        compareAtPrice: 1,
        images: 1,
        badge: 1,
        showOnHomepage: 1,
        homepageOrder: 1,
      })
      .sort({
        homepageOrder: 1,
        createdAt: 1,
      })
      .limit(3)
      .lean();

  if (
    selectedProducts.length >
    0
  ) {
    return cleanProducts(
      selectedProducts
    );
  }

  /*
   * Safe fallback:
   * agar admin se koi product
   * select nahi hua.
   */
  const fallbackProducts =
    await Product.find({
      isActive: true,
    })
      .select({
        _id: 1,
        name: 1,
        slug: 1,
        shortDescription: 1,
        price: 1,
        compareAtPrice: 1,
        images: 1,
        badge: 1,
        showOnHomepage: 1,
        homepageOrder: 1,
      })
      .sort({
        featured: -1,
        createdAt: 1,
      })
      .limit(3)
      .lean();

  return cleanProducts(
    fallbackProducts
  );
}

/*
 * CACHE:
 *
 * 30 seconds.
 *
 * 100 / 1000 visitors repeatedly
 * homepage open karein to har request
 * MongoDB ko hit nahi karegi.
 */
export const getHomepageProducts =
  unstable_cache(
    loadHomepageProducts,

    [
      "orinoca-homepage-products",
    ],

    {
      revalidate: 30,

      tags: [
        "homepage-products",
      ],
    }
  );