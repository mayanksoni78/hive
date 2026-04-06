import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";


export default function TransportAdminDashboard() {
    const navigate = useNavigate();
    const [buses, setBuses] = useState([]);
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

    // fetch buses by date
    const fetchBuses = async (selectedDate) => {
        if (!selectedDate) return;
       // console.log(selectedDate)
        setLoading(true);
        try {
            const { data, error} = await supabase
                .from("transport")
                .select("*")
                .eq("date",selectedDate)
             
            if (error) throw error;
            setBuses(data);
          
            console.log("Buses",buses)
        }
        catch (error) {
            console.log("Failed to Get Bus",error);
        }
        finally{
            setLoading(false)
        }
    }
        useEffect(() => {
            if (date) fetchBuses(date);
        }, [date]);

        const handleEdit = (bus) => {
            navigate("/admin/edit-bus", { state: { bus } });
        };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ── Page Header Card ── */}
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(17,25,39,0.15)] overflow-hidden border border-slate-200 ring-1 ring-slate-100 mb-6">
          <div className="bg-[#111927] p-8 relative border-b border-[#2a374b]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M8 17l4 4 4-4m-4-5v9M3 9l9-7 9 7M5 9v10a1 1 0 001 1h3m10-11l2 2M5 9l-2 2m14-2v10a1 1 0 01-1 1h-3M9 21h6" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Transport Admin</h1>
                <div className="h-1 w-10 bg-[#4f73b3] mt-2 rounded-full" />
                <p className="text-slate-300 text-xs mt-2 uppercase tracking-widest font-medium">Manage buses &amp; schedules</p>
              </div>
            </div>
            <div className="absolute top-6 right-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">Admin Panel</span>
            </div>
          </div>

          {/* Date + Add Bus row */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-end gap-5">
            {/* Date Selector */}
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                Filter by Date <span className="text-red-400">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#111927] transition-colors">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white transition-all outline-none text-slate-700 font-medium"
                />
              </div>
              <p className="text-xs text-slate-400 font-medium ml-1">
                Select a date to view and manage bus schedules for that day.
              </p>
            </div>

            {/* Add Bus Button */}
            <div className="sm:w-48">
              <button
                onClick={() => navigate("/add_transport")}
                className="w-full flex items-center justify-center gap-2 bg-[#111927] text-white font-bold py-3.5 px-5 rounded-xl hover:bg-[#1a2638] transition-all shadow-lg shadow-[#111927]/30 active:scale-[0.98] text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                Add Bus
              </button>
            </div>
          </div>
        </div>

        {/* ── Bus List ── */}
        {!date ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(17,25,39,0.08)] ring-1 ring-slate-100 overflow-hidden">
            <div className="bg-[#111927] px-6 py-5 border-b border-[#2a374b] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg">🗓️</div>
              <div>
                <h3 className="font-black text-white text-sm tracking-tight">No Date Selected</h3>
                <p className="text-slate-400 text-xs uppercase tracking-widest font-medium">Choose a date to load schedules</p>
              </div>
            </div>
            <div className="p-8 text-center text-slate-400 text-sm font-medium">
              Select a date above to view bus schedules.
            </div>
          </div>
        ) : loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(17,25,39,0.08)] ring-1 ring-slate-100 overflow-hidden">
            <div className="p-8 flex items-center justify-center gap-3 text-slate-500 text-sm font-medium">
              <svg className="animate-spin h-5 w-5 text-[#111927]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading schedules…
            </div>
          </div>
        ) : buses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(17,25,39,0.08)] ring-1 ring-slate-100 overflow-hidden">
            <div className="bg-[#111927] px-6 py-5 border-b border-[#2a374b] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg">🚌</div>
              <div>
                <h3 className="font-black text-white text-sm tracking-tight">No Buses Found</h3>
                <p className="text-slate-400 text-xs uppercase tracking-widest font-medium">No schedules for this date</p>
              </div>
            </div>
            <div className="p-8 text-center text-slate-400 text-sm font-medium">
              No bus schedules exist for the selected date. Click <span className="font-bold text-slate-600">+ Add Bus</span> to create one.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {buses.length} route{buses.length !== 1 ? "s" : ""} found
              </p>
              <p className="text-xs text-slate-400 font-medium">{date}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {buses.map((bus, idx) => {
                const accent = ROUTE_ACCENTS[idx % ROUTE_ACCENTS.length];
                return (
                  <div
                    key={bus.transport_id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(17,25,39,0.08)] overflow-hidden ring-1 ring-slate-100"
                  >
                    {/* Card Header */}
                    <div className="bg-[#111927] px-5 py-4 flex items-center gap-3 border-b border-[#2a374b]">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg shrink-0">
                        🚌
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-white text-sm tracking-tight truncate">
                          {bus.pickup} → {bus.destination}
                        </h3>
                        <p className="text-slate-400 text-xs uppercase tracking-widest font-medium">
                          {bus.start_time} – {bus.end_time}
                        </p>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 shrink-0">
                        Batch {bus.batch}
                      </span>
                    </div>

                    {/* Accent bar */}
                    <div style={{ height: 2, background: accent }} />

                    {/* Body */}
                    <div className="p-5 space-y-4">
                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Pickup", value: bus.pickup, icon: "📍" },
                          { label: "Students", value: bus.student_count, icon: "👥" },
                          { label: "Buses", value: bus.bus_count, icon: "🚌" },
                        ].map(({ label, value, icon }) => (
                          <div key={label} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                            <div className="text-base mb-1">{icon}</div>
                            <div className="text-slate-700 font-black text-sm">{value}</div>
                            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Time row */}
                      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-slate-600 text-sm font-semibold">
                          {bus.start_time} – {bus.end_time}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleEdit(bus)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#111927] text-white text-sm font-bold rounded-xl hover:bg-[#1a2638] transition-all active:scale-[0.98] shadow-md shadow-[#111927]/20"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(bus)}
                          className="px-4 py-2.5 bg-white border border-red-200 text-red-500 font-bold rounded-xl hover:bg-red-50 hover:border-red-300 transition-all active:scale-[0.98] flex items-center gap-1.5 text-sm shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center px-2 mt-8">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">© 2026 HIVE CORE</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">System Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}