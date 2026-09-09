import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-session";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";

const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      "Category name is required"
    )
    .max(60),

  isActive: z
    .boolean()
    .default(true),

  sortOrder: z
    .number()
    .int()
    .min(0)
    .max(9999)
    .default(0),
});

function createSlug(
  value: string
) {
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

function escapeRegExp(
  value: string
) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

async function requireAdmin() {
  return getAdminSession();
}

/*
  Automatically import categories
  already being used by existing
  products.

  Example:
  General
  Serum
  Shoes
*/
async function importExistingProductCategories() {
  const productCategories =
    await Product.distinct(
      "category",
      {
        category: {
          $type: "string",
          $ne: "",
        },
      }
    );

  for (
    const rawCategory
    of productCategories
  ) {
    const name =
      String(
        rawCategory || ""
      ).trim();

    if (!name) {
      continue;
    }

    const slug =
      createSlug(name);

    if (!slug) {
      continue;
    }

    await Category.updateOne(
      {
        slug,
      },
      {
        $setOnInsert: {
          name,
          slug,
          isActive: true,
          sortOrder: 0,
        },
      },
      {
        upsert: true,
      }
    );
  }
}

/* =========================
   GET CATEGORIES
========================= */

export async function GET() {
  try {
    const admin =
      await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    await connectToDatabase();

    /*
      Keeps existing products safe.
      Their current categories
      automatically become managed
      categories.
    */
    await importExistingProductCategories();

    const categories =
      await Category.find({})
        .sort({
          sortOrder: 1,
          name: 1,
        })
        .lean();

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error(
      "Unable to load categories:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load categories.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   CREATE CATEGORY
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
          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const parsed =
      categorySchema.safeParse(
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
            "Invalid category data.",
        },
        {
          status: 400,
        }
      );
    }

    await connectToDatabase();

    const name =
      parsed.data.name.trim();

    const slug =
      createSlug(name);

    const existing =
      await Category.findOne({
        $or: [
          {
            slug,
          },

          {
            name: {
              $regex:
                `^${escapeRegExp(
                  name
                )}$`,

              $options:
                "i",
            },
          },
        ],
      });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This category already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const category =
      await Category.create({
        name,

        slug,

        isActive:
          parsed.data
            .isActive,

        sortOrder:
          parsed.data
            .sortOrder,
      });

    return NextResponse.json(
      {
        success: true,
        category,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Unable to create category:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to create category.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   UPDATE CATEGORY
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
          message:
            "Unauthorized",
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
      ...categoryData
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
            "Category ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const parsed =
      categorySchema.safeParse(
        categoryData
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,

          message:
            parsed.error
              .issues[0]
              ?.message ||
            "Invalid category data.",
        },
        {
          status: 400,
        }
      );
    }

    await connectToDatabase();

    const category =
      await Category.findById(
        id
      );

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Category not found.",
        },
        {
          status: 404,
        }
      );
    }

    const oldName =
      category.name;

    const newName =
      parsed.data
        .name
        .trim();

    const newSlug =
      createSlug(
        newName
      );

    const duplicate =
      await Category.findOne({
        _id: {
          $ne: id,
        },

        $or: [
          {
            slug:
              newSlug,
          },

          {
            name: {
              $regex:
                `^${escapeRegExp(
                  newName
                )}$`,

              $options:
                "i",
            },
          },
        ],
      });

    if (duplicate) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Another category already uses this name.",
        },
        {
          status: 409,
        }
      );
    }

    category.name =
      newName;

    category.slug =
      newSlug;

    category.isActive =
      parsed.data
        .isActive;

    category.sortOrder =
      parsed.data
        .sortOrder;

    await category.save();

    /*
      Important:
      if category is renamed,
      existing products are renamed
      automatically too.
    */
    if (
      oldName !==
      newName
    ) {
      await Product.updateMany(
        {
          category: {
            $regex:
              `^${escapeRegExp(
                oldName
              )}$`,

            $options:
              "i",
          },
        },
        {
          $set: {
            category:
              newName,
          },
        }
      );
    }

    return NextResponse.json({
      success: true,

      message:
        "Category updated successfully.",

      category,
    });
  } catch (error) {
    console.error(
      "Unable to update category:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Unable to update category.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   DELETE CATEGORY
========================= */

export async function DELETE(
  request: Request
) {
  try {
    const admin =
      await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const {
      searchParams,
    } = new URL(
      request.url
    );

    const id =
      searchParams.get(
        "id"
      );

    if (!id) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Category ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    await connectToDatabase();

    const category =
      await Category.findById(
        id
      );

    if (!category) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Category not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
      Prevent accidental deletion
      while products still belong
      to this category.
    */
    const productCount =
      await Product.countDocuments(
        {
          category: {
            $regex:
              `^${escapeRegExp(
                category.name
              )}$`,

            $options:
              "i",
          },
        }
      );

    if (
      productCount > 0
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            `This category is used by ${productCount} product${
              productCount ===
              1
                ? ""
                : "s"
            }. Move those products first.`,
        },
        {
          status: 409,
        }
      );
    }

    await category.deleteOne();

    return NextResponse.json({
      success: true,

      message:
        "Category deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Unable to delete category:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Unable to delete category.",
      },
      {
        status: 500,
      }
    );
  }
}