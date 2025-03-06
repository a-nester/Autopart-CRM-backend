import { model, Schema } from 'mongoose';

export const CustomerSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    company: {
      type: String,
      require: false,
    },
    phone: {
      type: String,
      require: false,
    },
    email: {
      type: String,
      require: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const CustomersCollection = model('customers', CustomerSchema);
