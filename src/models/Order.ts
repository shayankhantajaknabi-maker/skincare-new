import {
  Schema,
  model,
  models,
  type Model,
} from "mongoose";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderPaymentStatus =
  | "pending"
  | "paid"
  | "failed";

export type OrderItem = {
  productId: Schema.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type OrderCustomer = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
};

export type OrderShipping = {
  courier: string;
  shippingMethod: string;
  trackingNumber: string;
  shippedAt: Date | null;
};

export type OrderDocumentShape = {
  orderNumber: string;

  customer: OrderCustomer;

  items: OrderItem[];

  subtotal: number;

  promoCode: string;

  discountAmount: number;

  deliveryFee: number;

  total: number;

  paymentMethod: "cod";

  paymentStatus: OrderPaymentStatus;

  status: OrderStatus;

  shipping: OrderShipping;

  createdAt: Date;

  updatedAt: Date;
};

const OrderItemSchema =
  new Schema<OrderItem>(
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },

      image: {
        type: String,
        default: "",
      },
    },
    {
      _id: false,
    }
  );

const ShippingSchema =
  new Schema<OrderShipping>(
    {
      courier: {
        type: String,
        default: "",
        trim: true,
      },

      shippingMethod: {
        type: String,
        default: "",
        trim: true,
      },

      trackingNumber: {
        type: String,
        default: "",
        trim: true,
      },

      shippedAt: {
        type: Date,
        default: null,
      },
    },
    {
      _id: false,
    }
  );

const OrderSchema =
  new Schema<OrderDocumentShape>(
    {
      orderNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      customer: {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        phone: {
          type: String,
          required: true,
          trim: true,
        },

        email: {
          type: String,
          default: "",
          trim: true,
          lowercase: true,
        },

        address: {
          type: String,
          required: true,
          trim: true,
        },

        city: {
          type: String,
          required: true,
          trim: true,
        },

        postalCode: {
          type: String,
          default: "",
          trim: true,
        },

        notes: {
          type: String,
          default: "",
          trim: true,
        },
      },

      items: {
        type: [OrderItemSchema],
        required: true,

        validate: {
          validator: (
            items: OrderItem[]
          ) => items.length > 0,

          message:
            "Order must contain at least one item",
        },
      },

      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },

      promoCode: {
        type: String,
        default: "",
        trim: true,
        uppercase: true,
      },

      discountAmount: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },

      deliveryFee: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },

      total: {
        type: Number,
        required: true,
        min: 0,
      },

      paymentMethod: {
        type: String,
        enum: ["cod"],
        default: "cod",
      },

      paymentStatus: {
        type: String,
        enum: [
          "pending",
          "paid",
          "failed",
        ],
        default: "pending",
      },

      status: {
        type: String,
        enum: [
          "pending",
          "confirmed",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ],
        default: "pending",
      },

      shipping: {
        type: ShippingSchema,
        default: () => ({
          courier: "",
          shippingMethod: "",
          trackingNumber: "",
          shippedAt: null,
        }),
      },
    },
    {
      timestamps: true,
    }
  );

export const Order =
  (models.Order as Model<OrderDocumentShape>) ||
  model<OrderDocumentShape>(
    "Order",
    OrderSchema
  );

export default Order;