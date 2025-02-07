import { Router } from 'express';
import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { createDiscountTimerSchema } from '../validation/timers.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createTimerController,
  getAllTimersController,
} from '../controllers/timers.js';

const router = Router();
const jsonParser = express.json();

router.get(
  '/',
  // jsonParser,
  // validateBody(createDiscountTimerSchema),
  ctrlWrapper(getAllTimersController),
);

router.post(
  '/',
  jsonParser,
  validateBody(createDiscountTimerSchema),
  ctrlWrapper(createTimerController),
);

export default router;
