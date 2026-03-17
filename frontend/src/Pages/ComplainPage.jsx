import { supabase } from "../lib/supabase";
import React, { useEffect, useState } from "react";
import axios from "axios";

const AddComplain = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [complain, setComplain] = useState({
    name: "",
    enroll_id: "",
    room_no: "",
    description: "",
    complain_type: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setComplain((prev) => ({
          ...prev,
          enroll_id: user.user_metadata.enroll_id,
          name: user.user_metadata.name,
        }));
      }
    };
    getUser();
  }, []);

  const handleChange = (e) => {
    setComplain({ ...complain, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      let imageUrl = "";
      if (image) {
        const filePath = `complaints/${Date.now()}_${image.name}`;
        const { error: uploadError } = await supabase.storage
          .from("complain-images")
          .upload(filePath, image);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage
          .from("complain-images")
          .getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }

      const payload = { ...complain, image_url: imageUrl };

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setMessage({ type: "error", text: "User not authenticated." });
        return;
      }

      await axios.post(
        "http://localhost:3000/api/complain/complain_page",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: "success", text: "Complaint registered successfully." });
      setComplain((prev) => ({
        ...prev,
        room_no: "",
        description: "",
        complain_type: "",
      }));
      setImage(null);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to submit complaint. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 text-sm text-gray-800 bg-white border border-gray-300 rounded focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition duration-150 placeholder-gray-400";

  const labelClass =
    "block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-14 px-4">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            Hostel Management
          </p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Register Complaint
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

            {/* Student Info (read-only) */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Student Details
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Name</label>
                  <div className="w-full px-3 py-2.5 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded">
                    {complain.name || "Loading..."}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Student ID</label>
                  <div className="w-full px-3 py-2.5 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded">
                    {complain.enroll_id || "Loading..."}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Complaint Details */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Complaint Details
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="room_no" className={labelClass}>
                    Room No.
                  </label>
                  <input
                    type="text"
                    id="room_no"
                    name="room_no"
                    value={complain.room_no}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="e.g. A-204"
                  />
                </div>
                <div>
                  <label htmlFor="complain_type" className={labelClass}>
                    Complaint Type
                  </label>
                  <select
                    id="complain_type"
                    name="complain_type"
                    value={complain.complain_type}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  >
                    <option value="">Select Type</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Cleanliness">Cleanliness</option>
                    <option value="Internet">Internet</option>
                    <option value="Security">Security</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="description" className={labelClass}>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={complain.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder="Describe your issue in detail..."
                />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Image Upload */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Attachment
              </p>
              <label htmlFor="image" className={labelClass}>
                Upload Image <span className="normal-case font-normal text-gray-400">(optional)</span>
              </label>
              <div className="mt-1 flex items-center gap-3">
                <label
                  htmlFor="image"
                  className="cursor-pointer px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition duration-150"
                >
                  Choose File
                </label>
                <span className="text-sm text-gray-400">
                  {image ? image.name : "No file chosen"}
                </span>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setComplain((prev) => ({
                    ...prev,
                    room_no: "",
                    description: "",
                    complain_type: "",
                  }));
                  setImage(null);
                  setMessage({ type: "", text: "" });
                }}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition duration-150"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
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
                    Submitting...
                  </>
                ) : (
                  "Submit Complaint"
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          All required fields must be filled. Your complaint will be reviewed by the hostel admin.
        </p>
      </div>
    </div>
  );
};

export default AddComplain;