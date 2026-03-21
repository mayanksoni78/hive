import { generateToken } from "../util/generateToken.js";

export async function hostelSignup(req, res) {
    const { Hostel_Name, Address, Owner_Name, Manager_Name, Owner_Number, Manager_Contact, Password } = req.body
    const domain = 'admin@' + Hostel_Name;

    try {
        const { data, error } = await supabase
            .from('hostel')
            .insert([
                { "hostel_email": domain, "hostel_name": Hostel_Name, "total_rooms": 10, "location": Address, "warden_name": Owner_Name, "warden_contact": Owner_Number, "password": Password },
            ])
            .select("*")
        console.log(data, error)
        const token = generateToken(data.hostel_email)
        console.log(token)
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).send(data);
    } catch (e) {
        res.status(409).send("Something wrong in fetching");
    }

}