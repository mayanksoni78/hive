import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Security match failure: Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    setLoading(false);

    if (signupError) {
      setError(signupError.message);
      return;
    }

    alert("Registration successful! Please check your email for verification.");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Main Form Card */}
      <div className="w-full max-w-xl relative mt-8 mb-8 z-10">
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(17,25,39,0.15)] overflow-hidden border border-slate-200 ring-1 ring-slate-100">
          
          {/* ── Header: Deep Dark Blue background ── */}
          <div className="bg-[#111927] p-10 text-center relative border-b border-[#2a374b]">
            <div className="inline-block p-3 bg-white/5 backdrop-blur-md rounded-xl mb-4 border border-white/10">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">HIVE PLATFORM</h1>
            <div className="h-1 w-12 bg-[#4f73b3] mx-auto mt-2 rounded-full" />
            <p className="text-slate-300 text-xs mt-3 uppercase tracking-widest font-medium">New Administrator Access</p>
          </div>

          {/* ── Form Body ── */}
          <div className="p-8 md:p-10">
            {error && (
              <div className="mb-8 flex items-center gap-3 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold uppercase tracking-widest rounded-r-lg">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                  Legal Representative
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  required
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400"
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  placeholder="admin@hive-portal.com"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                  Secure Key
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                  Verify Key
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400"
                />
              </div>

              {/* Terms Checkbox */}
              <div className="md:col-span-2 flex items-start gap-3 py-2 mt-2">
                <input 
                  type="checkbox" 
                  required
                  className="w-4 h-4 mt-1 accent-[#111927] rounded border-slate-300 bg-white cursor-pointer" 
                />
                <label className="text-xs text-slate-500 leading-relaxed font-medium">
                  I authorize Hive to manage administrative credentials according to the <span className="text-[#111927] hover:underline cursor-pointer font-bold">Security Protocol</span>.
                </label>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#111927] hover:bg-[#1a2638] text-white font-bold py-4 rounded-xl active:scale-[0.98] transition-all shadow-lg shadow-[#111927]/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Establish Account</span>
                  )}
                </button>
              </div>
            </form>

            {/* Login Redirect */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm">
                Existing Administrator?{" "}
                <a href="/login" className="text-[#111927] hover:underline font-bold transition-colors">
                  Authorize Here
                </a>
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer Branding */}
        <div className="flex justify-between items-center px-4 mt-6">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
            © 2026 HIVE CORE
          </p>
          <div className="flex gap-4 items-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">System Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}