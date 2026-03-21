import { generateToken } from "../util/generateToken.js";
import { supabase } from "../supabase.js";
import bcrypt from "bcrypt";

export async function hostelSignup(req, res) {
    try {
        const { Hostel_Name, Address, Owner_Name, Owner_Number, Password } = req.body;
        console.log(Hostel_Name,Address,Owner_Name,Owner_Number,Password)
       
        if (!Hostel_Name || !Address || !Owner_Name || !Owner_Number || !Password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

       
        const domain = `admin@${Hostel_Name.trim().toLowerCase().replace(/\s+/g, "_")}`;

        
        const hashedPassword = await bcrypt.hash(Password, 10);

      
        const { data, error } = await supabase
            .from("hostel")
            .insert([
                {
                    hostel_id: domain,
                    hostel_name: Hostel_Name,
                    total_rooms: 10,
                    location: Address,
                    owner_name: Owner_Name,
                    owner_contact: Owner_Number,
                    password: hashedPassword,
                },
            ])
            .select("*");

        if (error) {
            return res.status(400).json({ msg: error.message });
        }

        // console.log(data)
        const token = generateToken(domain);
        // console.log(token)
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            msg: "Signup successful",
            data,
        });

    } catch (e) {
        console.error("Signup error:", e);
        return res.status(500).json({ msg: "Internal server error" });
    }
}