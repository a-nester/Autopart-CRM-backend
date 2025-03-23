import { createShop, getAllShops } from '../services/settings.js';

export const createShopController = async (req, res, next) => {
  //   if (req.user.role !== 'admin') {
  //     return res.status(403).json({
  //       status: 403,
  //       message: 'This user has no rights to create a shop!',
  //     });
  //   }
  const newShop = await createShop(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created new shop!',
    data: newShop,
  });
};

export const getAllShopsController = async (req, res, next) => {
  const { company } = req.query;
  console.log('COMPANY', company);

  const shops = await getAllShops(company);

  res.status(200).json({
    status: 200,
    message: 'Successfully find shops',
    data: shops,
  });
};
// test
