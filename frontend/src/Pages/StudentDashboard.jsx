import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import MyComplaints from "../Pages/MyComplaints";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const enrollID = localStorage.getItem("enroll_id");
  const [student, setStudent] = useState(null);
  const [page, setPage] = useState("dashboard");

  //fetch student data
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
    if (!enrollID) {
      navigate("/");
      return;
    }
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
    }
  };

  const renderPage = () => {
    if (!student) return <Loader />;
    switch (page) {
      case "dashboard":
        return <DashboardPage student={student} onNavigate={handleNavigate} />;
      case "fee":
        return <FeePage student={student} />;
      case "profile":
        return <ProfilePage student={student} setStudent={setStudent} />;
      case "mycomplains":
        return <MyComplaints student={student} />;
      default:
        return <DashboardPage student={student} onNavigate={handleNavigate} />;
    }
  };

  const sections = [...new Set(NAV.map((n) => n.section))];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans w-full">
      <nav className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold leading-tight text-gray-900">
            Hostel<br />Portal
          </h1>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1 block">
            Student · HIVE
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {sections.map((section) => (
            <div key={section}>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
                {section}
              </div>
              {NAV.filter((n) => n.section === section).map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-colors mb-1 ${
                    !item.path && page === item.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => handleNavigate(item.id)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.path && <span className="ml-auto text-xs opacity-50">↗</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
              {initials(student?.name)}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {student?.name?.split(" ")[0] || "Student"}
              </div>
              <div className="text-xs text-gray-500">
                {student?.enroll_id || "—"}
              </div>
            </div>
          </div>
          <button
            className="w-full flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            onClick={handleLogout}
          >
            ⎋ Logout
          </button>
        </div>
      </nav>
      <main className="flex-1 overflow-y-auto p-6 md:p-8">{renderPage()}</main>
    </div>
  );
}

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
    <div className="flex items-center justify-center h-full text-gray-500 gap-3">
      <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600" />
      Loading…
    </div>
  );
}

function Badge({ status }) {
  const map = {
    Paid: "bg-green-100 text-green-800", paid: "bg-green-100 text-green-800",
    Pending: "bg-amber-100 text-amber-800", pending: "bg-amber-100 text-amber-800",
    Overdue: "bg-red-100 text-red-800", overdue: "bg-red-100 text-red-800",
    Resolved: "bg-green-100 text-green-800", "In Progress": "bg-blue-100 text-blue-800",
    Open: "bg-amber-100 text-amber-800", Active: "bg-green-100 text-green-800",
    active: "bg-green-100 text-green-800", Inactive: "bg-red-100 text-red-800",
    inactive: "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || "bg-gray-100 text-gray-800"}`}>
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

// ─── PAGE: DASHBOARD ─────────────────────────────────────────────────────────
function DashboardPage({ student, onNavigate }) {
  if (!student) return <Loader />;

  const quickActions = [
    { icon: "🍽️", label: "Today's mess menu", id: "mess", bg: "bg-emerald-50", iconBg: "bg-emerald-100 text-emerald-600" },
    { icon: "🚌", label: "Transport schedule", id: "transport", bg: "bg-blue-50", iconBg: "bg-blue-100 text-blue-600" },
    { icon: "📋", label: "Submit a complaint", id: "complaint", bg: "bg-red-50", iconBg: "bg-red-100 text-red-600" },
    { icon: "🔔", label: "View notices", id: "notices", bg: "bg-amber-50", iconBg: "bg-amber-100 text-amber-600" },
    { icon: "💳", label: "Check fee status", id: "fee", bg: "bg-purple-50", iconBg: "bg-purple-100 text-purple-600" },
    { icon: "👤", label: "Edit my profile", id: "profile", bg: "bg-green-50", iconBg: "bg-green-100 text-green-600" },
    { icon: "🗂️", label: "My complains", id: "mycomplains", bg: "bg-green-50", iconBg: "bg-green-100 text-green-600" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900">
            Good morning, {student.name?.split(" ")[0]} 👋
          </div>
          <div className="text-sm text-gray-500 mt-1">Welcome to your hostel portal</div>
        </div>
        <Badge status={student.status || "active"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Enrollment ID", value: student.enroll_id, sub: "Your student ID" },
          { label: "Room", value: `#${student.room_id || "—"}`, sub: `Hostel ${student.hostel_id || "—"}` },
          { label: "Year", value: student.year ? `Year ${student.year}` : "—", sub: genderLabel(student.gender) },
          { label: "Fee ID", value: student.fee_id || "—", sub: "Payment account" },
        ].map((s) => (
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100" key={s.label}>
            <div className="text-sm font-medium text-gray-500 mb-1">{s.label}</div>
            <div className="text-xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="font-semibold text-sm mb-4 text-gray-900">Quick Actions</div>
          {quickActions.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer hover:opacity-80 transition-opacity mb-3 last:mb-0 ${item.bg}`}
              onClick={() => onNavigate(item.id)}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${item.iconBg}`}>
                {item.icon}
              </div>
              <span className="font-medium text-sm text-gray-800 flex-1">{item.label}</span>
              <span className="text-gray-400">›</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-fit">
          <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold shrink-0">
              {initials(student.name)}
            </div>
            <div>
              <div className="font-semibold text-base text-gray-900">{student.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{student.email}</div>
            </div>
          </div>
          {[
            ["Phone", student.phone || "Not set"],
            ["Gender", genderLabel(student.gender)],
            ["Address", student.address || "Not set"],
            ["Status", null, <Badge key="s" status={student.status || "active"} />],
          ].map(([label, value, node]) => (
            <div
              key={label}
              className="px-6 py-3.5 border-b border-gray-50 flex justify-between items-center last:border-0"
            >
              <span className="text-[13px] text-gray-500">{label}</span>
              <span className="text-[13px] font-medium text-right text-gray-900">{node || value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: FEE STATUS ─────────────────────────────────────────────────────────
function FeePage({ student }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!student?.enroll_id) {
      setLoading(false);
      return;
    }
    apiFetch.get(`${API}/fee/status?enroll_id=${student.enroll_id}`)
      .then((r) => {
        if (r.error) {
          setError(r.error);
          return;
        }
        setPayments(r.payments || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [student]);

  const totalPaid = payments.filter((p) => p.status === "Paid").reduce((s, p) => s + Number(p.amount), 0);
  const totalDue = payments.filter((p) => p.status !== "Paid").reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900">Fee Status</div>
          <div className="text-sm text-gray-500 mt-1">Payment history</div>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-gray-100">
              {[
                { label: "Total Paid", value: `₹${totalPaid.toLocaleString("en-IN")}`, color: "text-green-600" },
                { label: "Outstanding", value: `₹${totalDue.toLocaleString("en-IN")}`, color: totalDue > 0 ? "text-red-600" : "text-gray-500" },
                { label: "Transactions", value: payments.length, color: "text-gray-900" },
              ].map((s) => (
                <div className="p-6 text-center" key={s.label}>
                  <div className={`text-2xl font-bold mb-1 ${s.color}`}>{s.value}</div>
                  <div className="text-sm text-gray-500 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 font-semibold text-gray-900 bg-gray-50/50">
              Payment History
            </div>
            {payments.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-3">💳</div>
                <div className="text-gray-500 font-medium">No payment records yet</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-3 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">Month</th>
                      <th className="px-6 py-3 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id}>
                        <td className="px-6 py-4 border-b border-gray-50 text-sm font-medium text-gray-900">{p.month}</td>
                        <td className="px-6 py-4 border-b border-gray-50 text-sm text-gray-700">₹{Number(p.amount).toLocaleString("en-IN")}</td>
                        <td className="px-6 py-4 border-b border-gray-50"><Badge status={p.status} /></td>
                        <td className="px-6 py-4 border-b border-gray-50 text-sm text-gray-500">
                          {p.payment_date ? new Date(p.payment_date).toLocaleDateString("en-IN") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── PAGE: PROFILE ────────────────────────────────────────────────────────────
function ProfilePage({ student, setStudent }) {
  const [form, setForm] = useState({ phone: student?.phone || "", address: student?.address || "" });
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(null);
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
    ["Name", student.name],
    ["Email", student.email],
    ["Gender", genderLabel(student.gender)],
    ["Year", student.year ? `Year ${student.year}` : "—"],
    ["Room", student.room_id || "—"],
    ["Hostel", student.hostel_id || "—"],
    ["Status", null, <Badge key="st" status={student.status || "active"} />],
  ];

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900">My Profile</div>
          <div className="text-sm text-gray-500 mt-1">View and update your details</div>
        </div>
        {!editing ? (
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setEditing(true)}
          >
            ✏️ Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => { setEditing(false); setStatus(null); }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {status && (
        <div className={`max-w-2xl px-4 py-3 rounded-lg mb-6 text-sm border ${status.type === "error" ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}>
          {status.msg}
        </div>
      )}

      <div className="max-w-2xl bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-5 bg-gray-50/50">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold shrink-0">
            {initials(student.name)}
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-gray-900">{student.name}</div>
            <div className="text-sm text-gray-500 mt-1">
              {student.email} · {student.enroll_id}
            </div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          {readOnly.map(([label, value, node]) => (
            <div className="flex flex-col gap-1.5" key={label}>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</div>
              <div className="text-sm font-medium text-gray-900">{node || value || "—"}</div>
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</div>
            {editing ? (
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
              />
            ) : (
              <div className="text-sm font-medium text-gray-900">
                {student.phone || <span className="text-gray-400">Not set</span>}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</div>
            {editing ? (
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow min-h-[80px]"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Your home address"
              />
            ) : (
              <div className="text-sm font-medium text-gray-900">
                {student.address || <span className="text-gray-400">Not set</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", icon: "⊞", label: "Dashboard", section: "Main" },
  { id: "fee", icon: "💳", label: "Fee Status", section: "Main" },
  { id: "profile", icon: "👤", label: "Profile", section: "Main" },
  { id: "mess", icon: "🍽️", label: "Mess Menu", section: "Pages", path: "/mess-menu" },
  { id: "transport", icon: "🚌", label: "Transport Schedule", section: "Pages", path: "/transport_schedule" },
  { id: "complaint", icon: "📋", label: "Complaints", section: "Pages", path: "/complain_page" },
  { id: "notices", icon: "🔔", label: "Notices", section: "Pages", path: "/notices" },

{ id: "mycomplains", icon: "🗂️", label: "My Complaints", section: "Pages" }
];