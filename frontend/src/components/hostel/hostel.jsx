import React, { useEffect, useState, useRef } from "react";

const API_URL = "http://localhost:3000/api/hostel/dashboard";
const ADD_STUDENT_URL = "http://localhost:3000/api/hostel/addstudents";
const MARK_PAID_URL = "http://localhost:3000/api/hostel/fees/markpaid";
const ADD_ROOM_URL = "http://localhost:3000/api/hostel/addroom";

// ── COLOR CONFIGURATION ──────────────────────────────────────────────────────
const THEME = {
  bg: "#111927",             // Your exact dark blue
  cardBg: "#1c2536",         // Slightly lighter blue for cards
  cardBorder: "#2a374b",     // Subtle border for definition
  textMain: "#f1f5f9",       // Near white
  textMuted: "#94a3b8",      // Slate gray
  accentBlue: "#3b82f6",     // Branding blue
  accentGreen: "#22c55e",    // Success
  accentRed: "#ef4444",      // Danger
};

const fmt = (n) => (n !== null && n !== undefined ? n : "—");
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—");
const fmtCurrency = (n) => (n !== null && n !== undefined ? `₹${Number(n).toLocaleString("en-IN")}` : "—");

const STATUS_COLOR = {
  available: THEME.accentGreen, occupied: THEME.accentRed, maintenance: "#f59e0b",
  paid: THEME.accentGreen, unpaid: THEME.accentRed,
  pending: "#f59e0b", Pending: "#f59e0b",
  resolved: THEME.accentGreen, Resolved: THEME.accentGreen,
};

// ── REUSABLE COMPONENTS ──────────────────────────────────────────────────────
function Badge({ label }) {
  const color = STATUS_COLOR[label] ?? "#6b7280";
  return (
    <span style={{
      background: color + "15", color,
      border: `1px solid ${color}40`, borderRadius: 6,
      padding: "2px 10px", fontSize: 11, fontWeight: 700,
      letterSpacing: ".04em", textTransform: "capitalize", whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: THEME.cardBg,
      border: `1px solid ${THEME.cardBorder}`,
      borderRadius: 16, padding: "24px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)", ...style,
    }}>{children}</div>
  );
}

function SectionTitle({ icon, title, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
      <span style={{ fontSize: 24 }}>{icon}</span>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: THEME.textMain }}>{title}</h2>
      {count !== undefined && (
        <span style={{ marginLeft: "auto", background: THEME.accentBlue + "22", color: THEME.accentBlue, border: `1px solid ${THEME.accentBlue}33`, borderRadius: 999, padding: "2px 12px", fontSize: 12, fontWeight: 800 }}>
          {count}
        </span>
      )}
    </div>
  );
}

// ── SHARED STYLES ───────────────────────────────────────────────────────────
const tableStyle = { width: "100%", borderCollapse: "separate", borderSpacing: "0 8px", fontSize: 13 };
const thStyle = { textAlign: "left", padding: "12px", color: THEME.textMuted, fontWeight: 700, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase" };
const tdStyle = { padding: "14px 12px", color: THEME.textMuted, background: "#ffffff03", borderTop: `1px solid ${THEME.cardBorder}`, borderBottom: `1px solid ${THEME.cardBorder}` };
const inputStyle = { width: "100%", boxSizing: "border-box", background: THEME.bg, border: `1px solid ${THEME.cardBorder}`, borderRadius: 10, padding: "12px 16px", color: THEME.textMain, fontSize: 14, outline: "none", marginBottom: 20 };
const lbl = { fontSize: 11, color: THEME.textMuted, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8, display: "block" };

// ── ADD ROOM MODAL ────────────────────────────────────────────────────────────
function AddRoomModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ room_no: "", occupicity: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.room_no || !form.occupicity) { setError("Fill all fields"); return; }
    setLoading(true);
    try {
      const res = await fetch(ADD_ROOM_URL, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add room");
      onSuccess();
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", zIndex: 100 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 101, width: "min(400px, 90vw)", background: THEME.cardBg, border: `1px solid ${THEME.cardBorder}`, borderRadius: 20, padding: "32px" }}>
        <h2 style={{ color: THEME.textMain, marginTop: 0, fontSize: 22 }}>Add New Room</h2>
        <div style={{ marginTop: 20 }}>
          <label style={lbl}>Room Number</label>
          <input style={inputStyle} value={form.room_no} onChange={e => setForm({...form, room_no: e.target.value})} placeholder="e.g. 101" />
          <label style={lbl}>Capacity</label>
          <input style={inputStyle} type="number" value={form.occupicity} onChange={e => setForm({...form, occupicity: e.target.value})} placeholder="e.g. 2" />
        </div>
        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "14px", borderRadius: 10, background: THEME.accentGreen, color: "#fff", border: "none", fontWeight: 800, cursor: "pointer" }}>
          {loading ? "Processing..." : "Create Room"}
        </button>
      </div>
    </>
  );
}

// ── MAIN DASHBOARD COMPONENT ──────────────────────────────────────────────────
export default function HostelDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Rooms");

  const fetchData = async () => {
    try {
      const res = await fetch(API_URL, { credentials: "include" });
      const json = await res.json();
      setData(json);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div style={{ height: "100vh", background: THEME.bg, display: "flex", alignItems: "center", justifyContent: "center", color: THEME.textMain }}>
      <div className="loader">Loading Hive...</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: THEME.bg, color: THEME.textMain, padding: "40px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: "-1px" }}>HIVE <span style={{ color: THEME.accentBlue }}>DASHBOARD</span></h1>
            <p style={{ color: THEME.textMuted, margin: "4px 0 0", fontSize: 14 }}>Welcome back, Admin</p>
          </div>
          <div style={{ display: "flex", gap: 10, background: THEME.cardBg, padding: "6px", borderRadius: 12, border: `1px solid ${THEME.cardBorder}` }}>
            {["Rooms", "Students", "Complaints", "Fees"].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13,
                  background: activeTab === tab ? THEME.accentBlue : "transparent",
                  color: activeTab === tab ? "#fff" : THEME.textMuted,
                  transition: "0.2s"
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 30 }}>
            <Card style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 24, background: THEME.accentBlue + "20", padding: 12, borderRadius: 12 }}>🏢</div>
                <div>
                    <div style={{ fontSize: 24, fontWeight: 900 }}>{data?.rooms?.length || 0}</div>
                    <div style={{ fontSize: 12, color: THEME.textMuted, textTransform: "uppercase", fontWeight: 700 }}>Total Rooms</div>
                </div>
            </Card>
            <Card style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 24, background: THEME.accentGreen + "20", padding: 12, borderRadius: 12 }}>🎓</div>
                <div>
                    <div style={{ fontSize: 24, fontWeight: 900 }}>{data?.students?.length || 0}</div>
                    <div style={{ fontSize: 12, color: THEME.textMuted, textTransform: "uppercase", fontWeight: 700 }}>Total Students</div>
                </div>
            </Card>
            <Card style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontSize: 24, background: THEME.accentRed + "20", padding: 12, borderRadius: 12 }}>⚠️</div>
                <div>
                    <div style={{ fontSize: 24, fontWeight: 900 }}>{data?.complaints?.filter(c => c.status !== "Resolved").length || 0}</div>
                    <div style={{ fontSize: 12, color: THEME.textMuted, textTransform: "uppercase", fontWeight: 700 }}>Active Issues</div>
                </div>
            </Card>
        </div>

        {/* Main Content Area */}
        <div style={{ animation: "fadeIn 0.4s ease" }}>
            {activeTab === "Rooms" && (
                <RoomsSection rooms={data?.rooms} onRefresh={fetchData} />
            )}
            {activeTab === "Students" && (
                <StudentsSection 
                    students={data?.students} 
                    room={data?.rooms} 
                    availableRooms={data?.rooms?.filter(r => r.occupied < r.capacity)} 
                    onRefresh={fetchData} 
                />
            )}
            {activeTab === "Complaints" && (
                <ComplaintsSection complaints={data?.complaints} />
            )}
            {activeTab === "Fees" && (
                <FeesSection fees={data?.fees} hostelName="Hive Residency" onRefresh={fetchData} />
            )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        body { margin: 0; font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${THEME.bg}; }
        ::-webkit-scrollbar-thumb { background: ${THEME.cardBorder}; border-radius: 10px; }
      `}</style>
    </div>
  );
}


function RoomsSection({ rooms, onRefresh }) {
    const [showAdd, setShowAdd] = useState(false);
    return (
        <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <SectionTitle icon="🛏️" title="Room Inventory" count={rooms?.length} />
                <button onClick={() => setShowAdd(true)} style={{ background: THEME.accentBlue, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>+ Add Room</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                {rooms?.map(r => (
                    <div key={r.room_id} style={{ background: THEME.bg, border: `1px solid ${THEME.cardBorder}`, padding: 20, borderRadius: 12 }}>
                        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Room {r.room_no}</div>
                        <div style={{ color: THEME.textMuted, fontSize: 12, marginBottom: 12 }}>{r.occupied}/{r.capacity} Occupied</div>
                        <Badge label={r.status} />
                    </div>
                ))}
            </div>
            {showAdd && <AddRoomModal onClose={() => setShowAdd(false)} onSuccess={() => { setShowAdd(false); onRefresh(); }} />}
        </Card>
    );
}

