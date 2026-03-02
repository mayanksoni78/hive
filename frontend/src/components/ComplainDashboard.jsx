import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const ComplainDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching complaints:", error);
    } else {
      setComplaints(data);
    }
    setLoading(false);
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
            <div className="text-center py-12">
          <p className="text-lg text-gray-600">Total Complains {complaints.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
         
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Day
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {complaints.map((c) => {
                    const dateObj = new Date(c.created_at);
                  
                    return (
                      <tr key={comp.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {comp.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {comp.day}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {comp.complaint_type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                          {comp.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={comp.status} />
                        </td>
                      </tr>
                    );
                  })}
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
    resolved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span
      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status === "resolved" ? "Resolved" : "Pending"}
    </span>
  );
};

export default ComplainDashboard;