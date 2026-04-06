import React from 'react';

const mealIcons = {
    breakfast: '🌅',
    lunch: '🍛',
    snacks: '☕',
    dinner: '🌙'
};

const mealAccents = {
    breakfast: 'bg-amber-500',
    lunch:     'bg-emerald-500',
    snacks:    'bg-[#4f73b3]',
    dinner:    'bg-slate-500'
};

const mealLabels = {
    breakfast: 'Morning Meal',
    lunch:     'Afternoon Meal',
    snacks:    'Evening Snacks',
    dinner:    'Night Meal'
};

export default function MealCard({ mealType, mealData }) {
    if (!mealData || !mealData.items || mealData.items.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(17,25,39,0.08)] border border-slate-200 ring-1 ring-slate-100 overflow-hidden">

            {/* Card Header */}
            <div className="bg-[#111927] px-5 py-4 flex items-center gap-3 border-b border-[#2a374b]">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-xl shrink-0">
                    {mealIcons[mealType]}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-black text-white text-base capitalize tracking-tight">{mealType}</h3>
                    <p className="text-slate-400 text-xs uppercase tracking-widest font-medium">{mealLabels[mealType]}</p>
                </div>
                {mealData.time && (
                    <span className="text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 rounded-lg px-3 py-1 shrink-0">
                        {mealData.time}
                    </span>
                )}
            </div>

            {/* Accent bar */}
            <div className={`h-0.5 w-full ${mealAccents[mealType]}`} />

            {/* Items List */}
            <div className="px-5 py-4">
                <ul className="space-y-2.5">
                    {mealData.items.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <span className="mt-1 shrink-0 w-4 h-4 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                            <span className="text-sm text-slate-700 font-medium leading-snug">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Footer count */}
            <div className="px-5 pb-4">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    {mealData.items.length} {mealData.items.length === 1 ? 'item' : 'items'}
                </p>
            </div>
        </div>
    );
}