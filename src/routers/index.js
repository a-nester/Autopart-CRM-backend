import { Router } from 'express';
import webHookRouter from '../routers/webhook.js';
import authRouter from '../routers/auth.js';
import contactsRouter from '../routers/contacts.js';
import timersRouter from '../routers/timers.js';
import transportRouter from '../routers/transport.js';
import { stormRouter } from '../routers/storm.js';

const router = Router();

router.use('/webhook', webHookRouter);
router.use('/auth', authRouter);
router.use('/contacts', contactsRouter);
router.use('/timers', timersRouter);
router.use('/storm', stormRouter);
router.use('/transport', transportRouter);

export default router;
