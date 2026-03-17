import { useState, useEffect } from 'react';
import { getNotices, subscribeToNotices } from '../../lib/supabase';

const HOSTEL_ID = 1;

export default function NoticePage() {
    const [notices, setNotices]= useState([]);
    const [loading, setLoading]= useState(true);
    const [search, setSearch]= useState('');

    useEffect(() => {
        loadNotices();
        const subscription=subscribeToNotices(HOSTEL_ID, () => {
            loadNotices();
        });
        return()=>subscription.unsubscribe();
    }, []);

    async function loadNotices() {
        try {
            setLoading(true);
            const data=await getNotices(HOSTEL_ID);
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 
                                    border-b-4 border-blue-600 mx-auto mb-4"/>
                    <p className="text-gray-600">Loading notices...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-1">
                        📋 Notice Board
                    </h1>
                    <p className="text-gray-500">
                        Stay updated with hostel announcements
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <input
                        type="text"
                        placeholder="🔍 Search notices..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 
                                   rounded-lg focus:ring-2 focus:ring-blue-500 
                                   focus:border-transparent outline-none"
                    />
                </div>

                <p className="text-sm text-gray-500 mb-4 px-1">
                    Showing {filtered.length} notice{filtered.length !== 1 ? 's' : ''}
                </p>
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <span className="text-6xl block mb-4">📭</span>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">
                            No Notices Found
                        </h3>
                        <p className="text-gray-500">
                            {search
                                ? `No results for "${search}"`
                                : 'No active notices right now'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map(notice => (
                            <div
                                key={notice.notice_id}
                                className="bg-white rounded-lg shadow-md p-5 
                                           border-l-4 border-blue-500 
                                           hover:shadow-lg transition"
                            >

                                <h2 className="font-bold text-gray-800 text-lg mb-2">
                                    {notice.title}
                                    {isNew(notice.date) && (
                                        <span className="ml-2 text-xs bg-red-500 
                                                         text-white px-2 py-0.5 
                                                         rounded-full">
                                            NEW
                                        </span>
                                    )}
                                </h2>


                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    {notice.description}
                                </p>

                                <div className="flex items-center justify-between 
                                                text-xs text-gray-400">
                                    <span>📅 Posted: {formatDate(notice.date)}</span>
                                    {notice.expiry_date && (
                                        <span>⏳ Valid till: {formatDate(notice.expiry_date)}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}