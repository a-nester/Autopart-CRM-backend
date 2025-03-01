import { SORT_ORDER } from '../constants/index.js';
import { TripCollection } from '../db/models/Transport.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllTrips = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  company,
}) => {
  const limit = perPage;
  const skip = perPage * (page - 1);

  const tripsQuery = TripCollection.find({ company });

  if (filter.truck) {
    tripsQuery.where('truck').equals(filter.truck);
  }
  if (filter.driver) {
    tripsQuery.where('driver').equals(filter.driver);
  }

  const tripsCount = await TripCollection.find()
    .merge(tripsQuery)
    .countDocuments();

  const trips = await tripsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(tripsCount, perPage, page);

  return {
    data: trips,
    ...paginationData,
  };
};

export const createTrip = async (payload) => {
  const trip = await TripCollection.create(payload);
  return trip;
};
