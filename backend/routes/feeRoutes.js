import express from 'express';
import { getFeeStatus, downloadReceipt } from '../controllers/feeController.js';

const feeRouter = express.Router();

// No auth middleware — enroll_id sent as query param
feeRouter.get('/status',            getFeeStatus);
feeRouter.get('/receipt/:payment_id', downloadReceipt);

export default feeRouter;
