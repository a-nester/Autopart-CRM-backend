import { Schema, model } from 'mongoose';

export const DiscountTimerSchema = new Schema(
  {
    shop: {
      type: String,
      required: true,
    },
    productId: {
      type: Number,
      required: true,
    },
    dayDiscountType: {
      type: String,
      required: true,
    },
    dayDiscount: {
      type: Number,
      required: true,
    },
    nightDiscountType: {
      type: String,
      required: true,
    },
    nightDiscount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const DiscountTimerCollection = model(
  'discountTimers',
  DiscountTimerSchema,
);
