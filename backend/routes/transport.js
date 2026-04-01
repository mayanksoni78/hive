import express from 'express';
import authMiddleware from '../middlewares/authMiddlewares.js';
import { addBus, getTransportSchedule, updateBusSchedule } from '../controllers/transportController.js';
import { verifyToken } from '../middlewares/hostelAuthMiddlewares.js';
const transportRouter = express.Router();

transportRouter.post('/add_bus', verifyToken, addBus);
transportRouter.get('/schedule',  authMiddleware, getTransportSchedule);
transportRouter.put('/update_bus', verifyToken, updateBusSchedule);

export default transportRouter;