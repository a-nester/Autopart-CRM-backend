import { Router } from 'express';
// import express from 'express';
import { getGroupsController } from '../controllers/storm.js';

const router = Router();
// const jsonParser = express.json();

router.get('/groups/', getGroupsController);

export default router;
