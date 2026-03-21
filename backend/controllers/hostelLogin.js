import { supabase } from "../supabase.js";
import { generateToken } from "../util/generateToken.js";
import bcrypt from 'bcrypt'
export async function hostelLogin(req, res) {
    try {
        const { data } = req.body
        // console.log(data);
        const user = await supabase.from('hostel').select("*").eq("hostel_id", data.hostel_id)
        if (user.length === 0) return res.json({ msg: "Wrong email" })
        // console.log(user.data[0].password);
        const isCorrectPassword = await bcrypt.compare( data.password,user.data[0].password);
        // console.log(isCorrectPassword);
        if (!isCorrectPassword) return res.json({ msg: "Wrong password" });
        // console.log(user);
        const token = generateToken(data.hostel_id)
        console.log(token);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.json({ mssg: "success" }).status(200);
    }
    catch (e) {
        console.log("login failed:", e);
        return res.json({ error: "something went wrong" });
    }
}