import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const HOSTEL_ID = 1;
// const { data: adminData } = await supabase
//     .from('Admin')
//     .select('hostel_id')
//     .eq('auth_id', user.id)  
//     .single();

// const HOSTEL_ID = adminData.hostel_id;
export async function getMenuByDate(date = null) {
  const targetDate = date || new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('mess_menu')
    .select('*')
    .eq('date', targetDate)
    .eq('hostel_id', HOSTEL_ID)      
    .single();
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching menu:', error);
    return null;
  }
  if (error) throw error;
  return data;
}

export async function getWeeklyMenu() {
  const today = new Date();
  const weekLater = new Date();
  weekLater.setDate(today.getDate() + 7);
  const { data, error } = await supabase
    .from('mess_menu')
    .select('*')
    .eq('hostel_id', HOSTEL_ID)       
    .gte('date', today.toISOString().split('T')[0])
    .lte('date', weekLater.toISOString().split('T')[0])
    .order('date', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function upsertMenu(menuData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  const formattedData = {
    date: menuData.date,
    hostel_id: HOSTEL_ID,              
    breakfast: {
      items: menuData.breakfast?.items || [],
      time: menuData.breakfast?.time || "7:30 AM - 9:00 AM"
    },
    lunch: {
      items: menuData.lunch?.items || [],
      time: menuData.lunch?.time || "12:30 PM - 2:00 PM"
    },
    snacks: {
      items: menuData.snacks?.items || [],
      time: menuData.snacks?.time || "4:30 PM - 5:30 PM"
    },
    dinner: {
      items: menuData.dinner?.items || [],
      time: menuData.dinner?.time || "7:30 PM - 9:30 PM"
    },
    special_note: menuData.special_note || null,
    is_holiday: menuData.is_holiday || false,
    updated_by: user.id
  };

  const { data, error } = await supabase
    .from('mess_menu')
    .upsert(formattedData, {
      onConflict: 'hostel_id, date',   
      ignoreDuplicates: false
    })
    .select();

  if (error) throw error;
  return data[0];
}
export async function deleteMenu(date) {
  const { error } = await supabase
    .from('mess_menu')
    .delete()
    .eq('date', date)
    .eq('hostel_id', HOSTEL_ID);       

  if (error) throw error;
  return true;
}

export function subscribeToMenuUpdates(callback) {
  const subscription = supabase
    .channel('mess_menu_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'mess_menu',
      filter: `hostel_id=eq.${HOSTEL_ID}`  
    }, (payload) => {
      callback(payload);
    })
    .subscribe();
  return subscription;
}

export async function getNotices(hostel_id) {
    const { data, error } = await supabase
        .from('notice')
        .select('*')
        .order('date', { ascending: false });
    
    console.log('Notices data:', data);
    console.log('Notices error:', error);
    
    if (error) throw error;
    return data || [];
}
export function subscribeToNotices(hostel_id, callback) {
    return supabase
        .channel('notice_changes')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'notice',
            filter: `hostel_id=eq.${hostel_id}`
        }, callback)
        .subscribe();
}