import { supabase } from "../supabase.js";
const hostelData = async (req, res) => {
  try {
    const hostel_id = req.user;

    const { data, error } = await supabase
      .from("hostel")
      .select(`
        hostel_id,
        hostel_name,
        room(room_id, room_no, capacity, occupied, status),
        student(enroll_id, name, email, phone, gender, year, room_id),
        complaints(complaint_id, room_no, complain_type, description, status, date),
        fee(fee_id, enroll_id, amount, status, due_date, paid_date),
        admin(admin_id, name, email, department, phone)
      `)
      .eq("hostel_id", hostel_id)
      .single();
        console.log(data)
    if (error) throw error;

    return res.json({ data });

  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

export default hostelData;