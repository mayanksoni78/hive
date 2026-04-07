import { supabase } from "../supabase.js";
import bcrypt from 'bcrypt';
import { generateToken } from "../util/generateToken.js";

export async function studentLogin(req, res) {
    try {
        const body = req.body;

        if (!body || !body.enroll_id || !body.password) {
            return res.status(400).json({ msg: "enroll_id and password are required." });
        }

        const { data, error } = await supabase.from("student").select('*').eq("enroll_id", body.enroll_id);

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ msg: "No student found." });
        }

        const isCorrectPassword = await bcrypt.compare(body.password, data[0].password);

        if (!isCorrectPassword) {
            return res.status(401).json({ msg: "Wrong password." });
        }

        const token = generateToken(data[0].email, "student");

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ msg: "Login successful.", student: data[0] });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "Something went wrong." });
    }
}