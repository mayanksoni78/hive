import { Router } from "express";
import { supabase } from "../supabase.js";
import { hash } from 'bcrypt'
import  jwt  from "jsonwebtoken";
import { verifyToken } from "../middlewares/hostelAuthMiddlewares.js";
import hostelData from "../controllers/hostelData.js";


const hostelRouter = Router();
hostelRouter.post("/login", async (req, res) => {
  const { Hostel_Name, password } = req.body;
  console.log("clicked")
  const { data: user } = await supabase
    .from("Hostel")
    .select("*")
    .eq("Hostel Domain", Hostel_Name)
    .single();
  console.log(user);
  if (!user) return res.status(401).json({ error: "User not found" });
  const valid = password=== user.password;
  if (!valid) return res.status(401).json({ error: "Wrong password" });

  const token = jwt.sign(
    {
      sub: user.Hostel_Name,
      role: "authenticated"
    },
    process.env.VITE_SUPABASE_JWT_KEY,
    { expiresIn: "7d" }
  );
  console.log(token)
  res.json({ token });

})



hostelRouter.post("/signup", async (req, res) => {

  const { Hostel_Name, Address, Owner_Name, Manager_Name, Owner_Number, Manager_Contact, Password } = req.body
  const domain = 'admin@' + Hostel_Name;
  console.log("hitted");
  try {
    const { data, error } = await supabase
      .from('Hostel')
      .insert([
        { "Hostel Name": Hostel_Name, "Owner Name": Owner_Name, "Owner Number": Owner_Number, "Manager": Manager_Name, "Manager Number": Manager_Contact, "Address": Address, "Hostel Domain": domain, "Password": Password },
      ])
      .select("*")

    res.status(200).send(data).redirect(true);
  } catch (e) {
    // console.log(e)
    res.status(409).send("Something wrong in fetching");
  }

})



hostelRouter.get("/dashboard",verifyToken,hostelData)
export default hostelRouter;