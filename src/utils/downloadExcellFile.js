import Imap from 'imap';
import { env } from './env.js';
import fs from 'fs';
import path from 'path';
import { simpleParser } from 'mailparser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const downloadExcellFile = async () => {
  const imap = new Imap({
    user: env('EMAIL_USER'),
    password: env('EMAIL_PASS'),
    host: 'imap.ukr.net',
    port: 993,
    tls: true,
  });

  return new Promise((resolve, reject) => {
    imap.once('ready', () => {
      imap.openBox('INBOX/_Дія+', false, (err) => {
        if (err) {
          reject(err);
          return;
        }

        const today = new Date();
        const sinceDate = new Date(today.setHours(0, 0, 0, 0));
        const formattedDate = sinceDate.toLocaleDateString('en-CA');

        imap.search(
          [
            ['FROM', 'diya.zbut28@gmail.com'],
            ['SINCE', formattedDate],
          ],
          (err, results) => {
            if (err) {
              reject(err);
              return;
            }

            if (results.length === 0) {
              console.log('No new emails found.');
              imap.end();
              resolve(null); // Повертаємо null, якщо файлів немає
              return;
            }

            const f = imap.fetch(results, { bodies: '' });
            f.on('message', (msg) => {
              msg.on('body', (stream) => {
                let buffer = '';
                stream.on('data', (chunk) => {
                  buffer += chunk.toString('utf8');
                });
                stream.on('end', () => {
                  simpleParser(buffer, (err, mail) => {
                    if (err) {
                      reject(err);
                      return;
                    }

                    if (mail.attachments && mail.attachments.length > 0) {
                      mail.attachments.forEach((attachment) => {
                        if (
                          attachment.filename.endsWith('.xlsx') &&
                          attachment.filename.includes('Прайс-лист')
                        ) {
                          const filePath = path.join(
                            __dirname,
                            '../../uploadPrice',
                            attachment.filename,
                          );

                          fs.writeFile(filePath, attachment.content, (err) => {
                            if (err) {
                              console.error('Error saving the file:', err);
                              reject(err);
                            } else {
                              console.log('File saved:', filePath);
                              resolve(filePath); // Повертаємо шлях до файлу
                            }
                          });
                        }
                      });
                    } else {
                      resolve(null); // Повертаємо null, якщо вкладень немає
                    }
                  });
                });
              });
            });

            f.once('end', () => {
              imap.end();
            });
          },
        );
      });
    });

    imap.once('error', (err) => {
      console.error(err);
      reject(err);
    });

    imap.once('end', () => {
      console.log('Connection ended');
    });

    imap.connect();
  });
};

export default downloadExcellFile;
