import { findProductsByGroupeId } from '../services/products.js';
import { editProductsById } from './api.js';

export const sendDataToProm = async () => {
  // const groupeId = { code: '53399' };
  const groups = 53399;
  const productsList = await findProductsByGroupeId(groups);
  const editList = [];
  for (const product of productsList) {
    if (product.promProductId && product.quantity > 0) {
      editList.push({
        id: product.promProductId,
        presence: 'available',
        quantity_in_stock:
          product.quantity === '+' ? 100 : Number(product.quantity),
      });
    }
  }
  const response = await editProductsById(editList);
  if (!response.error) {
    console.log('Successfully upload group`s changes to Prom', response);
  } else {
    console.log('PromAPI fetch returns with error:', response.error);
  }
};

export default sendDataToProm;
