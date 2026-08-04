import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-session";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";

const updateOrderSchema = z.object({
  orderId: z.string().length(24),
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
});

export async function GET() {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to load orders" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const parsed = updateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid order update" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const order = await Order.findByIdAndUpdate(
      parsed.data.orderId,
      { status: parsed.data.status },
      { new: true }
    ).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to update order" },
      { status: 500 }
    );
  }
}