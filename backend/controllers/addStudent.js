import { supabase } from "../supabase.js";
import bcrypt from 'bcrypt';

export async function addStudent(req, res) {
    const data1 = req.body
    const hostel_id = req.user
    // console.log(hostel_id);
    console.log(data1)
    const hashedPassword = await bcrypt.hash(`${data1.roll}`, 10);
    // console.log(hashedPassword)
    try {
        const { data, error } = await supabase.from("student").insert([
            {
                name: data1.name,
                enroll_id: data1.enroll_id,
                email: data1.email,
                password: hashedPassword,
                phone: data1.phone,
                gender: data1.gender,
                year: data1.year,
                room_id: parseInt(data1.room_id) ,
                hostel_id: hostel_id
            },
        ]).select("*")
        // console.log(user.data1)
        console.log(data);
        if (error) return res.json({ msg: "Error in database", error: error });
        return res.json({ msg: "student added successfully" });
    } catch (e) {
        console.log("error in adding student:", e);
        return res.status(500)
    }
}