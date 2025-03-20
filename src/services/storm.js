import { SORT_ORDER } from '../constants.js';
import { ProductsGroupe } from '../db/models/ProductsGproupe.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllGroupes = async ({
  page = 1,
  perPage = 100,
  sortOrder = SORT_ORDER.DESC,
  sortBy = 'date',
  filter = {},
}) => {
  const limit = perPage;
  const skip = perPage * (page - 1);

  const groupesQuery = await ProductsGroupe.find();

  if (filter.name) {
    groupesQuery.where('name').equals(filter.name);
  }

  const groupesCount = await ProductsGroupe.find()
    .merge(groupesQuery)
    .countDocuments();

  const groupes = await groupesQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(groupesCount, perPage, page);

  return {
    data: groupes,
    ...paginationData,
  };
};
