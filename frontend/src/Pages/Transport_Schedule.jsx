import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const TransportSchedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("transport")
      .select("*")
      .gte("date", today)
      .order("date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      console.log(error);
    } else {
      setScheduleData(data);
    }
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl animate-bounce">🚌</span>
          <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">Loading Schedule…</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-xl shadow-lg shadow-slate-900/20">
              🚌
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Bus Schedule Dashboard
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 font-semibold tracking-widest uppercase">
                Real-time upcoming transport logs
              </p>
            </div>
          </div>
          <button
            onClick={fetchSchedule}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 rounded-xl shadow-md shadow-slate-900/20 hover:bg-slate-700 active:scale-95 transition-all tracking-wider uppercase"
          >
            <span className="text-base">↻</span> Refresh Data
          </button>
        </div>

        {scheduleData.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl py-24 text-center">
            <span className="text-6xl mb-6 block">🚏</span>
            <h3 className="text-xl font-bold text-slate-800">No trips scheduled</h3>
            <p className="text-slate-400 mt-2 max-w-xs mx-auto text-sm">
              There are no bus schedules planned from today onwards.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100 bg-slate-50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Date & Day</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Time Window</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Route Details</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-center">Capacity</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-center">Buses</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Batch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scheduleData.map((row) => (
                    <tr
                      key={row.transport_id}
                      className="hover:bg-blue-50/40 transition-colors duration-150 group"
                    >
                      {/* Date & Day */}
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-slate-800">{formatDate(row.date)}</div>
                        <div className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">{row.day}</div>
                      </td>

                      {/* Time Window */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-1.5 rounded-lg text-xs font-mono tracking-tight">
                            {row.start_time?.slice(0, 5)}
                          </span>
                          <span className="text-slate-300 font-bold text-sm">→</span>
                          <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-1.5 rounded-lg text-xs font-mono tracking-tight">
                            {row.end_time?.slice(0, 5)}
                          </span>
                        </div>
                      </td>

                      {/* Route Details */}
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                             <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight truncate max-w-[150px]">
                               {row.pickup}
                             </span>
                          </div>
                          <div className="ml-[3px] w-[1px] h-3 bg-slate-200"></div>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                             <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate max-w-[150px]">
                               {row.destination}
                             </span>
                          </div>
                        </div>
                      </td>

                      {/* Capacity */}
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <span className="text-xl font-black text-slate-900">{row.student_count}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">students</span>
                        </div>
                      </td>

                      {/* Buses */}
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <span className="text-xl font-black text-slate-900">{row.bus_count}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                            {row.bus_count === 1 ? "bus" : "buses"}
                          </span>
                        </div>
                      </td>

                      {/* Batch */}
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-black bg-slate-900 text-white uppercase tracking-widest shadow-sm">
                          {row.batch}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {scheduleData.length} trip{scheduleData.length !== 1 ? "s" : ""} upcoming
              </p>
              <p className="text-[10px] text-slate-300 font-semibold uppercase tracking-widest">
                End of Schedule
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="h-px w-16 bg-slate-200"></div>
          <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.25em]">
            Transport Dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransportSchedule;