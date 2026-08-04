import { NextResponse } from "next/server";
import { type ClientSession } from "mongoose";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { PromoCode } from "@/models/PromoCode";

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2).max(100),
    phone: z.string().min(8).max(25),
    email: z.string().email().optional().or(z.literal("")),
    address: z.string().min(5).max(300),
    city: z.string().min(2).max(100),
    postalCode: z.string().max(20).optional().or(z.literal("")),
    notes: z.string().max(500).optional().or(z.literal("")),
  }),
  promoCode: z.string().max(30).optional().or(z.literal("")),
  items: z
    .array(
      z.object({
        productId: z.string().length(24),
        quantity: z.coerce.number().int().min(1).max(20),
      })
    )
    .min(1),
});

type CreatedOrder = {
  orderNumber: string;
  total: number;
  status: string;
};

function createOrderNumber() {
  const time = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `NM-${time}-${random}`;
}

export async function POST(request: Request) {
  let session: ClientSession | null = null;

  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide valid checkout information.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();
    session = await Product.startSession();

    let createdOrder: CreatedOrder | null = null;

    await session.withTransaction(async () => {
      const orderItems: {
        productId: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
      }[] = [];

      let subtotal = 0;

      for (const item of parsed.data.items) {
        const product = await Product.findOne({
          _id: item.productId,
          isActive: true,
        }).session(session);

        if (!product) {
          throw new Error("One of the products is no longer available.");
        }

        if (product.stock < item.quantity) {
          throw new Error(`${product.name} does not have enough stock.`);
        }

        product.stock -= item.quantity;
        await product.save({ session });

        subtotal += product.price * item.quantity;

        orderItems.push({
          productId: product._id.toString(),
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.images?.[0] || "",
        });
      }

      const promoCode = (parsed.data.promoCode ?? "").trim().toUpperCase();

      let discountAmount = 0;

      if (promoCode) {
        const promo = await PromoCode.findOne({
          code: promoCode,
          isActive: true,
        }).session(session);

        if (!promo) {
          throw new Error("This promo code is invalid or inactive.");
        }

        if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
          throw new Error("This promo code has expired.");
        }

        if (subtotal < promo.minimumOrderAmount) {
          throw new Error(
            `This promo code requires a minimum order of Rs. ${promo.minimumOrderAmount.toLocaleString()}.`
          );
        }

        discountAmount = Math.round(
          (subtotal * promo.discountPercent) / 100
        );
      }

      const discountedSubtotal = Math.max(0, subtotal - discountAmount);
      const deliveryFee = discountedSubtotal >= 3000 ? 0 : 200;
      const total = discountedSubtotal + deliveryFee;

      const orders = await Order.create(
        [
          {
            orderNumber: createOrderNumber(),
            customer: parsed.data.customer,
            items: orderItems,
            subtotal,
            promoCode,
            discountAmount,
            deliveryFee,
            total,
            paymentMethod: "cod",
            paymentStatus: "pending",
            status: "pending",
          },
        ],
        { session }
      );

      const savedOrder = orders[0];

      createdOrder = {
        orderNumber: savedOrder.orderNumber,
        total: savedOrder.total,
        status: savedOrder.status,
      };
    });

    if (!createdOrder) {
      throw new Error("Order could not be created.");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully.",
        order: createdOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to place order. Please try again.",
      },
      { status: 400 }
    );
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}