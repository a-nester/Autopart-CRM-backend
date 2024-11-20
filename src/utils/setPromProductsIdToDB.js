import {
  findGroupeByCode,
  updateProductByArticle,
} from '../services/products.js';
import { getProductsByGroupeId } from './api.js';

export const setPromProductsIdToDB = async (groupeId) => {
  const group = await findGroupeByCode(groupeId);
  const response = await getProductsByGroupeId(group.promGroupId);
  if (!response.error) {
    for (const product of response.products) {
      const result = await updateProductByArticle(product.sku, {
        promProductId: product.id,
        external_id: product.external_id,
        promDiscount: {
          type: 'percent',
          value: 24,
          date_start: new Date().toLocaleDateString('uk-UA'),
          date_end: new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 3,
          ).toLocaleDateString('uk-UA'),
        },
      });
      console.log('Success result:', result);
    }
  } else {
    console.log('Result with error:', response.error.message);
  }
};

export default setPromProductsIdToDB;
