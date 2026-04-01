import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const EditModal = ({ row, onClose, onSaved,fetchSchedule }) => {
  
  const [form, setForm] = useState({ ...row });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
 
    try {
      const res = await fetch("http://localhost:3000/api/transport/update_bus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials:'include',
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update");
      }

      const updated = await res.json();
      onSaved(updated);
      await fetchSchedule();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const fields = [
    { name: "date", label: "Date", type: "date" },
    { name: "day", label: "Day", type: "text", placeholder: "e.g. Monday" },
    { name: "start_time", label: "Start Time", type: "time" },
    { name: "end_time", label: "End Time", type: "time" },
    { name: "pickup", label: "Pickup Location", type: "text" },
    { name: "destination", label: "Destination", type: "text" },
    { name: "student_count", label: "Student Count", type: "number", min: 0 },
    { name: "batch", label: "Batch", type: "text", placeholder: "e.g. A1" },
    { name: "bus_count", label: "Bus Count", type: "number", min: 0},
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
      onClick={handleBackdrop}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        
        <div className="sticky top-0 z-10 bg-slate-900 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">✎</span>
            <div>
              <h2 className="text-sm font-black text-white tracking-wider uppercase">Edit Schedule</h2>
              <p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase mt-0.5">
                Batch: {row.batch} · ID #{row.transport_id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors text-base font-bold"
          >
            ×
          </button>
        </div>

        
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.name === "pickup" || field.name === "destination" ? "col-span-2" : "col-span-1"}
              >
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.12em] mb-1.5">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name] ?? ""}
                  onChange={handleChange}
                  placeholder={field.placeholder || ""}
                  min={field.min}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-900 text-sm font-semibold
                    focus:outline-none focus:border-slate-900 focus:bg-white transition-all
                    placeholder:text-slate-300 placeholder:font-normal"
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <span className="text-red-500 text-sm">⚠</span>
              <p className="text-xs font-bold text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 text-xs font-black text-slate-600
                hover:border-slate-300 hover:bg-slate-50 transition-all tracking-wider uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 text-xs font-black text-white
                hover:bg-slate-700 active:scale-95 transition-all tracking-wider uppercase
                disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
                flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TransportSchedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState(null);

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this schedule?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("transport")
      .delete()
      .eq("transport_id", id);

    if (error) {
      alert("Error deleting record: " + error.message);
    } else {
      setScheduleData(scheduleData.filter((item) => item.transport_id !== id));
    }
  };

  const handleEdit = (row) => {
    setEditingRow(row);
  };

  const handleSaved = (updatedRow) => {
    setScheduleData((prev) =>
      prev.map((item) =>
        item.transport_id === updatedRow.transport_id ? updatedRow : item
      )
    );
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
      <div className="max-w-7xl mx-auto">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-xl shadow-lg shadow-slate-900/20">
              🚌
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Bus Schedule Admin Dashboard
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
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Batch</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scheduleData.map((row) => (
                    <tr key={row.transport_id} className="hover:bg-blue-50/40 transition-colors duration-150 group">
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-slate-800">{formatDate(row.date)}</div>
                        <div className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">{row.day}</div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-100 text-slate-800 font-bold px-2 py-1 rounded text-xs font-mono">
                            {row.start_time?.slice(0, 5)}
                          </span>
                          <span className="text-slate-300">→</span>
                          <span className="bg-slate-100 text-slate-800 font-bold px-2 py-1 rounded text-xs font-mono">
                            {row.end_time?.slice(0, 5)}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="text-[11px] font-bold text-slate-700 uppercase">{row.pickup}</div>
                        <div className="text-[11px] font-medium text-slate-400">to {row.destination}</div>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <div className="text-sm font-black text-slate-900">{row.student_count}</div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase">Students</div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="px-2 py-1 rounded-md text-[10px] font-black bg-slate-900 text-white uppercase">
                          {row.batch}
                        </span>
                      </td>

                      {/* ACTIONS COLUMN */}
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(row)}
                            className="p-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            ✎
                          </button>

                          <button
                            onClick={() => handleDelete(row.transport_id)}
                            className="p-2 text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            🗑
                          </button>
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

      {/* Edit Modal */}
      {editingRow && (
        <EditModal
          row={editingRow}
          onClose={() => setEditingRow(null)}
          onSaved={handleSaved}
          fetchSchedule={fetchSchedule}
        />
      )}
    </div>
  );
};

export default TransportSchedule;