import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-session";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";

const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name is required"),

  category: z
    .string()
    .trim()
    .min(2, "Category is required")
    .max(60),

  shortDescription: z
    .string()
    .trim()
    .optional()
    .default(""),

  description: z
    .string()
    .trim()
    .optional()
    .default(""),

  price: z
    .number()
    .min(
      0,
      "Price must be zero or greater"
    ),

  compareAtPrice: z
    .number()
    .min(0)
    .nullable()
    .optional(),

  stock: z
    .number()
    .int()
    .min(
      0,
      "Stock cannot be negative"
    ),

  imageUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  isActive: z
    .boolean()
    .default(true),

  featured: z
    .boolean()
    .default(false),

  /*
   * HOMEPAGE
   *
   * Optional rakhe hain taa-ke
   * existing actions/toggles accidentally
   * homepage selection reset na karein.
   */
  showOnHomepage: z
    .boolean()
    .optional(),

  homepageOrder: z
    .number()
    .int()
    .min(0)
    .max(3)
    .optional(),

  packType: z
    .enum([
      "single",
      "twin",
      "family",
    ])
    .default("single"),

  units: z
    .number()
    .int()
    .min(1)
    .max(20)
    .default(1),

  badge: z
    .string()
    .trim()
    .max(40)
    .optional()
    .default(""),

  benefits: z
    .array(z.string().trim())
    .optional()
    .default([]),

  ingredients: z
    .array(
      z.object({
        name: z.string().trim(),

        description: z.string().trim(),

        image: z
          .string()
          .trim()
          .optional()
          .default(""),
      })
    )
    .optional()
    .default([]),

  howToUse: z
    .array(
      z.object({
        title: z.string().trim(),

        description: z.string().trim(),

        image: z
          .string()
          .trim()
          .optional()
          .default(""),
      })
    )
    .optional()
    .default([]),

  story: z
    .string()
    .trim()
    .optional()
    .default(""),

  beforeAfter: z
    .object({
      beforeImage: z
        .string()
        .trim()
        .optional()
        .default(""),

      afterImage: z
        .string()
        .trim()
        .optional()
        .default(""),

      description: z
        .string()
        .trim()
        .optional()
        .default(""),
    })
    .optional()
    .default({
      beforeImage: "",
      afterImage: "",
      description: "",
    }),
});

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /(^-|-$)/g,
      ""
    );
}

async function requireAdmin() {
  const admin =
    await getAdminSession();

  if (!admin) {
    return null;
  }

  return admin;
}

async function getAvailableSlug(
  name: string,
  productId?: string
) {
  const baseSlug =
    createSlug(name) ||
    "orinoca-product";

  let slug = baseSlug;
  let number = 2;

  while (
    await Product.exists({
      slug,

      ...(productId
        ? {
          _id: {
            $ne: productId,
          },
        }
        : {}),
    })
  ) {
    slug = `${baseSlug}-${number}`;
    number += 1;
  }

  return slug;
}

/* =====================================================
   HOMEPAGE HELPERS
===================================================== */

async function validateHomepageSelection({
  productId,
  showOnHomepage,
  homepageOrder,
}: {
  productId?: string;
  showOnHomepage: boolean;
  homepageOrder: number;
}) {
  /*
   * Product homepage par nahi hai
   * to order ki koi zarurat nahi.
   */
  if (!showOnHomepage) {
    return {
      success: true as const,
    };
  }

  /*
   * Homepage par show karna ho to
   * position 1, 2 ya 3 required hai.
   */
  if (
    homepageOrder < 1 ||
    homepageOrder > 3
  ) {
    return {
      success: false as const,
      message:
        "Choose homepage position 1, 2 or 3.",
    };
  }

  /*
   * Maximum 3 products.
   */
  const homepageProductCount =
    await Product.countDocuments({
      showOnHomepage: true,

      ...(productId
        ? {
          _id: {
            $ne: productId,
          },
        }
        : {}),
    });

  if (homepageProductCount >= 3) {
    return {
      success: false as const,
      message:
        "Homepage already has 3 products. Remove one before adding another.",
    };
  }

  /*
   * Same position kisi aur product
   * ko already assigned na ho.
   */
  const positionTaken =
    await Product.exists({
      showOnHomepage: true,

      homepageOrder,

      ...(productId
        ? {
          _id: {
            $ne: productId,
          },
        }
        : {}),
    });

  if (positionTaken) {
    return {
      success: false as const,
      message: `Homepage position ${homepageOrder} is already being used by another product.`,
    };
  }

  return {
    success: true as const,
  };
}

/* =========================
   GET PRODUCTS
========================= */

export async function GET() {
  try {
    const admin =
      await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    await connectToDatabase();

    const products =
      await Product.find()
        .sort({
          createdAt: -1,
        })
        .lean();

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load products.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   CREATE PRODUCT
========================= */

export async function POST(
  request: Request
) {
  try {
    const admin =
      await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const parsed =
      productSchema.safeParse(
        body
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,

          message:
            parsed.error
              .issues[0]
              ?.message ||
            "Invalid product data.",
        },
        {
          status: 400,
        }
      );
    }

    await connectToDatabase();

    const data =
      parsed.data;

    const showOnHomepage =
      data.showOnHomepage ??
      false;

    const homepageOrder =
      showOnHomepage
        ? Number(
          data.homepageOrder ||
          0
        )
        : 0;

    /*
     * Validate homepage selection
     * before product creation.
     */
    const homepageValidation =
      await validateHomepageSelection(
        {
          showOnHomepage,
          homepageOrder,
        }
      );

    if (
      !homepageValidation.success
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            homepageValidation.message,
        },
        {
          status: 400,
        }
      );
    }

    const slug =
      await getAvailableSlug(
        data.name
      );

    const product =
      await Product.create({
        name:
          data.name,

        slug,

        category:
          data.category,

        shortDescription:
          data.shortDescription,

        description:
          data.description,

        price:
          data.price,

        compareAtPrice:
          data.compareAtPrice ??
          null,

        stock:
          data.stock,

        images:
          data.imageUrl
            ? [
              data.imageUrl,
            ]
            : [],

        isActive:
          data.isActive,

        featured:
          data.featured,

        /*
         * HOMEPAGE
         */
        showOnHomepage,

        homepageOrder,

        packType:
          data.packType,

        units:
          data.units,

        badge:
          data.badge,

        benefits:
          data.benefits,

        ingredients:
          data.ingredients,

        howToUse:
          Array.isArray(data.howToUse)
            ? data.howToUse.map((item: any) => ({
              title: item.title || "",
              description: item.description || "",
              image: item.image || "",
            }))

          : [],
            

        story:
          data.story,

        beforeAfter:
          data.beforeAfter,
      });

    return NextResponse.json(
      {
        success: true,
        product,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to create product.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   UPDATE PRODUCT
========================= */

export async function PATCH(
  request: Request
) {
  try {
    const admin =
      await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const {
      id,
      ...productData
    } = body;

    if (
      !id ||
      typeof id !==
      "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const parsed =
      productSchema.safeParse(
        productData
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,

          message:
            parsed.error
              .issues[0]
              ?.message ||
            "Invalid product data.",
        },
        {
          status: 400,
        }
      );
    }

    await connectToDatabase();

    const existingProduct =
      await Product.findById(
        id
      );

    if (
      !existingProduct
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    const data =
      parsed.data;

    /*
     * IMPORTANT:
     *
     * Agar old admin action
     * showOnHomepage send nahi karta,
     * existing MongoDB value preserve hogi.
     *
     * Is wajah se Store Visibility
     * toggle homepage selection ko
     * accidentally reset nahi karega.
     */
    const showOnHomepage =
      data.showOnHomepage !==
        undefined
        ? data.showOnHomepage
        : Boolean(
          existingProduct.showOnHomepage
        );

    const homepageOrder =
      showOnHomepage
        ? data.homepageOrder !==
          undefined
          ? Number(
            data.homepageOrder
          )
          : Number(
            existingProduct.homepageOrder ||
            0
          )
        : 0;

    const homepageValidation =
      await validateHomepageSelection(
        {
          productId: id,
          showOnHomepage,
          homepageOrder,
        }
      );

    if (
      !homepageValidation.success
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            homepageValidation.message,
        },
        {
          status: 400,
        }
      );
    }

    const slug =
      await getAvailableSlug(
        data.name,
        id
      );

    existingProduct.name =
      data.name;

    existingProduct.slug =
      slug;

    existingProduct.category =
      data.category;

    existingProduct.shortDescription =
      data.shortDescription;

    existingProduct.description =
      data.description;

    existingProduct.price =
      data.price;

    existingProduct.compareAtPrice =
      data.compareAtPrice ??
      null;

    existingProduct.stock =
      data.stock;

    existingProduct.isActive =
      data.isActive;

    existingProduct.featured =
      data.featured;

    /*
     * HOMEPAGE
     */
    existingProduct.showOnHomepage =
      showOnHomepage;

    existingProduct.homepageOrder =
      homepageOrder;

    existingProduct.packType =
      data.packType;

    existingProduct.units =
      data.units;

    existingProduct.badge =
      data.badge;


    existingProduct.benefits =
      data.benefits;

    existingProduct.ingredients =
      data.ingredients;

    existingProduct.howToUse =
      Array.isArray(data.howToUse)
        ? data.howToUse.map((item: any) => ({
          title: item.title || "",
          description: item.description || "",
          image: item.image || "",
        }))
        : [];

    existingProduct.story =
      data.story;

    existingProduct.beforeAfter =
      data.beforeAfter;

    if (
      data.imageUrl
    ) {
      existingProduct.images =
        [
          data.imageUrl,
        ];
    }

    await existingProduct.save();

    return NextResponse.json({
      success: true,

      message:
        "Product updated successfully.",

      product:
        existingProduct,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,

        message:
          "Unable to update product.",
      },
      {
        status: 500,
      }
    );
  }
}