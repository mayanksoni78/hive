import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [adminType, setAdminType] = useState('Mess'); // 'Mess' or 'Transport'
  const [email,setEmail] =useState()
  const [password,setPassword]=useState()
  const handleLogin =async (e) => {
    e.preventDefault();
    console.log(`Authenticating ${adminType} Admin...`);

    try{
      const response = await fetch("http://localhost:3000/admin/login",{
        method:"POST",
        body:JSON.stringify({email:email,password:password}),
      })
    }catch(e){

    }
    // Add your admin login logic here
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden font-sans">
      
      {/* ── AMBIENT BACKGROUND EFFECTS ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 blur-[120px]"></div>
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
              onClick={() => navigate('/')}
              className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>

            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-blue-500/10 border border-blue-400/20 rounded-2xl flex items-center justify-center mb-4 text-blue-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Admin Portal</h1>
              <p className="text-blue-400/80 text-[11px] mt-2 uppercase tracking-widest font-bold">
                System Oversight & Controls
              </p>
            </div>
          </div>

          {/* ── Body Area ── */}
          <div className="p-6 md:p-8 bg-slate-50/50">
            
            {/* Admin Department Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-8 border border-slate-200">
              <button 
                onClick={() => setAdminType('Mess')}
                className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                  adminType === 'Mess' ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Mess Admin
              </button>
              <button 
                onClick={() => setAdminType('Transport')}
                className={`flex-1 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                  adminType === 'Transport' ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Transport Admin
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Email Field */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 ml-1">
                  Official Email
                </label>
                <input 
                  type="email" 
                  required
                  onChange={(e)=>setEmail(e.value)}
                  placeholder={`admin@${adminType.toLowerCase()}.hive.edu`}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-300"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 ml-1">
                  Security Key
                </label>
                <input 
                  type="password" 
                  required
                  onChange={(e)=>setPassword(e.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium placeholder:text-slate-300"
                />
              </div>

              {/* Action Button */}
              <button 
                  type="submit"
                  onClick={() => adminType === 'Mess' ? navigate('/admin/mess-menu') : navigate('/update_bus')}
                  className="w-full mt-4 px-6 py-3.5 text-[11px] uppercase tracking-widest font-bold text-white bg-[#111927] rounded-xl hover:bg-[#1f2d44] transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-2 group"
                >
                 Login
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Systems Online</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminLogin;