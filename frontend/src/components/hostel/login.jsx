import React, { useState } from 'react';
import { Building2, Mail, Lock, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function LoginHostel() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    try {
      const data = {
        hostel_id: formData.email,
        password: formData.password
      };
      const res = await fetch("http://localhost:3000/api/hostel/login", {
  method: "POST",
  credentials: "include", // ✅ required for cookies
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
});

const result = await res.json();

// ✅ store hostel_id in localStorage
if (result.hostel_id) {
  localStorage.setItem("hostel_id", result.hostel_id);
}
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        // Navigate to dashboard
        navigate("/dashboard-hostel");
         
    localStorage.setItem("hostel_id", data.hostel_id);
  
      }, 1500);
    } catch (e) {
      console.log("error:", e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden font-sans">
      
      {/* ── AMBIENT BACKGROUND EFFECTS ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-slate-400/10 blur-[120px]"></div>
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{ backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, backgroundSize: '24px 24px' }}>
        </div>
      </div>

      <div className="w-full max-w-lg relative z-10 flex flex-col gap-6">
        
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(17,25,39,0.08)] overflow-hidden border border-slate-200">
          
          {/* ── Header ── */}
          <div className="bg-[#111927] px-8 py-10 text-center relative border-b border-[#2a374b] overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '16px 16px' }}></div>
            
            {/* Back Button */}
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>

            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4 text-white">
                <Building2 className="w-7 h-7" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Agency Portal</h1>
              <p className="text-slate-300/80 text-[11px] mt-2 uppercase tracking-widest font-bold">
                Hostel Management & Bookings
              </p>
            </div>
          </div>

          {/* ── Body Area (Form) ── */}
          <div className="p-6 md:p-8 bg-slate-50/50">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 ml-1">
                  Agency Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@hostel.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-slate-700 font-medium placeholder:text-slate-300 shadow-sm"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 ml-1">
                  Security Key
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-slate-700 font-medium placeholder:text-slate-300 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-800 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center ml-1">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 transition-colors cursor-pointer"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none">
                  Keep me connected
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || submitted}
                className="w-full mt-2 px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-white rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none bg-[#111927] shadow-slate-900/10 hover:bg-[#1f2d44]"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : submitted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Access Granted
                  </>
                ) : (
                  <>
                    Authorize Agency Access
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              {/* Footer Link */}
              <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                <p className="text-xs text-slate-500 mb-2">Don't have an agency account?</p>
                <button 
                  type="button"
                  onClick={() => navigate('/hostel_registr')}
                  className="text-[11px] font-bold text-slate-950 hover:text-slate-700 uppercase tracking-widest transition-colors"
                >
                  Register New Hostel
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* Global Footer Branding */}
        <div className="flex justify-between items-center px-4">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            © 2026 HIVE CORE SYSTEMS
          </p>
          <div className="flex gap-3 items-center">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white border border-slate-300"></span>
            </div>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Agency Node</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginHostel;