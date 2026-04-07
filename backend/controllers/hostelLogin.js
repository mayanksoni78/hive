import { supabase } from "../supabase.js";
import { generateToken } from "../util/generateToken.js";
import bcrypt from 'bcrypt'
export async function hostelLogin(req, res) {
  try {
    const { hostel_id, password } = req.body;

    const { data: user, error } = await supabase
      .from('hostel')
      .select("*")
      .eq("hostel_id", hostel_id);

    if (!user || user.length === 0) {
      return res.json({ msg: "Wrong hostel_id" });
    }

    const isCorrectPassword = await bcrypt.compare(password, user[0].password);

    if (!isCorrectPassword) {
      return res.json({ msg: "Wrong password" });
    }

    const token = generateToken(hostel_id, "hostel");

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "success",
      hostel_id
    });

  } catch (e) {
    console.log("login failed:", e);
    res.json({ error: "something went wrong" });
  }
}