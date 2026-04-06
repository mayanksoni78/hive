import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const ComplainDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try{
       setLoading(true);
        const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }
     setComplaints(data)
    }
    catch(error){
    console.error("error fetching",error)
   }
   finally{
    setLoading(false)
   }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Complaints Dashboard
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Loading complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No complaints found</p>
          </div>
        ) : (
          <div>
            <div className="mb-6 px-2">
              <p className="text-lg text-gray-600">
                Total Complaints: <span className="font-bold text-gray-900">{complaints.length}</span>
              </p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Enroll ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Room</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                   
                    {complaints.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {/* ✅ Fixed: was c.date (doesn't exist) → using created_at */}
                          {new Date(c.created_at).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric"
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {c.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {c.enroll_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {/* ✅ Fixed: was c.day (doesn't exist) → using room_no */}
                          {c.room_no}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {/* ✅ Fixed: was c.complaint_type → correct column is complain_type */}
                          {c.complain_type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                          {c.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={c.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusStyles = {
    Resolved: "bg-green-100 text-green-800",
    resolved: "bg-green-100 text-green-800",
    Pending:  "bg-yellow-100 text-yellow-800",
    pending:  "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
  };

  return (
    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
      {status || "Pending"}
    </span>
  );
};

export default ComplainDashboard;