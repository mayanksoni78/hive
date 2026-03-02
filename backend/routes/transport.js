import express from 'express';
import authMiddleware  from '../middlewares/authMiddlewares.js';
import { addBus } from '../controllers/transportController.js';


const transportRouter=express.Router();

transportRouter.post('/add_bus',authMiddleware,addBus);

export default transportRouter;

