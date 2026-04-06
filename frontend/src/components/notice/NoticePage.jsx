import { useState, useEffect } from 'react';
import { getNotices, subscribeToNotices, supabase } from '../../lib/supabase';

export default function NoticePage() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [hostelId, setHostelId] = useState(null);
    const [hostelError, setHostelError] = useState(false);

    useEffect(() => {
        resolveHostelId();
    }, []);

    useEffect(() => {
        if (!hostelId) return;

        loadNotices(hostelId);
        const subscription = subscribeToNotices(hostelId, () => {
            loadNotices(hostelId);
        });
        return () => subscription.unsubscribe();
    }, [hostelId]);

    async function resolveHostelId() {
        try {
            const enrollId = localStorage.getItem('enroll_id');
            if (!enrollId) { setHostelError(true); setLoading(false); return; }

            const { data, error } = await supabase
                .from('student')
                .select('hostel_id')
                .eq('enroll_id', enrollId)
                .single();

            if (error || !data?.hostel_id) { setHostelError(true); setLoading(false); return; }

            setHostelId(data.hostel_id);
        } catch (err) {
            console.error('Error resolving hostel ID:', err);
            setHostelError(true);
            setLoading(false);
        }
    }

    async function loadNotices(id) {
        try {
            setLoading(true);
            const data = await getNotices(id);
            setNotices(data);
        } catch (error) {
            console.error('Error loading notices:', error);
        } finally {
            setLoading(false);
        }
    }

    const filtered = notices.filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.description.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    const isNew = (dateStr) => {
        const diff = Date.now() - new Date(dateStr);
        return diff < 3 * 24 * 60 * 60 * 1000;
    };

    if (hostelError) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_20px_60px_rgba(17,25,39,0.15)] overflow-hidden border border-slate-200 ring-1 ring-slate-100">
                    <div className="bg-[#111927] p-8 text-center border-b border-[#2a374b]">
                        <div className="inline-block p-3 bg-white/5 backdrop-blur-md rounded-xl mb-4 border border-white/10">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight">HIVE</h1>
                        <div className="h-1 w-12 bg-[#4f73b3] mx-auto mt-2 rounded-full" />
                    </div>
                    <div className="p-8 text-center">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Session Error</h3>
                        <p className="text-slate-500 text-sm">Could not identify your hostel. Please log in again.</p>
                        <p className="text-xs text-slate-400 mt-3 uppercase tracking-wider">Contact support if the issue persists.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#111927] mb-6 shadow-[0_20px_60px_rgba(17,25,39,0.2)]">
                        <svg className="animate-spin h-9 w-9 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    </div>
                    <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Loading notices...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-10 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(17,25,39,0.15)] overflow-hidden border border-slate-200 ring-1 ring-slate-100 mb-6">
                    <div className="bg-[#111927] p-8 relative border-b border-[#2a374b]">
                        <div className="flex items-center gap-4">
                            <div className="inline-block p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shrink-0">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-white tracking-tight">Notice Board</h1>
                                <div className="h-1 w-10 bg-[#4f73b3] mt-2 rounded-full" />
                                <p className="text-slate-300 text-xs mt-2 uppercase tracking-widest font-medium">
                                    Stay updated with hostel announcements
                                </p>
                            </div>
                        </div>
                        {/* Live indicator */}
                        <div className="absolute top-6 right-6 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                            <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">Live</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="p-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                                Search Notices
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#111927] transition-colors">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by title or description..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white transition-all outline-none text-slate-700 font-medium"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Count */}
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">
                    {filtered.length} Notice{filtered.length !== 1 ? 's' : ''} Found
                </p>

                {/* Empty State */}
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(17,25,39,0.08)] border border-slate-200 ring-1 ring-slate-100 p-14 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-5">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No Notices Found</h3>
                        <p className="text-slate-500 text-sm">
                            {search
                                ? `No results for "${search}"`
                                : 'No active notices right now'}
                        </p>
                        <p className="text-xs text-slate-400 mt-3 uppercase tracking-wider">
                            Please check back later or contact the hostel admin.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map(notice => (
                            <div
                                key={notice.notice_id}
                                className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(17,25,39,0.08)] border border-slate-200 ring-1 ring-slate-100 overflow-hidden hover:shadow-[0_16px_40px_rgba(17,25,39,0.13)] transition-all duration-200"
                            >
                                {/* Top accent bar */}
                                <div className="h-1 w-full bg-[#111927]" />

                                <div className="p-6">
                                    {/* Title Row */}
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#111927] shrink-0">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                </svg>
                                            </div>
                                            <h2 className="font-black text-slate-800 text-base tracking-tight leading-snug">
                                                {notice.title}
                                            </h2>
                                        </div>
                                        {isNew(notice.date) && (
                                            <span className="shrink-0 text-xs font-bold bg-[#111927] text-white px-3 py-1 rounded-full uppercase tracking-wider">
                                                New
                                            </span>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-slate-100 mb-4" />

                                    {/* Description */}
                                    <p className="text-slate-600 text-sm leading-relaxed mb-5">
                                        {notice.description}
                                    </p>

                                    {/* Footer Meta */}
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium uppercase tracking-wider">
                                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Posted: {formatDate(notice.date)}
                                        </div>
                                        {notice.expiry_date && (
                                            <div className="flex items-center gap-2 text-xs font-semibold text-[#4f73b3] uppercase tracking-wider">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Valid till: {formatDate(notice.expiry_date)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center px-4 mt-10">
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                        © 2026 HIVE CORE
                    </p>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                        Notice Board
                    </p>
                </div>

            </div>
        </div>
    );
}