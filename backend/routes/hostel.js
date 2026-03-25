import { Router } from "express";
import { addStudent } from "../controllers/addStudent.js";
import { hostelLogin } from "../controllers/hostelLogin.js";
import { verifyToken } from "../middlewares/hostelAuthMiddlewares.js";
import hostelData from "../controllers/hostelData.js";
import { hostelSignup } from "../controllers/hostelSignup.js";


const hostelRouter = Router();
hostelRouter.post("/login", hostelLogin)

hostelRouter.post("/signup", hostelSignup)
hostelRouter.post("/signup", async (req, res) => {

  const { Hostel_Name, Address, Owner_Name, Manager_Name, Owner_Number, Manager_Contact, Password } = req.body
  const domain = 'admin@' + Hostel_Name;
  console.log("hitted");
  try {
    const { data, error } = await supabase
      .from('Hostel')
      .insert([
        { "hostel_id": domain,  "hostel_name": Hostel_Name, "total_rooms": 10, "location": Address, "Owner_Name":Owner_Name, "Manager_Name":Manager_Name, "Owner_Number":Owner_Number, "Manager_Contact":Manager_Contact, "Password":Password},
      ])
      .select("*")
      console.log(data,error)
    res.status(200).send(data);
  } catch (e) {
    // console.log(e)
    res.status(409).send("Something wrong in fetching");
  }

})

hostelRouter.get("/dashboard",verifyToken,hostelData)
hostelRouter.post("/addstudents",verifyToken,addStudent)
// hostelRouter.get("/")
export default hostelRouter;