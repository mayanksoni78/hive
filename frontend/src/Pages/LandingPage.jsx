import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const portals = [
    { 
      id: 'Student', 
      label: 'Student Portal', 
      desc: 'Access your profile and bookings',
      path: '/login',
      color: 'blue',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
      )
    },
    { 
      id: 'Hostel Agency', 
      label: 'Agency Portal', 
      desc: 'Manage your hostel listings',
      path: '/hostel/login',
      color: 'emerald',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
      )
    },
    { 
      id: 'Admin', 
      label: 'Admin Portal', 
      desc: 'System oversight & controls',
      path: '/admin/login',
      color: 'purple',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden font-sans">
      
      
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 blur-[120px]"></div>
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`, backgroundSize: '24px 24px' }}>
        </div>
      </div>

      <div className="w-full max-w-xl relative z-10 flex flex-col gap-6">
        
        
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(17,25,39,0.08)] overflow-hidden border border-slate-200">
          
          <div className="bg-[#111927] px-8 py-10 text-center relative border-b border-[#2a374b] overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '16px 16px' }}></div>
            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-blue-500/10 border border-blue-400/20 rounded-2xl flex items-center justify-center mb-5 text-blue-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Hostel Portal</h1>
              <p className="text-slate-400 text-sm mt-2 font-medium">
                Select your designated access gateway
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-slate-50/50">
            <div className="flex flex-col gap-4">
              {portals.map((portal) => (
                <button
                  key={portal.id}
                  onClick={() => navigate(portal.path)}
                  className="group relative flex items-center p-5 bg-white border border-slate-200 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200 hover:border-slate-300 text-left w-full overflow-hidden"
                >
                 
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-${portal.color}-50 group-hover:text-${portal.color}-600 transition-colors duration-300 z-10`}>
                    {portal.icon}
                  </div>
                  
                  <div className="ml-5 flex-1 z-10">
                    <h3 className="text-base font-bold text-slate-800 tracking-tight">{portal.label}</h3>
                    <p className="text-xs font-medium text-slate-500 mt-1">{portal.desc}</p>
                  </div>

                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-slate-800 group-hover:text-white transition-all duration-300 z-10">
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
         
          <div className="px-6 py-6 bg-slate-100 border-t border-slate-200">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                Partnership Opportunities
              </p>
              <button 
                onClick={() => navigate('/hostel/signup')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 text-sm font-bold rounded-xl shadow-sm hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-[0.98] w-full sm:w-auto"
              >
                Register a New Hostel Agency
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </button>
            </div>
          </div>

        </div>

    
        <div className="flex justify-between items-center px-4">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            © 2026 HIVE CORE SYSTEMS
          </p>
          <div className="flex gap-3 items-center">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Systems Routing Online</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LandingPage;