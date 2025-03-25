import { findProductsByGroupeId } from '../services/products.js';
import { editProductsById } from './api.js';

export const getProductsFromDbByGroupeId = async (groupe, store) => {
  console.log('getProductsFromDbByGroupeId', groupe, store);

  const productsList = await findProductsByGroupeId(groupe);
  // console.log(
  //   'Пошук в БД',
  //   productsList.map((elem) => elem.code),
  // );

  const editList = [];
  for (const product of productsList) {
    if (product.quantity > 0 || product.quantity === '+') {
      const productId =
        product.promProductId instanceof Map
          ? product.promProductId.get(store)
          : undefined;

      const discount =
        product.promDiscount instanceof Map
          ? product.promDiscount.get(store)
          : {};
      console.log('DEBUG product.promProductId:', productId);
      console.log('DEBUG product.promDiscount:', discount);
      if (!productId) {
        console.warn(
          `❌ Немає promProductId для товару ${product.code} у магазині ${store}`,
        );
        continue;
      }
      editList.push({
        id: productId,
        presence: 'available',
        quantity_in_stock:
          product.quantity === '+' ? 100 : Number(product.quantity),
        price: product.promPrice,
        discount: discount || {},
      });
    }
  }
  console.log('Edit list', editList);

  return editList;
};

export const sendDataToProm = async (groups, store) => {
  // const groupeId = { code: '53399' };
  // const groups = [code];
  console.log('Start send data to prom', groups, store);

  const productListToProm = [];
  for (const group of groups) {
    const products = await getProductsFromDbByGroupeId(group, store);
    // console.log('Відправка Products', products);

    if (products) productListToProm.push(...products);
  }
  // console.log('Send products to PROM:', productListToProm);

  const response = await editProductsById(productListToProm, store);
  if (!response.error) {
    console.log('Successfully upload group`s changes to Prom', response);
  } else {
    console.log('PromAPI fetch returns with error:', response.error);
  }
};

// export default sendDataToProm;

// export const setDiscountTimersToPromByShop = (shop, discountTimers) => {};
