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

  const download = () => {
    imap.once('ready', () => {
      imap.openBox('INBOX/_Дія+', false, (err) => {
        if (err) throw err;

        const today = new Date();
        const sinceDate = new Date(today.setHours(0, 0, 0, 0));
        const formattedDate = sinceDate.toLocaleDateString('en-CA');

        imap.search(
          [
            ['FROM', 'diya.zbut28@gmail.com'],
            ['SINCE', formattedDate],
          ],

          (err, results) => {
            if (err) throw err;
            console.log('Search results:', results);

            if (results.length === 0) {
              console.log('No new emails found.');
              imap.end();
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
                    if (err) throw err;

                    console.log('Subject: ' + mail.subject);

                    // Перевірка наявності вкладень
                    if (mail.attachments && mail.attachments.length > 0) {
                      mail.attachments.forEach((attachment) => {
                        console.log(
                          'Attachment filename:',
                          attachment.filename,
                        );

                        // Перевірка на тип файлу та шаблон назви
                        if (
                          attachment.filename.endsWith('.xlsx') &&
                          attachment.filename.includes('Прайс-лист')
                        ) {
                          console.log('Has pattern');

                          const filePath = path.join(
                            __dirname,
                            '../../uploadPrice',
                            attachment.filename,
                          ); // Задаємо шлях для збереження файлу
                          console.log('Path', filePath);

                          fs.writeFile(filePath, attachment.content, (err) => {
                            if (err) {
                              console.error('Error saving the file:', err);
                            } else {
                              console.log('File saved:', filePath);
                            }
                          });
                        }
                      });
                    }
                  });
                });
              });
            });

            f.once('end', () => {
              console.log('Done fetching all messages!');
              imap.end();
            });
          },
        );
      });
    });

    imap.once('error', (err) => {
      console.error(err);
    });

    imap.once('end', () => {
      console.log('Connection ended');
    });

    imap.connect();
  };

  download();
};

export default downloadExcellFile;
