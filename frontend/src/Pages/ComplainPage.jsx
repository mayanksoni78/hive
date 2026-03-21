import { supabase } from "../lib/supabase";
import React, { useState } from "react";
import axios from "axios";

const AddComplain = () => {
  const student = JSON.parse(localStorage.getItem("student") || "{}");

  const [loading, setLoading]   = useState(false);
  const [image, setImage]       = useState(null);
  const [message, setMessage]   = useState({ type: "", text: "" });
  const [complain, setComplain] = useState({
    room_no:       student.room_id || "",
    description:   "",
    complain_type: "",
  });

  const handleChange = (e) => {
    setComplain({ ...complain, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Upload image if provided — non-blocking
      let imageUrl = "";
      if (image) {
        try {
          const filePath = `complaints/${Date.now()}_${image.name}`;
          const { error: uploadError } = await supabase.storage
            .from("complain-images")
            .upload(filePath, image);
          if (uploadError) {
            console.warn("Image upload failed:", uploadError.message);
          } else {
            const { data } = supabase.storage
              .from("complain-images")
              .getPublicUrl(filePath);
            imageUrl = data.publicUrl;
          }
        } catch (imgErr) {
          console.warn("Image error, continuing:", imgErr.message);
        }
      }

      const response = await axios.post(
        "http://localhost:3000/api/complain/complain_page",
        {
          enroll_id:     student.enroll_id,
          hostel_id:     student.hostel_id,   // ✅ required by DB
          room_no:       complain.room_no,
          description:   complain.description,
          complain_type: complain.complain_type,
          image_url:     imageUrl,
        }
      );

      if (response.data?.error) throw new Error(response.data.error);

      setMessage({ type: "success", text: "Complaint registered successfully." });
      setComplain({ room_no: student.room_id || "", description: "", complain_type: "" });
      setImage(null);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to submit. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 text-sm text-gray-800 bg-white border border-gray-300 rounded focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition duration-150 placeholder-gray-400";
  const labelClass = "block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-14 px-4">
      <div className="w-full max-w-2xl">

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Hostel Management</p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Register Complaint</h1>
          <div className="mt-3 h-px bg-gray-200" />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">

          {message.text && (
            <div className={`mx-6 mt-6 px-4 py-3 rounded text-sm border ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}>
              <span className="font-medium">{message.type === "success" ? "Success — " : "Error — "}</span>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">

            {/* Student info — read only from localStorage */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Student Details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Name</label>
                  <div className="w-full px-3 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded">
                    {student.name || "—"}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Student ID</label>
                  <div className="w-full px-3 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded">
                    {student.enroll_id || "—"}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Complaint details */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Complaint Details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="room_no" className={labelClass}>Room No.</label>
                  <input
                    type="text" id="room_no" name="room_no"
                    value={complain.room_no} onChange={handleChange}
                    required className={inputClass} placeholder="e.g. A-204"
                  />
                </div>
                <div>
                  <label htmlFor="complain_type" className={labelClass}>Complaint Type</label>
                  <select
                    id="complain_type" name="complain_type"
                    value={complain.complain_type} onChange={handleChange}
                    required className={inputClass}
                  >
                    <option value="">Select Type</option>
                    {/* ✅ Fixed: matches DB constraint values exactly */}
                    <option value="Maintenance">Maintenance</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="description" className={labelClass}>Description</label>
                <textarea
                  id="description" name="description"
                  value={complain.description} onChange={handleChange}
                  required rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder="Describe your issue in detail..."
                />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Image upload */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Attachment</p>
              <div className="flex items-center gap-3">
                <label htmlFor="image" className="cursor-pointer px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition">
                  Choose File
                </label>
                <span className="text-sm text-gray-400">{image ? image.name : "No file chosen"}</span>
                <input type="file" id="image" accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])} className="hidden" />
              </div>
              {image && (
                <img src={URL.createObjectURL(image)} alt="preview"
                  className="mt-3 h-32 rounded border border-gray-200 object-cover" />
              )}
            </div>

            <div className="h-px bg-gray-100" />

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button type="button"
                onClick={() => { setComplain({ room_no: student.room_id || "", description: "", complain_type: "" }); setImage(null); setMessage({ type: "", text: "" }); }}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition">
                Clear
              </button>
              <button type="submit" disabled={loading}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition">
                {loading ? (
                  <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>Submitting...</>
                ) : "Submit Complaint"}
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