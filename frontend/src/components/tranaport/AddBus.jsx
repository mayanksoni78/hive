import React, { useState } from "react";
import axios from "axios";

const AddBus = () => {
  const [busDetails, setBusDetails] = useState({
    route: "",
    time_range: "",
    student_count: "",
    bus_count: "",
    batch: "",
    day: "",
    date: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setBusDetails({
      ...busDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(
        "http://localhost:3000/api/transport/add_bus",
        busDetails
      );
      
      if (response.data) {
        setMessage({ type: "success", text: "Bus added successfully!" });
        setBusDetails({
          route: "",
          time_range: "",
          student_count: "",
          bus_count: "",
          batch: "",
          day: "",
          date: "",
        });
      }
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to add bus. Please try again." 
      });
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Add New Bus Schedule
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Enter the bus details to add to the system
            </p>
          </div>

          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="route"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Route
                </label>
                <input
                  type="text"
                  id="route"
                  name="route"
                  value={busDetails.route}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="Enter route name"
                />
              </div>

              <div>
                <label
                  htmlFor="time_range"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Time Range
                </label>
                <input
                  type="text"
                  id="time_range"
                  name="time_range"
                  value={busDetails.time_range}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="e.g., 8:00 AM - 9:00 AM"
                />
              </div>

              <div>
                <label
                  htmlFor="student_count"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Student Count
                </label>
                <input
                  type="number"
                  id="student_count"
                  name="student_count"
                  value={busDetails.student_count}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="Enter student count"
                />
              </div>

              <div>
                <label
                  htmlFor="bus_count"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Bus Count
                </label>
                <input
                  type="number"
                  id="bus_count"
                  name="bus_count"
                  value={busDetails.bus_count}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="Enter bus count"
                />
              </div>

              <div>
                <label
                  htmlFor="batch"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Batch
                </label>
                <input
                  type="text"
                  id="batch"
                  name="batch"
                  value={busDetails.batch}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="Enter batch name"
                />
              </div>

              <div>
                <label
                  htmlFor="day"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Day
                </label>
                <select
                  id="day"
                  name="day"
                  value={busDetails.day}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                >
                  <option value="">Select a day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={busDetails.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding Bus...
                </span>
              ) : (
                "Add Bus"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBus;