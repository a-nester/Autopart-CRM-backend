import { Product } from '../db/models/Product.js';
import { ProductsGroupe } from '../db/models/ProductsGproupe.js';

export const findGroupeByCode = (code) => ProductsGroupe.findOne({ code });

export const findAllGroups = () => ProductsGroupe.find();

export const createProductsGroupe = async (data) =>
  await ProductsGroupe.create({ ...data });

export const upsertProductsGroupe = async (code, updates) => {
  console.log('UPDATES', updates);

  const shopKey = updates.promShop; // Ключ магазину (наприклад, "AvtoKlan")
  const promGroupValue = updates[shopKey]; // Значення, яке ми додаємо

  if (!shopKey) {
    throw new Error('promShop is undefined');
  }

  console.log('🔍 Updating with:', {
    [`promGroup.${shopKey}`]: promGroupValue,
  });

  const updatedGroup = await ProductsGroupe.findOneAndUpdate(
    { code },
    {
      $set: {
        [`promGroup.${shopKey}`]: promGroupValue, // ✅ Правильний шлях
      },
    },
    { new: true, upsert: true },
  );

  console.log('✅ Updated GROUP:', updatedGroup);
  return updatedGroup;
};

export const findProductByCode = (code) => Product.findOne({ code });

export const createProduct = (productData) =>
  Product.create({ ...productData });

export const findAllProducts = () => Product.find({});

export const findProductsByGroupeId = (groupId) =>
  Product.find({ productGroupId: groupId });

export const updateProductByCode = (_id, updates) =>
  Product.findOneAndUpdate({ _id }, updates, { new: true });

export const updateProductByArticle = async (article, updates) => {
  return await Product.findOneAndUpdate({ article }, updates, { new: true });
};

// /products/edit_by_external_id
