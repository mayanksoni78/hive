import { Router } from "express";
import { adminLogin } from "../controllers/loginAdmin.js";
import { adminSignup } from "../controllers/signupAdmin.js";


const adminRoute = Router();

adminRoute.post("/login",adminLogin);
adminRoute.post("/signup",adminSignup);


export default adminRoute;