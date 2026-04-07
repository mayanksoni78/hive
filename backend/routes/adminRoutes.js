import express from 'express';
import { adminLogin, createAdmin, getAdmins } from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.post('/login',  adminLogin);   // Mess/Transport admin login
adminRouter.post('/create', createAdmin);  // Hostel owner creates a new admin
adminRouter.get('/list',    getAdmins);    // Get all admins for a hostel

export default adminRouter;