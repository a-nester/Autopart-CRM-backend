import cron from 'node-cron';
import { downloadExcellFile } from './downloadExcellFile.js';
import parseExcellFile from './parseExcellFile.js';
import { sendDataToProm } from '../utils/sendDataToProm.js';
import { setPromProductsIdToDB } from './setPromProductsIdToDB.js';
import { setDiscountsToProm } from '../controllers/timers.js';

export const downloadScheduler = () => {
  cron.schedule('10 10 * * *', async () => {
    // cron.schedule('*/10 * * * *', async () => {
    console.log('Running the job to download Excell files...');
    try {
      const filePath = await downloadExcellFile();
      console.log('Excell file download complete.');
      await parseExcellFile(filePath);
    } catch (error) {
      console.error('Error during download or parsing:', error);
    }
  });

  cron.schedule('*/59 * * * *', async () => {
    // cron.schedule('59 1-23/2 * * *', async () => { // 59-та хвилина запуску, починаючи з 1 години і через кожні 2 години
    console.log('Running the job to send data to prom...');
    // const groups = [53399, 19836];
    const groups = [53399];

    for (const group of groups) {
      try {
        await setPromProductsIdToDB(group);
        await sendDataToProm(group);
      } catch (error) {
        console.error('Error during send data to prom...:', error);
      }
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
};
