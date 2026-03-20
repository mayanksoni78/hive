import express from 'express';
import authMiddleware from '../middlewares/authMiddlewares.js';
import { addBus, getTransportSchedule } from '../controllers/transportController.js';

const transportRouter = express.Router();

transportRouter.post('/add_bus',  authMiddleware, addBus);
transportRouter.get('/schedule',  authMiddleware, getTransportSchedule);

export default transportRouter;