import { Router } from "express";
import { supabase } from "../supabase.js";
import { hostelLogin } from "../controllers/hostelLogin.js";
import { verifyToken } from "../middlewares/hostelAuthMiddlewares.js";
import hostelData from "../controllers/hostelData.js";
import { hostelSignup } from "../controllers/hostelSignup.js";


const hostelRouter = Router();
hostelRouter.post("/login", hostelLogin)

hostelRouter.post("/signup", hostelSignup)

hostelRouter.get("/dashboard",verifyToken,hostelData)
// hostelRouter.get("/")
export default hostelRouter;