import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { updateProductByArticle } from '../services/products.js';
import { sendDataToProm } from './sendDataToProm.js';

const BASE_URL = 'https://storm-group.eu';
const CATEGORY_URL = `${BASE_URL}/ru/products?category_id=316&page=1`;

async function fetchProductLinks(url, page) {
  try {
    const { data } = await axios.get(url, { params: { page } });
    const $ = cheerio.load(data);
    const links = [];

    $('.grid-products-wrapper .product-item-link').each((_, el) => {
      const link = $(el).attr('href');
      if (link) {
        //   links.push(`${BASE_URL}${link}`);
        const absoluteLink = link.startsWith('http')
          ? link
          : `${BASE_URL}${link}`;
        links.push(absoluteLink);
      }
    });

    return links;
  } catch (error) {
    console.error('Помилка при отриманні списку товарів:', error.message);
    return [];
  }
}

async function getImage(imgURL) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(imgURL, { waitUntil: 'networkidle2' });

  const imageUrls = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll('.fotorama__nav__frame img'),
    ).map((img) =>
      img.src.startsWith('/') ? `https://storm-group.eu${img.src}` : img.src,
    );
  });

  await browser.close();
  return imageUrls;
}

async function fetchProductDetails(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $('.info-title').text().trim();
    const description = $('.full-description').text().trim();

    // Отримуємо всі зображення з блоку .fotorama__stage__shaft
    const imageUrls = await getImage(url);

    // console.log('Знайдені зображення:', imageUrls);

    let article = null;
    $('.info-specification li').each((_, el) => {
      const label = $(el).find('span:first-child').text().trim();
      if (label === 'Артикул:') {
        article = $(el).find('span:last-child').text().trim();
        // console.log(`'Article', ${article}`, typeof article);
      }
    });
    // console.log(article, description);

    return { title, description, article, imageUrls, url };
  } catch (error) {
    console.error(`Помилка при парсингу сторінки ${url}:`, error.message);
    return null;
  }
}

export async function parsePage(groups, store) {
  let allProductLinks = [];
  let lastProdList = 0;
  let page = 1;
  while (true) {
    const productLinks = await fetchProductLinks(CATEGORY_URL, page);
    allProductLinks = allProductLinks.concat(productLinks);
    if (lastProdList !== 0 && productLinks.length < lastProdList) {
      break; // Якщо на сторінці немає товарів, завершуємо цикл
    }
    lastProdList = productLinks.length;
    console.log(`Сторінка ${page}: знайдено ${productLinks.length} товарів`);
    page++;
  }
  console.log(`Знайдено ${allProductLinks.length} товарів`);
  const products = [];
  for (const link of allProductLinks) {
    const product = await fetchProductDetails(link);
    if (product) {
      products.push(product);
    }
  }

  products.map(async (product) => {
    console.log({
      promTitleRu: product.title,
      imageUrls: product.imageUrls,
      originalUrl: product.url,
      description_ru: product.description,
    });

    try {
      await updateProductByArticle(product.article, {
        promTitleRu: product.title,
        imageUrls: product.imageUrls,
        originalUrl: product.url,
        description_ru: product.description,
      });
    } catch (error) {
      console.log('Помилка запису в БД', error);
    }
  });
  // console.log('Отримані товари:', products);

  try {
    await sendDataToProm(groups, store);
  } catch (error) {
    console.log('Error during send data to prom', error);
  }
}

// Запуск парсингу
// parsePage();

// {
//     title: 'Холодильник автомобильный Brevia 40л (компрессор LG) 22445',
//     article: '22445',
//     imageUrls: [
//       'https://storm-group.eu/storage/upload/117928/bf486ede-74a5-4205-97e4-0b4ab777bbf6.jpeg',
//       'https://storm-group.eu/storage/upload/117939/bf486ede-74a5-4205-97e4-0b4ab777bbf6_2.jpeg',
//       'https://storm-group.eu/storage/upload/117947/bf486ede-74a5-4205-97e4-0b4ab777bbf6_3.jpeg',
//       'https://storm-group.eu/storage/upload/117958/bf486ede-74a5-4205-97e4-0b4ab777bbf6_4.jpeg',
//       'https://storm-group.eu/storage/upload/117969/bf486ede-74a5-4205-97e4-0b4ab777bbf6_5.jpeg',
//       'https://storm-group.eu/storage/upload/117977/bf486ede-74a5-4205-97e4-0b4ab777bbf6_6.jpeg',
//       'https://storm-group.eu/storage/upload/117987/bf486ede-74a5-4205-97e4-0b4ab777bbf6_7.jpeg',
//       'https://storm-group.eu/storage/upload/117994/bf486ede-74a5-4205-97e4-0b4ab777bbf6_8.jpeg'
//     ],
//     url: 'https://storm-group.eu/ru/products/show/8784-kholodylnyk-avtomobylnyy-brevia-40l-%28kompressor-lg%29-22445'
//   },
