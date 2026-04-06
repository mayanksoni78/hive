import { Router } from "express";
import { studentLogin } from "../controllers/studentLogin.js";
import { verifyStudent } from "../middlewares/studentMiddleware.js";
import  { createComplain, getComplains, resolveComplain } from "../controllers/complainController.js";

const studentRoute = Router();

studentRoute.post("/login",studentLogin);
studentRoute.get("/my_complains",verifyStudent,getComplains);
studentRoute.post('/complain_page',verifyStudent,createComplain);
studentRoute.patch("/resolve/:complaint_id",verifyStudent,resolveComplain);


export default studentRoute;