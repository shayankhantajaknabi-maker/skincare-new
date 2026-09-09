import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-session";
import { connectToDatabase } from "@/lib/mongodb";
import {
  Order,
  type OrderItem,
} from "@/models/Order";
import { sendOrderStatusEmail } from "@/lib/order-emails";

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

  courier: z
    .string()
    .trim()
    .max(100)
    .optional(),

  shippingMethod: z
    .string()
    .trim()
    .max(100)
    .optional(),

  trackingNumber: z
    .string()
    .trim()
    .max(150)
    .optional(),
});

export async function GET() {
  const admin = await getAdminSession();

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

  try {
    await connectToDatabase();

    const orders = await Order.find({})
      .sort({
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load orders",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: Request
) {
  const admin = await getAdminSession();

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

  try {
    const body = await request.json();

    const parsed =
      updateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            parsed.error.issues[0]?.message ||
            "Invalid order update",
        },
        {
          status: 400,
        }
      );
    }

    const {
      orderId,
      status,
      courier,
      shippingMethod,
      trackingNumber,
    } = parsed.data;

    /*
     * Shipping information is mandatory
     * when the admin marks an order shipped.
     */
    if (status === "shipped") {
      if (
        !courier?.trim() ||
        !shippingMethod?.trim() ||
        !trackingNumber?.trim()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Courier, shipping method and tracking number are required before shipping.",
          },
          {
            status: 400,
          }
        );
      }
    }

    await connectToDatabase();

    const existingOrder =
      await Order.findById(orderId);

    if (!existingOrder) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        {
          status: 404,
        }
      );
    }

    const previousStatus =
      existingOrder.status;

    /*
     * Update the existing document rather
     * than replacing any order information.
     */
    existingOrder.status = status;

    if (status === "shipped") {
      existingOrder.shipping = {
        courier: courier!.trim(),
        shippingMethod:
          shippingMethod!.trim(),
        trackingNumber:
          trackingNumber!.trim(),
        shippedAt:
          existingOrder.shipping
            ?.shippedAt || new Date(),
      };
    }

    await existingOrder.save();

    const statusChanged =
      previousStatus !== status;

    const emailStatus:
      | "shipped"
      | "delivered"
      | null =
      status === "shipped" ||
      status === "delivered"
        ? status
        : null;

    if (
      statusChanged &&
      emailStatus &&
      existingOrder.customer.email
    ) {
      try {
        await sendOrderStatusEmail(
          {
            orderNumber:
              existingOrder.orderNumber,

            customerName:
              existingOrder.customer.name,

            customerEmail:
              existingOrder.customer.email,

            total:
              existingOrder.total,

            items:
              existingOrder.items.map(
                (item: OrderItem) => ({
                  name: item.name,
                  price: item.price,
                  quantity:
                    item.quantity,
                })
              ),

            shipping:
              existingOrder.shipping
                ? {
                    courier:
                      existingOrder
                        .shipping
                        .courier,

                    shippingMethod:
                      existingOrder
                        .shipping
                        .shippingMethod,

                    trackingNumber:
                      existingOrder
                        .shipping
                        .trackingNumber,
                  }
                : undefined,
          },
          emailStatus
        );
      } catch (emailError) {
        /*
         * Do NOT undo the order status if
         * Resend temporarily fails.
         */
        console.error(
          "Order status email failed:",
          emailError
        );
      }
    }

    return NextResponse.json({
      success: true,
      order:
        existingOrder.toObject(),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update order",
      },
      {
        status: 500,
      }
    );
  }
}