import {supabase} from "../supabase.js"

const createComplain=async(req,res)=>{
    try{
        const {name,enroll_id,room_no,description,complain_type,image_url}= req.body;
        if(!room_no || !description || !complain_type ||!image_url ||!name ||!enroll_id )
        {
            return res.json({error:"Missing required fields"})
        }
        const {data,error}=await supabase.from('complaints').insert([{
            name,enroll_id,room_no,description,complain_type,image_url,status:'Pending',date:Date.now()}
        ]).select();

        if(error)throw error;
        
        res.json({message:"Complain created",data})
        }
    catch(error){
        console.log("Backend Error:", error);
         res.json({ error: error.message })
    }
}
import { getSupabase } from '../config.js';

const supabase = getSupabase();

// POST /api/complain/complain_page
// Body: { enroll_id, hostel_id, room_no, description, complain_type, image_url }
export const createComplain = async (req, res) => {
  try {
    const { enroll_id, hostel_id, room_no, description, complain_type, image_url } = req.body;

    // Tell client exactly which field is missing for easier debugging
    const missing = [];
    if (!enroll_id)     missing.push('enroll_id');
    if (!hostel_id)     missing.push('hostel_id');
    if (!room_no)       missing.push('room_no');
    if (!description)   missing.push('description');
    if (!complain_type) missing.push('complain_type');
    if (missing.length > 0) {
      return res.json({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    // Fetch student name from DB — don't trust client
    const { data: student, error: studentError } = await supabase
      .from('student')
      .select('name')
      .eq('enroll_id', enroll_id)
      .single();

    if (studentError || !student) {
      return res.json({ error: 'Student not found' });
    }

    const { data, error } = await supabase
      .from('complaints')
      .insert([{
        enroll_id,
        hostel_id:     Number(hostel_id),
        name:          student.name,
        room_no,
        description,
        complain_type,
        image_url:     image_url || null,
        status:        'Pending',
        date:          new Date().toISOString().split('T')[0],
      }])
      .select();

    if (error) throw error;

    res.json({ message: 'Complaint submitted', data });
  } catch (error) {
    console.log('Backend Error:', error);
    res.json({ error: error.message });
  }
};

// GET /api/complain/my_complains?enroll_id=101
export const getComplains = async (req, res) => {
  try {
    const { enroll_id } = req.query;

    if (!enroll_id) return res.json({ error: 'enroll_id is required' });

    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('enroll_id', enroll_id)
      .order('date', { ascending: false }); // ✅ uses 'date' not 'created_at'

    if (error) throw error;

    res.json({ complains: data });
  } catch (error) {
    console.log('Backend Error:', error);
    res.json({ error: error.message });
  }
};

// PATCH /api/complain/resolve/:complaint_id
// Body: { enroll_id }
export const resolveComplain = async (req, res) => {
  try {
    const { complaint_id } = req.params;
    const { enroll_id }    = req.body;

    if (!enroll_id) return res.json({ error: 'enroll_id is required' });

    // Verify complaint belongs to this student
    const { data: existing, error: findError } = await supabase
      .from('complaints')
      .select('complaint_id, enroll_id, status')
      .eq('complaint_id', complaint_id)
      .eq('enroll_id', enroll_id)
      .single();

    if (findError || !existing) {
      return res.json({ error: 'Complaint not found or not yours' });
    }

    if (existing.status === 'Resolved') {
      return res.json({ error: 'Complaint is already resolved' });
    }

    const { data, error } = await supabase
      .from('complaints')
      .update({
        status:        'Resolved',
        resolved_date: new Date().toISOString().split('T')[0],
      })
      .eq('complaint_id', complaint_id)
      .eq('enroll_id', enroll_id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: 'Complaint marked as resolved', data });
  } catch (error) {
    console.log('Backend Error:', error);
    res.json({ error: error.message });
  }
};

export default createComplain;