import { Router } from "express";
import { addStudent } from "../controllers/addStudent.js";
import { hostelLogin } from "../controllers/hostelLogin.js";
import { verifyToken } from "../middlewares/hostelAuthMiddlewares.js";
import hostelData from "../controllers/hostelData.js";
import { hostelSignup } from "../controllers/hostelSignup.js";
import { markPaid } from "../controllers/markPaid.js";
import { addRoom } from "../controllers/addRoom.js";


const hostelRouter = Router();
hostelRouter.post("/login", hostelLogin)
hostelRouter.post("/signup", hostelSignup)

hostelRouter.get("/dashboard",verifyToken,hostelData)
hostelRouter.post("/addstudents",verifyToken,addStudent)
hostelRouter.post("/fees/markpaid/:id",verifyToken,markPaid)
hostelRouter.post("/addroom",verifyToken,addRoom)
// hostelRouter.get("/")


export default hostelRouter;