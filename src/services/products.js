import { Product } from '../db/models/Product.js';
import { ProductsGroupe } from '../db/models/ProductsGproupe.js';

export const findGroupeByCode = (code) => ProductsGroupe.findOne({ code });

export const createProductsGroupe = (data) =>
  ProductsGroupe.create({ ...data });

export const findProductByCode = (code) => Product.findOne({ code });

export const createProduct = (productData) =>
  Product.create({ ...productData });

export const findAllProducts = () => Product.find({});

export const findProductsByGroupeId = (groupId) =>
  Product.find({ productGroupId: groupId });

export const updateProductByCode = (code, updates) =>
  Product.findOneAndUpdate({ code }, updates, { new: true });

export const updateProductByArticle = async (article, updates) => {
  return await Product.findOneAndUpdate({ article }, updates, { new: true });
};

// /products/edit_by_external_id
