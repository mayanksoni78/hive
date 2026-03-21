import { useEffect, useState } from "react";
import axios from "axios";

const MyComplaints = () => {
  const student = JSON.parse(localStorage.getItem("student") || "{}");

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [updating, setUpdating]     = useState(null);
  const [message, setMessage]       = useState({ type: "", text: "" });
  const [filter, setFilter]         = useState("All");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/complain/my_complains?enroll_id=${student.enroll_id}`
      );
      if (res.data.error) throw new Error(res.data.error);
      setComplaints(res.data.complains || []);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const markResolved = async (complaint_id) => {
    setUpdating(complaint_id);
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/complain/resolve/${complaint_id}`,
        { enroll_id: student.enroll_id }
      );
      if (res.data.error) throw new Error(res.data.error);

      setComplaints(prev =>
        prev.map(c => c.complaint_id === complaint_id
          ? { ...c, status: "Resolved", resolved_date: new Date().toISOString().split("T")[0] }
          : c
        )
      );
      setMessage({ type: "success", text: "Complaint marked as resolved!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setUpdating(null);
    }
  };

  // ✅ Fixed: status values match DB constraint — In_Progress not "In Progress"
  const filtered = filter === "All"
    ? complaints
    : complaints.filter(c => c.status === filter);

  const counts = {
    All:          complaints.length,
    Pending:      complaints.filter(c => c.status === "Pending").length,
    In_Progress:  complaints.filter(c => c.status === "In_Progress").length,
    Resolved:     complaints.filter(c => c.status === "Resolved").length,
    Closed:       complaints.filter(c => c.status === "Closed").length,
  };

  const statusStyle = (status) => {
    switch (status) {
      case "Resolved":    return "bg-green-100 text-green-800";
      case "In_Progress": return "bg-blue-100 text-blue-800";
      case "Closed":      return "bg-gray-200 text-gray-700";
      case "Pending":     return "bg-yellow-100 text-yellow-800";
      default:            return "bg-gray-100 text-gray-700";
    }
  };

  const statusLabel = (status) => {
    if (status === "In_Progress") return "In Progress";
    return status;
  };

  const typeIcon = (type) => {
    switch (type) {
      case "Maintenance": return "🔧";
      case "Food":        return "🍽️";
      case "Transport":   return "🚌";
      case "Other":       return "📋";
      default:            return "📋";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            Hostel Management
          </p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Complaints</h1>
          <p className="text-sm text-gray-500 mt-1">
            Viewing complaints for{" "}
            <span className="font-medium text-gray-700">{student.name}</span>
            {" "}· ID: {student.enroll_id}
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

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: "All",         label: "All"         },
            { key: "Pending",     label: "Pending"     },
            { key: "In_Progress", label: "In Progress" },
            { key: "Resolved",    label: "Resolved"    },
            { key: "Closed",      label: "Closed"      },
          ].map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
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
          <button onClick={fetchComplaints}
            className="ml-auto px-4 py-2 text-sm text-gray-500 border border-gray-200 bg-white rounded-full hover:bg-gray-50 transition">
            ↻ Refresh
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4" />
            <p className="text-gray-500">Loading your complaints...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-gray-700 font-medium">
              {filter === "All" ? "No complaints submitted yet" : `No ${statusLabel(filter)} complaints`}
            </p>
            {filter === "All" && (
              <p className="text-gray-400 text-sm mt-1">Submit a complaint using the complaint form</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(c => (
              <div key={c.complaint_id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">

                {/* Card header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{typeIcon(c.complain_type)}</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{c.complain_type}</p>
                      <p className="text-xs text-gray-400">
                        Room {c.room_no} · {/* ✅ Fixed: uses 'date' not 'created_at' */}
                        {c.date
                          ? new Date(c.date).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })
                          : "—"
                        }
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle(c.status)}`}>
                    {statusLabel(c.status)}
                  </span>
                </div>

                {/* Card body */}
                <div className="px-5 py-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{c.description}</p>

                  {/* Admin response if any */}
                  {c.response && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded text-sm">
                      <p className="text-xs font-semibold text-blue-600 mb-1">Admin Response</p>
                      <p className="text-blue-800">{c.response}</p>
                    </div>
                  )}

                  {/* Image */}
                  {c.image_url && (
                    <img src={c.image_url} alt="complaint"
                      className="mt-3 h-36 w-auto rounded border border-gray-200 object-cover cursor-pointer"
                      onClick={() => window.open(c.image_url, "_blank")} />
                  )}

                  {/* Resolved date */}
                  {c.resolved_date && (
                    <p className="mt-2 text-xs text-gray-400">
                      Resolved on: {new Date(c.resolved_date).toLocaleDateString("en-IN")}
                    </p>
                  )}
                </div>

                {/* Footer */}
                {c.status !== "Resolved" && c.status !== "Closed" ? (
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      {c.status === "In_Progress"
                        ? "🔨 Admin is working on this"
                        : "⏳ Waiting for admin to pick up"}
                    </p>
                    {/* Student can ONLY mark as Resolved — no other changes */}
                    <button
                      onClick={() => markResolved(c.complaint_id)}
                      disabled={updating === c.complaint_id}
                      className="px-4 py-2 text-xs font-semibold text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1.5"
                    >
                      {updating === c.complaint_id ? (
                        <><svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>Updating...</>
                      ) : "✓ Issue Fixed — Mark Resolved"}
                    </button>
                  </div>
                ) : (
                  <div className={`px-5 py-3 border-t ${
                    c.status === "Resolved"
                      ? "bg-green-50 border-green-100"
                      : "bg-gray-50 border-gray-100"
                  }`}>
                    <p className={`text-xs ${c.status === "Resolved" ? "text-green-700" : "text-gray-500"}`}>
                      {c.status === "Resolved" ? "✅ This complaint has been resolved" : "🔒 This complaint has been closed by admin"}
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
};

export default MyComplaints;