import { supabase } from '../supabase.js';

// GET /api/profile?enroll_id=101
export const getProfile = async (req, res) => {
  try {
    const { enroll_id } = req.query;

    if (!enroll_id) return res.json({ error: 'enroll_id is required' });

    const { data: student, error } = await supabase
      .from('student')
      .select('enroll_id, name, email, phone, gender, year, address, hostel_id, room_id, status')
      .eq('enroll_id', enroll_id)
      .single();

    if (error || !student) return res.json({ error: 'Profile not found' });

    res.json({ student });
  } catch (error) {
    console.error('Profile Get Error:', error);
    res.json({ error: error.message });
  }
};

// PUT /api/profile
// Body: { enroll_id, phone, address }
export const updateProfile = async (req, res) => {
  try {
    const { enroll_id, phone, address,password } = req.body;

    if (!enroll_id) return res.json({ error: 'enroll_id is required' });

    // Only phone and address are student-editable
    const updates = {};
    if (phone   !== undefined) updates.phone   = phone;
    if (address !== undefined) updates.address = address;
    if (password !== undefined) updates.password = password;

    if (Object.keys(updates).length === 0) {
      return res.json({ error: 'No valid fields to update' });
    }

    const { data, error } = await supabase
      .from('student')
      .update(updates)
      .eq('enroll_id', enroll_id)
      .select('enroll_id, name, email, phone, gender, year, address, hostel_id, room_id')
      .single();

    if (error) throw error;

    res.json({ message: 'Profile updated successfully', student: data });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.json({ error: error.message });
  }
};