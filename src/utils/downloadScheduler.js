import cron from 'node-cron';
import { downloadExcellFile } from './downloadExcellFile.js';

export const downloadScheduler = () => {
  // cron.schedule('10 10 * * *', () => {
  cron.schedule('*/2 * * * *', () => {
    console.log('Running the job to download Excell files...');
    downloadExcellFile();
  });
};
