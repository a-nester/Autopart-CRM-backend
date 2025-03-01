import { Router } from 'express';
import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createTripSchema } from '../validation/transport.js';
import {
  createTripController,
  getTripsController,
} from '../controllers/transport.js';

const router = Router();

const jsonParser = express.json();

router.get('/', getTripsController);

router.post(
  '/',
  jsonParser,
  validateBody(createTripSchema),
  ctrlWrapper(createTripController),
);

export default router;
