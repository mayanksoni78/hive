import { supabase } from '../supabase.js';

// GET /api/mess/menu?date=2025-03-20&hostel_id=1
export const getMessMenu = async (req, res) => {
  try {
    const { hostel_id, date } = req.query;
    const menuDate = date || new Date().toISOString().split('T')[0];

    if (!hostel_id) {
      return res.json({ error: 'hostel_id is required' });
    }

    const { data, error } = await supabase
      .from('mess_menu')
      .select('*')
      .eq('date', menuDate)
      .eq('hostel_id', hostel_id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!data) {
      return res.json({ date: menuDate, menu: null, message: 'No menu published for this date' });
    }

    res.json({ date: menuDate, menu: data });
  } catch (error) {
    console.error('Mess Controller Error:', error);
    res.json({ error: error.message });
  }
};