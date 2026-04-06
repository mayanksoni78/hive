import { useState, useEffect } from 'react';
import { upsertMenu, getMenuByDate, deleteMenu } from '../../lib/supabase';

const MEAL_META = {
    breakfast: { label: 'Breakfast', icon: '🌅', accent: '#f59e0b' },
    lunch:     { label: 'Lunch',     icon: '🍛', accent: '#22c55e' },
    snacks:    { label: 'Snacks',    icon: '☕', accent: '#4f73b3' },
    dinner:    { label: 'Dinner',    icon: '🌙', accent: '#8b5cf6' },
};

export default function MessMenuAdmin() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        breakfast: { items: [''], time: '7:30 AM - 9:00 AM' },
        lunch:     { items: [''], time: '12:30 PM - 2:00 PM' },
        snacks:    { items: [''], time: '4:30 PM - 5:30 PM' },
        dinner:    { items: [''], time: '7:30 PM - 9:30 PM' },
        special_note: '',
        is_holiday: false
    });

    useEffect(() => {
        loadExistingMenu(selectedDate);
    }, [selectedDate]);

    async function loadExistingMenu(date) {
        try {
            const menu = await getMenuByDate(date);
            if (menu) {
                setFormData({
                    breakfast:    menu.breakfast,
                    lunch:        menu.lunch,
                    snacks:       menu.snacks,
                    dinner:       menu.dinner,
                    special_note: menu.special_note || '',
                    is_holiday:   menu.is_holiday || false
                });
            } else {
                setFormData({
                    breakfast: { items: [''], time: '7:30 AM - 9:00 AM' },
                    lunch:     { items: [''], time: '12:30 PM - 2:00 PM' },
                    snacks:    { items: [''], time: '4:30 PM - 5:30 PM' },
                    dinner:    { items: [''], time: '7:30 PM - 9:30 PM' },
                    special_note: '',
                    is_holiday: false
                });
            }
        } catch (error) {
            console.error('Error loading menu:', error);
        }
    }

    const addItem = (mealType) => {
        setFormData(prev => ({
            ...prev,
            [mealType]: {
                ...prev[mealType],
                items: [...prev[mealType].items, '']
            }
        }));
    };

    const updateItem = (mealType, index, value) => {
        setFormData(prev => ({
            ...prev,
            [mealType]: {
                ...prev[mealType],
                items: prev[mealType].items.map((item, i) => i === index ? value : item)
            }
        }));
    };

    const removeItem = (mealType, index) => {
        setFormData(prev => ({
            ...prev,
            [mealType]: {
                ...prev[mealType],
                items: prev[mealType].items.filter((_, i) => i !== index)
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const cleanedData = {
                date: selectedDate,
                breakfast: { ...formData.breakfast, items: formData.breakfast.items.filter(item => item.trim()) },
                lunch:     { ...formData.lunch,     items: formData.lunch.items.filter(item => item.trim()) },
                snacks:    { ...formData.snacks,    items: formData.snacks.items.filter(item => item.trim()) },
                dinner:    { ...formData.dinner,    items: formData.dinner.items.filter(item => item.trim()) },
                special_note: formData.special_note.trim() || null,
                is_holiday:   formData.is_holiday
            };
            await upsertMenu(cleanedData);
            alert('✅ Menu saved successfully!');
        } catch (error) {
            console.error('Save error:', error);
            alert('❌ Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete the menu for ${selectedDate}?`)) return;
        try {
            await deleteMenu(selectedDate);
            alert('✅ Menu deleted successfully!');
            setFormData({
                breakfast: { items: [''], time: '7:30 AM - 9:00 AM' },
                lunch:     { items: [''], time: '12:30 PM - 2:00 PM' },
                snacks:    { items: [''], time: '4:30 PM - 5:30 PM' },
                dinner:    { items: [''], time: '7:30 PM - 9:30 PM' },
                special_note: '',
                is_holiday: false
            });
        } catch (error) {
            alert('❌ Error deleting menu: ' + error.message);
        }
    };

    const renderMealSection = (mealType) => {
        const { label, icon, accent } = MEAL_META[mealType];
        return (
            <div key={mealType} className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(17,25,39,0.08)] overflow-hidden ring-1 ring-slate-100">
                {/* Meal Card Header */}
                <div className="bg-[#111927] px-5 py-4 flex items-center gap-3 border-b border-[#2a374b]">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg shrink-0">
                        {icon}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-black text-white text-sm tracking-tight">{label}</h3>
                        <p className="text-slate-400 text-xs uppercase tracking-widest font-medium">{formData[mealType].time}</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                        {formData[mealType].items.filter(i => i.trim()).length} items
                    </span>
                </div>

                {/* Accent bar */}
                <div style={{ height: 2, background: accent }} />

                {/* Body */}
                <div className="p-5 space-y-4">
                    {/* Timing */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            Timing
                        </label>
                        <input
                            type="text"
                            value={formData[mealType].time}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                [mealType]: { ...prev[mealType], time: e.target.value }
                            }))}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white transition-all outline-none"
                            placeholder="e.g., 7:30 AM - 9:00 AM"
                        />
                    </div>

                    {/* Items */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            </svg>
                            Menu Items
                        </label>
                        <div className="space-y-2">
                            {formData[mealType].items.map((item, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 border border-slate-200 shrink-0">
                                        <span className="text-slate-400 text-xs font-bold">{index + 1}</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => updateItem(mealType, index, e.target.value)}
                                        className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white transition-all outline-none"
                                        placeholder="Enter food item"
                                    />
                                    {formData[mealType].items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(mealType, index)}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300 transition-all shrink-0"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => addItem(mealType)}
                            className="mt-1 w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-[#111927] hover:text-[#111927] hover:bg-slate-50 transition-all text-sm font-semibold flex items-center justify-center gap-1.5"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/>
                            </svg>
                            Add Item
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white py-10 px-4">
            <div className="max-w-5xl mx-auto">

                {/* ── Page Header Card ── */}
                <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(17,25,39,0.15)] overflow-hidden border border-slate-200 ring-1 ring-slate-100 mb-6">
                    <div className="bg-[#111927] p-8 relative border-b border-[#2a374b]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shrink-0">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-white tracking-tight">Mess Menu Admin</h1>
                                <div className="h-1 w-10 bg-[#4f73b3] mt-2 rounded-full" />
                                <p className="text-slate-300 text-xs mt-2 uppercase tracking-widest font-medium">Create &amp; manage daily menus</p>
                            </div>
                        </div>
                        <div className="absolute top-6 right-6 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">Admin Panel</span>
                        </div>
                    </div>

                    {/* Date + Holiday row */}
                    <div className="p-6 flex flex-col sm:flex-row sm:items-end gap-5">
                        {/* Date Selector */}
                        <div className="flex-1 space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                                Select Date <span className="text-red-400">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#111927] transition-colors">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white transition-all outline-none text-slate-700 font-medium"
                                />
                            </div>
                            <p className="text-xs text-slate-400 font-medium ml-1">
                                If a menu exists for this date, it will load automatically for editing.
                            </p>
                        </div>

                        {/* Holiday Toggle */}
                        <div className="sm:w-64">
                            <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-all group">
                                <div className="relative shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_holiday}
                                        onChange={(e) => setFormData(prev => ({ ...prev, is_holiday: e.target.checked }))}
                                        className="sr-only"
                                    />
                                    <div className={`w-11 h-6 rounded-full border-2 transition-all ${formData.is_holiday ? 'bg-[#111927] border-[#111927]' : 'bg-slate-200 border-slate-300'}`}>
                                        <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mt-0.5 ${formData.is_holiday ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'}`} />
                                    </div>
                                </div>
                                <div>
                                    <span className="font-bold text-slate-700 text-sm">Mark as Holiday</span>
                                    <p className="text-xs text-slate-500 mt-0.5">Mess will be closed</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* ── Meals Grid ── */}
                    {!formData.is_holiday && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {['breakfast', 'lunch', 'snacks', 'dinner'].map(m => renderMealSection(m))}
                        </div>
                    )}

                    {/* Holiday notice */}
                    {formData.is_holiday && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(17,25,39,0.08)] overflow-hidden ring-1 ring-slate-100">
                            <div className="bg-[#111927] px-6 py-5 border-b border-[#2a374b] flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">🏖️</div>
                                <div>
                                    <h3 className="font-black text-white text-base">Holiday Mode Active</h3>
                                    <p className="text-slate-400 text-xs mt-0.5 uppercase tracking-widest font-medium">Mess will be closed on this date</p>
                                </div>
                            </div>
                            <div className="p-6 text-center text-slate-500 text-sm font-medium">
                                Meal sections are hidden while holiday mode is enabled. Uncheck to manage meals.
                            </div>
                        </div>
                    )}

                    {/* ── Special Announcement ── */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(17,25,39,0.08)] overflow-hidden ring-1 ring-slate-100">
                        <div className="bg-[#111927] px-5 py-4 flex items-center gap-3 border-b border-[#2a374b]">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-black text-white text-sm tracking-tight">Special Announcement</h3>
                                <p className="text-slate-400 text-xs uppercase tracking-widest font-medium">Optional highlighted banner</p>
                            </div>
                        </div>
                        <div className="p-5 space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Announcement Text
                            </label>
                            <textarea
                                value={formData.special_note}
                                onChange={(e) => setFormData(prev => ({ ...prev, special_note: e.target.value }))}
                                rows={3}
                                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-[#111927]/10 focus:border-[#111927] focus:bg-white transition-all outline-none resize-none"
                                placeholder="e.g., Birthday cake will be served at dinner! 🎂"
                            />
                            <p className="text-xs text-slate-400 font-medium">
                                This will appear as a highlighted banner on the student menu display.
                            </p>
                        </div>
                    </div>

                    {/* ── Action Buttons ── */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-[#111927] text-white font-bold py-4 rounded-xl hover:bg-[#1a2638] transition-all shadow-lg shadow-[#111927]/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    Saving…
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                                    </svg>
                                    Save Menu
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-6 py-4 bg-white border border-red-200 text-red-500 font-bold rounded-xl hover:bg-red-50 hover:border-red-300 transition-all active:scale-[0.98] flex items-center gap-2 text-base shadow-sm"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Delete
                        </button>
                    </div>
                </form>

                {/* ── Preview Link ── */}
                <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(17,25,39,0.08)] ring-1 ring-slate-100 overflow-hidden">
                    <div className="bg-[#111927] px-6 py-4 border-b border-[#2a374b] flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                        </div>
                        <div>
                            <span className="text-white font-bold text-sm">Preview Student View</span>
                            <p className="text-slate-400 text-xs uppercase tracking-widest font-medium mt-0.5">See how the menu looks to students</p>
                        </div>
                    </div>
                    <div className="p-5 flex items-center justify-between gap-4">
                        <p className="text-slate-500 text-sm font-medium">
                            Check the student-facing menu display to verify your changes look correct.
                        </p>
                        <a
                            href="/mess-menu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[#111927] text-white text-sm font-bold rounded-xl hover:bg-[#1a2638] transition-all shadow-md shadow-[#111927]/20 active:scale-[0.98]"
                        >
                            Open Preview
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center px-2 mt-8">
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">© 2026 HIVE CORE</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">System Secure</span>
                    </div>
                </div>
            </div>
        </div>
    );
}