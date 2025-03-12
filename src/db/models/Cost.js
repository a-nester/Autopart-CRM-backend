import { model, Schema } from 'mongoose';

export const CostSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    odometr: {
      type: Number,
      required: false,
    },
    costType: {
      type: Number,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    companyId: {
      type: String,
      required: false,
    },
    truck: {
      type: String,
      required: false,
    },
    driver: {
      type: String,
      required: false,
    },
    trip: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const CostsCollection = model('costs', CostSchema);
