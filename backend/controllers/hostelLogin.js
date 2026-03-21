import { supabase } from "../supabase.js";
import { generateToken } from "../util/generateToken.js";
export async function hostelLogin(req, res) {

    const { Hostel_Name, password } = req.body;
    const { data: user } = await supabase
        .from("Hostel")
        .select("*")
        .eq("hostel_email", Hostel_Name)
        .single();
    if (!user) return res.status(401).json({ error: "User not found" });
    const valid = password === user.password;
    if (!valid) return res.status(401).json({ error: "Wrong password" });

    const token = generateToken(user.hostel_email)
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.json({ mssg: "success" }).status(200);
}