import { model, Schema } from 'mongoose';

export const ProductSchema = new Schema(
  {
    code: {
      type: Number,
      require: true,
    },
    article: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    currency: {
      type: String,
      require: false,
    },
    quantity: {
      type: String,
      require: true,
    },
    productGroupId: {
      type: Number,
      require: true,
    },
    promProductId: {
      type: Map,
      of: Number,
    },
    external_id: {
      type: String,
      require: false,
    },
    promPrice: {
      type: Number,
      require: false,
    },
    promDiscount: {
      type: Map,
      of: new Schema({
        type: { type: String, require: false },
        value: { type: Number, require: false },
        date_start: { type: String, require: false },
        date_end: { type: String, require: false },
      }),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

ProductSchema.pre('save', function (next) {
  if (typeof this.price === 'string') {
    this.price = parseFloat(this.price.replace(',', '.'));
  }
  next();
});

export const Product = model('products', ProductSchema);
