import { Router } from 'express';
import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createCustomerSchema,
  createTripSchema,
} from '../validation/transport.js';
import {
  createCustomerController,
  createTripController,
  getCustomersController,
  getTripByIdController,
  getTripsController,
} from '../controllers/transport.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

const jsonParser = express.json();

router.get('/', getTripsController);

router.get('/:tripId', isValidId, ctrlWrapper(getTripByIdController));

router.post(
  '/',
  jsonParser,
  validateBody(createTripSchema),
  ctrlWrapper(createTripController),
);

router.post(
  '/customer',
  jsonParser,
  validateBody(createCustomerSchema),
  ctrlWrapper(createCustomerController),
);

router.get('/customers', getCustomersController);

export default router;
