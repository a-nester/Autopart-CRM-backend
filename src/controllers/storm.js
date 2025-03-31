import createHttpError from 'http-errors';
import { upsertProductsGroupe } from '../services/products.js';
import { getAllGroups } from '../services/storm.js';
import { sendDataToProm } from '../utils/sendDataToProm.js';
import setPromProductsIdToDB from '../utils/setPromProductsIdToDB.js';

export const getGroupsController = async (req, res) => {
  const groupes = await getAllGroups(req.query);

  res.status(200).json({
    status: 200,
    message: 'Successfully get groupes',
    data: groupes,
  });
};

export const updateGroupController = async (req, res, next) => {
  const { excellGroupId, promGroup, promShop } = req.body;
  const updates = { [promShop]: promGroup, promShop };
  const group = await upsertProductsGroupe(excellGroupId, updates);
  console.log('GROUP', group);

  if (!group) {
    next(createHttpError(404, 'Group not found!'));
  }

  res.status(200).json({
    status: 200,
    message: 'Group successfully updated!',
    data: group,
  });
};

// export const upsertGroup = async () => { };

export const setParsedDataToPromController = async (req, res, next) => {
  const { group, store } = req.body;
  console.log('group, store', group, store);

  try {
    await setPromProductsIdToDB(group, store);
  } catch (error) {
    console.log(error);
  }

  const setted = await sendDataToProm([group], store[0]);

  res.status(200).json({
    status: 200,
    message: 'Parsed data successfully setted.',
    data: setted,
  });
};
