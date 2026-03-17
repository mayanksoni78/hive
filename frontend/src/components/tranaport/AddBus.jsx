import React, { useState } from "react";
import axios from "axios";

const AddBus = () => {
  const [busDetails, setBusDetails] = useState({
    transport_id:"",
    hostel_id:"",
    pickup: "",
    destination: "",
    start_time: "",
    end_time: "",
    student_count: "",
    bus_count: "",
    batch: "",
    date: "",
    day: "",
    
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setBusDetails({
      ...busDetails,
      [e.target.name]: e.target.value,
    });
  };

  const today = new Date().toISOString().split("T")[0];

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
        setMessage({ type: "success", text: "Bus schedule has been added successfully." });
        setBusDetails({
          hostel_id:" ",
          pickup: "",
          destination: "",
          start_time: "",
          end_time: "",
          student_count: "",
          bus_count: "",
          batch: "",
          date: "",
          day: "",
          
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to add bus. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 text-sm text-gray-800 bg-white border border-gray-300 rounded focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition duration-150 placeholder-gray-400";

  const labelClass = "block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-14 px-4">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            Transport Management
          </p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Add Bus Schedule
          </h1>
          <div className="mt-3 h-px bg-gray-200" />
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">

          {/* Status Message */}
          {message.text && (
            <div
              className={`mx-6 mt-6 px-4 py-3 rounded text-sm border ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              <span className="font-medium">
                {message.type === "success" ? "Success — " : "Error — "}
              </span>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">

            {/* Route Section */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Route Details
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pickup" className={labelClass}>
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    id="pickup"
                    name="pickup"
                    value={busDetails.pickup}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="e.g. Hostel Name"
                  />
                </div>
                <div>
                  <label htmlFor="destination" className={labelClass}>
                    Destination
                  </label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={busDetails.destination}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="e.g. College Name"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Schedule Section */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                Schedule
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Set the time window during which buses are available
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_time" className={labelClass}>
                    Starting Time
                  </label>
                  <input
                    type="time"
                    id="start_time"
                    name="start_time"
                    value={busDetails.start_time}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="end_time" className={labelClass}>
                    Leaving Time
                  </label>
                  <input
                    type="time"
                    id="end_time"
                    name="end_time"
                    value={busDetails.end_time}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="date" className={labelClass}>
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={busDetails.date}
                    onChange={handleChange}
                    required
                    min={today}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="day" className={labelClass}>
                    Day
                  </label>
                  <select
                    id="day"
                    name="day"
                    value={busDetails.day}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  >
                    <option value="">Select Day</option>
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
            </div>

            <div className="h-px bg-gray-100" />

            {/* Capacity Section */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Capacity & Batch
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="student_count" className={labelClass}>
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
                    className={inputClass}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label htmlFor="bus_count" className={labelClass}>
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
                    className={inputClass}
                    placeholder="1"
                  />
                </div>
                <div>
                  <label htmlFor="batch" className={labelClass}>
                    Batch
                  </label>
                  <input
                    type="text"
                    id="batch"
                    name="batch"
                    value={busDetails.batch}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="e.g. Btech"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() =>
                  setBusDetails({
                    pickup: "",
                    destination: "",
                    start_time: "",
                    end_time: "",
                    student_count: "",
                    bus_count: "",
                    batch: "",
                    date: "",
                    day: "",
                  })
                }
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition duration-150"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Add Schedule"
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          All fields are required. Entries will be saved to the transport system.
        </p>
      </div>
    </div>
  );
};

export default AddBus;