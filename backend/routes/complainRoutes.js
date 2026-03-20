import express from 'express';
import { createComplain, getComplains } from '../controllers/complainController.js';

const complainrouter = express.Router();

// No auth middleware — enroll_id comes from request body/query
complainrouter.post('/complain_page', createComplain);
complainrouter.get('/my_complains',   getComplains);

export default complainrouter;
