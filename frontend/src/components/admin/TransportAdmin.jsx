import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function TransportAdminDashboard() {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch buses
  const fetchBuses = async (selectedDate) => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("transport")
        .select("*")
        .eq("date", selectedDate);

      if (error) throw error;

      setBuses(data || []);
      console.log("Fetched buses:", data);
    } catch (error) {
      console.log("Failed to get buses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date) fetchBuses(date);
  }, [date]);

  const handleDelete = async (bus) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bus?"
    );
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from("transport")
        .delete()
        .eq("transport_id", bus.transport_id);

      if (error) throw error;

      fetchBuses(date);
    } catch (err) {
      console.log("Delete failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-[#111927] to-gray-800 p-8 text-white">
            <h1 className="text-3xl font-bold tracking-tight">Transport Admin</h1>
            <p className="text-sm text-gray-300 mt-2">
              Manage routes, buses, and daily schedules
            </p>
          </div>

          {/* DATE + ADD */}
          <div className="p-6 flex flex-col sm:flex-row gap-4 items-center bg-white">
            <div className="w-full sm:flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Select Schedule Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#111927] focus:border-[#111927] outline-none transition-all text-gray-700"
              />
            </div>

            <button
              onClick={() => navigate("/add_transport")}
              className="w-full sm:w-auto mt-6 sm:mt-0 bg-[#111927] hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span className="text-xl leading-none">+</span> Add Bus
            </button>
          </div>
        </div>

        {/* CONTENT */}
        {!date ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
            <p className="text-lg font-medium text-gray-500">
              Please select a date above to view schedules
            </p>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#111927]"></div>
          </div>
        ) : buses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
            <p className="text-lg font-medium text-gray-500">
              No buses found for the selected date
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {buses.map((bus) => (
              <div
                key={bus.transport_id}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-extrabold text-xl text-gray-900 leading-tight">
                      {bus.pickup} <span className="text-gray-400 mx-1">→</span> {bus.destination}
                    </h3>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-sm text-gray-700 font-medium mb-5">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {bus.start_time} – {bus.end_time}
                  </div>

                  {/* BADGES */}
                  <div className="flex flex-wrap gap-2 text-sm mb-6">
                    <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full font-semibold">
                     Student: {bus.student_count}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full font-semibold">
                      Buses: {bus.bus_count}
                    </span>
                    <span className="bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-full font-semibold">
                      Batch: {bus.batch}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 mt-auto">
                  <button
                    onClick={() => handleDelete(bus)}
                    className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white py-2.5 rounded-xl font-medium transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete Bus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}