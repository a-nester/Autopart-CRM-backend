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
