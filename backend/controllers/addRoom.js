import { supabase } from "../supabase.js";

export async function addRoom(req, res) {
    const hostel_id = req.user;
    const roomData = req.body;
    try {
        const { data, error } = await supabase.from("room").insert([
            { room_no: roomData.room_no, capacity: roomData.occupicity ,hostel_id:hostel_id}
        ]).select("*");
        return res.json({msg:"Room added successfull"});
    } catch (e) {

    }
}