import createHttpError from 'http-errors';
import {
  createCost,
  createCustomer,
  createTrip,
  getAllCosts,
  getAllCustomers,
  getAllTrips,
  getTripById,
  upsertTrip,
} from '../services/transport.js';

export const getTripByIdController = async (req, res) => {
  const { tripId } = req.params;

  const trip = await getTripById(tripId);

  console.log('ID', trip);
  if (!trip) {
    return createHttpError(404, 'Trip not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found trip with id ${tripId}!`,
    data: trip,
  });
};

export const getTripsController = async (req, res) => {
  const trips = await getAllTrips(req.query);

  return res.status(200).json({
    status: 200,
    message: 'Trips successfully find',
    data: trips,
  });
};

export const createTripController = async (req, res) => {
  const tripParams = { ...req.body };
  // console.log(tripParams);

  const createdTrip = await createTrip(tripParams);

  res.status(201).json({
    status: 201,
    message: 'Trip successfully created!',
    data: createdTrip,
  });
};

export const patchTripController = async (req, res, next) => {
  const { tripId } = req.params;

  console.log('TRIP_ID', tripId);

  const result = await upsertTrip(tripId, {
    ...req.body,
  });

  if (!result) {
    next(createHttpError(404, 'Trip not found!'));
  }

  res.status(200).json({
    status: 200,
    message: 'Trip successfully patched!',
    data: result.trip,
  });
};

export const createCustomerController = async (req, res) => {
  const customer = req.body;
  // console.log('Customer', customer);

  const createdCustomer = await createCustomer(customer);

  res.status(201).json({
    status: 201,
    message: 'Customer successfully created!',
    data: createdCustomer,
  });
};

export const getCustomersController = async (req, res) => {
  const customers = await getAllCustomers(req.query);
  return res.status(200).json({
    status: 200,
    message: 'Customers successfully find!',
    data: customers,
  });
};

export const createCostController = async (req, res) => {
  const cost = req.body;

  const createdCost = await createCost(cost);

  res.status(201).json({
    status: 201,
    message: 'Cost successfully created',
    data: createdCost,
  });
};

export const getCostsController = async (req, res) => {
  const costs = await getAllCosts(req.query);

  res.status(200).json({
    status: 200,
    message: 'Costs successfully found!',
    data: costs,
  });
};
