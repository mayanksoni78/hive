import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TransportSchedule from '../Pages/Transport_Schedule';

// ✅ Chain matches: .from().select('*').gte().order().order()
// ✅ Each step returns a Promise at the end so await resolves
vi.mock('../lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                gte: vi.fn(() => ({
                    order: vi.fn(() => ({
                        order: vi.fn(() => Promise.resolve({
                            data: [
                                {
                                    transport_id: '1',
                                    pickup: 'Campus Gate',
                                    destination: 'City Center',
                                    start_time: '08:00',
                                    end_time: '08:45',
                                    date: '2099-01-01',
                                    day: 'Monday',
                                    student_count: 40,
                                    bus_count: 2,
                                    batch: 'Btech'
                                },
                                {
                                    transport_id: '2',
                                    pickup: 'Campus Gate',
                                    destination: 'Railway Station',
                                    start_time: '09:00',
                                    end_time: '09:30',
                                    date: '2099-01-01',
                                    day: 'Monday',
                                    student_count: 30,
                                    bus_count: 1,
                                    batch: 'Mtech'
                                }
                            ],
                            error: null
                        }))
                    }))
                }))
            }))
        }))
    }
}));

beforeEach(() => {
    localStorage.setItem('student', JSON.stringify({
        enroll_id: '101',
        hostel_id: 'admin@test'
    }));
});

function renderTransport() {
    return render(
        <BrowserRouter>
            <TransportSchedule />
        </BrowserRouter>
    );
}

describe('Transport Schedule', () => {

    beforeEach(() => vi.clearAllMocks());

    // ✅ WB-T01: wrap in waitFor — component starts loading, heading appears after fetch
    it('WB-T01: renders transport page', async () => {
        renderTransport();
        await waitFor(() => {
            expect(screen.getByText(/Bus Schedule Dashboard/i)).toBeInTheDocument();
        });
    });

    // ✅ WB-T02: unchanged logic, now works because mock resolves correctly
    it('WB-T02: shows routes after data loads', async () => {
        renderTransport();
        await waitFor(() => {
            expect(
                screen.getByText(/City Center/i) ||
                screen.getByText(/Campus Gate/i)
            ).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    // ✅ WB-T03: override returns empty array via correct chain + Promise
    it('WB-T03: shows no routes message when empty', async () => {
        const { supabase } = await import('../lib/supabase');
        supabase.from.mockReturnValueOnce({
            select: vi.fn(() => ({
                gte: vi.fn(() => ({
                    order: vi.fn(() => ({
                        order: vi.fn(() => Promise.resolve({ data: [], error: null }))
                    }))
                }))
            }))
        });

        renderTransport();
        // ✅ Matches "No trips scheduled" in the component's empty-state h3
        await waitFor(() => {
            expect(screen.getByText(/No trips scheduled/i)).toBeInTheDocument();
        }, { timeout: 3000 });
    });
});