import { supabase } from '../supabase.js';

export const addBus = async (req, res) => {
  try {
    const { hostel_id, transport_id, pickup, destination, date, day, start_time, end_time, student_count, batch, bus_count } = req.body;

    if (!hostel_id || !transport_id || !pickup || !destination || !date || !start_time || !end_time || !day || !student_count || !batch || !bus_count) {
      return res.json({ error: "Missing required Fields" });
    }

    const { data, error } = await supabase
      .from('transport')
      .insert([{ pickup, destination, day, date, start_time, end_time, student_count, batch, bus_count,hostel_id }])
      .select();

    if (error) {
      console.log(error);
      throw error;}
    
    res.json({ message: "Bus Added", data });
  } catch (error) {
    console.error("Backend Error:", error);
    res.json({ error: error.message });
  }
};


export const getTransportSchedule = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('transport')
      .select('*')
      .gte('date', today)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;

    res.json({ schedule: data });
  } catch (error) {
    console.error("Backend Error:", error);
    res.json({ error: error.message });
  }
};