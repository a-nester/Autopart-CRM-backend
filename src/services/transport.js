import { SORT_ORDER } from '../constants/index.js';
import { CostsCollection } from '../db/models/Cost.js';
import { CustomersCollection } from '../db/models/Customer.js';
import { TripCollection } from '../db/models/Transport.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllTrips = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.DESC,
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

export const createCost = async (payload) => {
  const cost = await CostsCollection.create(payload);

  return cost;
};

export const getAllCosts = async ({
  page = 1,
  perPage = 100,
  sortOrder = SORT_ORDER.DESC,
  sortBy = 'date',
  filter = {},
}) => {
  const limit = perPage;
  const skip = perPage * (page - 1);

  const costsQuery = CostsCollection.find();

  if (filter._id) {
    costsQuery.where('tripId').equals(filter._id);
  }
  if (filter.costType) {
    costsQuery.where('costType').equals(filter.costType);
  }
  if (filter.trip) {
    costsQuery.where('trip').equals(filter.trip);
  }
  if (filter.truck) {
    costsQuery.where('truck').equals(filter.truck);
  }
  if (filter.driver) {
    costsQuery.where('driver').equals(filter.driver);
  }
  if (filter.date) {
    if (typeof filter.date === 'string') {
      // Якщо передана конкретна дата → шукаємо точний збіг
      costsQuery.where('date').equals(new Date(filter.date));
    } else if (typeof filter.date === 'object') {
      // Якщо передано діапазон (наприклад, { $gte: '2024-03-01', $lte: '2024-03-09' })
      const dateFilter = {};
      if (filter.date.$gte) dateFilter.$gte = new Date(filter.date.$gte);
      if (filter.date.$lte) dateFilter.$lte = new Date(filter.date.$lte);
      costsQuery.where('date').gte(dateFilter.$gte).lte(dateFilter.$lte);

      // getAllCosts({ filter: { date: '2024-03-01' } }); // Точна дата
      // getAllCosts({
      //   filter: { date: { $gte: '2024-03-01', $lte: '2024-03-09' } },
      // }); // Діапазон дат
    }
  }

  const costsCount = await CostsCollection.find()
    .merge(costsQuery)
    .countDocuments();

  const costs = await costsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(costsCount, perPage, page);

  return {
    data: costs,
    ...paginationData,
  };
};

export const deleteCost = async (costId) => {
  const cost = await CostsCollection.findOneAndDelete({
    _id: costId,
  });
  return cost;
};
