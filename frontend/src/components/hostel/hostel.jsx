import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api/hostel/dashboard";

// ── tiny helpers ──────────────────────────────────────────────────────────────
const fmt = (n) => (n !== null && n !== undefined ? n : "—");
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—");
const fmtCurrency = (n) => (n !== null && n !== undefined ? `₹${Number(n).toLocaleString("en-IN")}` : "—");

const STATUS_COLOR = {
  available: "#22c55e",
  occupied: "#ef4444",
  maintenance: "#f59e0b",
  paid: "#22c55e",
  unpaid: "#ef4444",
  pending: "#f59e0b",
  Pending: "#f59e0b",
  resolved: "#22c55e",
  Resolved: "#22c55e",
};

function Badge({ label }) {
  const color = STATUS_COLOR[label] ?? "#6b7280";
  return (
    <span style={{
      background: color + "22",
      color,
      border: `1px solid ${color}55`,
      borderRadius: 6,
      padding: "2px 10px",
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: ".04em",
      textTransform: "capitalize",
      whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.035)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: "20px 24px",
      backdropFilter: "blur(4px)",
      ...style,
    }}>{children}</div>
  );
}

function SectionTitle({ icon, title, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#e2e8f0", letterSpacing: ".02em" }}>{title}</h2>
      {count !== undefined && (
        <span style={{ marginLeft: "auto", background: "#1e40af33", color: "#93c5fd", border: "1px solid #3b82f633", borderRadius: 999, padding: "1px 12px", fontSize: 12, fontWeight: 700 }}>
          {count}
        </span>
      )}
    </div>
  );
}

// ── stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, accent = "#3b82f6" }) {
  return (
    <Card style={{ display: "flex", gap: 14, alignItems: "center" }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
        background: accent + "22", fontSize: 22, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: accent, marginTop: 2 }}>{sub}</div>}
      </div>
    </Card>
  );
}

// ── ROOMS ─────────────────────────────────────────────────────────────────────
function RoomsSection({ rooms }) {
  if (!rooms?.length) return (
    <Card><SectionTitle icon="🛏️" title="Rooms" count={0} /><EmptyState msg="No rooms found" /></Card>
  );
  return (
    <Card>
      <SectionTitle icon="🛏️" title="Rooms" count={rooms.length} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
        {rooms.map((r) => {
          const pct = r.capacity ? Math.round((r.occupied / r.capacity) * 100) : 0;
          const accent = r.status === "available" ? "#22c55e" : r.status === "maintenance" ? "#f59e0b" : "#ef4444";
          return (
            <div key={r.room_id} style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${accent}44`,
              borderRadius: 12,
              padding: "14px 16px",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: `${pct}%`, height: 3, background: accent, borderRadius: 2 }} />
              <div style={{ fontWeight: 800, fontSize: 16, color: "#f1f5f9" }}>Room {r.room_no}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", margin: "6px 0 8px" }}>
                {r.occupied ?? 0}/{r.capacity ?? 0} occupied
              </div>
              <Badge label={r.status ?? "unknown"} />
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── STUDENTS ──────────────────────────────────────────────────────────────────
function StudentsSection({ students }) {
  const [search, setSearch] = useState("");
  const filtered = (students ?? []).filter(s =>
    [s.name, s.enroll_id, s.email, s.phone].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <Card>
      <SectionTitle icon="🎓" title="Students" count={students?.length ?? 0} />
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search students…"
        style={inputStyle}
      />
      {!filtered.length ? <EmptyState msg="No students found" /> : (
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>{["Name", "Enroll ID", "Email", "Phone", "Gender", "Year", "Room"].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.enroll_id} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                  <td style={tdStyle}><span style={{ fontWeight: 600, color: "#e2e8f0" }}>{fmt(s.name)}</span></td>
                  <td style={tdStyle}><span style={{ color: "#93c5fd", fontFamily: "monospace", fontSize: 13 }}>{fmt(s.enroll_id)}</span></td>
                  <td style={tdStyle}>{fmt(s.email)}</td>
                  <td style={tdStyle}>{fmt(s.phone)}</td>
                  <td style={tdStyle}>{fmt(s.gender)}</td>
                  <td style={tdStyle}>{fmt(s.year)}</td>
                  <td style={tdStyle}>{fmt(s.room_id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

// ── COMPLAINTS ────────────────────────────────────────────────────────────────
function ComplaintsSection({ complaints }) {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Pending", "Resolved"];
  const filtered = filter === "All" ? (complaints ?? []) : (complaints ?? []).filter(c => c.status === filter);
  return (
    <Card>
      <SectionTitle icon="📢" title="Complaints" count={complaints?.length ?? 0} />
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "4px 14px", borderRadius: 999, border: "1px solid",
            borderColor: filter === s ? "#3b82f6" : "rgba(255,255,255,0.1)",
            background: filter === s ? "#1d4ed855" : "transparent",
            color: filter === s ? "#93c5fd" : "#94a3b8",
            cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}>{s}</button>
        ))}
      </div>
      {!filtered.length ? <EmptyState msg="No complaints" /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(c => (
            <div key={c.complaint_id} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 10,
              padding: "14px 16px",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 8,
            }}>
              <div>
                <div style={{ fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>
                  {fmt(c.complain_type)} — Room {fmt(c.room_no)}
                </div>
                <div style={{ color: "#94a3b8", fontSize: 13 }}>{fmt(c.description)}</div>
                <div style={{ color: "#64748b", fontSize: 12, marginTop: 6 }}>📅 {fmtDate(c.date)}</div>
              </div>
              <Badge label={c.status ?? "unknown"} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ── FEES ──────────────────────────────────────────────────────────────────────
function FeesSection({ fees }) {
  const total = (fees ?? []).reduce((a, f) => a + (Number(f.amount) || 0), 0);
  const paid = (fees ?? []).filter(f => f.status === "paid").reduce((a, f) => a + (Number(f.amount) || 0), 0);
  return (
    <Card>
      <SectionTitle icon="💰" title="Fees" count={fees?.length ?? 0} />
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ background: "#22c55e22", border: "1px solid #22c55e33", borderRadius: 10, padding: "10px 18px" }}>
          <div style={{ fontSize: 12, color: "#86efac" }}>Collected</div>
          <div style={{ fontWeight: 800, color: "#22c55e", fontSize: 18 }}>{fmtCurrency(paid)}</div>
        </div>
        <div style={{ background: "#ef444422", border: "1px solid #ef444433", borderRadius: 10, padding: "10px 18px" }}>
          <div style={{ fontSize: 12, color: "#fca5a5" }}>Pending</div>
          <div style={{ fontWeight: 800, color: "#ef4444", fontSize: 18 }}>{fmtCurrency(total - paid)}</div>
        </div>
      </div>
      {!fees?.length ? <EmptyState msg="No fee records" /> : (
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>{["Enroll ID", "Amount", "Status", "Due Date", "Paid Date"].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {fees.map((f, i) => (
                <tr key={f.fee_id} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                  <td style={tdStyle}><span style={{ color: "#93c5fd", fontFamily: "monospace", fontSize: 13 }}>{fmt(f.enroll_id)}</span></td>
                  <td style={tdStyle}><span style={{ fontWeight: 700 }}>{fmtCurrency(f.amount)}</span></td>
                  <td style={tdStyle}><Badge label={f.status ?? "unknown"} /></td>
                  <td style={tdStyle}>{fmtDate(f.due_date)}</td>
                  <td style={tdStyle}>{fmtDate(f.paid_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

// ── ADMINS ────────────────────────────────────────────────────────────────────
function AdminsSection({ admins }) {
  return (
    <Card>
      <SectionTitle icon="👤" title="Admins" count={admins?.length ?? 0} />
      {!admins?.length ? <EmptyState msg="No admin records" /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          {admins.map(a => (
            <div key={a.admin_id} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: "14px 16px",
            }}>
              <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 15 }}>{fmt(a.name)}</div>
              <div style={{ color: "#93c5fd", fontSize: 12, marginTop: 4 }}>{fmt(a.email)}</div>
              <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>🏢 {fmt(a.department)}</div>
              <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>📞 {fmt(a.phone)}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function EmptyState({ msg }) {
  return (
    <div style={{ textAlign: "center", color: "#475569", padding: "32px 0", fontSize: 14 }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>{msg}
    </div>
  );
}

// ── STYLES ───────────────────────────────────────────────────────────────────
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: 13 };
const thStyle = {
  textAlign: "left", padding: "8px 12px", color: "#64748b",
  fontWeight: 700, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};
const tdStyle = { padding: "10px 12px", color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.04)" };
const inputStyle = {
  width: "100%", boxSizing: "border-box",
  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8, padding: "8px 14px", color: "#e2e8f0", fontSize: 13,
  outline: "none", marginBottom: 14,
};

// ── NAV TABS ─────────────────────────────────────────────────────────────────
const TABS = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "rooms", label: "Rooms", icon: "🛏️" },
  { key: "students", label: "Students", icon: "🎓" },
  { key: "complaints", label: "Complaints", icon: "📢" },
  { key: "fees", label: "Fees", icon: "💰" },
  { key: "admins", label: "Admins", icon: "👤" },
];

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    fetch(API_URL, { credentials: "include" })
      .then(r => r.json())
      .then(res => setData(res.data?.[0] ?? res.data ?? res))
      .catch(() => setError("Failed to load dashboard data. Make sure the API is running."));
  }, []);

  if (error) return (
    <div style={{ ...shell, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "#ef4444" }}>
        <div style={{ fontSize: 48 }}>⚠️</div>
        <div style={{ marginTop: 12, fontSize: 16 }}>{error}</div>
      </div>
    </div>
  );

  if (!data) return (
    <div style={{ ...shell, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "#64748b" }}>
        <div style={{ fontSize: 40, animation: "spin 1s linear infinite" }}>⏳</div>
        <div style={{ marginTop: 12 }}>Loading dashboard…</div>
      </div>
    </div>
  );

  const { hostel_name, room = [], student = [], complaints = [], fee = [], admin = [] } = data;
  const availRooms = room.filter(r => r.status === "available").length;
  const pendingComplaints = complaints.filter(c => c.status === "Pending" || c.status === "pending").length;
  const unpaidFees = fee.filter(f => f.status === "unpaid").length;

  return (
    <div style={shell}>
      {/* gradient blobs for depth */}
      <div style={{ position: "fixed", top: -200, left: -200, width: 600, height: 600, background: "radial-gradient(circle, #1d4ed822 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -200, right: -100, width: 500, height: 500, background: "radial-gradient(circle, #7c3aed15 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 20px 40px" }}>
        {/* HEADER */}
        <div style={{ padding: "28px 0 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 24, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 4 }}>Hostel Management</div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-.02em" }}>{hostel_name ?? "Dashboard"}</h1>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>ID: {data.hostel_id}</div>
          </div>
          <div style={{ fontSize: 12, color: "#475569" }}>Last updated: {new Date().toLocaleTimeString("en-IN")}</div>
        </div>

        {/* NAV */}
        <div style={{ display: "flex", gap: 4, marginBottom: 28, overflowX: "auto", paddingBottom: 4 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "7px 16px", borderRadius: 10, border: "1px solid",
              borderColor: tab === t.key ? "#3b82f6" : "rgba(255,255,255,0.07)",
              background: tab === t.key ? "#1d4ed833" : "rgba(255,255,255,0.03)",
              color: tab === t.key ? "#93c5fd" : "#64748b",
              cursor: "pointer", fontSize: 13, fontWeight: 600,
              whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6,
              transition: "all .15s",
            }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
              <StatCard icon="🛏️" label="Total Rooms" value={room.length} sub={`${availRooms} available`} accent="#3b82f6" />
              <StatCard icon="🎓" label="Students" value={student.length} accent="#8b5cf6" />
              <StatCard icon="📢" label="Complaints" value={complaints.length} sub={`${pendingComplaints} pending`} accent="#f59e0b" />
              <StatCard icon="💰" label="Fee Records" value={fee.length} sub={`${unpaidFees} unpaid`} accent="#22c55e" />
              <StatCard icon="👤" label="Admins" value={admin.length} accent="#ec4899" />
            </div>
            <RoomsSection rooms={room} />
            <StudentsSection students={student} />
            <ComplaintsSection complaints={complaints} />
            <FeesSection fees={fee} />
            <AdminsSection admins={admin} />
          </div>
        )}
        {tab === "rooms" && <RoomsSection rooms={room} />}
        {tab === "students" && <StudentsSection students={student} />}
        {tab === "complaints" && <ComplaintsSection complaints={complaints} />}
        {tab === "fees" && <FeesSection fees={fee} />}
        {tab === "admins" && <AdminsSection admins={admin} />}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>
    </div>
  );
}

const shell = {
  minHeight: "100vh",
  background: "#080c14",
  color: "#94a3b8",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  position: "relative",
  overflow: "hidden",
};