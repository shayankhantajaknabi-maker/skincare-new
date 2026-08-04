import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PromoCode } from "@/models/PromoCode";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const code = (searchParams.get("code") || "").trim().toUpperCase();
    const subtotal = Number(searchParams.get("subtotal") || 0);

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Enter a promo code." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(subtotal) || subtotal < 0) {
      return NextResponse.json(
        { success: false, message: "Invalid cart total." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const promo = await PromoCode.findOne({
      code: {
        $regex: `^${escapeRegex(code)}$`,
        $options: "i",
      },
    });

    if (!promo || promo.isActive === false) {
      return NextResponse.json(
        { success: false, message: "This promo code is invalid or disabled." },
        { status: 404 }
      );
    }

    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, message: "This promo code has expired." },
        { status: 400 }
      );
    }

    if (subtotal < promo.minimumOrderAmount) {
      return NextResponse.json(
        {
          success: false,
          message: `This code requires a minimum order of Rs. ${promo.minimumOrderAmount.toLocaleString()}.`,
        },
        { status: 400 }
      );
    }

    const discountAmount = Math.round(
      (subtotal * promo.discountPercent) / 100
    );

    return NextResponse.json({
      success: true,
      promo: {
        code: promo.code,
        discountPercent: promo.discountPercent,
        discountAmount,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to validate promo code.",
      },
      { status: 500 }
    );
  }
}