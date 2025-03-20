import { Router } from 'express';
// import express from 'express';
import { getGroupesController } from '../controllers/storm.js';

const router = Router();
// const jsonParser = express.json();

router.get('/groupes/', getGroupesController);

export default router;
