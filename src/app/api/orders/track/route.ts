import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const orderNumber = searchParams.get("orderNumber")?.trim();
  const phone = searchParams.get("phone")?.trim();

  if (!orderNumber || !phone) {
    return NextResponse.json(
      {
        success: false,
        message: "Order number and phone number are required.",
      },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    const order = await Order.findOne({
      orderNumber,
      "customer.phone": phone,
    }).lean();

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "No order was found with these details.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        items: order.items,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to track this order." },
      { status: 500 }
    );
  }
}