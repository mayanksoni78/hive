import { getSupabase } from '../config.js';

const supabase = getSupabase();

// POST /api/complain/complain_page
// Body: { enroll_id, description, complain_type, image_url }
export const createComplain = async (req, res) => {
  try {
    const { enroll_id, description, complain_type, image_url } = req.body;

    if (!enroll_id || !description || !complain_type || !image_url) {
      return res.json({ error: 'Missing required fields' });
    }

    // Fetch student details from DB using enroll_id — don't trust client-sent name
    const { data: student, error: studentError } = await supabase
      .from('student')
      .select('enroll_id, name, room_id')
      .eq('enroll_id', enroll_id)
      .single();

    if (studentError || !student) {
      return res.json({ error: 'Student not found' });
    }

    const { data, error } = await supabase
      .from('complaints')
      .insert([{
        name:          student.name,
        enroll_id:     student.enroll_id,
        room_no:       student.room_id,
        description,
        complain_type,
        image_url,
        status:        'Pending',
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
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ complains: data });
  } catch (error) {
    console.log('Backend Error:', error);
    res.json({ error: error.message });
  }
};

export default createComplain;