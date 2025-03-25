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
    promGroup: {
      type: Map,
      of: new Schema({
        id: Number,
        name: String,
        discountValue: Number,
        discountType: String,
      }),
    },
    parentGroupeId: {
      type: Number,
      require: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ProductsGroupe = model('productsGroupes', ProductsGroupeSchema);
