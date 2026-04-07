import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:3000/api";

// ─── FEE REQUEST PAGE ────────────────────────────────────────────────────────
export   function FeeRequestPage() {
  const student = JSON.parse(localStorage.getItem("student") || "{}");

  const [form, setForm]       = useState({ fees_paid: "", due_date: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post(`${API}/fee/create`, {
        enroll_id:  student.enroll_id,
        hostel_id:  String(student.hostel_id),
        fees_paid:  Number(form.fees_paid),
        due_date:   form.due_date,
      });

      if (res.data.error) throw new Error(res.data.error);

      setMessage({ type: "success", text: "Fee payment request submitted! Admin will confirm receipt." });
      setForm({ fees_paid: "", due_date: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 text-sm text-gray-800 bg-white border border-gray-300 rounded focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition placeholder-gray-400";
  const labelClass = "block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-14 px-4">
      <div className="w-full max-w-xl">

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Hostel Management</p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Submit Fee Payment</h1>
          <p className="text-sm text-gray-500 mt-1">Notify the admin that you've paid your hostel fee</p>
          <div className="mt-3 h-px bg-gray-200" />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">

          {message.text && (
            <div className={`mx-6 mt-6 px-4 py-3 rounded text-sm border ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}>
              <span className="font-medium">{message.type === "success" ? "Success — " : "Error — "}</span>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">

            {/* Student info */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Student Details</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Name</label>
                  <div className="px-3 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded">{student.name || "—"}</div>
                </div>
                <div>
                  <label className={labelClass}>Enrollment ID</label>
                  <div className="px-3 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded">{student.enroll_id || "—"}</div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Payment info */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Payment Details</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fees_paid" className={labelClass}>Amount Paid (₹)</label>
                  <input
                    type="number" id="fees_paid" min="1"
                    value={form.fees_paid} required
                    onChange={e => setForm({ ...form, fees_paid: e.target.value })}
                    className={inputClass} placeholder="e.g. 5000"
                  />
                </div>
                <div>
                  <label htmlFor="due_date" className={labelClass}>Due Date</label>
                  <input
                    type="date" id="due_date"
                    value={form.due_date} required
                    onChange={e => setForm({ ...form, due_date: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Info note */}
            <div className="flex gap-3 bg-blue-50 border border-blue-100 rounded-lg p-4">
              <span className="text-blue-400 text-lg flex-shrink-0">ℹ️</span>
              <p className="text-sm text-blue-700">
                After submitting, the admin will verify your payment. Once confirmed, your status will be updated to <strong>Paid</strong> and you can download a receipt.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button type="button"
                onClick={() => setForm({ fees_paid: "", due_date: "" })}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition">
                Clear
              </button>
              <button type="submit" disabled={loading}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition">
                {loading ? (
                  <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>Submitting...</>
                ) : "Submit Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── FEE HISTORY PAGE ────────────────────────────────────────────────────────
export function FeeHistoryPage() {
  const student = JSON.parse(localStorage.getItem("student") || "{}");

  const [fees, setFees]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [message, setMessage]   = useState({ type: "", text: "" });
  const [filter, setFilter]     = useState("All");

  useEffect(() => { fetchFees(); }, []);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/fee/status?enroll_id=${student.enroll_id}`);
      if (res.data.error) throw new Error(res.data.error);
      setFees(res.data.payments || []);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = (fee_id) => {
    // Opens the receipt HTML in a new tab — user can print/save as PDF
    window.open(`${API}/fee/receipt/${fee_id}`, "_blank");
  };

  const filtered = filter === "All" ? fees : fees.filter(f => f.status === filter);

  const totalPaid = fees.filter(f => f.status === "paid").reduce((s, f) => s + Number(f.amount), 0);
  const totalDue  = fees.filter(f => f.status !== "paid").reduce((s, f) => s + Number(f.amount), 0);

  const statusStyle = (status) => {
    switch (status) {
      case "paid":    return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "unpaid":  return "bg-red-100 text-red-800";
      default:        return "bg-gray-100 text-gray-700";
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case "paid":    return "✓ Paid";
      case "pending": return "⏳ Pending Confirmation";
      case "unpaid":  return "✗ Unpaid";
      default:        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Hostel Management</p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Fee History</h1>
          <p className="text-sm text-gray-500 mt-1">
            {student.name} · ID: {student.enroll_id}
          </p>
          <div className="mt-3 h-px bg-gray-200" />
        </div>

        {message.text && (
          <div className={`mb-6 px-4 py-3 rounded text-sm border ${
            message.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
          }`}>{message.text}</div>
        )}

        {/* Summary cards */}
        {!loading && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Paid",     value: `₹${totalPaid.toLocaleString("en-IN")}`, color: "text-green-700", bg: "bg-green-50 border-green-200" },
              { label: "Total Due",      value: `₹${totalDue.toLocaleString("en-IN")}`,  color: totalDue > 0 ? "text-red-700" : "text-gray-500",    bg: totalDue > 0 ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200" },
              { label: "Total Records",  value: fees.length,                              color: "text-gray-900",  bg: "bg-white border-gray-200" },
            ].map(s => (
              <div key={s.label} className={`border rounded-lg p-4 ${s.bg}`}>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap items-center">
          {["All", "paid", "pending", "unpaid"].map(tab => (
            <button key={tab} onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition border capitalize ${
                filter === tab
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}>
              {tab === "All" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                filter === tab ? "bg-white text-gray-900" : "bg-gray-100 text-gray-600"
              }`}>
                {tab === "All" ? fees.length : fees.filter(f => f.status === tab).length}
              </span>
            </button>
          ))}
          <button onClick={fetchFees} className="ml-auto px-4 py-2 text-sm text-gray-500 border border-gray-200 bg-white rounded-full hover:bg-gray-50 transition">
            ↻ Refresh
          </button>
        </div>

        {/* Fee list */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4" />
            <p className="text-gray-500">Loading fee records...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <p className="text-4xl mb-3">💳</p>
            <p className="text-gray-700 font-medium">
              {filter === "All" ? "No fee records yet" : `No ${filter} records`}
            </p>
            {filter === "All" && (
              <p className="text-gray-400 text-sm mt-1">Submit a payment using the Fee Payment form</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(f => (
              <div key={f.fee_id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      ₹{Number(f.amount).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Due: {new Date(f.due_date).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                      {f.paid_date && ` · Paid: ${new Date(f.paid_date).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle(f.status)}`}>
                      {statusLabel(f.status)}
                    </span>
                    {/* Download receipt only when paid */}
                    {f.status === "paid" && (
                      <button
                        onClick={() => downloadReceipt(f.fee_id)}
                        className="px-4 py-2 text-xs font-semibold text-white bg-gray-900 rounded hover:bg-gray-700 transition flex items-center gap-1.5"
                      >
                        ↓ Receipt
                      </button>
                    )}
                  </div>
                </div>

                {/* Pending confirmation message */}
                {f.status === "pending" && (
                  <div className="px-5 py-3 bg-yellow-50 border-t border-yellow-100">
                    <p className="text-xs text-yellow-700">
                      ⏳ Your payment is awaiting confirmation from the admin
                    </p>
                  </div>
                )}

                {/* Unpaid reminder */}
                {f.status === "unpaid" && (
                  <div className="px-5 py-3 bg-red-50 border-t border-red-100">
                    <p className="text-xs text-red-700">
                      ⚠️ Payment not received. Please contact the hostel office.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default FeeRequestPage;