import cron from 'node-cron';
import { downloadExcellFile } from './downloadExcellFile.js';
import parseExcellFile from './parseExcellFile.js';
import { sendDataToProm } from '../utils/sendDataToProm.js';
import { setPromProductsIdToDB } from './setPromProductsIdToDB.js';
import { setDiscountsToProm } from '../controllers/timers.js';
import { findAllGroups } from '../services/products.js';
// import { parsePage } from './parserURL.js';

export const downloadScheduler = () => {
  cron.schedule('10 10 * * *', async () => {
    // cron.schedule('1-59/10 * * * *', async () => {
    // з першої хвилини і кожні 10хв
    console.log('Running the job to download Excell files...');
    try {
      const filePath = await downloadExcellFile();
      console.log('Excell file download complete.');
      await parseExcellFile(filePath);
    } catch (error) {
      console.error('Error during download or parsing:', error);
    }
  });

  // cron.schedule('*/59 * * * *', async () => {
  cron.schedule('59 1-23/3 * * *', async () => {
    // 59-та хвилина запуску, починаючи з 1 години і через кожні 3 години
    console.log('Running the job to send data to prom...');

    try {
      const stores = ['AvtoKlan', 'AutoAx', 'iDoAuto', 'ToAuto'];
      // const stores = ['AvtoKlan'];

      for (const store of stores) {
        const newGroups = await findAllGroups();
        const groups = newGroups
          .filter((elem) => elem.promGroup && elem.promGroup.get(store)) // Перевіряємо існування promGroup і його властивості store
          .map((elem) => elem.code);

        // console.log('New Groups1', groups);
        for (const group of groups) {
          try {
            await setPromProductsIdToDB(group, store);
          } catch (error) {
            console.error('Error during send data to prom...:', error);
          }
          await sendDataToProm(groups, store);
        }
      }
    } catch (error) {
      console.error('Error during find product groups!', error);
    }
  });

  cron.schedule('55 8 * * 1-5', async () => {
    console.log('Running the job to seе Day Discounts');
    const period = 'day';
    try {
      await setDiscountsToProm(period);
    } catch (error) {
      console.error('Error during seting Day Discount:', error);
    }
  });

  cron.schedule('00 18 * * 1-5', async () => {
    console.log('Running the job to seе Day Discounts');
    const period = 'night';
    try {
      await setDiscountsToProm(period);
    } catch (error) {
      console.error('Error during seting Day Discount:', error);
    }
  });

  // cron.schedule('*/3 * * * *', async () => {
  //   // const url = 'https://storm-group.eu/ru/products?category_id=316&page=1';
  //   const groups = [52840];
  //   const store = 'AvtoKlan';

  //   try {
  //     parsePage(groups, store);
  //   } catch (error) {
  //     console.error('Error during parse', error);
  //   }
  // });
};
