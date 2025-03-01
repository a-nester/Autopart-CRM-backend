import { createTrip, getAllTrips } from '../services/transport.js';

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
  console.log(tripParams);

  const createdTrip = await createTrip(tripParams);

  res.status(201).json({
    status: 201,
    message: 'Trip successfully created!',
    data: createdTrip,
  });
};
