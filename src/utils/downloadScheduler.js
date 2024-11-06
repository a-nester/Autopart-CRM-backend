import cron from 'node-cron';
import { downloadExcellFile } from './downloadExcellFile.js';
import parseExcellFile from './parseExcellFile.js';

export const downloadScheduler = () => {
  cron.schedule('10 10 * * *', async () => {
    // cron.schedule('*/5 * * * *', async () => {
    console.log('Running the job to download Excell files...');
    try {
      const filePath = await downloadExcellFile();
      console.log('Excell file download complete.');
      parseExcellFile(filePath);
    } catch (error) {
      console.error('Error during download or parsing:', error);
    }
  });
};
