import {
  createCustomer,
  createTrip,
  getAllCustomers,
  getAllTrips,
} from '../services/transport.js';

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
