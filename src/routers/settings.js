import { Router } from 'express';
import express from 'express';
// import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createStoreSchema } from '../validation/settings.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createShopController,
  getAllShopsController,
} from '../controllers/settings.js';

const router = Router();
const jsonParser = express.json();

// router.use(authenticate);

router.get('/shops', ctrlWrapper(getAllShopsController));

router.post(
  '/shops',
  jsonParser,
  validateBody(createStoreSchema),
  ctrlWrapper(createShopController),
);

export default router;
