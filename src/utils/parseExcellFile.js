import fs from 'fs';
import xlsx from 'xlsx';
import {
  createProductsGroupe,
  findGroupeByCode,
  findProductByCode,
  createProduct,
  findAllProducts,
  updateProductByCode,
} from '../services/products.js';

export const parseExcellFile = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  console.log('Start parsing...');

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
    header: 1,
  });

  let groupId = null;
  let groupName = null;
  const excellProducts = {};

  for (let i = 0; i < sheet.length; i++) {
    const row = sheet[i];

    if (typeof row[1] === 'number') {
      // Перевірка чи рядок є назвою групи
      if (row[2] === undefined && row[4] === undefined) {
        groupId = row[1];
        groupName = row[3];
        // console.log(`Found groupId: ${groupId}, Group Name: ${groupName}`);

        try {
          const isGroupExist = await findGroupeByCode(groupId);
          if (!isGroupExist) {
            await createProductsGroupe({ code: groupId, name: groupName });
            console.log('Group created.');
          } else {
            // console.log('Group already exists.');
          }
        } catch (error) {
          console.error('Error while checking or creating group:', error);
        }
        continue;
      }
      //  обробляємо товари
      if (row[1] && row[2] && row[3]) {
        excellProducts[row[1]] = {
          code: row[1],
          article: row[2],
          name: row[3],
          price: parseFloat(row[7]),
          currency: row[8],
          quantity: row[9] ? row[9].toString() : '0',
          productGroupId: groupId,
        };

        try {
          // пошук і перевірка чи існує товар в БД. Якщо не існує - пишем в Бд
          const product = await findProductByCode(excellProducts[row[1]].code);
          if (!product) {
            try {
              const newProduct = await createProduct(excellProducts[row[1]]);
              console.log(`Product added: ${newProduct.name}`);
              if (newProduct.article === '22170') {
                console.log(
                  '🚀 Продукт з article "22170" успішно доданий в базу даних:',
                  newProduct,
                );
              }
            } catch (err) {
              console.error('Помилка при створенні продукту:');
              console.error('Обʼєкт продукту:', excellProducts[row[1]]);
              console.error('Текст помилки:', err.message);

              if (excellProducts[row[1]].article === '22170') {
                console.error(
                  '⚠️ Продукт з article "22170" НЕ був доданий через помилку.',
                );
              }
            }
          }
        } catch (error) {
          console.error('Error while saving product:', error);
        }
      }
    }
  }
  console.log('End parsing excell');

  try {
    const dbProducts = await findAllProducts();

    await Promise.all(
      dbProducts.map(async (dbProduct) => {
        const excellProduct = excellProducts[dbProduct.code];
        const updates = {};

        if (excellProduct) {
          if (dbProduct.article !== excellProduct.article) {
            console.log('Article not equal');
            updates.article = excellProduct.article;
          }
          if (dbProduct.name !== excellProduct.name) {
            console.log('Name not equal');
            updates.name = excellProduct.name;
          }
          if (dbProduct.price !== excellProduct.price) {
            console.log('Price not equal');
            updates.price = excellProduct.price;
            // updates.promPrice = Math.ceil(excellProduct.price * 41.65 * 1.875);
          }
          if (excellProduct.price) {
            updates.promPrice = Math.ceil(excellProduct.price * 41.65 * 1.875);
          }
          if (dbProduct.quantity !== excellProduct.quantity) {
            console.log('Quantity not equal');
            updates.quantity = excellProduct.quantity;
          } else {
            updates.quantity = null;
          }
        } else {
          console.log(
            `Product article: ${dbProduct.article} missing in excell!`,
          );
          updates.quantity = null;
        }

        if (Object.keys(updates).length > 0) {
          console.log('Values to update', updates);
          const updated = await updateProductByCode(dbProduct._id, updates);
          console.log('Updated', updated);
        }
      }),
    );
  } catch (error) {
    console.log('Error', error);
  }

  console.log('End preparing price');
};

export default parseExcellFile;
