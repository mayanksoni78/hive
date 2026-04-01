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
      case "Resolved":    return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "In_Progress": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Closed":      return "bg-slate-100 text-slate-600 border-slate-200";
      case "Pending":     return "bg-amber-50 text-amber-700 border-amber-200";
      default:            return "bg-slate-50 text-slate-700 border-slate-200";
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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-12 px-4 relative overflow-hidden font-sans">
      
      {/* ── AMBIENT BACKGROUND EFFECTS ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/5 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/5 blur-[100px]"></div>
        <div className="absolute inset-0 opacity-[0.015]" 
             style={{ backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, backgroundSize: '24px 24px' }}>
        </div>
      </div>

      {/* Changed max-w-4xl to max-w-6xl below to increase width */}
      <div className="w-full max-w-6xl relative z-10">
        
        {/* Main Container */}
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(17,25,39,0.08)] overflow-hidden border border-slate-200">
          
          {/* ── Header ── */}
          <div className="bg-[#111927] px-8 py-8 text-center relative border-b border-[#2a374b] overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '16px 16px' }}></div>
            <div className="relative z-10 flex flex-col items-center justify-center">
              <h1 className="text-3xl font-black text-white tracking-tight">Complaint Records</h1>
              <p className="text-blue-400/80 text-[11px] mt-2 uppercase tracking-widest font-bold">
                Viewing records for {student.name} • ID: {student.enroll_id}
              </p>
            </div>
          </div>

          {/* ── Body Area ── */}
          <div className="p-6 md:p-8 bg-slate-50/50">
            
            {/* Alert */}
            {message.text && (
              <div className={`mb-6 flex items-center gap-3 p-4 border-l-4 text-[11px] font-bold uppercase tracking-widest rounded-r-xl bg-white shadow-sm ${
                message.type === "success" 
                  ? "border-emerald-500 text-emerald-700" 
                  : "border-red-500 text-red-700"
              }`}>
                {message.type === "success" ? (
                   <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                ) : (
                   <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                )}
                {message.text}
              </div>
            )}

            {/* Filters & Refresh */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "All",         label: "All"         },
                  { key: "Pending",     label: "Pending"     },
                  
                  { key: "Resolved",    label: "Resolved"    },
                  
                ].map(tab => (
                  <button key={tab.key} onClick={() => setFilter(tab.key)}
                    className={`px-4 py-2.5 rounded-xl text-[11px] uppercase tracking-widest font-bold transition-all border ${
                      filter === tab.key
                        ? "bg-[#111927] text-white border-[#111927] shadow-md shadow-[#111927]/10"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}>
                    {tab.label}
                    <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] ${
                      filter === tab.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      {counts[tab.key]}
                    </span>
                  </button>
                ))}
              </div>
              <button onClick={fetchComplaints}
                className="group flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#111927] font-bold rounded-xl shadow-sm transition-all text-[11px] uppercase tracking-widest w-full md:w-auto justify-center">
                <svg className="w-4 h-4 group-active:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Refresh
              </button>
            </div>

            {/* Content List */}
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#111927] mx-auto mb-4" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Retrieving Records...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full mb-4">
                  <span className="text-2xl">📭</span>
                </div>
                <p className="text-sm font-bold text-slate-700">
                  {filter === "All" ? "No records found" : `No ${statusLabel(filter)} records found`}
                </p>
                {filter === "All" && (
                  <p className="text-xs font-medium text-slate-500 mt-2">Submit a new issue using the registration protocol.</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map(c => (
                  <div key={c.complaint_id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">

                    {/* Card header */}
                    <div className="flex items-start md:items-center justify-between px-6 py-5 border-b border-slate-100 flex-col md:flex-row gap-4 md:gap-0">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-2xl shadow-inner">
                          {typeIcon(c.complain_type)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{c.complain_type} Issue</p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">
                            Room {c.room_no} <span className="mx-1">•</span> 
                            {c.date ? new Date(c.date).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "—"}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border ${statusStyle(c.status)}`}>
                        {statusLabel(c.status)}
                      </span>
                    </div>

                    {/* Card body */}
                    <div className="px-6 py-5">
                      <p className="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">{c.description}</p>

                      {/* Admin response */}
                      {c.response && (
                        <div className="mt-5 p-4 bg-blue-50/50 border border-blue-100 rounded-xl relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400"></div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-blue-600 mb-1.5">Admin Update</p>
                          <p className="text-sm text-blue-900 font-medium">{c.response}</p>
                        </div>
                      )}

                      {/* Image Preview */}
                      {c.image_url && (
                        <div className="mt-5 inline-block group relative">
                          <img src={c.image_url} alt="Evidence" 
                            className="h-32 w-auto rounded-xl border border-slate-200 object-cover shadow-sm group-hover:opacity-90 transition-opacity" />
                          <button onClick={() => window.open(c.image_url, "_blank")} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-xl">
                            <span className="bg-white text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest">View Full</span>
                          </button>
                        </div>
                      )}

                      {/* Resolved date */}
                      {c.resolved_date && (
                        <p className="mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          Resolved on {new Date(c.resolved_date).toLocaleDateString("en-IN")}
                        </p>
                      )}
                    </div>

                    {/* Card Footer (Actions) */}
                    {c.status !== "Resolved" && c.status !== "Closed" ? (
                      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                          {c.status === "In_Progress" ? (
                            <><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Under Review by Admin</>
                          ) : (
                            <><span className="w-2 h-2 rounded-full bg-amber-400"></span> Awaiting Admin Action</>
                          )}
                        </div>
                        <button
                          onClick={() => markResolved(c.complaint_id)}
                          disabled={updating === c.complaint_id}
                          className="w-full md:w-auto px-6 py-3 text-[11px] uppercase tracking-widest font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                          {updating === c.complaint_id ? (
                            <><svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>Processing...</>
                          ) : (
                            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Mark as Fixed</>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className={`px-6 py-4 border-t flex items-center gap-2 ${
                        c.status === "Resolved" ? "bg-emerald-50/50 border-emerald-100" : "bg-slate-50 border-slate-100"
                      }`}>
                        {c.status === "Resolved" ? (
                           <><svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">Issue Successfully Resolved</span></>
                        ) : (
                           <><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                           <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Closed by Administration</span></>
                        )}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Branding */}
        <div className="flex justify-between items-center px-4 mt-6">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            © 2026 HIVE CORE SYSTEMS
          </p>
          <div className="flex gap-3 items-center">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </div>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Uplink Active</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyComplaints;