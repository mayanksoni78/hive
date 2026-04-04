import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MessMenuDisplay from '../components/mess/MessMenuDisplay';

// Supabase mock
vi.mock('../lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    eq: vi.fn(() => ({
                        single: vi.fn(() => ({
                            data: {
                                id: '1',
                                date: new Date().toISOString().split('T')[0],
                                hostel_id: 'admin@test',
                                breakfast: { time: '7:30 AM - 9:00 AM', items: ['Poha', 'Chai'] },
                                lunch: { time: '12:30 PM - 2:00 PM', items: ['Dal', 'Rice'] },
                                snacks: { time: '4:30 PM - 5:30 PM', items: ['Samosa'] },
                                dinner: { time: '7:30 PM - 9:30 PM', items: ['Paneer', 'Roti'] },
                                special_note: null,
                                is_holiday: false,
                                updated_at: new Date().toISOString(),
                                version: 1
                            },
                            error: null
                        }))
                    }))
                }))
            }))
        })),
        channel: vi.fn(() => ({
            on: vi.fn(() => ({ subscribe: vi.fn() }))
        }))
    },
    getMenuByDate: vi.fn(() => Promise.resolve({
        id: '1',
        date: new Date().toISOString().split('T')[0],
        hostel_id: 'admin@test',
        breakfast: { time: '7:30 AM - 9:00 AM', items: ['Poha', 'Chai'] },
        lunch: { time: '12:30 PM - 2:00 PM', items: ['Dal', 'Rice'] },
        snacks: { time: '4:30 PM - 5:30 PM', items: ['Samosa'] },
        dinner: { time: '7:30 PM - 9:30 PM', items: ['Paneer', 'Roti'] },
        special_note: null,
        is_holiday: false,
        updated_at: new Date().toISOString(),
        version: 1
    })),
    subscribeToMenuUpdates: vi.fn(() => ({ unsubscribe: vi.fn() }))
}));

// localStorage mock
beforeEach(() => {
    localStorage.setItem('student', JSON.stringify({
        enroll_id: '101',
        hostel_id: 'admin@test',
        name: 'Test Student'
    }));
});

function renderMessMenu() {
    return render(
        <BrowserRouter>
            <MessMenuDisplay />
        </BrowserRouter>
    );
}

describe('Mess Menu Display', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('WB-M01: renders loading state initially', () => {
        renderMessMenu();
        expect(screen.getByText(/Loading menu/i)).toBeInTheDocument();
    });

    it('WB-M02: renders meal cards after data loads', async () => {
        renderMessMenu();
        await waitFor(() => {
            expect(screen.getByText(/Poha/i)).toBeInTheDocument();
        });
    });

    it('WB-M03: shows breakfast items correctly', async () => {
        renderMessMenu();
        await waitFor(() => {
            expect(screen.getByText('Chai')).toBeInTheDocument();
        });
    });

    it('WB-M04: shows No Menu Available when data is null', async () => {
        const { getMenuByDate } = await import('../lib/supabase');
        getMenuByDate.mockResolvedValueOnce(null);

        renderMessMenu();
        await waitFor(() => {
            expect(screen.getByText(/No Menu Available/i)).toBeInTheDocument();
        });
    });

    it('WB-M05: shows holiday message when is_holiday is true', async () => {
        const { getMenuByDate } = await import('../lib/supabase');
        getMenuByDate.mockResolvedValueOnce({
            is_holiday: true,
            breakfast: { items: [] },
            lunch: { items: [] },
            snacks: { items: [] },
            dinner: { items: [] },
            updated_at: new Date().toISOString(),
            version: 1
        });

        renderMessMenu();
        await waitFor(() => {
            expect(screen.getByText(/Holiday/i)).toBeInTheDocument();
        });
    });

    it('WB-M06: shows special note when present', async () => {
        const { getMenuByDate } = await import('../lib/supabase');
        getMenuByDate.mockResolvedValueOnce({
            is_holiday: false,
            special_note: 'Birthday cake at dinner!',
            breakfast: { time: '7:30 AM', items: ['Poha'] },
            lunch: { time: '12:30 PM', items: ['Rice'] },
            snacks: { time: '4:30 PM', items: ['Samosa'] },
            dinner: { time: '7:30 PM', items: ['Cake'] },
            updated_at: new Date().toISOString(),
            version: 1
        });

        renderMessMenu();
        await waitFor(() => {
            expect(screen.getByText(/Birthday cake at dinner/i)).toBeInTheDocument();
        });
    });
});