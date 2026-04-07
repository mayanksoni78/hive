import { supabase } from '../supabase.js';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/login
// Body: { email, password }
// ─────────────────────────────────────────────────────────────────────────────
export async function adminLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    const { data, error } = await supabase
      .from("admin")
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .single();

    if (error || !data) {
      return res.status(401).json({ msg: "Admin not found" });
    }

    if (!data.is_active) {
      return res.status(403).json({ msg: "Your account has been deactivated. Contact the hostel admin." });
    }

    if (password !== data.password) {
      return res.status(401).json({ msg: "Wrong password" });
    }

    // Return admin data — frontend uses department to decide where to navigate
    return res.json({
      msg: "Login successful",
      data: {
        admin_id:   data.admin_id,
        name:       data.name,
        email:      data.email,
        department: data.department,   // "Mess_Manager" | "Transport_Manager" | "Hostel_Admin"
        hostel_id:  data.hostel_id,
        is_active:  data.is_active,
      }
    });

  } catch (e) {
    console.error("Admin login error:", e);
    return res.status(500).json({ msg: "Server error" });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/create
// Called from hostel dashboard when hostel owner adds a new admin
// Body: { name, email, password, phone, department, hostel_id }
// ─────────────────────────────────────────────────────────────────────────────
export async function createAdmin(req, res) {
  const { name, email, password, phone, department, hostel_id } = req.body;

  if (!name || !email || !password || !department || !hostel_id) {
    return res.json({ error: "name, email, password, department and hostel_id are required" });
  }

  // Validate department matches DB constraint
  const validDepts = ["Hostel_Admin", "Mess_Manager", "Transport_Manager"];
  if (!validDepts.includes(department)) {
    return res.json({ error: `Invalid department. Must be one of: ${validDepts.join(", ")}` });
  }

  try {
    // Check if email already exists
    const { data: existing } = await supabase
      .from("admin")
      .select("admin_id")
      .eq("email", email.trim().toLowerCase())
      .single();

    if (existing) {
      return res.json({ error: "An admin with this email already exists" });
    }

    const { data, error } = await supabase
      .from("admin")
      .insert([{
        name:       name.trim(),
        email:      email.trim().toLowerCase(),
        password,                          // store as-is (hash later with bcrypt)
        phone:      phone || null,
        department,
        hostel_id:  String(hostel_id),
        is_active:  true,
      }])
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: `${department.replace("_", " ")} created successfully`,
      data: {
        admin_id:   data.admin_id,
        name:       data.name,
        email:      data.email,
        department: data.department,
      }
    });

  } catch (error) {
    console.error("Create Admin Error:", error);
    res.json({ error: error.message });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/list?hostel_id=1
// Get all admins for a hostel (used by hostel dashboard)
// ─────────────────────────────────────────────────────────────────────────────
export async function getAdmins(req, res) {
  const { hostel_id } = req.query;

  if (!hostel_id) return res.json({ error: "hostel_id is required" });

  try {
    const { data, error } = await supabase
      .from("admin")
      .select("admin_id, name, email, phone, department, is_active")
      .eq("hostel_id", String(hostel_id))
      .order("department");

    if (error) throw error;

    res.json({ admins: data || [] });
  } catch (error) {
    console.error("Get Admins Error:", error);
    res.json({ error: error.message });
  }
}
