import express from 'express';
import { createComplain, getComplains, resolveComplain } from '../controllers/complainController.js';

const complainrouter = express.Router();

complainrouter.post('/complain_page',          createComplain);
complainrouter.get('/my_complains',            getComplains);
complainrouter.patch('/resolve/:complaint_id', resolveComplain); // ✅ complaint_id not id

export default complainrouter;