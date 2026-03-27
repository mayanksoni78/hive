import React, { useEffect, useState, useRef } from "react";

const API_URL = "http://localhost:3000/api/hostel/dashboard";
const ADD_STUDENT_URL = "http://localhost:3000/api/hostel/addstudents";
const MARK_PAID_URL = "http://localhost:3000/api/hostel/fees/markpaid";
const ADD_ROOM_URL = "http://localhost:3000/api/hostel/addroom";

// ── tiny helpers ──────────────────────────────────────────────────────────────
const fmt = (n) => (n !== null && n !== undefined ? n : "—");
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—");
const fmtCurrency = (n) => (n !== null && n !== undefined ? `₹${Number(n).toLocaleString("en-IN")}` : "—");

const STATUS_COLOR = {
  available: "#22c55e", occupied: "#ef4444", maintenance: "#f59e0b",
  paid: "#22c55e", unpaid: "#ef4444",
  pending: "#f59e0b", Pending: "#f59e0b",
  resolved: "#22c55e", Resolved: "#22c55e",
};

function Badge({ label }) {
  const color = STATUS_COLOR[label] ?? "#6b7280";
  return (
    <span style={{
      background: color + "22", color,
      border: `1px solid ${color}55`, borderRadius: 6,
      padding: "2px 10px", fontSize: 12, fontWeight: 700,
      letterSpacing: ".04em", textTransform: "capitalize", whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.035)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16, padding: "20px 24px",
      backdropFilter: "blur(4px)", ...style,
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

function StatCard({ icon, label, value, sub, accent = "#3b82f6" }) {
  return (
    <Card style={{ display: "flex", gap: 14, alignItems: "center" }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: accent + "22", fontSize: 22, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: accent, marginTop: 2 }}>{sub}</div>}
      </div>
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
const thStyle = { textAlign: "left", padding: "8px 12px", color: "#64748b", fontWeight: 700, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.06)" };
const tdStyle = { padding: "10px 12px", color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.04)" };
const inputStyle = { width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 14px", color: "#e2e8f0", fontSize: 13, outline: "none", marginBottom: 14 };
const mInput = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "9px 12px", color: "#e2e8f0", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" };
const mSelect = { background: "#131c2e", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "9px 12px", color: "#e2e8f0", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box", cursor: "pointer" };
const lbl = { fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 5, display: "block" };

// ── ADD ROOM MODAL ────────────────────────────────────────────────────────────
const EMPTY_ROOM = { room_no: "", occupicity: "" };

function AddRoomModal({ onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_ROOM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.room_no.trim()) { setError("Please enter a room number."); return; }
    if (!form.occupicity.trim()) { setError("Please enter the occupicity (capacity)."); return; }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(ADD_ROOM_URL, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_no: form.room_no.trim(),
          occupicity: form.occupicity.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Failed to add room");
      onSuccess();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)", zIndex: 100 }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        zIndex: 101, width: "min(420px, 95vw)",
        background: "#0f1623",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20, padding: "28px 28px 24px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.75)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>New Room</div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#f1f5f9" }}>Add Room</h2>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#94a3b8", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {/* Icon accent */}
        <div style={{ width: 52, height: 52, borderRadius: 14, background: "#22c55e18", border: "1px solid #22c55e33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 20 }}>🛏️</div>

        {/* Form fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={lbl}>Room Number</label>
            <input
              style={mInput}
              value={form.room_no}
              onChange={e => set("room_no", e.target.value)}
              placeholder="e.g. 101, A-202"
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div>
            <label style={lbl}>Occupicity (Capacity)</label>
            <input
              style={mInput}
              value={form.occupicity}
              onChange={e => set("occupicity", e.target.value)}
              placeholder="e.g. 2, 4"
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
            <div style={{ fontSize: 11, color: "#475569", marginTop: 5 }}>Maximum number of students that can occupy this room</div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginTop: 14, background: "#ef444422", border: "1px solid #ef444444", borderRadius: 8, padding: "8px 14px", color: "#fca5a5", fontSize: 13 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#64748b", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "9px 26px", borderRadius: 10, border: "none",
              background: loading ? "#166534" : "linear-gradient(135deg,#22c55e,#16a34a)",
              color: loading ? "#475569" : "#fff",
              cursor: loading ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 700,
              boxShadow: loading ? "none" : "0 4px 20px #22c55e44",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Adding…" : "＋ Add Room"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── ADD STUDENT MODAL ─────────────────────────────────────────────────────────
const EMPTY = { name: "", roll: "", email: "", phone: "", gender: "", year: "", room: "" };

function AddStudentModal({ availableRooms, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    const required = ["name", "roll", "email", "phone", "gender", "year", "room"];
    const missing = required.filter(k => !form[k]);
    if (missing.length) { setError(`Please fill in: ${missing.join(", ")}`); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(ADD_STUDENT_URL, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          enroll_id: form.roll,
          email: form.email,
          phone: form.phone,
          gender: form.gender,
          year: form.year,
          room_id: form.room,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Failed to add student");
      onSuccess();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)", zIndex: 100 }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        zIndex: 101, width: "min(540px, 95vw)",
        background: "#0f1623",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20, padding: "28px 28px 24px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.75)",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>New Admission</div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#f1f5f9" }}>Add Student</h2>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#94a3b8", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
          <div><label style={lbl}>Full Name</label><input style={mInput} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Rahul Sharma" /></div>
          <div><label style={lbl}>Roll / Enroll ID</label><input style={mInput} value={form.roll} onChange={e => set("roll", e.target.value)} placeholder="e.g. 22CS101" /></div>
          <div><label style={lbl}>Email</label><input style={mInput} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="student@college.edu" /></div>
          <div><label style={lbl}>Phone</label><input style={mInput} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="10-digit number" /></div>
          <div>
            <label style={lbl}>Gender</label>
            <select style={mSelect} value={form.gender} onChange={e => set("gender", e.target.value)}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label style={lbl}>Year</label>
            <select style={mSelect} value={form.year} onChange={e => set("year", e.target.value)}>
              <option value="">Select year</option>
              {["1st Year", "2nd Year", "3rd Year", "4th Year"].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ ...lbl, display: "flex", alignItems: "center", gap: 8 }}>
              Room Assignment
              <span style={{ background: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e33", borderRadius: 999, padding: "1px 8px", fontSize: 10, fontWeight: 700, textTransform: "none" }}>
                ✓ Available only
              </span>
            </label>
            <select style={mSelect} value={form.room} onChange={e => set("room", e.target.value)}>
              <option value="">— Select a room —</option>
              {availableRooms.map(r => (
                <option key={r.room_id} value={r.room_id}>
                  Room {r.room_no}  •  {r.occupied ?? 0}/{r.capacity ?? 0} occupied
                </option>
              ))}
            </select>
            {availableRooms.length === 0 && (
              <div style={{ fontSize: 12, color: "#f59e0b", marginTop: 6 }}>⚠️ No available rooms at the moment</div>
            )}
          </div>
        </div>
        {error && (
          <div style={{ marginTop: 14, background: "#ef444422", border: "1px solid #ef444444", borderRadius: 8, padding: "8px 14px", color: "#fca5a5", fontSize: 13 }}>
            ⚠️ {error}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#64748b", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} style={{
            padding: "9px 26px", borderRadius: 10, border: "none",
            background: loading ? "#1d4ed844" : "linear-gradient(135deg,#3b82f6,#6366f1)",
            color: loading ? "#475569" : "#fff",
            cursor: loading ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 700,
            boxShadow: loading ? "none" : "0 4px 20px #3b82f644",
          }}>
            {loading ? "Adding…" : "✓ Add Student"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── ROOMS ─────────────────────────────────────────────────────────────────────
function RoomsSection({ rooms, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleRoomAdded = () => {
    setShowModal(false);
    showToast("Room added successfully ✓");
    if (onRefresh) onRefresh();
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 200,
          background: toast.type === "error" ? "#ef444422" : "#22c55e22",
          border: `1px solid ${toast.type === "error" ? "#ef444466" : "#22c55e66"}`,
          borderRadius: 12, padding: "12px 20px",
          color: toast.type === "error" ? "#fca5a5" : "#86efac",
          fontSize: 14, fontWeight: 700,
          backdropFilter: "blur(8px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "slideUp .25s ease",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          {toast.type === "error" ? "⚠️" : "✓"} {toast.msg}
        </div>
      )}

      {showModal && (
        <AddRoomModal
          onClose={() => setShowModal(false)}
          onSuccess={handleRoomAdded}
        />
      )}

      <Card>
        {/* Header row with Add Room button */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 18, gap: 10 }}>
          <span style={{ fontSize: 20 }}>🛏️</span>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>Rooms</h2>
          <span style={{ background: "#1e40af33", color: "#93c5fd", border: "1px solid #3b82f633", borderRadius: 999, padding: "1px 12px", fontSize: 12, fontWeight: 700 }}>
            {rooms?.length ?? 0}
          </span>
          <button
            onClick={() => setShowModal(true)}
            style={{
              marginLeft: "auto",
              padding: "8px 18px", borderRadius: 10, border: "none",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 4px 16px #22c55e33",
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>＋</span> Add Room
          </button>
        </div>

        {!rooms?.length ? <EmptyState msg="No rooms found" /> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {rooms.map(r => {
              const pct = r.capacity ? Math.round((r.occupied / r.capacity) * 100) : 0;
              const accent = r.status === "available" ? "#22c55e" : r.status === "maintenance" ? "#f59e0b" : "#ef4444";
              return (
                <div key={r.room_id} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${accent}44`, borderRadius: 12, padding: "14px 16px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: `${pct}%`, height: 3, background: accent }} />
                  <div style={{ fontWeight: 800, fontSize: 16, color: "#f1f5f9" }}>Room {r.room_no}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", margin: "6px 0 8px" }}>{r.occupied ?? 0}/{r.capacity ?? 0} occupied</div>
                  <Badge label={r.status ?? "unknown"} />
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </>
  );
}

// ── STUDENTS ──────────────────────────────────────────────────────────────────
function StudentsSection({ students, availableRooms, onRefresh, room }) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const filtered = (students ?? []).filter(s =>
    [s.name, s.enroll_id, s.email, s.phone].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );
  filtered.forEach(element => {
    room.forEach(e => {
      if (element.room_id === e.room_id) {
        element.room_id = e.room_no;
      }
    });
  });
  return (
    <>
      {showModal && (
        <AddStudentModal
          availableRooms={availableRooms}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); onRefresh(); }}
        />
      )}
      <Card>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 18, gap: 10 }}>
          <span style={{ fontSize: 20 }}>🎓</span>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>Students</h2>
          <span style={{ background: "#1e40af33", color: "#93c5fd", border: "1px solid #3b82f633", borderRadius: 999, padding: "1px 12px", fontSize: 12, fontWeight: 700 }}>
            {students?.length ?? 0}
          </span>
          <button
            onClick={() => setShowModal(true)}
            style={{
              marginLeft: "auto",
              padding: "8px 18px", borderRadius: 10, border: "none",
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 4px 16px #3b82f633",
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>＋</span> Add Student
          </button>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students…" style={inputStyle} />
        {!filtered.length ? <EmptyState msg="No students found" /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>{["Name", "Enroll ID", "Email", "Phone", "Gender", "Year", "Room"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
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
    </>
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
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "4px 14px", borderRadius: 999, border: "1px solid", borderColor: filter === s ? "#3b82f6" : "rgba(255,255,255,0.1)", background: filter === s ? "#1d4ed855" : "transparent", color: filter === s ? "#93c5fd" : "#94a3b8", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>{s}</button>
        ))}
      </div>
      {!filtered.length ? <EmptyState msg="No complaints" /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(c => (
            <div key={c.complaint_id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 16px", display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700, color: "#e2e8f0", marginBottom: 4 }}>{fmt(c.complain_type)} — Room {fmt(c.room_no)}</div>
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

// ── PAYMENT SLIP GENERATOR ────────────────────────────────────────────────────
function generateSlipHTML(f, hostelName) {
  const paidDate = f.paid_date ? new Date(f.paid_date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const dueDate = f.due_date ? new Date(f.due_date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "—";
  const amount = Number(f.amount).toLocaleString("en-IN");
  const receiptNo = `RCP-${f.fee_id ?? "0000"}-${new Date().getFullYear()}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Fee Receipt – ${f.enroll_id}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:#f8fafc;display:flex;justify-content:center;padding:40px 20px;}
  .slip{background:#fff;width:520px;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.12);}
  .header{background:linear-gradient(135deg,#1e3a8a,#3b82f6);padding:28px 32px;color:#fff;}
  .header-top{display:flex;justify-content:space-between;align-items:flex-start;}
  .hostel-name{font-size:18px;font-weight:800;letter-spacing:-.01em;}
  .receipt-badge{background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.3);border-radius:8px;padding:4px 14px;font-size:12px;font-weight:700;letter-spacing:.05em;}
  .slip-title{margin-top:18px;font-size:24px;font-weight:900;letter-spacing:-.02em;}
  .receipt-no{margin-top:4px;font-size:12px;opacity:.7;font-weight:600;}
  .body{padding:28px 32px;}
  .paid-banner{background:#dcfce7;border:1px solid #bbf7d0;border-radius:10px;padding:12px 18px;display:flex;align-items:center;gap:10px;margin-bottom:22px;}
  .paid-icon{width:32px;height:32px;background:#22c55e;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;flex-shrink:0;}
  .paid-text{font-weight:700;color:#15803d;font-size:14px;}
  .paid-sub{font-size:12px;color:#16a34a;margin-top:2px;}
  .section-label{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#94a3b8;margin-bottom:12px;}
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:22px;}
  .info-item label{font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:3px;}
  .info-item span{font-size:14px;color:#1e293b;font-weight:700;}
  .amount-box{background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border:1px solid #bae6fd;border-radius:12px;padding:18px 22px;display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;}
  .amount-label{font-size:13px;color:#0369a1;font-weight:700;}
  .amount-value{font-size:28px;font-weight:900;color:#0c4a6e;}
  .footer{border-top:1px dashed #e2e8f0;padding-top:18px;display:flex;justify-content:space-between;align-items:flex-end;}
  .footer-note{font-size:11px;color:#94a3b8;max-width:240px;line-height:1.5;}
  .watermark{font-size:10px;font-weight:800;color:#22c55e;letter-spacing:.06em;text-transform:uppercase;}
  @media print{body{background:#fff;padding:0;}.slip{box-shadow:none;border-radius:0;width:100%;}}
</style>
</head>
<body>
<div class="slip">
  <div class="header">
    <div class="header-top">
      <div class="hostel-name">🏠 ${hostelName ?? "Hostel"}</div>
      <div class="receipt-badge">OFFICIAL RECEIPT</div>
    </div>
    <div class="slip-title">Fee Payment Slip</div>
    <div class="receipt-no">Receipt No: ${receiptNo}</div>
  </div>
  <div class="body">
    <div class="paid-banner">
      <div class="paid-icon">✓</div>
      <div>
        <div class="paid-text">Payment Confirmed</div>
        <div class="paid-sub">Paid on ${paidDate}</div>
      </div>
    </div>

    <div class="section-label">Student Details</div>
    <div class="info-grid">
      <div class="info-item"><label>Enroll ID</label><span>${fmt(f.enroll_id)}</span></div>
      <div class="info-item"><label>Fee ID</label><span>#${fmt(f.fee_id)}</span></div>
      <div class="info-item"><label>Due Date</label><span>${dueDate}</span></div>
      <div class="info-item"><label>Paid Date</label><span>${paidDate}</span></div>
    </div>

    <div class="amount-box">
      <div class="amount-label">💰 Amount Paid</div>
      <div class="amount-value">₹${amount}</div>
    </div>

    <div class="footer">
      <div class="footer-note">This is a computer-generated receipt and does not require a physical signature.</div>
      <div class="watermark">✓ PAID</div>
    </div>
  </div>
</div>
<script>window.onload=()=>window.print();</script>
</body>
</html>`;
}

// ── FEES ──────────────────────────────────────────────────────────────────────
function FeesSection({ fees: initialFees, hostelName, onRefresh }) {
  const [fees, setFees] = useState(initialFees ?? []);
  const [markingId, setMarkingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { setFees(initialFees ?? []); }, [initialFees]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleMarkPaid = async (f) => {
    setMarkingId(f.fee_id);
    setConfirmId(null);
    try {
      const res = await fetch(`${MARK_PAID_URL}/${f.fee_id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.message ?? "Failed to mark as paid");
      }
      setFees(prev => prev.map(fee =>
        fee.fee_id === f.fee_id
          ? { ...fee, status: "paid", paid_date: new Date().toISOString() }
          : fee
      ));
      showToast(`Fee #${f.fee_id} marked as paid ✓`);
      if (onRefresh) onRefresh();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setMarkingId(null);
    }
  };

  const handleDownloadSlip = (f) => {
    const html = generateSlipHTML(f, hostelName);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (!win) {
      const a = document.createElement("a");
      a.href = url;
      a.download = `fee-slip-${f.enroll_id}-${f.fee_id}.html`;
      a.click();
    }
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const total = fees.reduce((a, f) => a + (Number(f.amount) || 0), 0);
  const paid = fees.filter(f => f.status === "paid").reduce((a, f) => a + (Number(f.amount) || 0), 0);

  return (
    <>
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 200,
          background: toast.type === "error" ? "#ef444422" : "#22c55e22",
          border: `1px solid ${toast.type === "error" ? "#ef444466" : "#22c55e66"}`,
          borderRadius: 12, padding: "12px 20px",
          color: toast.type === "error" ? "#fca5a5" : "#86efac",
          fontSize: 14, fontWeight: 700,
          backdropFilter: "blur(8px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "slideUp .25s ease",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          {toast.type === "error" ? "⚠️" : "✓"} {toast.msg}
        </div>
      )}

      {confirmId !== null && (
        <>
          <div onClick={() => setConfirmId(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", zIndex: 110 }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            zIndex: 111, width: "min(380px,90vw)",
            background: "#0f1623", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16, padding: "24px 24px 20px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
          }}>
            <div style={{ fontSize: 32, textAlign: "center", marginBottom: 12 }}>💳</div>
            <h3 style={{ margin: "0 0 8px", color: "#f1f5f9", textAlign: "center", fontSize: 17, fontWeight: 800 }}>Confirm Payment</h3>
            <p style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", lineHeight: 1.6, margin: "0 0 20px" }}>
              Mark fee <strong style={{ color: "#93c5fd" }}>#{confirmId}</strong> as <strong style={{ color: "#22c55e" }}>paid</strong>?
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => setConfirmId(null)} style={{ padding: "9px 22px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#64748b", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                Cancel
              </button>
              <button
                onClick={() => {
                  const f = fees.find(x => x.fee_id === confirmId);
                  if (f) handleMarkPaid(f);
                }}
                style={{ padding: "9px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700, boxShadow: "0 4px 16px #22c55e44" }}
              >
                ✓ Confirm
              </button>
            </div>
          </div>
        </>
      )}

      <Card>
        <SectionTitle icon="💰" title="Fees" count={fees.length} />
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

        {!fees.length ? <EmptyState msg="No fee records" /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  {["Enroll ID", "Amount", "Status", "Due Date", "Paid Date", "Action"].map(h => (
                    <th key={h} style={h === "Action" ? { ...thStyle, textAlign: "right" } : thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fees.map((f, i) => {
                  const isPaid = f.status === "paid";
                  const isMarkingThis = markingId === f.fee_id;
                  return (
                    <tr key={f.fee_id} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                      <td style={tdStyle}><span style={{ color: "#93c5fd", fontFamily: "monospace", fontSize: 13 }}>{fmt(f.enroll_id)}</span></td>
                      <td style={tdStyle}><span style={{ fontWeight: 700 }}>{fmtCurrency(f.amount)}</span></td>
                      <td style={tdStyle}><Badge label={f.status ?? "unknown"} /></td>
                      <td style={tdStyle}>{fmtDate(f.due_date)}</td>
                      <td style={tdStyle}>{fmtDate(f.paid_date)}</td>
                      <td style={{ ...tdStyle, textAlign: "right", whiteSpace: "nowrap" }}>
                        {isPaid ? (
                          <button
                            onClick={() => handleDownloadSlip(f)}
                            style={{ padding: "5px 14px", borderRadius: 8, border: "1px solid #22c55e44", background: "#22c55e18", color: "#22c55e", cursor: "pointer", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}
                            onMouseEnter={e => { e.currentTarget.style.background = "#22c55e30"; e.currentTarget.style.borderColor = "#22c55e77"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "#22c55e18"; e.currentTarget.style.borderColor = "#22c55e44"; }}
                          >
                            <span style={{ fontSize: 13 }}>⬇</span> Download Slip
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmId(f.fee_id)}
                            disabled={isMarkingThis}
                            style={{ padding: "5px 14px", borderRadius: 8, border: "1px solid #3b82f644", background: isMarkingThis ? "#1d4ed822" : "#3b82f618", color: isMarkingThis ? "#475569" : "#60a5fa", cursor: isMarkingThis ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5, opacity: isMarkingThis ? 0.5 : 1 }}
                            onMouseEnter={e => { if (!isMarkingThis) { e.currentTarget.style.background = "#3b82f630"; } }}
                            onMouseLeave={e => { e.currentTarget.style.background = isMarkingThis ? "#1d4ed822" : "#3b82f618"; }}
                          >
                            {isMarkingThis ? <><span>⟳</span> Processing…</> : <><span style={{ fontSize: 13 }}>✓</span> Mark Paid</>}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
      `}</style>
    </>
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
            <div key={a.admin_id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px" }}>
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

  const loadData = () => {
    setData(null);
    fetch(API_URL, { credentials: "include" })
      .then(r => r.json())
      .then(res => setData(res.data?.[0] ?? res.data ?? res))
      .catch(() => setError("Failed to load dashboard data. Make sure the API is running."));
  };

  useEffect(() => { loadData(); }, []);

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
        <div style={{ fontSize: 40 }}>⏳</div>
        <div style={{ marginTop: 12 }}>Loading dashboard…</div>
      </div>
    </div>
  );

  const { hostel_name, room = [], student = [], complaints = [], fee = [], admin = [] } = data;
  const availableRooms = room.filter(r => r.status === "available");
  const pendingComplaints = complaints.filter(c => ["Pending", "pending"].includes(c.status)).length;
  const unpaidFees = fee.filter(f => f.status === "unpaid").length;

  return (
    <div style={shell}>
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
            }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
              <StatCard icon="🛏️" label="Total Rooms" value={room.length} sub={`${availableRooms.length} available`} accent="#3b82f6" />
              <StatCard icon="🎓" label="Students" value={student.length} accent="#8b5cf6" />
              <StatCard icon="📢" label="Complaints" value={complaints.length} sub={`${pendingComplaints} pending`} accent="#f59e0b" />
              <StatCard icon="💰" label="Fee Records" value={fee.length} sub={`${unpaidFees} unpaid`} accent="#22c55e" />
              <StatCard icon="👤" label="Admins" value={admin.length} accent="#ec4899" />
            </div>
            <RoomsSection rooms={room} onRefresh={loadData} />
            <StudentsSection students={student} room={room} availableRooms={availableRooms} onRefresh={loadData} />
            <ComplaintsSection complaints={complaints} />
            <FeesSection fees={fee} hostelName={hostel_name} onRefresh={loadData} />
            <AdminsSection admins={admin} />
          </div>
        )}
        {tab === "rooms" && <RoomsSection rooms={room} onRefresh={loadData} />}
        {tab === "students" && <StudentsSection students={student} availableRooms={availableRooms} onRefresh={loadData} room={room} />}
        {tab === "complaints" && <ComplaintsSection complaints={complaints} />}
        {tab === "fees" && <FeesSection fees={fee} hostelName={hostel_name} onRefresh={loadData} />}
        {tab === "admins" && <AdminsSection admins={admin} />}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        select option { background: #0f1623; }
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