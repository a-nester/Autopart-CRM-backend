import { ShopsCollection } from '../db/models/Settings.js';

export const createShop = async (payload) => {
  const shop = await ShopsCollection.create(payload);

  return shop;
};

export const getAllShops = async (company) => {
  const shops = await ShopsCollection.find({ company });

  return shops;
};
