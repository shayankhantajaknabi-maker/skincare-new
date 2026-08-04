import { Schema, model, models } from "mongoose";

const PromoCodeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: 30,
    },

    discountPercent: {
      type: Number,
      required: true,
      min: 1,
      max: 90,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    minimumOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const PromoCode =
  models.PromoCode || model("PromoCode", PromoCodeSchema);

export default PromoCode;