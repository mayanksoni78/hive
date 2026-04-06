import { Router } from "express";
import { studentLogin } from "../controllers/studentLogin.js";
import { verifyStudent } from "../middlewares/studentMiddleware.js";
import  { createComplain, getComplains, resolveComplain } from "../controllers/complainController.js";
import { getMessMenu } from "../controllers/messController.js";
import { getTransportSchedule } from "../controllers/transportController.js";
const studentRoute = Router();

studentRoute.post("/login",studentLogin);
studentRoute.get("/my_complains",verifyStudent,getComplains);
studentRoute.post('/complain_page',verifyStudent,createComplain);
studentRoute.patch("/resolve/:complaint_id",verifyStudent,resolveComplain);
studentRoute.get("/mess",verifyStudent,getMessMenu);
studentRoute.get("/schedule",verifyStudent,getTransportSchedule);

export default studentRoute;