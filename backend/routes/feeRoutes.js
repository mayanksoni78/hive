import express from 'express';
import { getFeeStatus, downloadReceipt, createFees, updateFeeStatus, getAllFees } from '../controllers/feeController.js';
import { verifyHostel } from '../middlewares/hostelverify.js';

const feeRouter = express.Router();

feeRouter.post('/create',         createFees);       // student submits payment
feeRouter.get('/status',          getFeeStatus);     // student views own fees
feeRouter.get('/fees', verifyHostel, getAllFees);
feeRouter.patch('/update',        updateFeeStatus);  // admin marks paid/unpaid
feeRouter.get('/receipt/:fee_id', downloadReceipt);  // download HTML receipt

export default feeRouter;