import { findProductsByGroupeId } from '../services/products.js';
import { editProductsById } from './api.js';

export const getProductsFromDbByGroupeId = async (groupe, store) => {
  const productsList = await findProductsByGroupeId(groupe);

  const editList = [];
  for (const product of productsList) {
    if (
      product.quantity > 0 ||
      product.quantity === '+' ||
      product.quantity === null
    ) {
      const productId =
        product.promProductId instanceof Map
          ? product.promProductId.get(store)
          : undefined;

      const discount =
        product.promDiscount instanceof Map
          ? product.promDiscount.get(store)
          : {};
      if (!productId) {
        continue;
      }

      editList.push({
        id: productId,
        presence: product.quantity === null ? 'not_available' : 'available',
        quantity_in_stock:
          product.quantity === '+' ? 100 : Number(product.quantity),
        price: product.promPrice,
        discount: discount || {},
      });
    }
  }

  return editList;
};

export const sendDataToProm = async (groups, store) => {
  console.log('Start send data to prom', groups, store);

  const productListToProm = [];
  for (const group of groups) {
    const products = await getProductsFromDbByGroupeId(group, store); // store[0]

    if (products) productListToProm.push(...products);
  }
  const response = await editProductsById(productListToProm, store);
  if (!response.error) {
    console.log('Successfully upload group`s changes to Prom', response);

    // перевірка помилок у відповіді
    for (const result of response) {
      if (result.errors) {
        console.log('Errors found:');
        for (const [productId, errorDetails] of Object.entries(result.errors)) {
          console.log(`❌ Product ID ${productId}:`, errorDetails);
        }
      }
    }
  } else {
    console.log('PromAPI fetch returns with error:', response);
  }
};
