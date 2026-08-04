import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-session";
import { connectToDatabase } from "@/lib/mongodb";
import { PromoCode } from "@/models/PromoCode";

const promoSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .min(3, "Promo code must have at least 3 characters")
    .max(30)
    .regex(/^[A-Z0-9_-]+$/, "Use only letters, numbers, - or _"),

  discountPercent: z.coerce.number().min(1).max(90),

  minimumOrderAmount: z.coerce.number().min(0).default(0),

  expiresAt: z.string().optional().or(z.literal("")),

  isActive: z.boolean().default(true),
});

const updateSchema = promoSchema.extend({
  id: z.string().length(24),
});

async function requireAdmin() {
  const admin = await getAdminSession();

  if (!admin) {
    return null;
  }

  return admin;
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

    const promos = await PromoCode.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      promos,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to load promo codes." },
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
    const parsed = promoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message || "Invalid promo code data.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const expiresAt = parsed.data.expiresAt
      ? new Date(parsed.data.expiresAt)
      : null;

    if (expiresAt && Number.isNaN(expiresAt.getTime())) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid expiry date." },
        { status: 400 }
      );
    }

    const existing = await PromoCode.findOne({ code: parsed.data.code });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "This promo code already exists." },
        { status: 409 }
      );
    }

    const promo = await PromoCode.create({
      code: parsed.data.code,
      discountPercent: parsed.data.discountPercent,
      minimumOrderAmount: parsed.data.minimumOrderAmount,
      expiresAt,
      isActive: parsed.data.isActive,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Promo code created successfully.",
        promo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to create promo code." },
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
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message || "Invalid promo code data.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const expiresAt = parsed.data.expiresAt
      ? new Date(parsed.data.expiresAt)
      : null;

    if (expiresAt && Number.isNaN(expiresAt.getTime())) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid expiry date." },
        { status: 400 }
      );
    }

    const promo = await PromoCode.findByIdAndUpdate(
      parsed.data.id,
      {
        code: parsed.data.code,
        discountPercent: parsed.data.discountPercent,
        minimumOrderAmount: parsed.data.minimumOrderAmount,
        expiresAt,
        isActive: parsed.data.isActive,
      },
      { new: true, runValidators: true }
    );

    if (!promo) {
      return NextResponse.json(
        { success: false, message: "Promo code not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Promo code updated successfully.",
      promo,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to update promo code." },
      { status: 500 }
    );
  }
}