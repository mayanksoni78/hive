import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:3000/api";

export default function AdminFeePage() {
  const [fees, setFees]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState(null);
  const [message, setMessage]   = useState({ type: "", text: "" });
  const [filter, setFilter]     = useState("All");
  const [search, setSearch]     = useState("");

  useEffect(() => { fetchAllFees(); }, []);

  const fetchAllFees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/fee/all`);
      if (res.data.error) throw new Error(res.data.error);
      setFees(res.data.fees || []);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (fee_id, status) => {
    setUpdating(fee_id + status);
    try {
      const res = await axios.patch(`${API}/fee/update`, { fee_id, status });
      if (res.data.error) throw new Error(res.data.error);

      setFees(prev => prev.map(f =>
        f.fee_id === fee_id
          ? { ...f, status, paid_date: status === "paid" ? new Date().toISOString().split("T")[0] : null }
          : f
      ));

      setMessage({
        type: "success",
        text: `Fee ${fee_id.slice(0, 8)} marked as ${status}`
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setUpdating(null);
    }
  };

  // Filter + search
  const filtered = fees
    .filter(f => filter === "All" || f.status === filter)
    .filter(f =>
      !search ||
      f.enroll_id?.toLowerCase().includes(search.toLowerCase()) ||
      f.student_name?.toLowerCase().includes(search.toLowerCase())
    );

  const counts = {
    All:     fees.length,
    pending: fees.filter(f => f.status === "pending").length,
    paid:    fees.filter(f => f.status === "paid").length,
    unpaid:  fees.filter(f => f.status === "unpaid").length,
  };

  const totalCollected = fees
    .filter(f => f.status === "paid")
    .reduce((s, f) => s + Number(f.amount), 0);

  const totalPending = fees
    .filter(f => f.status === "pending")
    .reduce((s, f) => s + Number(f.amount), 0);

  const statusStyle = (status) => {
    switch (status) {
      case "paid":    return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "unpaid":  return "bg-red-100 text-red-800";
      default:        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            Admin Panel
          </p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Fee Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review student fee submissions and update payment status
          </p>
          <div className="mt-3 h-px bg-gray-200" />
        </div>

        {/* Alert */}
        {message.text && (
          <div className={`mb-6 px-4 py-3 rounded text-sm border ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}>
            {message.text}
          </div>
        )}

        {/* Summary cards */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Records",    value: fees.length,                                      color: "text-gray-900",  bg: "bg-white" },
              { label: "Pending Review",   value: counts.pending,                                   color: "text-yellow-700", bg: "bg-yellow-50" },
              { label: "Total Collected",  value: `₹${totalCollected.toLocaleString("en-IN")}`,    color: "text-green-700",  bg: "bg-green-50" },
              { label: "Awaiting (₹)",     value: `₹${totalPending.toLocaleString("en-IN")}`,      color: "text-orange-700", bg: "bg-orange-50" },
            ].map(s => (
              <div key={s.label} className={`border border-gray-200 rounded-lg p-4 ${s.bg}`}>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters + Search */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "All",     label: "All"     },
              { key: "pending", label: "Pending" },
              { key: "paid",    label: "Paid"    },
              { key: "unpaid",  label: "Unpaid"  },
            ].map(tab => (
              <button key={tab.key} onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                  filter === tab.key
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}>
                {tab.label}
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  filter === tab.key ? "bg-white text-gray-900" : "bg-gray-100 text-gray-600"
                }`}>
                  {counts[tab.key]}
                </span>
              </button>
            ))}
          </div>

          <div className="flex gap-3 ml-auto">
            <input
              type="text" placeholder="Search by name or ID…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 text-sm border border-gray-200 rounded-full bg-white focus:outline-none focus:border-gray-400 w-56"
            />
            <button onClick={fetchAllFees}
              className="px-4 py-2 text-sm text-gray-500 border border-gray-200 bg-white rounded-full hover:bg-gray-50 transition">
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4" />
            <p className="text-gray-500">Loading fee records...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <p className="text-4xl mb-3">💳</p>
            <p className="text-gray-700 font-medium">No records found</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    {["Student", "Enroll ID", "Amount", "Due Date", "Paid Date", "Status", "Actions"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(f => (
                    <tr key={f.fee_id} className="hover:bg-gray-50 transition-colors">

                      {/* Student name */}
                      <td className="px-5 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {f.student_name || "—"}
                      </td>

                      {/* Enroll ID */}
                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {f.enroll_id}
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                        ₹{Number(f.amount).toLocaleString("en-IN")}
                      </td>

                      {/* Due date */}
                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {f.due_date
                          ? new Date(f.due_date).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })
                          : "—"}
                      </td>

                      {/* Paid date */}
                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {f.paid_date
                          ? new Date(f.paid_date).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })
                          : <span className="text-gray-300">—</span>}
                      </td>

                      {/* Status badge */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusStyle(f.status)}`}>
                          {f.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">

                          {/* Mark as Paid — show when pending or unpaid */}
                          {f.status !== "paid" && (
                            <button
                              onClick={() => updateStatus(f.fee_id, "paid")}
                              disabled={updating === f.fee_id + "paid"}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 transition flex items-center gap-1"
                            >
                              {updating === f.fee_id + "paid" ? (
                                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                </svg>
                              ) : "✓"} Received
                            </button>
                          )}

                          {/* Mark as Not Received — show when pending */}
                          {f.status === "pending" && (
                            <button
                              onClick={() => updateStatus(f.fee_id, "unpaid")}
                              disabled={updating === f.fee_id + "unpaid"}
                              className="px-3 py-1.5 text-xs font-semibold text-white bg-red-500 rounded hover:bg-red-600 disabled:opacity-50 transition flex items-center gap-1"
                            >
                              {updating === f.fee_id + "unpaid" ? (
                                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                </svg>
                              ) : "✗"} Not Received
                            </button>
                          )}

                          {/* View receipt — show when paid */}
                          {f.status === "paid" && (
                            <button
                              onClick={() => window.open(`${API}/fee/receipt/${f.fee_id}`, "_blank")}
                              className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
                            >
                              ↓ Receipt
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
