import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [enrollId, setEnrollId]         = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const {data: authData, error: authError}=await supabase.auth.getUser({
        email:email,
        password:password,
      })
      console.log(authData)
      // const { data: rows, error: e1 } = await supabase
      //   .from("student")
      //   .select("*")
      //   .eq("enroll_id", enrollId.trim());

      if (!rows || rows.length === 0) {
        setLoading(false);
        setError(`No student found with ID "${enrollId.trim()}"`);
        return;
      }

      const row = rows[0];
      if (row.email !== email.trim().toLowerCase()) {
        setLoading(false);
        setError("Email doesn't match.");
        return;
      }
      if (row.password !== password) {
        setLoading(false);
        setError("Password doesn't match.");
        return;
      }

      const { data, error: dbError } = await supabase
        .from("student")
        .select("*")
        .eq("enroll_id", enrollId.trim())
        .single();

      setLoading(false);
      if (dbError || !data) { setError("Fetch error: " + dbError?.message); return; }
      

      //console.log(data)
      console.log("enroll_id", data.enroll_id)
      localStorage.setItem("enroll_id", data.enroll_id);
      navigate("/student-dashboard");

    } catch (err) {
      setLoading(false);
      setError("Something went wrong.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="w-full max-w-md relative">
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(17,25,39,0.15)] overflow-hidden border border-slate-200 ring-1 ring-slate-100">

          {/* ── Header: Deep Dark Blue background for brand ── */}
          <div className="bg-[#111927] p-10 text-center relative border-b border-[#2a374b]">
            
            {/* Back Button */}
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>

            <div className="inline-block p-3 bg-white/5 backdrop-blur-md rounded-xl mb-4 border border-white/10">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">HIVE</h1>
            <div className="h-1 w-12 bg-[#4f73b3] mx-auto mt-2 rounded-full" />
            <p className="text-slate-300 text-xs mt-3 uppercase tracking-widest font-medium">Hostel Management Systems</p>
          </div>

          {/* ── Form Body: White background ── */}
          <div className="p-8 md:p-10">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Student Portal</h2>
                <p className="text-slate-500 text-sm mt-1">Please enter your credentials to continue</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 text-sm flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">

              {/* Enrollment ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                  Enrollment ID
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#111927] transition-colors">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="101"
                    value={enrollId}
                    required
                    onChange={(e) => setEnrollId(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#111927] transition-colors">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="name@university.edu"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                  Security Key
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#111927] transition-colors">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#111927] transition-colors"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#111927] text-white font-bold py-4 rounded-xl hover:bg-[#1a2638] transition-all shadow-lg shadow-[#111927]/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : "Login to Dashboard"}
              </button>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center px-4 mt-8">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">© 2026 HIVE CORE</p>
            <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">System Secure</span>
            </div>
        </div>
      </div>
    </div>
  );
}