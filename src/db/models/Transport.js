import { model, Schema } from 'mongoose';

export const TripSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    driver: {
      type: String,
      required: true,
    },
    truck: {
      type: String,
      required: true,
    },
    loadingPlace: {
      type: String,
      required: true,
    },
    loadDate: {
      type: String,
      required: false,
    },
    unloadingPlace: {
      type: String,
      required: true,
    },
    unloadDate: {
      type: String,
      required: false,
    },
    rangeTo: {
      type: Number,
      required: false,
    },
    range: {
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
    payment_Form: {
      type: String,
      required: true,
    },
    dispetcher_fee: {
      type: Number,
      required: false,
    },
    dispetcher_Currency: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const TripCollection = model('trips', TripSchema);
