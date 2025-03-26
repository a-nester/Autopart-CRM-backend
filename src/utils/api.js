import axios from 'axios';
import { API_URLs } from '../constants/index.js';
import { env } from './env.js';

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
  try {
    setToken(store);
    const response = await PromAPI.post('/products/edit', productsList);
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : error.message;
  }
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
