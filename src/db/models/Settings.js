import { model, Schema } from 'mongoose';

export const shopSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    company: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ShopsCollection = model('shops', shopSchema);
