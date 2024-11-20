import cron from 'node-cron';
import { downloadExcellFile } from './downloadExcellFile.js';
import parseExcellFile from './parseExcellFile.js';
import { sendDataToProm } from '../utils/sendDataToProm.js';
import { setPromProductsIdToDB } from './setPromProductsIdToDB.js';

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
    console.log('Running the job to download Excell files...');
    try {
      await setPromProductsIdToDB(53399);
      await sendDataToProm();
    } catch (error) {
      console.error('Error during download or parsing:', error);
    }
  });
};
