
import React, { useEffect, useState, useRef } from "react";
import AdminFeePage from "../../Pages/AdminFeePage" // adjust path as needed
import { Navigate } from "react-router-dom";
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

// ── THEME TOKENS ──────────────────────────────────────────────────────────────
const T = {
  bg: "#ffffff",
  surface: "#f8fafc",
  card: "#ffffff",
  dark: "#111927",
  darkBorder: "#2a374b",
  accent: "#4f73b3",
  text: "#1e293b",
  textMuted: "#64748b",
  textLight: "#94a3b8",
  border: "#e2e8f0",
  borderLight: "#f1f5f9",
  shadow: "0 8px 30px rgba(17,25,39,0.08)",
  shadowLg: "0 20px 60px rgba(17,25,39,0.15)",
};

// ── SHARED UI PRIMITIVES ──────────────────────────────────────────────────────
function Badge({ label }) {
  const color = STATUS_COLOR[label] ?? "#6b7280";
  return (
    <span style={{
      background: color + "18", color,
      border: `1px solid ${color}44`, borderRadius: 8,
      padding: "3px 10px", fontSize: 11, fontWeight: 700,
      letterSpacing: ".05em", textTransform: "capitalize", whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

function HiveCard({ children, style = {} }) {
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 20,
      boxShadow: T.shadow,
      overflow: "hidden",
      ...style,
    }}>{children}</div>
  );
}

function CardHeader({ icon, title, count, action }) {
  return (
    <div style={{
      background: T.dark,
      borderBottom: `1px solid ${T.darkBorder}`,
      padding: "18px 24px",
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-.01em" }}>{title}</h2>
        {count !== undefined && (
          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>
            {count} {count === 1 ? "record" : "records"}
          </span>
        )}
      </div>
      {count !== undefined && (
        <span style={{
          background: `${T.accent}22`, color: T.accent,
          border: `1px solid ${T.accent}44`, borderRadius: 20,
          padding: "2px 12px", fontSize: 12, fontWeight: 700,
        }}>{count}</span>
      )}
      {action}
    </div>
  );
}

function CardBody({ children, style = {} }) {
  return <div style={{ padding: "20px 24px", ...style }}>{children}</div>;
}

function StatCard({ icon, label, value, sub, accent = T.accent }) {
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 20,
      boxShadow: T.shadow,
      padding: "20px 22px",
      display: "flex", gap: 16, alignItems: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent, borderRadius: "20px 20px 0 0" }} />
      <div style={{
        width: 50, height: 50, borderRadius: 14,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: accent + "15", fontSize: 22, flexShrink: 0,
        border: `1px solid ${accent}25`,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 900, color: T.text, lineHeight: 1, letterSpacing: "-.02em" }}>{value}</div>
        <div style={{ fontSize: 13, color: T.textMuted, marginTop: 3, fontWeight: 600 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: accent, marginTop: 2, fontWeight: 700 }}>{sub}</div>}
      </div>
    </div>
  );
}

function EmptyState({ msg }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: T.surface, border: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, margin: "0 auto 14px",
      }}>📭</div>
      <p style={{ color: T.textLight, fontSize: 14, fontWeight: 600, margin: 0 }}>{msg}</p>
    </div>
  );
}

function PrimaryButton({ onClick, disabled, children, color = "#111927" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "9px 20px", borderRadius: 12, border: "none",
        background: disabled ? "#94a3b8" : color,
        color: "#fff", cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 13, fontWeight: 700, display: "inline-flex",
        alignItems: "center", gap: 6,
        boxShadow: disabled ? "none" : `0 4px 14px ${color}44`,
        transition: "all .15s ease", opacity: disabled ? 0.6 : 1,
      }}
    >{children}</button>
  );
}

function GhostButton({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "9px 18px", borderRadius: 12,
      border: `1px solid ${T.border}`,
      background: "transparent", color: T.textMuted,
      cursor: "pointer", fontSize: 13, fontWeight: 600,
      transition: "all .15s ease",
    }}>{children}</button>
  );
}

function FilterPill({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "5px 16px", borderRadius: 20, border: `1px solid`,
      borderColor: active ? T.dark : T.border,
      background: active ? T.dark : "transparent",
      color: active ? "#fff" : T.textMuted,
      cursor: "pointer", fontSize: 13, fontWeight: 600,
      transition: "all .15s ease",
    }}>{children}</button>
  );
}

// ── STYLES ───────────────────────────────────────────────────────────────────
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: 13 };
const thStyle = {
  textAlign: "left", padding: "10px 14px",
  color: T.textMuted, fontWeight: 700, fontSize: 11,
  letterSpacing: ".08em", textTransform: "uppercase",
  borderBottom: `1px solid ${T.border}`,
  background: T.surface,
};
const tdStyle = {
  padding: "12px 14px", color: T.textMuted,
  borderBottom: `1px solid ${T.borderLight}`,
};

const inputBase = {
  width: "100%", boxSizing: "border-box",
  background: "#f8fafc",
  border: `1px solid ${T.border}`,
  borderRadius: 12, padding: "10px 14px 10px 42px",
  color: T.text, fontSize: 13, outline: "none",
  fontWeight: 600, transition: "all .15s ease",
};
const mInput = {
  background: "#f8fafc", border: `1px solid ${T.border}`,
  borderRadius: 12, padding: "10px 14px",
  color: T.text, fontSize: 13, outline: "none",
  width: "100%", boxSizing: "border-box", fontWeight: 500,
};
const mSelect = {
  background: "#f8fafc", border: `1px solid ${T.border}`,
  borderRadius: 12, padding: "10px 14px",
  color: T.text, fontSize: 13, outline: "none",
  width: "100%", boxSizing: "border-box",
  cursor: "pointer", fontWeight: 500,
};
const lbl = {
  fontSize: 11, color: T.textMuted, fontWeight: 700,
  letterSpacing: ".07em", textTransform: "uppercase",
  marginBottom: 6, display: "block",
};

// ── MODAL SHELL ───────────────────────────────────────────────────────────────
function Modal({ onClose, width = "420px", children }) {
  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0,
        background: "rgba(17,25,39,0.55)",
        backdropFilter: "blur(6px)", zIndex: 100,
      }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 101, width: `min(${width}, 95vw)`,
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 24, overflow: "hidden",
        boxShadow: T.shadowLg,
      }}>{children}</div>
    </>
  );
}

function ModalHeader({ onClose, tag, tagColor = T.accent, title, icon }) {
  return (
    <div style={{ background: T.dark, borderBottom: `1px solid ${T.darkBorder}`, padding: "22px 24px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {icon && (
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>{icon}</div>
          )}
          <div>
            <div style={{ fontSize: 10, color: tagColor, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 3 }}>{tag}</div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-.01em" }}>{title}</h2>
          </div>
        </div>
        <button onClick={onClose} style={{
          width: 32, height: 32, borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.05)",
          color: "#94a3b8", cursor: "pointer", fontSize: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>
      </div>
    </div>
  );
}

function ModalError({ error }) {
  if (!error) return null;
  return (
    <div style={{
      margin: "0 24px 4px",
      background: "#fef2f2", border: "1px solid #fecaca",
      borderRadius: 10, padding: "10px 14px",
      color: "#dc2626", fontSize: 13, fontWeight: 600,
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      </svg>
      {error}
    </div>
  );
}

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
    setLoading(true); setError("");
    try {
      const res = await fetch(ADD_ROOM_URL, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_no: form.room_no.trim(), occupicity: form.occupicity.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Failed to add room");
      onSuccess();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <Modal onClose={onClose} width="420px">
      <ModalHeader onClose={onClose} tag="New Room" tagColor="#22c55e" title="Add Room" icon="🛏️" />
      <div style={{ padding: "22px 24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={lbl}>Room Number</label>
          <input style={mInput} value={form.room_no} onChange={e => set("room_no", e.target.value)}
            placeholder="e.g. 101, A-202" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        </div>
        <div>
          <label style={lbl}>Occupicity (Capacity)</label>
          <input style={mInput} value={form.occupicity} onChange={e => set("occupicity", e.target.value)}
            placeholder="e.g. 2, 4" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          <p style={{ fontSize: 11, color: T.textLight, marginTop: 6, fontWeight: 500 }}>
            Maximum number of students that can occupy this room
          </p>
        </div>
      </div>
      <ModalError error={error} />
      <div style={{ padding: "16px 24px 22px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <GhostButton onClick={onClose}>Cancel</GhostButton>
        <PrimaryButton onClick={handleSubmit} disabled={loading} color="#111927">
          {loading ? "Adding…" : "+ Add Room"}
        </PrimaryButton>
      </div>
    </Modal>
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
    setLoading(true); setError("");
    try {
      const res = await fetch(ADD_STUDENT_URL, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, enroll_id: form.roll, email: form.email, phone: form.phone, gender: form.gender, year: form.year, room_id: form.room }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Failed to add student");
      onSuccess();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <Modal onClose={onClose} width="560px">
      <ModalHeader onClose={onClose} tag="New Admission" tagColor={T.accent} title="Add Student" icon="🎓" />
      <div style={{ padding: "22px 24px 8px" }}>
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
              <span style={{ background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: 20, padding: "1px 8px", fontSize: 10, fontWeight: 700, textTransform: "none", letterSpacing: ".02em" }}>
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
              <p style={{ fontSize: 12, color: "#f59e0b", marginTop: 6, fontWeight: 600 }}>⚠️ No available rooms at the moment</p>
            )}
          </div>
        </div>
      </div>
      <ModalError error={error} />
      <div style={{ padding: "16px 24px 22px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <GhostButton onClick={onClose}>Cancel</GhostButton>
        <PrimaryButton onClick={handleSubmit} disabled={loading} color="#111927">
          {loading ? "Adding…" : "✓ Add Student"}
        </PrimaryButton>
      </div>
    </Modal>
  );
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const isErr = toast.type === "error";
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 200,
      background: isErr ? "#fef2f2" : "#f0fdf4",
      border: `1px solid ${isErr ? "#fecaca" : "#bbf7d0"}`,
      borderRadius: 14, padding: "12px 20px",
      color: isErr ? "#dc2626" : "#16a34a",
      fontSize: 14, fontWeight: 700,
      boxShadow: "0 8px 32px rgba(17,25,39,0.12)",
      animation: "slideUp .25s ease",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      {isErr ? "⚠️" : "✓"} {toast.msg}
    </div>
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

  const STATUS_ACCENT = { available: "#22c55e", maintenance: "#f59e0b", occupied: "#ef4444" };

  return (
    <>
      <Toast toast={toast} />
      {showModal && <AddRoomModal onClose={() => setShowModal(false)} onSuccess={handleRoomAdded} />}

      <HiveCard>
        <CardHeader
          icon="🛏️" title="Rooms" count={rooms?.length ?? 0}
          action={
            <PrimaryButton onClick={() => setShowModal(true)} color="#111927">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Add Room
            </PrimaryButton>
          }
        />
        <CardBody>
          {!rooms?.length ? <EmptyState msg="No rooms found" /> : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 12 }}>
              {rooms.map(r => {
                const pct = r.capacity ? Math.round((r.occupied / r.capacity) * 100) : 0;
                const accent = STATUS_ACCENT[r.status] ?? "#94a3b8";
                return (
                  <div key={r.room_id} style={{
                    background: T.surface, border: `1px solid ${T.border}`,
                    borderRadius: 14, padding: "14px 16px",
                    position: "relative", overflow: "hidden",
                    transition: "box-shadow .15s ease",
                  }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent }} />
                    <div style={{ fontWeight: 800, fontSize: 15, color: T.text, marginBottom: 4 }}>Room {r.room_no}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                      <div style={{ flex: 1, height: 4, background: T.border, borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: accent, borderRadius: 99 }} />
                      </div>
                      <span style={{ fontSize: 11, color: T.textMuted, fontWeight: 600 }}>{r.occupied ?? 0}/{r.capacity ?? 0}</span>
                    </div>
                    <Badge label={r.status ?? "unknown"} />
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </HiveCard>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
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
      if (element.room_id === e.room_id) element.room_id = e.room_no;
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
      <HiveCard>
        <CardHeader
          icon="🎓" title="Students" count={students?.length ?? 0}
          action={
            <PrimaryButton onClick={() => setShowModal(true)} color="#111927">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Add Student
            </PrimaryButton>
          }
        />
        <CardBody>
          {/* Search */}
          <div style={{ position: "relative", marginBottom: 18 }}>
            <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: T.textLight, pointerEvents: "none" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
              </svg>
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, ID, email…"
              style={inputBase}
            />
          </div>

          {!filtered.length ? <EmptyState msg="No students found" /> : (
            <div style={{ overflowX: "auto", borderRadius: 12, border: `1px solid ${T.border}` }}>
              <table style={tableStyle}>
                <thead>
                  <tr>{["Name", "Enroll ID", "Email", "Phone", "Gender", "Year", "Room"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr key={s.enroll_id} style={{ background: i % 2 === 0 ? "#fff" : T.surface }}>
                      <td style={tdStyle}><span style={{ fontWeight: 700, color: T.text }}>{fmt(s.name)}</span></td>
                      <td style={tdStyle}><span style={{ color: T.accent, fontFamily: "monospace", fontWeight: 700, fontSize: 13, background: `${T.accent}12`, padding: "2px 8px", borderRadius: 6 }}>{fmt(s.enroll_id)}</span></td>
                      <td style={tdStyle}>{fmt(s.email)}</td>
                      <td style={tdStyle}>{fmt(s.phone)}</td>
                      <td style={tdStyle}>{fmt(s.gender)}</td>
                      <td style={tdStyle}>{fmt(s.year)}</td>
                      <td style={tdStyle}><span style={{ fontWeight: 600, color: T.text }}>{fmt(s.room_id)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </HiveCard>
    </>
  );
}

// ── COMPLAINTS ────────────────────────────────────────────────────────────────
function ComplaintsSection({ complaints }) {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Pending", "Resolved"];
  const filtered = filter === "All" ? (complaints ?? []) : (complaints ?? []).filter(c => c.status === filter);

  return (
    <HiveCard>
      <CardHeader icon="📢" title="Complaints" count={complaints?.length ?? 0} />
      <CardBody>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {statuses.map(s => (
            <FilterPill key={s} active={filter === s} onClick={() => setFilter(s)}>{s}</FilterPill>
          ))}
        </div>
        {!filtered.length ? <EmptyState msg="No complaints" /> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(c => (
              <div key={c.complaint_id} style={{
                background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: 14, padding: "16px 18px",
                display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "start",
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: T.text, marginBottom: 4, fontSize: 14 }}>
                    {fmt(c.complain_type)} — Room {fmt(c.room_no)}
                  </div>
                  <div style={{ color: T.textMuted, fontSize: 13, lineHeight: 1.5 }}>{fmt(c.description)}</div>
                  <div style={{ color: T.textLight, fontSize: 11, marginTop: 8, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    {fmtDate(c.date)}
                  </div>
                </div>
                <Badge label={c.status ?? "unknown"} />
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </HiveCard>
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
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
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
    setMarkingId(f.fee_id); setConfirmId(null);
    try {
      const res = await fetch(`${MARK_PAID_URL}/${f.fee_id}`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.message ?? "Failed to mark as paid");
      }
      setFees(prev => prev.map(fee =>
        fee.fee_id === f.fee_id ? { ...fee, status: "paid", paid_date: new Date().toISOString() } : fee
      ));
      showToast(`Fee #${f.fee_id} marked as paid ✓`);
      if (onRefresh) onRefresh();
    } catch (e) { showToast(e.message, "error"); }
    finally { setMarkingId(null); }
  };

  const handleDownloadSlip = (f) => {
    const html = generateSlipHTML(f, hostelName);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (!win) {
      const a = document.createElement("a");
      a.href = url; a.download = `fee-slip-${f.enroll_id}-${f.fee_id}.html`; a.click();
    }
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const total = fees.reduce((a, f) => a + (Number(f.amount) || 0), 0);
  const paid = fees.filter(f => f.status === "paid").reduce((a, f) => a + (Number(f.amount) || 0), 0);

  return (
    <>
      <Toast toast={toast} />

      {/* Confirm modal */}
      {confirmId !== null && (
        <Modal onClose={() => setConfirmId(null)} width="360px">
          <div style={{ background: T.dark, borderBottom: `1px solid ${T.darkBorder}`, padding: "22px 24px", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 10px" }}>💳</div>
            <h3 style={{ margin: 0, color: "#f1f5f9", fontSize: 17, fontWeight: 800 }}>Confirm Payment</h3>
          </div>
          <div style={{ padding: "20px 24px" }}>
            <p style={{ color: T.textMuted, fontSize: 13, textAlign: "center", lineHeight: 1.6, margin: "0 0 20px" }}>
              Mark fee <strong style={{ color: T.accent }}>#{confirmId}</strong> as <strong style={{ color: "#22c55e" }}>paid</strong>?
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <GhostButton onClick={() => setConfirmId(null)}>Cancel</GhostButton>
              <PrimaryButton
                color="#22c55e"
                onClick={() => { const f = fees.find(x => x.fee_id === confirmId); if (f) handleMarkPaid(f); }}
              >✓ Confirm</PrimaryButton>
            </div>
          </div>
        </Modal>
      )}

      <HiveCard>
        <CardHeader icon="💰" title="Fees" count={fees.length} />
        <CardBody>
          {/* Summary Pills */}
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "12px 20px" }}>
              <div style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>Collected</div>
              <div style={{ fontWeight: 900, color: "#15803d", fontSize: 20 }}>{fmtCurrency(paid)}</div>
            </div>
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "12px 20px" }}>
              <div style={{ fontSize: 11, color: "#dc2626", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>Pending</div>
              <div style={{ fontWeight: 900, color: "#b91c1c", fontSize: 20 }}>{fmtCurrency(total - paid)}</div>
            </div>
          </div>

          {!fees.length ? <EmptyState msg="No fee records" /> : (
            <div style={{ overflowX: "auto", borderRadius: 12, border: `1px solid ${T.border}` }}>
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
                      <tr key={f.fee_id} style={{ background: i % 2 === 0 ? "#fff" : T.surface }}>
                        <td style={tdStyle}>
                          <span style={{ color: T.accent, fontFamily: "monospace", fontWeight: 700, fontSize: 13, background: `${T.accent}12`, padding: "2px 8px", borderRadius: 6 }}>{fmt(f.enroll_id)}</span>
                        </td>
                        <td style={tdStyle}><span style={{ fontWeight: 800, color: T.text, fontSize: 14 }}>{fmtCurrency(f.amount)}</span></td>
                        <td style={tdStyle}><Badge label={f.status ?? "unknown"} /></td>
                        <td style={tdStyle}>{fmtDate(f.due_date)}</td>
                        <td style={tdStyle}>{fmtDate(f.paid_date)}</td>
                        <td style={{ ...tdStyle, textAlign: "right", whiteSpace: "nowrap" }}>
                          {isPaid ? (
                            <button
                              onClick={() => handleDownloadSlip(f)}
                              style={{ padding: "5px 14px", borderRadius: 8, border: "1px solid #bbf7d0", background: "#f0fdf4", color: "#16a34a", cursor: "pointer", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}
                            >
                              ⬇ Download Slip
                            </button>
                          ) : (
                            <button
                              onClick={() => setConfirmId(f.fee_id)}
                              disabled={isMarkingThis}
                              style={{ padding: "5px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surface, color: isMarkingThis ? T.textLight : T.text, cursor: isMarkingThis ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5, opacity: isMarkingThis ? 0.5 : 1 }}
                            >
                              {isMarkingThis ? "Processing…" : "✓ Mark Paid"}
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
        </CardBody>
      </HiveCard>

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </>
  );
}

// ── ADMINS ────────────────────────────────────────────────────────────────────
// ── ADD ADMIN MODAL ───────────────────────────────────────────────────────────
// Drop this into your hostel.jsx, replacing the existing AdminsSection

const ADD_ADMIN_URL = "http://localhost:3000/api/admin/create";

const EMPTY_ADMIN = { name: "", email: "", password: "", phone: "", department: "" };

function AddAdminModal({ hostelId, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_ADMIN);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name.trim())       { setError("Name is required.");        return; }
    if (!form.email.trim())      { setError("Email is required.");       return; }
    if (!form.password.trim())   { setError("Password is required.");    return; }
    if (!form.department)        { setError("Select an admin type.");    return; }

    setLoading(true); setError("");
    try {
      const res = await fetch(ADD_ADMIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:       form.name.trim(),
          email:      form.email.trim().toLowerCase(),
          password:   form.password,
          phone:      form.phone.trim() || null,
          department: form.department,
          hostel_id:  String(hostelId),
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onSuccess();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const DEPT_OPTIONS = [
    { value: "Mess_Manager",      label: "Mess Manager",       icon: "🍽️" },
    { value: "Transport_Manager", label: "Transport Manager",  icon: "🚌" },
  ];

  return (
    <Modal onClose={onClose} width="480px">
      <ModalHeader onClose={onClose} tag="New Admin" tagColor="#a855f7" title="Add Admin" icon="👤" />
      <div style={{ padding: "22px 24px 8px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Admin type — pick first, it sets context */}
        <div>
          <label style={lbl}>Admin Type *</label>
          <div style={{ display: "flex", gap: 10 }}>
            {DEPT_OPTIONS.map(opt => (
              <button key={opt.value} type="button"
                onClick={() => set("department", opt.value)}
                style={{
                  flex: 1, padding: "12px 14px", borderRadius: 12, cursor: "pointer",
                  border: `2px solid ${form.department === opt.value ? "#a855f7" : T.border}`,
                  background: form.department === opt.value ? "#faf5ff" : T.surface,
                  color: form.department === opt.value ? "#7c3aed" : T.textMuted,
                  fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center",
                  gap: 8, transition: "all .15s",
                }}
              >
                <span style={{ fontSize: 18 }}>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 14px" }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={lbl}>Full Name *</label>
            <input style={mInput} value={form.name}
              onChange={e => set("name", e.target.value)}
              placeholder="e.g. Ravi Kumar" />
          </div>
          <div>
            <label style={lbl}>Email *</label>
            <input style={mInput} type="email" value={form.email}
              onChange={e => set("email", e.target.value)}
              placeholder="admin@hostel.com" />
          </div>
          <div>
            <label style={lbl}>Phone</label>
            <input style={mInput} value={form.phone}
              onChange={e => set("phone", e.target.value)}
              placeholder="10-digit number" />
          </div>
          <div style={{ gridColumn: "1/-1", position: "relative" }}>
            <label style={lbl}>Password *</label>
            <div style={{ position: "relative" }}>
              <input
                style={mInput}
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={e => set("password", e.target.value)}
                placeholder="Set a login password"
              />
              <button type="button"
                onClick={() => setShowPass(p => !p)}
                style={{
                  position: "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  border: "none", cursor: "pointer", color: T.textLight,
                  fontSize: 13, fontWeight: 600,
                }}>
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
            <p style={{ fontSize: 11, color: T.textLight, marginTop: 5, fontWeight: 500 }}>
              This admin will use this password to log in at /login/admin
            </p>
          </div>
        </div>
      </div>

      <ModalError error={error} />

      <div style={{ padding: "16px 24px 22px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <GhostButton onClick={onClose}>Cancel</GhostButton>
        <PrimaryButton onClick={handleSubmit} disabled={loading} color="#7c3aed">
          {loading ? "Creating…" : "✓ Create Admin"}
        </PrimaryButton>
      </div>
    </Modal>
  );
}

// ── UPDATED ADMINS SECTION ────────────────────────────────────────────────────
function AdminsSection({ admins, hostelId, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const DEPT_COLOR = {
    Hostel_Admin:      { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", icon: "🏠" },
    Mess_Manager:      { bg: "#fdf4ff", color: "#7c3aed", border: "#e9d5ff", icon: "🍽️" },
    Transport_Manager: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0", icon: "🚌" },
  };

  return (
    <>
      <Toast toast={toast} />
      {showModal && (
        <AddAdminModal
          hostelId={hostelId}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            showToast("Admin created successfully ✓");
            if (onRefresh) onRefresh();
          }}
        />
      )}

      <HiveCard>
        <CardHeader
          icon="👤" title="Admins" count={admins?.length ?? 0}
          action={
            <PrimaryButton onClick={() => setShowModal(true)} color="#7c3aed">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Add Admin
            </PrimaryButton>
          }
        />
        <CardBody>
          {!admins?.length ? <EmptyState msg="No admins yet. Add a Mess or Transport manager." /> : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {admins.map(a => {
                const dept = DEPT_COLOR[a.department] ?? { bg: T.surface, color: T.textMuted, border: T.border, icon: "👤" };
                return (
                  <div key={a.admin_id} style={{
                    background: T.surface, border: `1px solid ${T.border}`,
                    borderRadius: 14, padding: "16px 18px", overflow: "hidden",
                    position: "relative",
                  }}>
                    {/* Colored top accent */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: dept.color }} />

                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: dept.bg, border: `1px solid ${dept.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, flexShrink: 0,
                      }}>{dept.icon}</div>
                      <div>
                        <div style={{ fontWeight: 800, color: T.text, fontSize: 14 }}>{fmt(a.name)}</div>
                        <div style={{ fontSize: 11, color: dept.color, fontWeight: 700, marginTop: 1 }}>
                          {a.department?.replace("_", " ")}
                        </div>
                      </div>
                      {/* Active/Inactive badge */}
                      <div style={{ marginLeft: "auto" }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                          background: a.is_active ? "#f0fdf4" : "#fef2f2",
                          color: a.is_active ? "#16a34a" : "#dc2626",
                          border: `1px solid ${a.is_active ? "#bbf7d0" : "#fecaca"}`,
                        }}>
                          {a.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <div style={{ color: T.textMuted, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                        <span>✉️</span> {fmt(a.email)}
                      </div>
                      {a.phone && (
                        <div style={{ color: T.textMuted, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                          <span>📞</span> {a.phone}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </HiveCard>
    </>
  );
}

// ── NAV TABS ─────────────────────────────────────────────────────────────────
const TABS = [
  { key: "overview",    label: "Overview",    icon: "📊" },
  { key: "rooms",       label: "Rooms",       icon: "🛏️" },
  { key: "students",    label: "Students",    icon: "🎓" },
  { key: "complaints",  label: "Complaints",  icon: "📢" },
  { key: "fees",        label: "Fees",        icon: "💰" },
  { key: "admins",      label: "Admins",      icon: "👤" },
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
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: 20, boxShadow: T.shadowLg,
        overflow: "hidden", width: "min(420px, 95vw)",
      }}>
        <div style={{ background: T.dark, padding: "24px", textAlign: "center", borderBottom: `1px solid ${T.darkBorder}` }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "#ef444422", border: "1px solid #ef444444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 10px" }}>⚠️</div>
          <h2 style={{ color: "#f1f5f9", margin: 0, fontSize: 18, fontWeight: 800 }}>Connection Error</h2>
        </div>
        <div style={{ padding: "24px", textAlign: "center" }}>
          <p style={{ color: T.textMuted, fontSize: 14, margin: 0 }}>{error}</p>
        </div>
      </div>
    </div>
  );

  if (!data) return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: T.dark, display: "flex", alignItems: "center",
          justifyContent: "center", margin: "0 auto 16px",
          boxShadow: T.shadowLg,
        }}>
          <svg style={{ width: 28, height: 28, color: "white", animation: "spin 1s linear infinite" }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: .25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path style={{ opacity: .75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
        <p style={{ color: T.textMuted, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", margin: 0 }}>Loading dashboard…</p>
      </div>
    </div>
  );

  const { hostel_name, room = [], student = [], complaints = [], fee = [], admin = [] } = data;
  const availableRooms = room.filter(r => r.status === "available");
  const pendingComplaints = complaints.filter(c => ["Pending", "pending"].includes(c.status)).length;
  const unpaidFees = fee.filter(f => f.status === "unpaid").length;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── TOP NAV BAR ─────────────────────────────────────────────────────── */}
      <div style={{
        background: T.dark,
        borderBottom: `1px solid ${T.darkBorder}`,
        position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 4px 20px rgba(17,25,39,0.2)",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 0, height: 60 }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginRight: 36 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>🏠</div>
            <div>
              <div style={{ fontWeight: 900, color: "#f1f5f9", fontSize: 16, letterSpacing: "-.01em", lineHeight: 1 }}>HIVE</div>
              <div style={{ fontSize: 9, color: "#64748b", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>Admin Panel</div>
            </div>
            <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.08)", margin: "0 8px" }} />
            <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>{hostel_name ?? "Dashboard"}</span>
          </div>

          {/* Nav Tabs — in the header bar */}
          <div style={{ display: "flex", gap: 2, flex: 1, overflowX: "auto" }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding: "6px 14px", borderRadius: 8, border: "none",
                background: tab === t.key ? "rgba(255,255,255,0.1)" : "transparent",
                color: tab === t.key ? "#f1f5f9" : "#64748b",
                cursor: "pointer", fontSize: 13, fontWeight: 600,
                whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6,
                transition: "all .15s ease",
                borderBottom: tab === t.key ? `2px solid ${T.accent}` : "2px solid transparent",
              }}>
                <span style={{ fontSize: 14 }}>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 16, flexShrink: 0 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em" }}>
              {new Date().toLocaleTimeString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* ── PAGE BODY ────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 24px 48px" }}>

        {/* Page title strip */}
        <div style={{
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 20, boxShadow: T.shadow,
          overflow: "hidden", marginBottom: 24,
        }}>
          <div style={{ background: T.dark, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 10, color: T.accent, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 4 }}>
                Hostel Management System
              </div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-.02em" }}>
                {hostel_name ?? "Dashboard"}
              </h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em" }}>Hostel ID</div>
              <div style={{ fontSize: 14, color: "#94a3b8", fontWeight: 700, fontFamily: "monospace" }}>{data.hostel_id}</div>
            </div>
          </div>
          <div style={{ background: T.surface, borderTop: `1px solid ${T.border}`, padding: "10px 28px", display: "flex", gap: 24 }}>
            <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>
              <span style={{ color: T.accent }}>●</span> {room.length} Rooms
            </span>
            <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>
              <span style={{ color: "#8b5cf6" }}>●</span> {student.length} Students
            </span>
            <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>
              <span style={{ color: "#f59e0b" }}>●</span> {pendingComplaints} Pending Complaints
            </span>
            <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>
              <span style={{ color: "#ef4444" }}>●</span> {unpaidFees} Unpaid Fees
            </span>
          </div>
        </div>

        {/* CONTENT */}
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
              <StatCard icon="🛏️" label="Total Rooms"  value={room.length}       sub={`${availableRooms.length} available`}  accent={T.accent} />
              <StatCard icon="🎓" label="Students"     value={student.length}    accent="#8b5cf6" />
              <StatCard icon="📢" label="Complaints"   value={complaints.length} sub={`${pendingComplaints} pending`}         accent="#f59e0b" />
              <StatCard icon="💰" label="Fee Records"  value={fee.length}        sub={`${unpaidFees} unpaid`}                 accent="#22c55e" />
              <StatCard icon="👤" label="Admins"       value={admin.length}      accent="#ec4899" />
            </div>
            <RoomsSection rooms={room} onRefresh={loadData} />
            <StudentsSection students={student} room={room} availableRooms={availableRooms} onRefresh={loadData} />
            <ComplaintsSection complaints={complaints} />
            <FeesSection fees={fee} hostelName={hostel_name} onRefresh={loadData} />
            <AdminsSection admins={admin} />
          </div>
        )}
        {tab === "rooms"      && <RoomsSection rooms={room} onRefresh={loadData} />}
        {tab === "students"   && <StudentsSection students={student} availableRooms={availableRooms} onRefresh={loadData} room={room} />}
        {tab === "complaints" && <ComplaintsSection complaints={complaints} />}
        {tab === "fees" && <AdminFeePage />}
{tab === "admins" && <AdminsSection admins={admin} hostelId={data.hostel_id} onRefresh={loadData} />}      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${T.border}`, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1240, margin: "0 auto" }}>
        <p style={{ fontSize: 11, color: T.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".1em", margin: 0 }}>© 2026 HIVE CORE</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, color: T.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em" }}>System Secure</span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 3px; }
        select option { background: #ffffff; color: #1e293b; }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
      `}</style>
    </div>
  );
}