import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const TransportSchedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
 const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    const { data, error } = await supabase
      .from("transport_schedule")
      .select("*")
      .order("day", { ascending: true });

    if (error) {
        console.log(error);
    }
      else {setScheduleData(data);}
      setLoading(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading Schedule...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-5 font-sans">
      <h2 className="text-xl font-bold text-gray-800 mb-5">Bus Schedule</h2>

      <div className="w-full max-w-5xl overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-sm">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wider px-3 py-3 border border-gray-200">Day</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wider px-3 py-3 border border-gray-200">Time</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wider px-3 py-3 border border-gray-200">Route</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wider px-3 py-3 border border-gray-200">Students</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wider px-3 py-3 border border-gray-200">Buses</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wider px-3 py-3 border border-gray-200">Batch</th>
            </tr>
          </thead>
          <tbody>
            {scheduleData.map((row, index) => (
              <tr
                key={row.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="text-sm text-gray-700 font-bold px-3 py-2.5 border border-gray-200">{row.day}</td>
                <td className="text-sm text-gray-700 px-3 py-2.5 border border-gray-200">{row.time_range}</td>
                <td className="text-sm text-gray-700 px-3 py-2.5 border border-gray-200">{row.route}</td>
                <td className="text-sm text-gray-700 px-3 py-2.5 border border-gray-200">{row.student_count}</td>
                <td className="text-sm text-gray-700 px-3 py-2.5 border border-gray-200">{row.bus_count}</td>
                <td className="text-sm text-gray-700 px-3 py-2.5 border border-gray-200">{row.batch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
  export default TransportSchedule;