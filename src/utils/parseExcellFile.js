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
          price: parseFloat(row[6]),
          currency: row[7],
          quantity: row[8] ? row[8].toString() : '0',
          productGroupId: groupId,
        };

        try {
          // пошук і перевірка чи існує товар в БД. Якщо не існує - пишем в Бд
          const product = await findProductByCode(excellProducts[row[1]].code);
          if (!product) {
            const newProduct = await createProduct(excellProducts[row[1]]);
            console.log(`Product added: ${newProduct.name}`);
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

    for (const dbProduct of dbProducts) {
      const excellProduct = excellProducts[dbProduct.code];

      const updates = {};
      if (excellProduct) {
        updates.promPrice = Math.ceil(excellProduct.price * 41.65 * 1.875);
        if (dbProduct.article !== excellProduct.article) {
          console.log('Article not eaqual');
          updates.article = excellProduct.article;
        }
        if (dbProduct.name !== excellProduct.name) {
          console.log('Name not eaqual');
          updates.name = excellProduct.name;
        }
        if (dbProduct.price !== excellProduct.price) {
          console.log('Price not eaqual');

          updates.price = excellProduct.price;
        }
        if (dbProduct.quantity !== excellProduct.quantity) {
          console.log('Quantity not eaqual');
          updates.quantity = excellProduct.quantity;
        }
        if (Object.keys(updates).length > 0) {
          console.log('Values to update', updates);

          const updated = await updateProductByCode(dbProduct._id, updates);
          console.log('Updated', updated);
        }
      } else {
        if (Object.keys(updates).length > 0) {
          console.log('Zero quantity to update', updates);
          updates.quantity = null;
          const updated = await updateProductByCode(dbProduct._id, updates);
          console.log('Updated', updated);
        }
      }
    }
  } catch (error) {
    console.log('Error', error);
  }

  console.log('End preparing price');
};

export default parseExcellFile;
