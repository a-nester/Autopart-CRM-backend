import {
  findGroupeByCode,
  updateProductByArticle,
} from '../services/products.js';
import { getProductsByGroupeId } from './api.js';

export const setPromProductsIdToDB = async (groupeId, newstore) => {
  const store = Array.isArray(newstore) ? newstore[0] : newstore;
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
    }
  } else {
    console.log('Result with error:', response.error.message);
  }
};

export default setPromProductsIdToDB;

// const response = await getProductsByGroupeId(promGroupData.id, store);
// answer
//  id: 2239114700,
//     external_id: 'ca95a87e-2324-11ef-8c63-7085c22f8ea3',
//     name: 'Портативний холодильник BREVIA 44л 22940',
//     sku: '22940',
//     keywords: '-  STORMgroup, -  STORM -, -Аксессуари-, -Холодильники Brevia-',
//     presence: 'available',
//     price: 17365,
//     minimum_order_quantity: null,
//     discount: [Object],
//     prices: [],
//     currency: 'UAH',
//     description: 'Портативный холодильник Brevia объемом 44 л – удобное решение для хранения продуктов и напитков в дороге. Оснащенный компрессорной системой охлаждения от LG, что обеспечивает эффективное охлаждение с режимами MAX (60 Вт) и ECO (45 Вт). Корпус и внутренняя камера выполнены из пластика, есть цифровой LED-дисплей, возможность подключения через USB, а также функция изменения направления открывания дверцы. Модель весит 13 кг, что делает его компактными и удобными для транспортировки.',
//     group: [Object],
//     category: [Object],
//     main_image: '/cloud-cgi/static/uaprom-static/image/company_site/no-image-200-hc252cdfad79520566ddd81d53cbe8fe19.png',
//     images: [],
//     selling_type: 'retail',
//     status: 'on_display',
//     quantity_in_stock: 15,
//     measure_unit: 'шт.',
//     is_variation: false,
//     variation_base_id: null,
//     variation_group_id: null,
//     date_modified: '2025-03-30T22:00:00+00:00',
//     regions: [],
//     name_multilang: [Object],
//     description_multilang: [Object]
//   },
