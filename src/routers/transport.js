import { Router } from 'express';
import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createCostSchema,
  createCustomerSchema,
  createTripSchema,
  updateTripSchema,
} from '../validation/transport.js';
import {
  createCostController,
  createCustomerController,
  createTripController,
  getCostsController,
  getCustomersController,
  getTripByIdController,
  getTripsController,
  patchTripController,
} from '../controllers/transport.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

const jsonParser = express.json();

router.get('/', getTripsController);

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

router.get('/costs', getCostsController);

router.post(
  '/cost',
  jsonParser,
  validateBody(createCostSchema),
  ctrlWrapper(createCostController),
);

router.get('/:tripId', isValidId, ctrlWrapper(getTripByIdController));

router.patch(
  '/:tripId',
  isValidId,
  validateBody(updateTripSchema),
  ctrlWrapper(patchTripController),
);
export default router;
