import { useEffect, useState } from 'react';
import { getMenuByDate, subscribeToMenuUpdates } from '../../lib/supabase';
import MealCard from './MealCard';

export default function MessMenuDisplay() {
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    
    useEffect(() => {
        loadMenu(selectedDate);
        
        
        const subscription = subscribeToMenuUpdates((payload) => {
            console.log('Menu updated:', payload);
            loadMenu(selectedDate);
        });
        
       
    }, [selectedDate]);
    
    async function loadMenu(date) {
        try {
            setLoading(true);
            const data = await getMenuByDate(date);
            setMenu(data);
        } catch (error) {
            console.error('Error loading menu:', error);
        } finally {
            setLoading(false);
        }
    }
    
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date().toDateString();
        const tomorrow = new Date(Date.now() + 86400000).toDateString();
        
        if (date.toDateString() === today) return "Today's Menu";
        if (date.toDateString() === tomorrow) return "Tomorrow's Menu";
        
        return date.toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };
    
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#111927] mb-6 shadow-[0_20px_60px_rgba(17,25,39,0.2)]">
                        <svg className="animate-spin h-9 w-9 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                    </div>
                    <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Loading menu...</p>
                </div>
            </div>
        );
    }
    
    if (!menu) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_20px_60px_rgba(17,25,39,0.15)] overflow-hidden border border-slate-200 ring-1 ring-slate-100">
                    <div className="bg-[#111927] p-8 text-center border-b border-[#2a374b]">
                        <div className="inline-block p-3 bg-white/5 backdrop-blur-md rounded-xl mb-4 border border-white/10">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18M3 9h18M3 15h18M3 21h18" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight">HIVE</h1>
                        <div className="h-1 w-12 bg-[#4f73b3] mx-auto mt-2 rounded-full" />
                        <p className="text-slate-300 text-xs mt-3 uppercase tracking-widest font-medium">Mess Management</p>
                    </div>
                    <div className="p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-5">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No Menu Available</h3>
                        <p className="text-slate-500 text-sm mb-1">
                            The mess menu for <span className="font-semibold text-slate-700">{formatDate(selectedDate)}</span> hasn't been published yet.
                        </p>
                        <p className="text-xs text-slate-400 mt-3 uppercase tracking-wider">Please check back later or contact the mess admin.</p>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-white py-10 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(17,25,39,0.15)] overflow-hidden border border-slate-200 ring-1 ring-slate-100 mb-6">
                    <div className="bg-[#111927] p-8 relative border-b border-[#2a374b]">
                        <div className="flex items-center gap-4">
                            <div className="inline-block p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shrink-0">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-white tracking-tight">Mess Menu</h1>
                                <div className="h-1 w-10 bg-[#4f73b3] mt-2 rounded-full" />
                                <p className="text-slate-300 text-xs mt-2 uppercase tracking-widest font-medium">{formatDate(selectedDate)}</p>
                            </div>
                        </div>
                        {/* Live indicator */}
                        <div className="absolute top-6 right-6 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                            <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">Live</span>
                        </div>
                    </div>

                    {/* Date Selector */}
                    <div className="p-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                                Select Date
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#111927] transition-colors">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full md:w-72 pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white transition-all outline-none text-slate-700 font-medium"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Special Notice */}
                {menu.special_note && (
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(17,25,39,0.08)] border border-slate-200 ring-1 ring-slate-100 p-6 mb-6">
                        <div className="flex items-start gap-4">
                            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#111927] shrink-0">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-1">Special Announcement</h4>
                                <p className="text-slate-600 text-sm leading-relaxed">{menu.special_note}</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Holiday Notice */}
                {menu.is_holiday && (
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(17,25,39,0.08)] border border-slate-200 ring-1 ring-slate-100 p-8 mb-6 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-5">
                            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <p className="font-bold text-slate-800 text-lg">Mess Closed — Holiday</p>
                        <p className="text-slate-500 text-sm mt-2 uppercase tracking-wider">Enjoy your day off!</p>
                    </div>
                )}
                
                {/* Meals Grid */}
                {!menu.is_holiday && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <MealCard mealType="breakfast" mealData={menu.breakfast} />
                        <MealCard mealType="lunch" mealData={menu.lunch} />
                        <MealCard mealType="snacks" mealData={menu.snacks} />
                        <MealCard mealType="dinner" mealData={menu.dinner} />
                    </div>
                )}
                
                {/* Footer */}
                <div className="flex justify-between items-center px-4 mt-8">
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                        © 2026 HIVE CORE
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                            Updated {new Date(menu.updated_at).toLocaleString('en-IN')}
                        </span>
                        {menu.version > 1 && (
                            <>
                                <span className="text-slate-300">·</span>
                                <span className="text-xs font-semibold text-[#4f73b3] uppercase tracking-wider">
                                    v{menu.version} revised
                                </span>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}