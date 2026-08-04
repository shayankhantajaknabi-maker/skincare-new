import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-session";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";

const productSchema = z.object({
  name: z.string().trim().min(2, "Product name is required"),
  shortDescription: z.string().trim().optional().default(""),
  description: z.string().trim().optional().default(""),
  price: z.number().min(0, "Price must be zero or greater"),
  compareAtPrice: z.number().min(0).nullable().optional(),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  imageUrl: z.string().trim().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false),
  packType: z.enum(["single", "twin", "family"]).default("single"),
  units: z.number().int().min(1).max(20).default(1),
  badge: z.string().trim().max(40).optional().default(""),
});

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function requireAdmin() {
  const admin = await getAdminSession();

  if (!admin) {
    return null;
  }

  return admin;
}

async function getAvailableSlug(name: string, productId?: string) {
  const baseSlug = createSlug(name) || "nm-skin-care-product";
  let slug = baseSlug;
  let number = 2;

  while (
    await Product.exists({
      slug,
      ...(productId ? { _id: { $ne: productId } } : {}),
    })
  ) {
    slug = `${baseSlug}-${number}`;
    number += 1;
  }

  return slug;
}

export async function GET() {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const products = await Product.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to load products." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message || "Invalid product data.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const data = parsed.data;
    const slug = await getAvailableSlug(data.name);

    const product = await Product.create({
      name: data.name,
      slug,
      shortDescription: data.shortDescription,
      description: data.description,
      price: data.price,
      compareAtPrice: data.compareAtPrice ?? null,
      stock: data.stock,
      images: data.imageUrl ? [data.imageUrl] : [],
      isActive: data.isActive,
      featured: data.featured,
      packType: data.packType,
      units: data.units,
      badge: data.badge,
    });

    return NextResponse.json(
      { success: true, product },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to create product." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...productData } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, message: "Product ID is required." },
        { status: 400 }
      );
    }

    const parsed = productSchema.safeParse(productData);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message || "Invalid product data.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    const data = parsed.data;
    const slug = await getAvailableSlug(data.name, id);

    existingProduct.name = data.name;
    existingProduct.slug = slug;
    existingProduct.shortDescription = data.shortDescription;
    existingProduct.description = data.description;
    existingProduct.price = data.price;
    existingProduct.compareAtPrice = data.compareAtPrice ?? null;
    existingProduct.stock = data.stock;
    existingProduct.isActive = data.isActive;
    existingProduct.featured = data.featured;
    existingProduct.packType = data.packType;
    existingProduct.units = data.units;
    existingProduct.badge = data.badge;

    if (data.imageUrl) {
      existingProduct.images = [data.imageUrl];
    }

    await existingProduct.save();

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
      product: existingProduct,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to update product." },
      { status: 500 }
    );
  }
}