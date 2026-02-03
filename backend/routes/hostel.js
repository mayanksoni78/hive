import { Router } from "express";
import { supabase } from "../supabase.js";
const hostelRouter = Router();
hostelRouter.get("/", async (req, res) => {
  let data = await supabase
    .from("Hostel")
    .select()
  console.log(data)
  res.send(data)

})

hostelRouter.post("/", async (req, res) => {
  const { Hostel_Name, Address, Owner_Name, Manager_Name, Owner_Number, Manager_Contact } = req.body
  console.log(Hostel_Name, Address, Owner_Name, Manager_Name, Owner_Number, Manager_Contact)
  let data1 = await supabase
    .from("Hostel")
    .select()
  console.log(data1)
  data1["data"].forEach(element => {
    if (element["Hostel Name"] === Hostel_Name) {
      res.send(`Hostel with name ${Hostel_Name} exsists!! Try different name for domain`);
    }
  });
  const domain = '@' + Hostel_Name;
  try {
    const { data, error } = await supabase
      .from('Hostel')
      .insert([
        { "Hostel Name": Hostel_Name, "Owner Name": Owner_Name, "Owner Number": Owner_Number, "Manager": Manager_Name, "Manager Number": Manager_Contact, "Address": Address, "Hostel Domain": domain },
      ])
      .select("*")
    // console.log(data)
    res.redirect("http://localhost:5173/dashboard-hostel")
  } catch (e) {
    console.log(e)
  }

})

export default hostelRouter;