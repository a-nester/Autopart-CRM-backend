import { Router } from 'express';
import express from 'express';
import {
  getGroupsController,
  setParsedDataToPromController,
  updateGroupController,
} from '../controllers/storm.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { updateGroupSchema } from '../validation/storm.js';

const router = Router();
const jsonParser = express.json();

router.get('/groups/', getGroupsController);

router.post('/setData/', jsonParser, setParsedDataToPromController);

router.patch(
  '/groups/',
  jsonParser,
  validateBody(updateGroupSchema),
  ctrlWrapper(updateGroupController),
);

export default router;
