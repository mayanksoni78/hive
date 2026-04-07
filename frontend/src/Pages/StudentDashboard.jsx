import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import MyComplaints from "../Pages/MyComplaints";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const enrollID = localStorage.getItem("enroll_id");
  const [student, setStudent] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getStudent = async () => {
    try {
      const { data, error } = await supabase
        .from("student")
        .select("*")
        .eq("enroll_id", enrollID)
        .single();
      if (error) throw error;
      setStudent(data);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  useEffect(() => {
    if (!enrollID) { navigate("/"); return; }
    getStudent();
  }, [enrollID]);

  const handleLogout = () => {
    localStorage.removeItem("enroll_id");
    navigate("/");
  };

  const handleNavigate = (id) => {
    const item = NAV.find((n) => n.id === id);
    if (item?.path) {
      navigate(item.path);
    } else {
      setPage(id);
      setSidebarOpen(false);
    }
  };

  const renderPage = () => {
    if (!student) return <Loader />;
    switch (page) {
      case "dashboard":   return <DashboardPage student={student} onNavigate={handleNavigate} />;
      case "fee":         return <FeePage student={student} />;
      case "profile":     return <ProfilePage student={student} setStudent={setStudent} />;
      case "mycomplains": return <MyComplaints student={student} />;
      default:            return <DashboardPage student={student} onNavigate={handleNavigate} />;
    }
  };

  const sections = [...new Set(NAV.map((n) => n.section))];

  return (
    <div className="flex h-screen bg-[#f0f2f5] text-gray-900 font-sans w-full overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <nav className={`
        fixed md:relative z-30 h-full w-60 bg-[#111927] flex flex-col justify-between shrink-0
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="flex flex-col min-h-0">
          <div className="px-5 py-5 border-b border-[#1e2d3d]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#4f73b3]/20 border border-[#4f73b3]/30 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-[#7fa8e0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-black text-white tracking-tight leading-none">HIVE</h1>
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Student Portal</span>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <div className="overflow-y-auto py-4 px-3 space-y-5 flex-1">
            {sections.map((section) => (
              <div key={section}>
                <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1.5 px-2">
                  {section}
                </div>
                {NAV.filter((n) => n.section === section).map((item) => {
                  const active = !item.path && page === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`
                        flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition-all mb-0.5
                        ${active
                          ? "bg-[#4f73b3]/15 text-white border border-[#4f73b3]/25"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}
                      `}
                    >
                      <span className="text-sm w-5 text-center">{item.icon}</span>
                      <span className="flex-1 text-[13px]">{item.label}</span>
                      {item.path && (
                        <svg className="w-3 h-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* User + logout */}
        <div className="p-3 border-t border-[#1e2d3d]">
          <div className="flex items-center gap-2.5 mb-3 px-1">
            <div className="w-8 h-8 rounded-lg bg-[#4f73b3]/20 border border-[#4f73b3]/30 text-[#7fa8e0] flex items-center justify-center font-black text-[10px] shrink-0">
              {initials(student?.name)}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-[13px] font-semibold text-white truncate leading-tight">
                {student?.name?.split(" ")[0] || "Student"}
              </div>
              <div className="text-[10px] text-slate-500 truncate">{student?.enroll_id || "—"}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[11px] font-bold text-red-400 bg-red-500/8 border border-red-500/15 rounded-lg hover:bg-red-500/15 transition-all uppercase tracking-wider"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#111927] border-b border-[#1e2d3d]">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-black text-white tracking-wider text-sm">HIVE</span>
          <div className="w-8 h-8 rounded-lg bg-[#4f73b3]/20 text-[#7fa8e0] flex items-center justify-center font-bold text-[10px] border border-[#4f73b3]/30">
            {initials(student?.name)}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const API = "http://localhost:3000/api";

const apiFetch = {
  get: (url) => fetch(url).then((r) => r.json()),
  post: (url, body) =>
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.json()),
  put: (url, body) =>
    fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.json()),
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function Loader() {
  return (
    <div className="flex items-center justify-center h-64 gap-3 text-slate-400">
      <div className="w-8 h-8 rounded-xl bg-[#111927] flex items-center justify-center">
        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
      <span className="text-sm font-medium uppercase tracking-widest">Loading...</span>
    </div>
  );
}

function Badge({ status }) {
  const map = {
    Paid:        "bg-emerald-50 text-emerald-700 border-emerald-200",
    paid:        "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending:     "bg-amber-50 text-amber-700 border-amber-200",
    pending:     "bg-amber-50 text-amber-700 border-amber-200",
    Overdue:     "bg-red-50 text-red-700 border-red-200",
    overdue:     "bg-red-50 text-red-700 border-red-200",
    Resolved:    "bg-emerald-50 text-emerald-700 border-emerald-200",
    "In Progress":"bg-slate-100 text-slate-600 border-slate-200",
    Open:        "bg-amber-50 text-amber-700 border-amber-200",
    Active:      "bg-emerald-50 text-emerald-700 border-emerald-200",
    active:      "bg-emerald-50 text-emerald-700 border-emerald-200",
    Inactive:    "bg-red-50 text-red-700 border-red-200",
    inactive:    "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${map[status] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
      {status}
    </span>
  );
}

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "ST";
}

function genderLabel(g) {
  if (g === "M") return "Male";
  if (g === "F") return "Female";
  return g || "—";
}

function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex justify-between items-end mb-6">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-[#111927] tracking-tight">{title}</h2>
        <div className="h-0.5 w-6 bg-[#4f73b3] rounded-full mt-1.5 mb-1" />
        {subtitle && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-[0_2px_12px_rgba(17,25,39,0.07)] border border-slate-100 ${className}`}>
      {children}
    </div>
  );
}

// ─── PAGE: DASHBOARD ─────────────────────────────────────────────────────────
function DashboardPage({ student, onNavigate }) {
  if (!student) return <Loader />;

  const quickActions = [
    { icon: "🍽️", label: "Today's Mess Menu",   id: "mess"        },
    { icon: "🚌", label: "Transport Schedule",  id: "transport"   },
    { icon: "📋", label: "Submit a Complaint",  id: "complaint"   },
    { icon: "🔔", label: "View Notices",         id: "notices"     },
    { icon: "💳", label: "Check Fee Status",    id: "fee"         },
    { icon: "👤", label: "Edit My Profile",     id: "profile"     },
    { icon: "🗂️", label: "My Complaints",       id: "mycomplains" },
  ];

  const stats = [
    { label: "Enrollment ID", value: student.enroll_id,                          sub: "Student ID",                    icon: "🪪" },
    { label: "Room",          value: `#${student.room_id || "—"}`,               sub: `Hostel ${student.hostel_id || "—"}`, icon: "🚪" },
    { label: "Year",          value: student.year ? `Year ${student.year}` : "—", sub: genderLabel(student.gender),   icon: "📅" },
    { label: "Fee Account",   value: student.fee_id || "—",                      sub: "Payment ID",                    icon: "💳" },
  ];

  return (
    <div>
      {/* Greeting banner */}
      <div className="bg-[#111927] rounded-2xl p-6 md:p-7 mb-5 relative overflow-hidden shadow-[0_8px_30px_rgba(17,25,39,0.18)]">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "linear-gradient(rgba(79,115,179,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(79,115,179,0.6) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="relative flex justify-between items-start">
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">Welcome back</p>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {student.name?.split(" ")[0]} 👋
            </h2>
            <div className="h-0.5 w-8 bg-[#4f73b3] rounded-full mt-2.5" />
            <p className="text-slate-500 text-[10px] mt-2.5 uppercase tracking-widest font-medium">Hostel Management · HIVE</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <Badge status={student.status || "active"} />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-base">{s.icon}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</span>
            </div>
            <div className="text-lg font-black text-[#111927]">{s.value}</div>
            <div className="text-[11px] text-slate-400 mt-0.5 font-medium">{s.sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Quick Actions */}
        <Card className="overflow-hidden">
          <div className="bg-[#111927] px-5 py-3.5 border-b border-[#1e2d3d]">
            <h3 className="font-bold text-white text-[10px] uppercase tracking-widest">Quick Actions</h3>
          </div>
          <div className="p-3 space-y-1">
            {quickActions.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer border border-transparent hover:bg-slate-50 hover:border-slate-100 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#111927]/6 flex items-center justify-center text-base shrink-0 group-hover:bg-[#111927]/10 transition-colors">
                  {item.icon}
                </div>
                <span className="font-semibold text-[13px] text-slate-700 flex-1">{item.label}</span>
                <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </Card>

        {/* Profile snapshot */}
        <Card className="overflow-hidden h-fit">
          <div className="bg-[#111927] px-5 py-3.5 border-b border-[#1e2d3d] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#4f73b3]/20 border border-[#4f73b3]/30 text-[#7fa8e0] flex items-center justify-center font-black text-[10px]">
              {initials(student.name)}
            </div>
            <div>
              <div className="font-bold text-white text-sm">{student.name}</div>
              <div className="text-slate-500 text-[11px]">{student.email}</div>
            </div>
          </div>
          {[
            ["Phone",   student.phone || "Not set"],
            ["Gender",  genderLabel(student.gender)],
            ["Address", student.address || "Not set"],
            ["Status",  null, <Badge key="s" status={student.status || "active"} />],
          ].map(([label, value, node]) => (
            <div key={label} className="px-5 py-3 border-b border-slate-50 flex justify-between items-center last:border-0">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
              <span className="text-[13px] font-semibold text-slate-700 text-right">{node || value}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── PAGE: FEE STATUS ─────────────────────────────────────────────────────────
function FeePage({ student }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!student?.enroll_id) { setLoading(false); return; }
    apiFetch.get(`${API}/fee/status?enroll_id=${student.enroll_id}`)
      .then((r) => { if (r.error) { setError(r.error); return; } setPayments(r.payments || []); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [student]);

  const totalPaid = payments.filter((p) => p.status === "Paid").reduce((s, p) => s + Number(p.amount), 0);
  const totalDue  = payments.filter((p) => p.status !== "Paid").reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div>
      <PageHeader title="Fee Status" subtitle="Payment history" />

      {loading ? <Loader /> : error ? (
        <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm mb-6 font-medium flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {[
              { label: "Total Paid",   value: `₹${totalPaid.toLocaleString("en-IN")}`, color: "text-emerald-600", icon: "✅" },
              { label: "Outstanding",  value: `₹${totalDue.toLocaleString("en-IN")}`,  color: totalDue > 0 ? "text-red-500" : "text-slate-400", icon: "⏳" },
              { label: "Transactions", value: payments.length,                           color: "text-[#111927]", icon: "📊" },
            ].map((s) => (
              <Card key={s.label} className="p-5 text-center">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className={`text-2xl font-black mb-1 ${s.color}`}>{s.value}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</div>
              </Card>
            ))}
          </div>

          <Card className="overflow-hidden">
            <div className="bg-[#111927] px-5 py-3.5 border-b border-[#1e2d3d]">
              <h3 className="font-bold text-white text-[10px] uppercase tracking-widest">Payment History</h3>
            </div>
            {payments.length === 0 ? (
              <div className="p-14 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl mb-3">💳</div>
                <div className="font-bold text-slate-600 text-sm">No payment records yet</div>
                <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Records will appear here once available</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50">
                      {["Month", "Amount", "Status", "Date"].map((h) => (
                        <th key={h} className="px-5 py-3 border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5 border-b border-slate-50 text-[13px] font-semibold text-slate-800">{p.month}</td>
                        <td className="px-5 py-3.5 border-b border-slate-50 text-[13px] font-black text-[#111927]">₹{Number(p.amount).toLocaleString("en-IN")}</td>
                        <td className="px-5 py-3.5 border-b border-slate-50"><Badge status={p.status} /></td>
                        <td className="px-5 py-3.5 border-b border-slate-50 text-[13px] text-slate-400 font-medium">
                          {p.payment_date ? new Date(p.payment_date).toLocaleDateString("en-IN") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

// ─── PAGE: PROFILE ────────────────────────────────────────────────────────────
function ProfilePage({ student, setStudent }) {
  const [form, setForm]       = useState({ phone: student?.phone || "", address: student?.address || "" });
  const [editing, setEditing] = useState(false);
  const [status, setStatus]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const r = await apiFetch.put(`${API}/profile`, {
      enroll_id: student.enroll_id,
      phone: form.phone,
      address: form.address,
    });
    setLoading(false);
    if (r.error) {
      setStatus({ type: "error", msg: r.error });
    } else {
      const updated = { ...student, ...r.student };
      localStorage.setItem("student", JSON.stringify(updated));
      setStudent(updated);
      setEditing(false);
      setStatus({ type: "success", msg: "Profile updated successfully!" });
    }
  };

  const readOnly = [
    ["Enrollment ID", student.enroll_id],
    ["Name",          student.name],
    ["Email",         student.email],
    ["Gender",        genderLabel(student.gender)],
    ["Year",          student.year ? `Year ${student.year}` : "—"],
    ["Room",          student.room_id || "—"],
    ["Hostel",        student.hostel_id || "—"],
    ["Status",        null, <Badge key="st" status={student.status || "active"} />],
  ];

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="View and update your details"
        action={
          !editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all uppercase tracking-wider shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => { setEditing(false); setStatus(null); }}
                className="px-4 py-2 text-[11px] font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 text-[11px] font-bold text-white bg-[#111927] rounded-xl hover:bg-[#1a2638] disabled:opacity-50 transition-all uppercase tracking-wider"
              >
                {loading ? "Saving…" : "Save Changes"}
              </button>
            </div>
          )
        }
      />

      {status && (
        <div className={`max-w-2xl px-4 py-3 rounded-xl mb-5 text-sm font-medium border flex items-center gap-3
          ${status.type === "error"
            ? "bg-red-50 text-red-700 border-red-100"
            : "bg-emerald-50 text-emerald-700 border-emerald-100"}`}>
          <span>{status.type === "error" ? "⚠️" : "✅"}</span>
          {status.msg}
        </div>
      )}

      <Card className="max-w-2xl overflow-hidden">
        <div className="bg-[#111927] p-5 border-b border-[#1e2d3d] flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#4f73b3]/20 border border-[#4f73b3]/30 text-[#7fa8e0] flex items-center justify-center text-xl font-black shrink-0">
            {initials(student.name)}
          </div>
          <div>
            <div className="text-xl font-black text-white tracking-tight">{student.name}</div>
            <div className="h-0.5 w-6 bg-[#4f73b3] rounded-full mt-1.5 mb-1.5" />
            <div className="text-[11px] text-slate-500 font-medium">{student.email} · {student.enroll_id}</div>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-7">
          {readOnly.map(([label, value, node]) => (
            <div key={label} className="flex flex-col gap-1">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
              <div className="text-[13px] font-semibold text-slate-800">{node || value || "—"}</div>
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Phone</div>
            {editing ? (
              <input
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium bg-slate-50 focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white outline-none transition-all"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
              />
            ) : (
              <div className="text-[13px] font-semibold text-slate-800">
                {student.phone || <span className="text-slate-300">Not set</span>}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Address</div>
            {editing ? (
              <textarea
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium bg-slate-50 focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white outline-none transition-all min-h-[80px]"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Your home address"
              />
            ) : (
              <div className="text-[13px] font-semibold text-slate-800">
                {student.address || <span className="text-slate-300">Not set</span>}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard",   icon: "⊞",  label: "Dashboard",         section: "Main" },
  { id: "fee",         icon: "💳", label: "Fee Status",         section: "Main" },
  { id: "profile",     icon: "👤", label: "Profile",            section: "Main" },
  { id: "mess",        icon: "🍽️", label: "Mess Menu",          section: "Pages", path: "/mess-menu" },
  { id: "transport",   icon: "🚌", label: "Transport Schedule", section: "Pages", path: "/transport_schedule" },
  { id: "complaint",   icon: "📋", label: "Complaints",         section: "Pages", path: "/complain_page" },
  { id: "notices",     icon: "🔔", label: "Notices",            section: "Pages", path: "/notices" },
  { id: "mycomplains", icon: "🗂️", label: "My Complaints",      section: "Pages" },
  { id:"feepay",     icon:"💸", label:"Pay Fee",     section:"Pages", path:"/fee/pay"     },
{ id:"feehistory", icon:"💳", label:"Fee History",  section:"Pages", path:"/fee/history" },
];