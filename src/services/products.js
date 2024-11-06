import { Product } from '../db/models/Product.js';
import { ProductsGroupe } from '../db/models/ProductsGproupe.js';

export const findGroupeByCode = (code) => ProductsGroupe.findOne({ code });

export const createProductsGroupe = (data) =>
  ProductsGroupe.create({ ...data });

export const findProductByCode = (code) => Product.findOne({ code });

export const createProduct = (productData) =>
  Product.create({ ...productData });

export const findAllProducts = () => Product.find({});

export const updateProductByCode = (code, updates) =>
  Product.findOneAndUpdate({ code }, updates, { new: true });
