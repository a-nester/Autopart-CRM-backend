import { findProductsByGroupeId } from '../services/products.js';
import { editProductsById } from './api.js';

export const getProductsFromDbByGroupeId = async (groupe) => {
  const productsList = await findProductsByGroupeId(groupe);
  const editList = [];
  for (const product of productsList) {
    if (product.promProductId && product.quantity > 0) {
      editList.push({
        id: product.promProductId,
        presence: 'available',
        quantity_in_stock:
          product.quantity === '+' ? 100 : Number(product.quantity),
        price: product.promPrice,
        discount: product.promDiscount,
      });
    }
  }
  return editList;
};

export const sendDataToProm = async (code) => {
  // const groupeId = { code: '53399' };
  const groups = [code];
  const productListToProm = [];
  for (const groupe of groups) {
    const products = await getProductsFromDbByGroupeId(groupe);
    if (products) productListToProm.push(...products);
  }
  console.log('Send products to PROM:', productListToProm);

  const response = await editProductsById(productListToProm);
  if (!response.error) {
    console.log('Successfully upload group`s changes to Prom', response);
  } else {
    console.log('PromAPI fetch returns with error:', response.error);
  }
};

// export default sendDataToProm;

// export const setDiscountTimersToPromByShop = (shop, discountTimers) => {};
