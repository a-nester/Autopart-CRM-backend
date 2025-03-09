import { SORT_ORDER } from '../constants/index.js';
import { CustomersCollection } from '../db/models/customer.js';
import { TripCollection } from '../db/models/transport.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllTrips = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'loadDate',
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

export const createCustomer = async (payload) => {
  const customer = await CustomersCollection.create(payload);
  return customer;
};

export const getAllCustomers = async ({ company }) => {
  const customers = await CustomersCollection.find({ company });

  return customers;
};

export const getTripById = async (id) => {
  const trip = await TripCollection.findById(id);

  return trip;
};

export const upsertTrip = async (id, payload, options = {}) => {
  const rawResult = await TripCollection.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) {
    return null;
  }

  return {
    trip: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
