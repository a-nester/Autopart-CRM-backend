import axios from 'axios';
import { API_URLs } from '../constants/index.js';
import { env } from './env.js';
import fs from 'fs/promises';

// const config = {
//     BASE_URL:
// };

// const token = env('PROM_TOKEN');

const PROM_SHOPS = {
  AvtoKlan: env('AVTOKLAN_PROM_TOKEN'),
  AutoAx: env('AUTOAX_PROM_TOKEN'),
  iDoAuto: env('IDOAUTO_PROM_TOKEN'),
  ToAuto: env('TOAVTO_PROM_TOKEN'),
};

// ['AvtoKlan', 'AutoAx', 'iDoAuto', 'ToAuto'];
const setToken = (shop) => {
  const token = PROM_SHOPS[shop];
  PromAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const PromAPI = axios.create({
  baseURL: API_URLs.PROM_BASE_URL,
});

export const getProductsByGroupeId = async (groupeId, store) => {
  try {
    setToken(store);
    const response = await PromAPI.get(`/products/list?group_id=${groupeId}`, {
      params: { limit: 100 },
    });
    // console.log(
    //   `/products/list?group_id=${groupeId}`,
    //   response.data.products.map((elem) => ({ art: elem.sku, id: elem.id })),
    // );

    return response.data;
  } catch (error) {
    return error.response ? error.response.data : error.message;
  }
};

export const editProductsById = async (productsList, store) => {
  console.log('productsList!!!', productsList);

  const BATCH_SIZE = 100;
  const results = [];

  setToken(store);

  for (let i = 0; i < productsList.length; i += BATCH_SIZE) {
    const batch = productsList.slice(i, i + BATCH_SIZE);
    // const batchNumber = Math.floor(i / BATCH_SIZE) + 1;

    try {
      const response = await PromAPI.post('/products/edit', batch);
      results.push(response.data);

      // логування у success.log
      // const logMessage = `✅ Batch ${batchNumber}: Success\n${JSON.stringify(
      //   response.data,
      // )}\n\n`;
      // await fs.appendFile('success.log', logMessage, 'utf-8');
    } catch (error) {
      return error.response ? error.response.data : error.message;
    }
  }
  return results;
};

export const editProductsByShop = async (shop, productsList) => {
  setToken(shop);
  try {
    const response = await PromAPI.post('/products/edit', productsList);
    // console.log('Edit produtcs response', response);

    return response.data;
  } catch (error) {
    return error.response ? error.response.data : error.message;
  }
};
