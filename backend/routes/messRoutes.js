import express from 'express';
import { getMessMenu } from '../controllers/messController.js';

const messRouter = express.Router();

// No auth middleware needed — hostel_id sent as query param
messRouter.get('/menu', getMessMenu);

export default messRouter;
