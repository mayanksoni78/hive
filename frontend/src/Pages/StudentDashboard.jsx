import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const API = "http://localhost:3000/api";

const enrollID = localStorage.getItem("enroll_id") || "{}";
// const [student, setStudent]=useState([]);

// //fetch student data
// const getStudent = async () => {
//   try { 
//     const {data,error}= await supabase
//     .from("students")
//     .select("*")
//     .eq("enroll_id", enrollID)
//     .single();
//     if(error) throw error;  
//     setStudent(data);
//   }
//   catch(error) {
//     console.error("Error fetching student data:", error);
//    }
// };

// useEffect(()=>{
//   getStudent();
// }, []);


const apiFetch = {
  get: (url) =>
    fetch(url).then(r => r.json()),
  post: (url, body) =>
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json()),
  put: (url, body) =>
    fetch(url, { method: "PUT",  headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json()),
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink:#0f1117; --ink-2:#3a3d4a; --ink-3:#6b6f7e;
    --surface:#fff; --surface-2:#f5f5f3; --surface-3:#eeede9;
    --border:#e2e0da; --accent:#2d5be3; --accent-2:#e8f0ff;
    --green:#1a8f5c; --green-bg:#e6f7ef;
    --amber:#b45309; --amber-bg:#fef3c7;
    --red:#c0392b; --red-bg:#fdecea;
    --radius:12px; --radius-sm:8px;
    --shadow:0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04);
    --shadow-lg:0 8px 32px rgba(0,0,0,0.10);
    font-family:'DM Sans',sans-serif;
  }
  body { background:var(--surface-2); color:var(--ink); min-height:100vh; }
  .app { display:flex; min-height:100vh; }

  .sidebar { width:240px; background:var(--ink); display:flex; flex-direction:column; padding:28px 0; position:fixed; top:0; left:0; bottom:0; z-index:100; }
  .sidebar-logo { padding:0 24px 28px; border-bottom:1px solid rgba(255,255,255,0.08); }
  .sidebar-logo h1 { font-family:'DM Serif Display',serif; font-size:20px; color:#fff; line-height:1.2; }
  .sidebar-logo span { font-size:10px; color:rgba(255,255,255,0.35); text-transform:uppercase; letter-spacing:1.5px; }
  .nav { padding:16px 0; flex:1; overflow-y:auto; }
  .nav-section { font-size:10px; color:rgba(255,255,255,0.25); text-transform:uppercase; letter-spacing:1.5px; padding:16px 24px 6px; }
  .nav-item { display:flex; align-items:center; gap:12px; padding:11px 24px; cursor:pointer; color:rgba(255,255,255,0.45); font-size:14px; border-left:2px solid transparent; transition:all 0.15s; margin:1px 0; }
  .nav-item:hover { color:#fff; background:rgba(255,255,255,0.05); }
  .nav-item.active { color:#fff; border-left-color:var(--accent); background:rgba(45,91,227,0.18); font-weight:500; }
  .nav-icon { font-size:15px; width:20px; text-align:center; flex-shrink:0; }
  .nav-ext-icon { font-size:9px; color:rgba(255,255,255,0.2); margin-left:auto; }
  .sidebar-footer { padding:16px 24px; border-top:1px solid rgba(255,255,255,0.08); flex-shrink:0; }
  .s-user { display:flex; align-items:center; gap:10px; }
  .s-av { width:34px; height:34px; border-radius:50%; background:var(--accent); color:#fff; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; flex-shrink:0; }
  .s-name { font-size:13px; color:#fff; font-weight:500; }
  .s-id { font-size:11px; color:rgba(255,255,255,0.35); }
  .logout-btn { margin-top:12px; width:100%; padding:8px 0; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:var(--radius-sm); color:rgba(255,255,255,0.5); font-size:12px; cursor:pointer; transition:all 0.15s; font-family:'DM Sans',sans-serif; }
  .logout-btn:hover { background:rgba(255,255,255,0.1); color:#fff; }

  .main { margin-left:240px; flex:1; padding:36px 40px; max-width:calc(100vw - 240px); }
  .page-header { margin-bottom:28px; display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:12px; }
  .page-title { font-family:'DM Serif Display',serif; font-size:28px; color:var(--ink); line-height:1; }
  .page-sub { font-size:13px; color:var(--ink-3); margin-top:5px; }

  .card { background:var(--surface); border-radius:var(--radius); border:1px solid var(--border); box-shadow:var(--shadow); }
  .card-pad { padding:24px; }

  .stat-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:14px; margin-bottom:24px; }
  .stat-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:18px; box-shadow:var(--shadow); animation:fadeUp 0.4s ease both; }
  .stat-card:nth-child(1){animation-delay:0.05s}.stat-card:nth-child(2){animation-delay:0.10s}
  .stat-card:nth-child(3){animation-delay:0.15s}.stat-card:nth-child(4){animation-delay:0.20s}
  .stat-label { font-size:11px; color:var(--ink-3); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:7px; }
  .stat-value { font-size:18px; font-weight:600; color:var(--ink); line-height:1; }
  .stat-sub { font-size:11px; color:var(--ink-3); margin-top:5px; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

  .dash-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; }

  .qa-item { display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:8px; margin-bottom:8px; cursor:pointer; transition:all 0.15s; }
  .qa-item:hover { transform:translateX(4px); filter:brightness(0.96); }
  .qa-item:last-child { margin-bottom:0; }
  .qa-icon-wrap { width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
  .qa-label { font-size:13px; font-weight:500; color:var(--ink); flex:1; }
  .qa-arrow { color:var(--ink-3); font-size:16px; }

  .tbl { width:100%; border-collapse:collapse; }
  .tbl th { text-align:left; font-size:11px; font-weight:500; color:var(--ink-3); text-transform:uppercase; letter-spacing:0.8px; padding:0 16px 12px; border-bottom:1px solid var(--border); }
  .tbl td { padding:13px 16px; font-size:14px; color:var(--ink-2); border-bottom:1px solid var(--surface-2); }
  .tbl tr:last-child td { border-bottom:none; }
  .tbl tr:hover td { background:var(--surface-2); }

  .badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:100px; font-size:12px; font-weight:500; }
  .badge.green { background:var(--green-bg); color:var(--green); }
  .badge.amber { background:var(--amber-bg); color:var(--amber); }
  .badge.red   { background:var(--red-bg);   color:var(--red); }
  .badge.blue  { background:var(--accent-2); color:var(--accent); }
  .badge.gray  { background:var(--surface-3); color:var(--ink-2); }

  .form-group { margin-bottom:18px; }
  .form-label { display:block; font-size:13px; font-weight:500; color:var(--ink-2); margin-bottom:6px; }
  .form-input { width:100%; padding:10px 14px; border:1px solid var(--border); border-radius:var(--radius-sm); font-size:14px; font-family:'DM Sans',sans-serif; color:var(--ink); background:var(--surface); transition:border-color 0.15s; outline:none; }
  .form-input:focus { border-color:var(--accent); }
  .form-input:disabled { background:var(--surface-2); color:var(--ink-3); cursor:not-allowed; }
  textarea.form-input { resize:vertical; min-height:100px; line-height:1.6; }
  select.form-input { cursor:pointer; }

  .btn { display:inline-flex; align-items:center; gap:7px; padding:10px 20px; border-radius:var(--radius-sm); font-size:14px; font-weight:500; font-family:'DM Sans',sans-serif; cursor:pointer; border:none; transition:all 0.15s ease; }
  .btn-primary { background:var(--accent); color:#fff; }
  .btn-primary:hover { background:#1e4ac8; transform:translateY(-1px); box-shadow:0 4px 12px rgba(45,91,227,0.3); }
  .btn-ghost { background:transparent; color:var(--ink-2); border:1px solid var(--border); }
  .btn-ghost:hover { background:var(--surface-2); }
  .btn:disabled { opacity:0.55; cursor:not-allowed; transform:none !important; }

  .alert { padding:12px 16px; border-radius:var(--radius-sm); font-size:13px; margin-bottom:18px; border:1px solid; }
  .alert.success { background:var(--green-bg); color:var(--green); border-color:#b2dfce; }
  .alert.error   { background:var(--red-bg);   color:var(--red);   border-color:#f5c6c2; }

  .fee-summary { display:grid; grid-template-columns:repeat(3,1fr); }
  .fee-stat { padding:22px; text-align:center; border-right:1px solid var(--border); }
  .fee-stat:last-child { border-right:none; }
  .fee-amount { font-family:'DM Serif Display',serif; font-size:26px; }
  .fee-label { font-size:12px; color:var(--ink-3); margin-top:4px; }

  .profile-header { display:flex; align-items:center; gap:18px; padding:22px; border-bottom:1px solid var(--border); }
  .profile-avatar { width:58px; height:58px; border-radius:50%; background:var(--accent); color:#fff; display:flex; align-items:center; justify-content:center; font-size:22px; font-family:'DM Serif Display',serif; flex-shrink:0; }
  .profile-grid { display:grid; grid-template-columns:1fr 1fr; }
  .profile-field { padding:15px 22px; border-bottom:1px solid var(--border); }
  .profile-field:nth-child(odd) { border-right:1px solid var(--border); }
  .profile-field-label { font-size:11px; text-transform:uppercase; letter-spacing:0.8px; color:var(--ink-3); margin-bottom:4px; }
  .profile-field-value { font-size:14px; color:var(--ink); }

  .loader { display:flex; align-items:center; justify-content:center; padding:60px; gap:8px; color:var(--ink-3); font-size:14px; }
  .spinner { width:18px; height:18px; border:2px solid var(--border); border-top-color:var(--accent); border-radius:50%; animation:spin 0.7s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }

  .empty { text-align:center; padding:50px 24px; }
  .empty-icon { font-size:36px; margin-bottom:10px; }
  .empty-title { font-size:15px; color:var(--ink-2); font-weight:500; margin-bottom:4px; }
  .empty-sub { font-size:13px; color:var(--ink-3); }

  .section-title { font-size:14px; font-weight:600; color:var(--ink); padding:18px 22px 14px; }

  @media (max-width:900px) {
    .sidebar { width:56px; }
    .sidebar-logo, .nav-item span, .nav-section, .nav-ext-icon, .s-name, .s-id, .logout-btn { display:none; }
    .nav-item { justify-content:center; padding:14px; }
    .main { margin-left:56px; padding:20px 16px; max-width:calc(100vw - 56px); }
    .dash-grid, .profile-grid { grid-template-columns:1fr; }
    .profile-field:nth-child(odd) { border-right:none; }
    .fee-summary { grid-template-columns:1fr; }
    .fee-stat { border-right:none; border-bottom:1px solid var(--border); }
    .fee-stat:last-child { border-bottom:none; }
  }
`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function Loader() {
  return <div className="loader"><div className="spinner" />Loading…</div>;
}

function Badge({ status }) {
  const map = {
    Paid:"green", paid:"green", Pending:"amber", pending:"amber",
    Overdue:"red", overdue:"red", Resolved:"green", "In Progress":"blue",
    Open:"amber", Active:"green", active:"green", Inactive:"red", inactive:"red",
  };
  return <span className={`badge ${map[status] || "gray"}`}>{status}</span>;
}

function initials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "ST";
}

function genderLabel(g) {
  if (g === "M") return "Male";
  if (g === "F") return "Female";
  return g || "—";
}

// ─── PAGE: DASHBOARD ─────────────────────────────────────────────────────────
function DashboardPage({ student, onNavigate }) {
  if (!student) return <Loader />;

  const quickActions = [
    { icon:"🍽️", label:"Today's mess menu",  id:"mess",      bg:"#f0fff8", iconBg:"#d1fae5" },
    { icon:"🚌", label:"Transport schedule",  id:"transport", bg:"#f0f4ff", iconBg:"#dbeafe" },
    { icon:"📋", label:"Submit a complaint",  id:"complaint", bg:"#fff5f5", iconBg:"#fee2e2" },
    { icon:"🔔", label:"View notices",        id:"notices",   bg:"#fffbeb", iconBg:"#fef3c7" },
    { icon:"💳", label:"Check fee status",    id:"fee",       bg:"#f5f3ff", iconBg:"#ede9fe" },
    { icon:"👤", label:"Edit my profile",     id:"profile",   bg:"#f0fdf4", iconBg:"#dcfce7" },
    { icon:"🗂️", label:"My complaints", id:"mycomplains", bg:"#f0fdf4", iconBg:"#dcfce7" },
  ];

  return (
    <div style={{ animation:"fadeUp 0.35s ease" }}>
      <div className="page-header">
        <div>
          <div className="page-title">Good morning, {student.name?.split(" ")[0]} 👋</div>
          <div className="page-sub">Welcome to your hostel portal</div>
        </div>
        <Badge status={student.status || "active"} />
      </div>

      <div className="stat-grid">
        {[
          { label:"Enrollment ID", value:student.enroll_id,            sub:"Your student ID"                    },
          { label:"Room",          value:`#${student.room_id || "—"}`, sub:`Hostel ${student.hostel_id || "—"}` },
          { label:"Year",          value:student.year ? `Year ${student.year}` : "—", sub:genderLabel(student.gender) },
          { label:"Fee ID",        value:student.fee_id || "—",        sub:"Payment account"                    },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize:17 }}>{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="card card-pad" style={{ animation:"fadeUp 0.4s ease" }}>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:16 }}>Quick Actions</div>
          {quickActions.map(item => (
            <div key={item.id} className="qa-item"
              style={{ background:item.bg }}
              onClick={() => onNavigate(item.id)}>
              <div className="qa-icon-wrap" style={{ background:item.iconBg }}>{item.icon}</div>
              <span className="qa-label">{item.label}</span>
              <span className="qa-arrow">›</span>
            </div>
          ))}
        </div>

        <div className="card" style={{ animation:"fadeUp 0.45s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, padding:"18px 20px", borderBottom:"1px solid var(--border)" }}>
            <div className="s-av" style={{ width:44, height:44, fontSize:16, flexShrink:0 }}>{initials(student.name)}</div>
            <div>
              <div style={{ fontWeight:600, fontSize:15 }}>{student.name}</div>
              <div style={{ fontSize:12, color:"var(--ink-3)" }}>{student.email}</div>
            </div>
          </div>
          {[
            ["Phone",   student.phone   || "Not set"],
            ["Gender",  genderLabel(student.gender)],
            ["Address", student.address || "Not set"],
            ["Status",  null, <Badge key="s" status={student.status || "active"} />],
          ].map(([label, value, node]) => (
            <div key={label} style={{ padding:"12px 20px", borderBottom:"1px solid var(--surface-2)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:13, color:"var(--ink-3)" }}>{label}</span>
              <span style={{ fontSize:13, textAlign:"right" }}>{node || value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: FEE STATUS ─────────────────────────────────────────────────────────
// GET /api/fee/status?enroll_id=101
function FeePage({ student }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!student?.enroll_id) { setLoading(false); return; }
    apiFetch.get(`${API}/fee/status?enroll_id=${student.enroll_id}`)
      .then(r => {
        if (r.error) { setError(r.error); return; }
        setPayments(r.payments || []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [student]);

  const totalPaid = payments.filter(p => p.status === "Paid").reduce((s,p) => s + Number(p.amount), 0);
  const totalDue  = payments.filter(p => p.status !== "Paid").reduce((s,p) => s + Number(p.amount), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Fee Status</div>
          <div className="page-sub">Payment history</div>
        </div>
      </div>
      {loading ? <Loader /> : error ? (
        <div className="alert error">{error}</div>
      ) : <>
        <div className="card" style={{ marginBottom:20, animation:"fadeUp 0.4s ease" }}>
          <div className="fee-summary">
            {[
              { label:"Total Paid",   value:`₹${totalPaid.toLocaleString("en-IN")}`, color:"var(--green)" },
              { label:"Outstanding",  value:`₹${totalDue.toLocaleString("en-IN")}`,  color:totalDue > 0 ? "var(--red)" : "var(--ink-3)" },
              { label:"Transactions", value:payments.length,                          color:"var(--ink)" },
            ].map(s => (
              <div className="fee-stat" key={s.label}>
                <div className="fee-amount" style={{ color:s.color }}>{s.value}</div>
                <div className="fee-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ animation:"fadeUp 0.45s ease" }}>
          <div className="section-title">Payment History</div>
          {payments.length === 0
            ? <div className="empty"><div className="empty-icon">💳</div><div className="empty-title">No payment records yet</div></div>
            : <div style={{ overflowX:"auto" }}>
                <table className="tbl">
                  <thead><tr><th>Month</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontWeight:500 }}>{p.month}</td>
                        <td>₹{Number(p.amount).toLocaleString("en-IN")}</td>
                        <td><Badge status={p.status} /></td>
                        <td style={{ color:"var(--ink-3)" }}>
                          {p.payment_date ? new Date(p.payment_date).toLocaleDateString("en-IN") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </div>
      </>}
    </div>
  );
}

// ─── PAGE: PROFILE ────────────────────────────────────────────────────────────
// GET /api/profile?enroll_id=101
// PUT /api/profile  body: { enroll_id, phone, address }
function ProfilePage({ student, setStudent }) {
  const [form, setForm]       = useState({ phone:student?.phone || "", address:student?.address || "" });
  const [editing, setEditing] = useState(false);
  const [status, setStatus]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const r = await apiFetch.put(`${API}/profile`, {
      enroll_id: student.enroll_id,
      phone:     form.phone,
      address:   form.address,
    });
    setLoading(false);
    if (r.error) {
      setStatus({ type:"error", msg:r.error });
    } else {
      const updated = { ...student, ...r.student };
      localStorage.setItem("student", JSON.stringify(updated));
      setStudent(updated);
      setEditing(false);
      setStatus({ type:"success", msg:"Profile updated successfully!" });
    }
  };

  const readOnly = [
    ["Enrollment ID", student.enroll_id],
    ["Name",   student.name],
    ["Email",  student.email],
    ["Gender", genderLabel(student.gender)],
    ["Year",   student.year ? `Year ${student.year}` : "—"],
    ["Room",   student.room_id   || "—"],
    ["Hostel", student.hostel_id || "—"],
    ["Status", null, <Badge key="st" status={student.status || "active"} />],
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">My Profile</div>
          <div className="page-sub">View and update your details</div>
        </div>
        {!editing
          ? <button className="btn btn-ghost" onClick={() => setEditing(true)}>✏️ Edit Profile</button>
          : <div style={{ display:"flex", gap:10 }}>
              <button className="btn btn-ghost" onClick={() => { setEditing(false); setStatus(null); }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading}>{loading ? "Saving…" : "Save"}</button>
            </div>
        }
      </div>

      {status && <div className={`alert ${status.type}`} style={{ maxWidth:680 }}>{status.msg}</div>}

      <div className="card" style={{ maxWidth:680, animation:"fadeUp 0.4s ease" }}>
        <div className="profile-header">
          <div className="profile-avatar">{initials(student.name)}</div>
          <div>
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:20 }}>{student.name}</div>
            <div style={{ fontSize:13, color:"var(--ink-3)", marginTop:2 }}>{student.email} · {student.enroll_id}</div>
          </div>
        </div>
        <div className="profile-grid">
          {readOnly.map(([label, value, node]) => (
            <div className="profile-field" key={label}>
              <div className="profile-field-label">{label}</div>
              <div className="profile-field-value">{node || value || "—"}</div>
            </div>
          ))}
          <div className="profile-field">
            <div className="profile-field-label">Phone</div>
            {editing
              ? <input className="form-input" style={{ marginTop:5 }} value={form.phone}
                  onChange={e => setForm({ ...form, phone:e.target.value })} placeholder="+91 XXXXX XXXXX" />
              : <div className="profile-field-value">{student.phone || <span style={{ color:"var(--ink-3)" }}>Not set</span>}</div>
            }
          </div>
          <div className="profile-field" style={{ gridColumn:"1/-1" }}>
            <div className="profile-field-label">Address</div>
            {editing
              ? <textarea className="form-input" style={{ marginTop:5, minHeight:70 }} value={form.address}
                  onChange={e => setForm({ ...form, address:e.target.value })} placeholder="Your home address" />
              : <div className="profile-field-value">{student.address || <span style={{ color:"var(--ink-3)" }}>Not set</span>}</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────
const NAV = [
  { id:"dashboard", icon:"⊞", label:"Dashboard",          section:"Main"  },
  { id:"fee",       icon:"💳", label:"Fee Status",         section:"Main"  },
  { id:"profile",   icon:"👤", label:"Profile",            section:"Main"  },
  { id:"mess",      icon:"🍽️", label:"Mess Menu",          section:"Pages", path:"/mess-menu"         },
  { id:"transport", icon:"🚌", label:"Transport Schedule", section:"Pages", path:"/transport_schedule" },
  { id:"complaint", icon:"📋", label:"Complaints",         section:"Pages", path:"/complain_page"      },
  { id:"notices",   icon:"🔔", label:"Notices",            section:"Pages", path:"/notices"            },
  { id:"mycomplains", icon:"🗂️", label:"My Complaints", section:"Pages", path:"/my_complains" },
];

export default function StudentDashboard() {
  const navigate              = useNavigate();
  const [page, setPage]       = useState("dashboard");
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const saved = getStudent();
    if (!saved) { navigate("/login"); return; }
    setStudent(saved);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("student");
    navigate("/login");
  };

  const handleNavigate = (id) => {
    const item = NAV.find(n => n.id === id);
    if (item?.path) { navigate(item.path); }
    else { setPage(id); }
  };

  const renderPage = () => {
    if (!student) return <Loader />;
    switch (page) {
      case "dashboard": return <DashboardPage student={student} onNavigate={handleNavigate} />;
      case "fee":       return <FeePage       student={student} />;
      case "profile":   return <ProfilePage   student={student} setStudent={setStudent} />;
      default:          return <DashboardPage student={student} onNavigate={handleNavigate} />;
    }
  };

  const sections = [...new Set(NAV.map(n => n.section))];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <nav className="sidebar">
          <div className="sidebar-logo">
            <h1>Hostel<br />Portal</h1>
            <span>Student · HIVE</span>
          </div>
          <div className="nav">
            {sections.map(section => (
              <div key={section}>
                <div className="nav-section">{section}</div>
                {NAV.filter(n => n.section === section).map(item => (
                  <div key={item.id}
                    className={`nav-item ${!item.path && page === item.id ? "active" : ""}`}
                    onClick={() => handleNavigate(item.id)}>
                    <span className="nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.path && <span className="nav-ext-icon">↗</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="sidebar-footer">
            <div className="s-user">
              <div className="s-av">{initials(student?.name)}</div>
              <div>
                <div className="s-name">{student?.name?.split(" ")[0] || "Student"}</div>
                <div className="s-id">{student?.enroll_id || "—"}</div>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>⎋ Logout</button>
          </div>
        </nav>
        <main className="main">{renderPage()}</main>
      </div>
    </>
  );
}