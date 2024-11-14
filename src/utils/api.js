import axios from 'axios';
import { API_URLs } from '../constants/index.js';
import { env } from './env.js';

// const config = {
//     BASE_URL:
// };

const token = env('PROM_TOKEN');

export const PromAPI = axios.create({
  baseURL: API_URLs.PROM_BASE_URL,
});

PromAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export const getProductsByGroupeId = async (groupeId) => {
  try {
    const response = await PromAPI.get(`/products/list?group_id=${groupeId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const editProductsById = async (productsList) => {
  try {
    const response = await PromAPI.post('/products/edit', productsList);
    return response.data;
  } catch (error) {
    return error;
  }
};
