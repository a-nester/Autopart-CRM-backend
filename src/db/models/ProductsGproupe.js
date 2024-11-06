import { model, Schema } from 'mongoose';

export const ProductsGroupeSchema = new Schema(
  {
    code: {
      type: Number,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ProductsGroupe = model('productsGroupes', ProductsGroupeSchema);
