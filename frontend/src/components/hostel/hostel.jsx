import React, { useState, useEffect } from 'react';
import {
  Building2, Users, UserPlus, Briefcase, Utensils, Plus, Search, Bell,
  Home, ShieldCheck, Hammer, ChevronDown, ChevronUp, AlertCircle, Clock,
  CheckCircle, Bus, DollarSign, FileText, Megaphone, X, Menu,
  TrendingUp, Wifi, Wrench, Droplets, Star, Send, Eye, Download,
  ArrowUpRight, Filter, MoreHorizontal, LogOut, Settings, HelpCircle
} from 'lucide-react';

// ─── THEME ──────────────────────────────────────────────────────────────────
const T = {
  bg: '#0B0F1A',
  surface: '#111827',
  card: '#16202E',
  border: '#1E2D40',
  accent: '#3B82F6',
  accent2: '#6366F1',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  muted: '#94A3B8',
  text: '#E2E8F0',
  textDim: '#64748B',
};

const badge = (color, bg, label) => (
  <span style={{ background: bg, color, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>
);

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const BUILDINGS = [
  {
    id: 1, name: 'Sunrise Block A', type: 'Boys Hostel', occ: 85, floors: [
      {
        name: 'Ground Floor', rooms: [
          { no: '101', status: 'occupied', cap: 3, filled: 3 },
          { no: '102', status: 'partial', cap: 3, filled: 1 },
          { no: '103', status: 'vacant', cap: 2, filled: 0 },
          { no: '104', status: 'occupied', cap: 2, filled: 2 },
          { no: '105', status: 'maintenance', cap: 2, filled: 0 },
        ]
      },
      {
        name: 'First Floor', rooms: [
          { no: '201', status: 'occupied', cap: 3, filled: 3 },
          { no: '202', status: 'occupied', cap: 3, filled: 3 },
          { no: '203', status: 'vacant', cap: 3, filled: 0 },
          { no: '204', status: 'partial', cap: 2, filled: 1 },
          { no: '205', status: 'vacant', cap: 2, filled: 0 },
        ]
      },
    ]
  },
  {
    id: 2, name: 'Moonlight Block B', type: 'Girls Hostel', occ: 40, floors: [
      {
        name: 'Ground Floor', rooms: [
          { no: '101', status: 'occupied', cap: 2, filled: 2 },
          { no: '102', status: 'vacant', cap: 2, filled: 0 },
          { no: '103', status: 'vacant', cap: 2, filled: 0 },
        ]
      },
      {
        name: 'First Floor', rooms: [
          { no: '201', status: 'partial', cap: 2, filled: 1 },
          { no: '202', status: 'vacant', cap: 2, filled: 0 },
          { no: '203', status: 'vacant', cap: 2, filled: 0 },
        ]
      },
    ]
  },
];

const COMPLAINTS = [
  { id: 1, room: '101', student: 'Arjun Verma', issue: 'Leaking tap in bathroom', type: 'plumbing', priority: 'high', time: '2h ago', status: 'open' },
  { id: 2, room: '205', student: 'Karan Singh', issue: 'Wi-Fi not connecting', type: 'internet', priority: 'medium', time: '5h ago', status: 'open' },
  { id: 3, room: '302', student: 'Rohan Das', issue: 'Window latch broken', type: 'maintenance', priority: 'low', time: '1d ago', status: 'open' },
  { id: 4, room: '104', student: 'Vikram M.', issue: 'Study chair broken', type: 'furniture', priority: 'medium', time: '2d ago', status: 'open' },
  { id: 5, room: '208', student: 'Priya Sharma', issue: 'No hot water', type: 'plumbing', priority: 'high', time: '3h ago', status: 'open' },
];

const NOTICES = [
  { id: 1, title: 'Monthly Inspection', body: 'All rooms will be inspected on 26th March 9 AM.', date: '21 Mar', tag: 'admin' },
  { id: 2, title: 'Staff Meeting', body: 'Floor managers to assemble at warden office 5 PM today.', date: '21 Mar', tag: 'staff' },
  { id: 3, title: 'Holiday Mess Hours', body: 'Mess will operate 8–9 AM, 12–1 PM, 7–8 PM on Holi.', date: '22 Mar', tag: 'mess' },
];

const TRANSPORT = [
  { id: 1, route: 'Campus ↔ Railway Station', departure: '07:30 AM', arrival: '08:10 AM', buses: 2, status: 'on-time' },
  { id: 2, route: 'Campus ↔ City Bus Stand', departure: '08:00 AM', arrival: '08:45 AM', buses: 1, status: 'on-time' },
  { id: 3, route: 'Campus ↔ Airport', departure: '05:00 PM', arrival: '06:15 PM', buses: 1, status: 'delayed' },
];

const MESS_MENU = {
  breakfast: ['Poha + Jalebi', 'Bread Butter', 'Tea / Coffee', 'Boiled Eggs'],
  lunch: ['Dal Tadka', 'Jeera Rice', 'Roti (3)', 'Mixed Veg', 'Salad', 'Buttermilk'],
  dinner: ['Paneer Butter Masala', 'Naan (2)', 'Dal Makhani', 'Pulao', 'Sweet (Kheer)'],
  timings: { breakfast: '7:00 – 9:00 AM', lunch: '12:00 – 2:00 PM', dinner: '7:00 – 9:00 PM' },
};

const FEE_RECORDS = [
  { id: 'ENR001', name: 'Arjun Verma', amount: 24000, paid: 24000, due: '2025-04-01', status: 'paid' },
  { id: 'ENR002', name: 'Karan Singh', amount: 24000, paid: 12000, due: '2025-03-15', status: 'partial' },
  { id: 'ENR003', name: 'Rohan Das', amount: 24000, paid: 0, due: '2025-03-10', status: 'overdue' },
  { id: 'ENR004', name: 'Priya Sharma', amount: 24000, paid: 24000, due: '2025-04-01', status: 'paid' },
];

const STUDENTS_PENDING = [
  { id: 'APP001', name: 'Aarav Mehta', gender: 'Male', year: '2nd', req: 'Triple', date: '19 Mar' },
  { id: 'APP002', name: 'Diya Patel', gender: 'Female', year: '1st', req: 'Double', date: '20 Mar' },
  { id: 'APP003', name: 'Raj Choudhary', gender: 'Male', year: '3rd', req: 'Single', date: '20 Mar' },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const ROOM_COLORS = {
  occupied: { bg: '#1C2F1E', border: '#22543D', text: '#6EE7A7', dot: '#10B981' },
  partial: { bg: '#2D1F0E', border: '#744210', text: '#FCD34D', dot: '#F59E0B' },
  vacant: { bg: '#0F1C2D', border: '#1E3A5F', text: '#93C5FD', dot: '#3B82F6' },
  maintenance: { bg: '#1A1A1A', border: '#374151', text: '#9CA3AF', dot: '#6B7280' },
};

const PRIORITY_STYLE = {
  high: { bg: '#2D0A0A', color: '#FCA5A5', border: '#7F1D1D' },
  medium: { bg: '#2D1B00', color: '#FCD34D', border: '#78350F' },
  low: { bg: '#0A1C2D', color: '#93C5FD', border: '#1E3A5F' },
};

const FEE_STATUS_STYLE = {
  paid: { color: '#6EE7A7', bg: '#1C2F1E', label: 'Paid' },
  partial: { color: '#FCD34D', bg: '#2D1F0E', label: 'Partial' },
  overdue: { color: '#FCA5A5', bg: '#2D0A0A', label: 'Overdue' },
};

// ─── MODAL WRAPPER ───────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: `1px solid ${T.border}` }}>
        <span style={{ fontWeight: 700, fontSize: 16, color: T.text }}>{title}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', padding: 4 }}><X size={18} /></button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: 'block', fontSize: 12, color: T.muted, marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>}
    <input {...props} style={{ width: '100%', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: '9px 12px', color: T.text, fontSize: 14, outline: 'none', boxSizing: 'border-box', ...props.style }} />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <label style={{ display: 'block', fontSize: 12, color: T.muted, marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>}
    <select {...props} style={{ width: '100%', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: '9px 12px', color: T.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Btn = ({ children, primary, danger, onClick, style = {} }) => (
  <button onClick={onClick} style={{
    background: primary ? T.accent : danger ? '#7F1D1D' : 'transparent',
    color: primary || danger ? '#fff' : T.muted,
    border: `1px solid ${primary ? T.accent : danger ? '#B91C1C' : T.border}`,
    borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
    transition: 'opacity 0.15s', ...style
  }}>{children}</button>
);

// ─── ROOM BOX ────────────────────────────────────────────────────────────────
const RoomBox = ({ room }) => {
  const c = ROOM_COLORS[room.status] || ROOM_COLORS.vacant;
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: '10px 8px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
      <div style={{ fontWeight: 800, fontSize: 12, color: c.text }}>R-{room.no}</div>
      <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: c.dot, marginTop: 2, fontWeight: 700 }}>{room.status}</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginTop: 6 }}>
        {Array.from({ length: room.cap }).map((_, i) => (
          <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: i < room.filled ? c.dot : c.border }} />
        ))}
      </div>
    </div>
  );
};

// ─── BUILDING CARD ───────────────────────────────────────────────────────────
const BuildingCard = ({ b }) => {
  const [open, setOpen] = useState(true);
  const pct = b.occ;
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: '#1E2D40', borderRadius: 10, padding: 8 }}>
            <Building2 size={18} color={T.accent} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: T.text, fontSize: 14 }}>{b.name}</div>
            <div style={{ fontSize: 11, color: T.muted }}>{b.type}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 60 }}>
            <div style={{ fontSize: 10, color: T.muted, textAlign: 'right', marginBottom: 3 }}>{pct}%</div>
            <div style={{ height: 4, background: T.border, borderRadius: 99 }}>
              <div style={{ height: '100%', width: `${pct}%`, background: pct > 75 ? T.danger : pct > 40 ? T.warning : T.success, borderRadius: 99 }} />
            </div>
          </div>
          <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', padding: 4 }}>
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>
      {open && (
        <div style={{ padding: '16px 18px' }}>
          {b.floors.map((fl, fi) => (
            <div key={fi} style={{ marginBottom: fi < b.floors.length - 1 ? 18 : 0 }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.textDim, fontWeight: 700, marginBottom: 10 }}>
                ● {fl.name}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(72px,1fr))', gap: 8 }}>
                {fl.rooms.map(r => <RoomBox key={r.no} room={r} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── COMPLAINT CARD ──────────────────────────────────────────────────────────
const ComplaintCard = ({ c, onResolve }) => {
  const p = PRIORITY_STYLE[c.priority];
  const ICON_MAP = { plumbing: <Droplets size={13} />, internet: <Wifi size={13} />, maintenance: <Wrench size={13} />, furniture: <Hammer size={13} /> };
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ background: '#1E2D40', borderRadius: 8, padding: 8, flexShrink: 0 }}>
        <span style={{ color: T.accent }}>{ICON_MAP[c.type] || <AlertCircle size={13} />}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: T.text, flex: 1 }}>{c.issue}</span>
          <span style={{ background: p.bg, color: p.color, border: `1px solid ${p.border}`, fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c.priority}</span>
        </div>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 6 }}>Room {c.room} · {c.student}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, color: T.textDim, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />{c.time}</span>
          <button onClick={() => onResolve(c.id)} style={{ background: 'none', border: 'none', color: T.success, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle size={12} /> Resolve
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MESS MENU ───────────────────────────────────────────────────────────────
const MessPanel = () => (
  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflow: 'hidden' }}>
    <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
      <Utensils size={16} color={T.warning} />
      <span style={{ fontWeight: 700, color: T.text, fontSize: 14 }}>Today's Mess Menu</span>
    </div>
    {['breakfast', 'lunch', 'dinner'].map(meal => (
      <div key={meal} style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: meal === 'breakfast' ? '#FCD34D' : meal === 'lunch' ? '#6EE7A7' : '#93C5FD' }}>{meal}</span>
          <span style={{ fontSize: 10, color: T.textDim }}>{MESS_MENU.timings[meal]}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {MESS_MENU[meal].map((item, i) => (
            <span key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 11, color: T.muted, padding: '3px 8px' }}>{item}</span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ─── TRANSPORT ───────────────────────────────────────────────────────────────
const TransportPanel = () => (
  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflow: 'hidden' }}>
    <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
      <Bus size={16} color={T.accent2} />
      <span style={{ fontWeight: 700, color: T.text, fontSize: 14 }}>Transport Schedules</span>
    </div>
    {TRANSPORT.map(t => (
      <div key={t.id} style={{ padding: '12px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: T.text, fontSize: 13 }}>{t.route}</div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>{t.departure} → {t.arrival} · {t.buses} bus{t.buses > 1 ? 'es' : ''}</div>
        </div>
        <span style={{ background: t.status === 'on-time' ? '#1C2F1E' : '#2D1B00', color: t.status === 'on-time' ? T.success : T.warning, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99, textTransform: 'uppercase' }}>
          {t.status}
        </span>
      </div>
    ))}
  </div>
);

// ─── FEE RECORDS ─────────────────────────────────────────────────────────────
const FeePanel = () => (
  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflow: 'hidden' }}>
    <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <DollarSign size={16} color={T.success} />
        <span style={{ fontWeight: 700, color: T.text, fontSize: 14 }}>Fee Status</span>
      </div>
      <button style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 8, padding: '4px 12px', fontSize: 11, color: T.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
        <Download size={11} /> Export
      </button>
    </div>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${T.border}` }}>
            {['Student', 'Amount', 'Due Date', 'Status', 'Receipt'].map(h => (
              <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: T.textDim, fontWeight: 700, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.06em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FEE_RECORDS.map(f => {
            const s = FEE_STATUS_STYLE[f.status];
            return (
              <tr key={f.id} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: '12px 16px', color: T.text, fontWeight: 600 }}>{f.name}<div style={{ fontSize: 10, color: T.textDim }}>{f.id}</div></td>
                <td style={{ padding: '12px 16px', color: T.text }}>₹{f.amount.toLocaleString()}</td>
                <td style={{ padding: '12px 16px', color: T.muted }}>{f.due}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99 }}>{s.label}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button style={{ background: 'none', border: 'none', color: T.accent, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>↓ PDF</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── NOTICES ─────────────────────────────────────────────────────────────────
const NoticesPanel = () => (
  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflow: 'hidden' }}>
    <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
      <Megaphone size={16} color={T.danger} />
      <span style={{ fontWeight: 700, color: T.text, fontSize: 14 }}>Notices & Announcements</span>
    </div>
    {NOTICES.map(n => (
      <div key={n.id} style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontWeight: 700, color: T.text, fontSize: 13 }}>{n.title}</span>
              <span style={{
                background: n.tag === 'admin' ? '#1C2F3A' : n.tag === 'staff' ? '#1C1C3A' : '#2D1F0E',
                color: n.tag === 'admin' ? '#93C5FD' : n.tag === 'staff' ? '#A5B4FC' : '#FCD34D',
                fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase'
              }}>{n.tag}</span>
            </div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{n.body}</div>
          </div>
          <span style={{ fontSize: 10, color: T.textDim, flexShrink: 0, paddingTop: 2 }}>{n.date}</span>
        </div>
      </div>
    ))}
    <div style={{ padding: '12px 18px' }}>
      <button style={{ background: 'none', border: 'none', color: T.accent, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>+ Publish New Notice</button>
    </div>
  </div>
);

// ─── PENDING APPLICATIONS ────────────────────────────────────────────────────
const PendingPanel = () => (
  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflow: 'hidden' }}>
    <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <FileText size={16} color={T.warning} />
        <span style={{ fontWeight: 700, color: T.text, fontSize: 14 }}>Pending Applications</span>
        <span style={{ background: '#2D1B00', color: T.warning, borderRadius: 99, fontSize: 11, fontWeight: 700, padding: '1px 9px' }}>{STUDENTS_PENDING.length}</span>
      </div>
    </div>
    {STUDENTS_PENDING.map(s => (
      <div key={s.id} style={{ padding: '12px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#1E2D40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: T.accent, flexShrink: 0 }}>
          {s.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: T.text, fontSize: 13 }}>{s.name}</div>
          <div style={{ fontSize: 11, color: T.muted }}>{s.gender} · {s.year} Year · {s.req} Room · {s.date}</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={{ background: '#1C2F1E', border: '1px solid #22543D', color: T.success, borderRadius: 7, padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>✓ Approve</button>
          <button style={{ background: '#2D0A0A', border: '1px solid #7F1D1D', color: '#FCA5A5', borderRadius: 7, padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>✕ Reject</button>
        </div>
      </div>
    ))}
  </div>
);

// ─── STATS BAR ───────────────────────────────────────────────────────────────
const STATS = [
  { label: 'Total Beds', value: '450', sub: '+12 new', icon: Building2, color: T.accent, bg: '#0F1C2D' },
  { label: 'Current Students', value: '342', sub: '76% capacity', icon: Users, color: T.success, bg: '#0A1F12' },
  { label: 'Pending Requests', value: '12', sub: '3 urgent', icon: UserPlus, color: T.warning, bg: '#1C1400' },
  { label: 'Staff on Duty', value: '8', sub: '2 leave today', icon: Hammer, color: '#A78BFA', bg: '#1A1230' },
  { label: 'Occupancy Rate', value: '76%', sub: '↑ 4% this week', icon: TrendingUp, color: T.success, bg: '#0A1F12' },
  { label: 'Open Complaints', value: '5', sub: '2 high priority', icon: AlertCircle, color: T.danger, bg: '#1F0A0A' },
];

// ─── MODALS ──────────────────────────────────────────────────────────────────
const AddStudentModal = ({ onClose }) => {
  const [form, setForm] = useState({ name: '', roll: '', gender: 'Male', year: '1st', hostel: '', room: '', email: '', phone: '' });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const addStudent = async () => {
    const data = { 
      name: form.name ,
      roll: form.roll,
      gender: form.gender,
      year: form.year,
      room: form.year,
      email: form.email,
      phone: form.phone
    }

    try{
      const res = await fetch("http://localhost:3000/api/hostel/addstudents",{
        method:"POST",
        credentials:"include",
        body:JSON.stringify(data),
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        }
      })
      const studentRes=await res.json();
      console.log(studentRes);
    }catch(e){
      console.log("error:",e);
    }
  }
  return (
    <Modal title="Add New Student" onClose={onClose}>
      <Input label="Full Name" value={form.name} onChange={e => f('name', e.target.value)} placeholder="e.g. Arjun Verma" />
      <Input label="Roll Number / Enroll ID" value={form.roll} onChange={e => f('roll', e.target.value)} placeholder="e.g. 22CS101" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Select label="Gender" value={form.gender} onChange={e => f('gender', e.target.value)} options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }]} />
        <Select label="Year" value={form.year} onChange={e => f('year', e.target.value)} options={['1st', '2nd', '3rd', '4th'].map(y => ({ value: y, label: y + ' Year' }))} />
      </div>
      <Select label="Hostel Block" value={form.hostel} onChange={e => f('hostel', e.target.value)} options={[{ value: '', label: 'Select Block' }, { value: 'A', label: 'Sunrise Block A (Boys)' }, { value: 'B', label: 'Moonlight Block B (Girls)' }]} />
      <Input label="Room Preference" value={form.room} onChange={e => f('room', e.target.value)} placeholder="e.g. Single / Double / Triple" />
      <Input label="Email" value={form.email} onChange={e => f('email', e.target.value)} placeholder="roll@hostel.edu" />
      <Input label="Phone" value={form.phone} onChange={e => f('phone', e.target.value)} placeholder="+91 9876543210" />
      <div style={{ display: 'flex', gap: 10, marginTop: 8, justifyContent: 'flex-end' }}>
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn primary onClick={addStudent} type="submit">Register Student</Btn>
      </div>
    </Modal>
  );
};

const AddComplaintModal = ({ onClose }) => {
  const [form, setForm] = useState({ room: '', student: '', type: 'plumbing', priority: 'medium', desc: '' });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <Modal title="Submit Complaint" onClose={onClose}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Room Number" value={form.room} onChange={e => f('room', e.target.value)} placeholder="e.g. 204" />
        <Input label="Student Name" value={form.student} onChange={e => f('student', e.target.value)} placeholder="Reported by" />
      </div>
      <Select label="Complaint Type" value={form.type} onChange={e => f('type', e.target.value)}
        options={[{ value: 'plumbing', label: 'Plumbing' }, { value: 'internet', label: 'Internet / Wi-Fi' }, { value: 'maintenance', label: 'Maintenance' }, { value: 'furniture', label: 'Furniture' }, { value: 'electrical', label: 'Electrical' }, { value: 'food', label: 'Food / Mess' }, { value: 'other', label: 'Other' }]} />
      <Select label="Priority" value={form.priority} onChange={e => f('priority', e.target.value)}
        options={[{ value: 'high', label: 'High — Urgent' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }]} />
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 12, color: T.muted, marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
        <textarea value={form.desc} onChange={e => f('desc', e.target.value)} placeholder="Describe the issue in detail..." rows={4}
          style={{ width: '100%', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: '9px 12px', color: T.text, fontSize: 14, outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn primary onClick={onClose}>Submit Complaint</Btn>
      </div>
    </Modal>
  );
};

const AddWorkerModal = ({ onClose }) => {
  const [form, setForm] = useState({ name: '', dept: '', shift: 'Morning', contact: '', role: 'Housekeeping' });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <Modal title="Add Staff / Worker" onClose={onClose}>
      <Input label="Full Name" value={form.name} onChange={e => f('name', e.target.value)} placeholder="e.g. Ramesh Kumar" />
      <Select label="Role" value={form.role} onChange={e => f('role', e.target.value)}
        options={['Housekeeping', 'Security Guard', 'Plumber', 'Electrician', 'Gardener', 'Warden Assistant'].map(r => ({ value: r, label: r }))} />
      <Select label="Shift" value={form.shift} onChange={e => f('shift', e.target.value)}
        options={['Morning (6AM–2PM)', 'Afternoon (2PM–10PM)', 'Night (10PM–6AM)'].map(s => ({ value: s, label: s }))} />
      <Input label="Contact Number" value={form.contact} onChange={e => f('contact', e.target.value)} placeholder="+91 9876543210" />
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn primary onClick={onClose}>Add Staff</Btn>
      </div>
    </Modal>
  );
};

// ─── NAV ITEMS ───────────────────────────────────────────────────────────────
const NAV = [
  { key: 'overview', label: 'Overview', icon: Home },
  { key: 'buildings', label: 'Buildings', icon: Building2 },
  { key: 'complaints', label: 'Complaints', icon: AlertCircle },
  { key: 'mess', label: 'Mess Menu', icon: Utensils },
  { key: 'transport', label: 'Transport', icon: Bus },
  { key: 'fees', label: 'Fee Status', icon: DollarSign },
  { key: 'notices', label: 'Notices', icon: Megaphone },
  { key: 'pending', label: 'Applications', icon: FileText },
];

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function HIVEDashboard() {
  const [tab, setTab] = useState('overview');
  const [modal, setModal] = useState(null);
  const [complaints, setComplaints] = useState(COMPLAINTS);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');
  useEffect(() => {
    const hostelData = async () => {
      const res = await fetch("http://localhost:3000/api/hostel/dashboard", {
        method: "GET",
        credentials: "include"
      })
      // if()
      const response = await res.json();
      console.log(response);
      if (response.msg === "unautherized") navigation("http://localhost:5173/login/hostel")
    }
    hostelData();
  }, [])
  const resolveComplaint = (id) => setComplaints(prev => prev.filter(c => c.id !== id));

  const SIDEBAR_W = sidebarOpen ? 220 : 64;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: T.bg, fontFamily: '"Inter",system-ui,sans-serif', color: T.text }}>
      {/* MODAL LAYER */}
      {modal === 'student' && <AddStudentModal onClose={() => setModal(null)} />}
      {modal === 'complaint' && <AddComplaintModal onClose={() => setModal(null)} />}
      {modal === 'worker' && <AddWorkerModal onClose={() => setModal(null)} />}

      {/* SIDEBAR */}
      <div style={{ width: SIDEBAR_W, flexShrink: 0, background: T.surface, borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', transition: 'width 0.2s', overflow: 'hidden', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '16px 14px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ background: `linear-gradient(135deg,${T.accent},${T.accent2})`, borderRadius: 9, padding: 7, flexShrink: 0 }}>
            <Home size={15} color="#fff" />
          </div>
          {sidebarOpen && <span style={{ fontWeight: 900, fontSize: 15, letterSpacing: '-0.02em', background: `linear-gradient(90deg,${T.accent},${T.accent2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>HIVE</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: T.muted, cursor: 'pointer', flexShrink: 0 }}>
            <Menu size={15} />
          </button>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
          {NAV.map(n => {
            const Icon = n.icon;
            const active = tab === n.key;
            return (
              <button key={n.key} onClick={() => setTab(n.key)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, marginBottom: 2, cursor: 'pointer',
                  background: active ? '#1E2D40' : 'none', border: active ? `1px solid ${T.border}` : '1px solid transparent',
                  color: active ? T.accent : T.muted, fontWeight: active ? 700 : 500, fontSize: 13, transition: 'all 0.15s', textAlign: 'left'
                }}>
                <Icon size={15} style={{ flexShrink: 0 }} />
                {sidebarOpen && n.label}
                {n.key === 'complaints' && complaints.filter(c => c.priority === 'high').length > 0 && sidebarOpen && (
                  <span style={{ marginLeft: 'auto', background: T.danger, color: '#fff', borderRadius: 99, fontSize: 9, fontWeight: 800, padding: '1px 6px' }}>
                    {complaints.filter(c => c.priority === 'high').length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '12px 8px', borderTop: `1px solid ${T.border}`, flexShrink: 0 }}>
          {[{ icon: Settings, label: 'Settings' }, { icon: HelpCircle, label: 'Help' }, { icon: LogOut, label: 'Sign Out', color: '#FCA5A5' }].map(i => {
            const Icon = i.icon;
            return (
              <button key={i.label} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, marginBottom: 2, cursor: 'pointer', background: 'none', border: 'none', color: i.color || T.muted, fontSize: 13 }}>
                <Icon size={15} style={{ flexShrink: 0 }} />
                {sidebarOpen && i.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* TOPBAR */}
        <header style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0, position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ flex: 1, position: 'relative', maxWidth: 360 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.textDim }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search rooms, students, complaints…"
              style={{ width: '100%', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 9, padding: '7px 12px 7px 34px', color: T.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <button onClick={() => setModal('student')}
              style={{ background: `linear-gradient(135deg,${T.accent},${T.accent2})`, border: 'none', borderRadius: 9, padding: '7px 16px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <UserPlus size={13} /> Add Student
            </button>
            <button onClick={() => setModal('complaint')}
              style={{ background: '#2D0A0A', border: `1px solid #7F1D1D`, borderRadius: 9, padding: '7px 14px', color: '#FCA5A5', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertCircle size={13} /> File Complaint
            </button>
            <button onClick={() => setModal('worker')}
              style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 9, padding: '7px 14px', color: T.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Briefcase size={13} /> Add Worker
            </button>
            <div style={{ width: 1, height: 28, background: T.border, margin: '0 4px' }} />
            <button style={{ position: 'relative', background: 'none', border: 'none', color: T.muted, cursor: 'pointer', padding: 6 }}>
              <Bell size={17} />
              <span style={{ position: 'absolute', top: 5, right: 5, width: 7, height: 7, background: T.danger, borderRadius: '50%', border: `2px solid ${T.surface}` }} />
            </button>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg,${T.accent},${T.accent2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', cursor: 'pointer' }}>AD</div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

          {/* PAGE TITLE */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: T.text }}>
              {NAV.find(n => n.key === tab)?.label || 'Dashboard'}
            </h1>
            <p style={{ fontSize: 13, color: T.muted, margin: '4px 0 0' }}>
              Hostel Integrated Virtual Environment · Admin Portal
            </p>
          </div>

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12, marginBottom: 24 }}>
                {STATS.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ background: s.bg, borderRadius: 9, padding: 8 }}>
                          <Icon size={15} color={s.color} />
                        </div>
                        <ArrowUpRight size={12} color={T.textDim} />
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: T.text, letterSpacing: '-0.02em' }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{s.label}</div>
                      <div style={{ fontSize: 10, color: s.color, marginTop: 4, fontWeight: 700 }}>{s.sub}</div>
                    </div>
                  );
                })}
              </div>

              {/* Room Legend */}
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '12px 18px', marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: T.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Room Legend:</span>
                {Object.entries(ROOM_COLORS).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: v.bg, border: `1px solid ${v.border}` }} />
                    <span style={{ fontSize: 11, color: v.text, textTransform: 'capitalize' }}>{k}</span>
                  </div>
                ))}
              </div>

              {/* Two-col layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {BUILDINGS.map(b => <BuildingCard key={b.id} b={b} />)}
                  <div onClick={() => { }} style={{ background: T.card, border: `2px dashed ${T.border}`, borderRadius: 16, padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', color: T.textDim, minHeight: 150 }}>
                    <Plus size={28} />
                    <span style={{ fontSize: 14, fontWeight: 700 }}>Add New Building</span>
                    <span style={{ fontSize: 12 }}>Configure floors and rooms</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Complaints summary */}
                  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflow: 'hidden' }}>
                    <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AlertCircle size={15} color={T.danger} />
                        <span style={{ fontWeight: 700, fontSize: 14 }}>Open Issues</span>
                        <span style={{ background: '#1F0A0A', color: T.danger, borderRadius: 99, fontSize: 10, fontWeight: 800, padding: '1px 8px' }}>{complaints.length}</span>
                      </div>
                      <button onClick={() => setTab('complaints')} style={{ fontSize: 11, color: T.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>View All</button>
                    </div>
                    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {complaints.slice(0, 3).map(c => <ComplaintCard key={c.id} c={c} onResolve={resolveComplaint} />)}
                    </div>
                  </div>
                  <NoticesPanel />
                </div>
              </div>
            </>
          )}

          {tab === 'buildings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
                {BUILDINGS.map(b => <BuildingCard key={b.id} b={b} />)}
                <div onClick={() => { }} style={{ background: T.card, border: `2px dashed ${T.border}`, borderRadius: 16, padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', color: T.textDim }}>
                  <Plus size={26} /><span style={{ fontWeight: 700 }}>Add Building</span>
                </div>
              </div>
            </div>
          )}

          {tab === 'complaints' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
                <button onClick={() => setModal('complaint')}
                  style={{ background: `linear-gradient(135deg,${T.danger},#B91C1C)`, border: 'none', borderRadius: 9, padding: '8px 18px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Plus size={13} /> File New Complaint
                </button>
              </div>
              {complaints.length === 0 && (
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 48, textAlign: 'center', color: T.muted }}>
                  <CheckCircle size={32} color={T.success} style={{ marginBottom: 12 }} />
                  <div style={{ fontWeight: 700, fontSize: 15 }}>All complaints resolved!</div>
                </div>
              )}
              {complaints.map(c => <ComplaintCard key={c.id} c={c} onResolve={resolveComplaint} />)}
            </div>
          )}

          {tab === 'mess' && <MessPanel />}
          {tab === 'transport' && <TransportPanel />}
          {tab === 'fees' && <FeePanel />}
          {tab === 'notices' && <NoticesPanel />}
          {tab === 'pending' && <PendingPanel />}
        </main>
      </div>
    </div>
  );
}