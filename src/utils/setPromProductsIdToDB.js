import {
  findGroupeByCode,
  updateProductByArticle,
} from '../services/products.js';
import { getProductsByGroupeId } from './api.js';

export const setPromProductsIdToDB = async (groupeId, store) => {
  const group = await findGroupeByCode(groupeId); // знайшли групу в ДБ
  const promGroupData = group.promGroup.get(store); // взяли id групи на Пром згідно магазину
  if (!promGroupData) {
    throw new Error(`Група для магазину ${store} не знайдена`);
  }
  const response = await getProductsByGroupeId(promGroupData.id, store); //взяли список товарів з пром згідно ІД групи
  // console.log('DISCOUNT', group.promGroup.get(store).discountValue);
  const discountForGroup = group.promGroup.get(store).discountValue; //взяли з БД знижку для групи
  if (!response.error) {
    for (const product of response.products) {
      const result = await updateProductByArticle(product.sku, {
        //оновлення продукта
        promProductId: { [store]: product.id },
        external_id: product.external_id,
        promDiscount: {
          [store]: {
            type: 'percent',
            value: discountForGroup,
            date_start: new Date().toLocaleDateString('uk-UA'),
            date_end: new Date(
              Date.now() + 1000 * 60 * 60 * 24 * 3,
            ).toLocaleDateString('uk-UA'),
          },
        },
      });
      // console.log('Success result:', result);
    }
  } else {
    console.log('Result with error:', response.error.message);
  }
};

export default setPromProductsIdToDB;
