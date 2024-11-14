import {
  findGroupeByCode,
  updateProductByArticle,
} from '../services/products.js';
import { getProductsByGroupeId } from './api.js';

export const setPromProductsIdToDB = async (groupeId) => {
  const group = await findGroupeByCode(groupeId);
  const response = await getProductsByGroupeId(group.promGroupId);
  if (!response.error) {
    // console.log(response);
    for (const product of response.products) {
      const result = await updateProductByArticle(product.sku, {
        promProductId: product.id,
        external_id: product.external_id,
      });
      console.log(result);
    }
  } else {
    console.log(response.error.message);
  }
};

export default setPromProductsIdToDB;
