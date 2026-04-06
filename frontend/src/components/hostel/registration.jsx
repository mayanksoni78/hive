import React, { useState } from 'react';
import { Building2, User, Phone, MapPin, CheckCircle2, ArrowRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    hostelName: '',
    password: '',
    address: '',
    ownerName: '',
    ownerContact: '',
    managerName: '', // Kept for state consistency, though not in the form
    managerContact: '', // Kept for state consistency, though not in the form
  });
  
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = { 
        "Hostel_Name": formData.hostelName, 
        "Password": formData.password,
        "Owner_Name": formData.ownerName, 
        "Owner_Number": formData.ownerContact,
        "Address": formData.address 
    };
    
    console.log("Submitting data:", data);
    
    try {
        const res = await fetch("http://localhost:3000/api/hostel/signup", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(data)
        });
        const data2 = await res.json();
        console.log(data2);
        
    } catch (error) {
        console.error("Submission error:", error);
    }
      
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      navigate("/dashboard-hostel");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Main Form Card */}
      <div className="w-full max-w-2xl relative mt-8 mb-8">
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(17,25,39,0.15)] overflow-hidden border border-slate-200 ring-1 ring-slate-100">

          {/* ── Header: Deep Dark Blue background ── */}
          <div className="bg-[#111927] p-10 text-center relative border-b border-[#2a374b]">
            <div className="inline-block p-3 bg-white/5 backdrop-blur-md rounded-xl mb-4 border border-white/10">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">HIVE PLATFORM</h1>
            <div className="h-1 w-12 bg-[#4f73b3] mx-auto mt-2 rounded-full" />
            <p className="text-slate-300 text-xs mt-3 uppercase tracking-widest font-medium">New Facility Registration</p>
          </div>

          {/* ── Form Body ── */}
          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Section: Property Details */}
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">
                  Property Details
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                  
                  {/* Hostel Name */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label htmlFor="hostelName" className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                      Hostel Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#111927] transition-colors">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        id="hostelName"
                        name="hostelName"
                        required
                        value={formData.hostelName}
                        onChange={handleChange}
                        placeholder="e.g. Sunrise Student Living"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label htmlFor="password" className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                      Security Key (Password)
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#111927] transition-colors">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter a secure password"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label htmlFor="address" className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                      Full Address
                    </label>
                    <div className="relative group">
                      <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-slate-400 group-focus-within:text-[#111927] transition-colors">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <textarea
                        id="address"
                        name="address"
                        rows="3"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Street address, City, Zip Code"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400 resize-none min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Personnel */}
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">
                  Management Details
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Owner Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="ownerName" className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                      Owner Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#111927] transition-colors">
                        <User className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        id="ownerName"
                        name="ownerName"
                        required
                        value={formData.ownerName}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Owner Contact */}
                  <div className="space-y-1.5">
                    <label htmlFor="ownerContact" className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                      Owner Contact
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#111927] transition-colors">
                        <Phone className="h-5 w-5" />
                      </div>
                      <input
                        type="tel"
                        id="ownerContact"
                        name="ownerContact"
                        required
                        value={formData.ownerContact}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2
                    ${submitted 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30' 
                      : 'bg-[#111927] hover:bg-[#1a2638] text-white shadow-[#111927]/30'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      <span>Registering Property...</span>
                    </>
                  ) : submitted ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Registration Complete</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Registration</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
                
                <p className="text-xs text-center text-slate-500 mt-6 font-medium">
                  By clicking register, you agree to our terms of service and data policy.
                </p>
                
                <div className="mt-4 pt-6 border-t border-slate-100 text-center">
                  <p className="text-slate-500 text-sm">
                    Already have an account?{" "}
                    <a href="/hostel/login" className="text-[#111927] hover:underline font-bold">
                      Login Here
                    </a>
                  </p>
                </div>
              </div>

            </form>
          </div>
        </div>

        {/* Footer info matching the standard */}
        <div className="flex justify-between items-center px-4 mt-6">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">© 2026 HIVE CORE</p>
            <div className="flex gap-4 items-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">System Secure</span>
            </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <RegistrationForm />
  );
}