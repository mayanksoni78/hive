import { supabase } from "../lib/supabase";
import React, { useState } from "react";
import axios from "axios";

const AddComplain = () => {
  const student = JSON.parse(localStorage.getItem("student") || "{}");

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [complain, setComplain] = useState({
    room_no: student.room_id || "",
    description: "",
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
          enroll_id: student.enroll_id,
          hostel_id: student.hostel_id,   // required by DB
          room_no: complain.room_no,
          description: complain.description,
          complain_type: complain.complain_type,
          image_url: imageUrl,
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

  const inputClass = "w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400";
  const labelClass = "text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 block mb-2";
  const readOnlyClass = "w-full px-4 py-3.5 bg-slate-100/70 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed";

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* ── AMBIENT BACKGROUND EFFECTS ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/5 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/5 blur-[100px]"></div>
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.015]" 
             style={{ backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, backgroundSize: '24px 24px' }}>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-2xl relative mt-8 mb-8 z-10">
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(17,25,39,0.08)] overflow-hidden border border-slate-200">
          
          {/* ── Header: Deep Dark Blue background ── */}
         <div className="bg-[#111927] px-8 py-8 text-center relative border-b border-[#2a374b] overflow-hidden">
  {/* Header internal grid pattern */}
  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '16px 16px' }}></div>
  
  <div className="relative z-10">
    <h1 className="text-3xl font-black text-white tracking-tight">Complaint Page</h1>
    <p className="text-blue-400/80 text-[11px] mt-2 uppercase tracking-widest font-bold">
      Register your issue below
    </p>
  </div>
</div>

          {/* ── Form Body ── */}
          <div className="p-8 md:p-10">
            
            {/* Status Messages */}
            {message.text && (
              <div className={`mb-8 flex items-center gap-3 p-4 border-l-4 text-[11px] font-bold uppercase tracking-widest rounded-r-xl ${
                message.type === "success" 
                  ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
                  : "bg-red-50 border-red-500 text-red-700"
              }`}>
                {message.type === "success" ? (
                   <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                ) : (
                   <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                )}
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Section: Student info */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  Student Identity
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <div className={readOnlyClass}>
                      {student.name || "—"}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Student ID / Enrollment</label>
                    <div className={readOnlyClass}>
                      {student.enroll_id || "—"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Complaint details */}
              <div className="space-y-4 pt-2">
                <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  Issue Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label htmlFor="room_no" className={labelClass}>Room Allocation</label>
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
                    <label htmlFor="complain_type" className={labelClass}>Issue Category</label>
                    <div className="relative">
                      <select
                        id="complain_type" 
                        name="complain_type"
                        value={complain.complain_type} 
                        onChange={handleChange}
                        required 
                        className={`${inputClass} appearance-none cursor-pointer`}
                      >
                        <option value="" disabled>Select appropriate category</option>
                        <option value="Maintenance">Maintenance & Repairs</option>
                        <option value="Food">Food & Mess</option>
                        <option value="Transport">Transportation</option>
                        <option value="Other">Other / General</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="description" className={labelClass}>Detailed Description</label>
                    <textarea
                      id="description" 
                      name="description"
                      value={complain.description} 
                      onChange={handleChange}
                      required 
                      rows={4}
                      className={`${inputClass} resize-none min-h-[120px]`}
                      placeholder="Please provide specifics regarding the issue..."
                    />
                  </div>
                </div>
              </div>

              {/* Section: Image upload (Redesigned) */}
              <div className="space-y-4 pt-2">
                <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  Supporting Evidence (Optional)
                </h2>
                
                <div className="pt-2">
                  <label 
                    htmlFor="image" 
                    className={`relative flex flex-col items-center justify-center w-full py-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                      image ? 'border-blue-400 bg-blue-50/50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
                    }`}
                  >
                    {!image ? (
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="p-3 bg-white rounded-full shadow-sm border border-slate-200 text-slate-500">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-slate-700">Click to upload image</p>
                          <p className="text-xs text-slate-500 mt-1">PNG, JPG or WEBP (Max. 5MB)</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-3">
                        <div className="p-1 bg-white rounded-lg shadow-sm border border-slate-200">
                          <img 
                            src={URL.createObjectURL(image)} 
                            alt="preview"
                            className="h-24 w-auto rounded object-cover" 
                          />
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-blue-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                          {image.name}
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 hover:text-slate-700">Click to change file</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      id="image" 
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-8 flex flex-col sm:flex-row items-center justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => { setComplain({ room_no: student.room_id || "", description: "", complain_type: "" }); setImage(null); setMessage({ type: "", text: "" }); }}
                  className="w-full sm:w-auto bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold py-4 px-8 rounded-xl transition-all text-xs uppercase tracking-widest"
                >
                  Reset Form
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full sm:w-auto bg-[#111927] hover:bg-[#1a2638] text-white font-bold py-4 px-8 rounded-xl active:scale-[0.98] transition-all shadow-xl shadow-[#111927]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Record</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="flex justify-between items-center px-4 mt-6">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            © 2026 HIVE CORE SYSTEMS
          </p>
          <div className="flex gap-3 items-center">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </div>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Uplink Active</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddComplain;