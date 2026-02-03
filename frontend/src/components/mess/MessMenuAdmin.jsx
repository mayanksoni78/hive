import {useState , useEffect} from 'react';
import { upsertMenu, getMenuByDate, deleteMenu } from '../../lib/supabase';

export default function MessMenuAdmin() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        breakfast: { items: [''], time: '7:30 AM - 9:00 AM' },
        lunch: { items: [''], time: '12:30 PM - 2:00 PM' },
        snacks: { items: [''], time: '4:30 PM - 5:30 PM' },
        dinner: { items: [''], time: '7:30 PM - 9:30 PM' },
        special_note: '',
        is_holiday: false
    });
    //to call when date changes
    useEffect(() => {
        loadExistingMenu(selectedDate);
    }, [selectedDate]);

    async function loadExistingMenu(date) {
        try {
            const menu = await getMenuByDate(date);
            if (menu) {
                setFormData({
                    breakfast: menu.breakfast,
                    lunch: menu.lunch,
                    snacks: menu.snacks,
                    dinner: menu.dinner,
                    special_note: menu.special_note || '',
                    is_holiday: menu.is_holiday || false
                });
            } else {
                // Reset to default if no menu exists
                setFormData({
                    breakfast: { items: [''], time: '7:30 AM - 9:00 AM' },
                    lunch: { items: [''], time: '12:30 PM - 2:00 PM' },
                    snacks: { items: [''], time: '4:30 PM - 5:30 PM' },
                    dinner: { items: [''], time: '7:30 PM - 9:30 PM' },
                    special_note: '',
                    is_holiday: false
                });
            }
        } catch (error) {
            console.error('Error loading menu:', error);
        }
    }
    
    const addItem = (mealType) => {
        setFormData(prev => ({//updating based on the old state
            ...prev,          //spread operator to copy previous state
                              //react updates are asyc
            [mealType]: {
                ...prev[mealType],
                items: [...prev[mealType].items, '']//so as to add the empty space at the end
            }
        }));
    };
    
    const updateItem = (mealType, index, value) => {
        setFormData(prev => ({
            ...prev,
            [mealType]: {//shallow comparison // react only re-renders if the reference changes //so thats why map is used
                ...prev[mealType],
                items: prev[mealType].items.map((item, i) => 
                    i === index ? value : item
                )
            }
        }));
    };
    
    const removeItem = (mealType, index) => {
        setFormData(prev => ({
            ...prev,
            [mealType]: {
                ...prev[mealType],
                items: prev[mealType].items.filter((_, i) => i !== index)//iterate and keep all except the one at index
            }
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const cleanedData = {
                date: selectedDate,
                breakfast: {
                    ...formData.breakfast,
                    items: formData.breakfast.items.filter(item => item.trim())
                },
                lunch: {
                    ...formData.lunch,
                    items: formData.lunch.items.filter(item => item.trim())
                },
                snacks: {
                    ...formData.snacks,
                    items: formData.snacks.items.filter(item => item.trim())
                },
                dinner: {
                    ...formData.dinner,
                    items: formData.dinner.items.filter(item => item.trim())
                },
                special_note: formData.special_note.trim() || null,
                is_holiday: formData.is_holiday
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
        if (!confirm(`Are you sure you want to delete the menu for ${selectedDate}?`)) {
            return;
        }
        
        try {
            await deleteMenu(selectedDate);
            alert('✅ Menu deleted successfully!');
            // Reset form
            setFormData({
                breakfast: { items: [''], time: '7:30 AM - 9:00 AM' },
                lunch: { items: [''], time: '12:30 PM - 2:00 PM' },
                snacks: { items: [''], time: '4:30 PM - 5:30 PM' },
                dinner: { items: [''], time: '7:30 PM - 9:30 PM' },
                special_note: '',
                is_holiday: false
            });
        } catch (error) {
            alert('❌ Error deleting menu: ' + error.message);
        }
    };
    
    const renderMealSection = (mealType, label, icon) => (
        <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{icon}</span>
                <h3 className="font-bold text-lg">{label}</h3>
            </div>
            
            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Timing</label>
                <input
                    type="text"
                    value={formData[mealType].time}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        [mealType]: { ...prev[mealType], time: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 7:30 AM - 9:00 AM"
                />
            </div>
            
            <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
            <div className="space-y-2">
                {formData[mealType].items.map((item, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => updateItem(mealType, index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter food item"
                        />
                        {formData[mealType].items.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeItem(mealType, index)}
                                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>
            
            <button
                type="button"
                onClick={() => addItem(mealType)}
                className="mt-2 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition"
            >
                + Add Item
            </button>
        </div>
    );
    
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">🔧 Mess Menu Admin</h1>
                    <p className="text-gray-600">Create and manage daily mess menus</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Date Selection */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Date *
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            If a menu exists for this date, it will be loaded for editing
                        </p>
                    </div>
                    
                    {/* Holiday Toggle */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_holiday}
                                onChange={(e) => setFormData(prev => ({ 
                                    ...prev, 
                                    is_holiday: e.target.checked 
                                }))}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <div>
                                <span className="font-medium text-gray-800">Mark as Holiday</span>
                                <p className="text-sm text-gray-600">Mess will be closed on this day</p>
                            </div>
                        </label>
                    </div>
                    
                    {/* Meals Grid */}
                    {!formData.is_holiday && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {renderMealSection('breakfast', 'Breakfast', '🌅')}
                            {renderMealSection('lunch', 'Lunch', '🍛')}
                            {renderMealSection('snacks', 'Snacks', '☕')}
                            {renderMealSection('dinner', 'Dinner', '🌙')}
                        </div>
                    )}
                    
                    {/* Special Note */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Special Announcement (Optional)
                        </label>
                        <textarea
                            value={formData.special_note}
                            onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                special_note: e.target.value 
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Birthday cake will be served at dinner! 🎂"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            This will appear as a highlighted banner on the menu display
                        </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition shadow-lg"
                        >
                            {loading ? '💾 Saving...' : '💾 Save Menu'}
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-8 py-4 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition shadow-lg"
                        >
                            🗑️ Delete
                        </button>
                    </div>
                </form>
                
                {/* Preview Link */}
                <div className="mt-6 bg-blue-50 border-2 border-blue-300 rounded-lg p-4 text-center">
                    <p className="text-blue-900 mb-2">
                        Want to see how it looks?
                    </p>
                    
                    <a
                        href="/mess-menu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        👁️ Preview Student View
                    </a>
                </div>
            </div>
        </div>
    );
}