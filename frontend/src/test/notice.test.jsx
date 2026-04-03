import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NoticePage from '../components/notice/NoticePage';

vi.mock('../lib/supabase', () => ({
    getNotices: vi.fn(() => Promise.resolve([
        {
            notice_id: 100,
            hostel_id: 'admin@test',
            title: 'Water Supply Interruption',
            description: 'Water supply cut from 2 to 3 pm',
            date: new Date().toISOString().split('T')[0],
            expiry_date: '2026-06-30'
        },
        {
            notice_id: 101,
            hostel_id: 'admin@test',
            title: 'Electricity Maintenance',
            description: 'Power cut on 19th March',
            date: new Date().toISOString().split('T')[0],
            expiry_date: '2026-06-30'
        }
    ])),
    subscribeToNotices: vi.fn(() => ({ unsubscribe: vi.fn() }))
}));

beforeEach(() => {
    localStorage.setItem('student', JSON.stringify({
        enroll_id: '101',
        hostel_id: 'admin@test'
    }));
});

function renderNotice() {
    return render(
        <BrowserRouter>
            <NoticePage />
        </BrowserRouter>
    );
}

describe('Notice Board', () => {

    beforeEach(() => vi.clearAllMocks());

    it('WB-N01: renders loading state initially', () => {
        renderNotice();
        expect(screen.getByText(/Loading notices/i)).toBeInTheDocument();
    });

    it('WB-N02: renders all notices after load', async () => {
        renderNotice();
        await waitFor(() => {
            expect(screen.getByText('Water Supply Interruption')).toBeInTheDocument();
            expect(screen.getByText('Electricity Maintenance')).toBeInTheDocument();
        });
    });

    it('WB-N03: shows correct notice count', async () => {
        renderNotice();
        await waitFor(() => {
            expect(screen.getByText(/Showing 2 notices/i)).toBeInTheDocument();
        });
    });

    it('WB-N04: search filters notices by title', async () => {
        renderNotice();
        await waitFor(() => {
            expect(screen.getByText('Water Supply Interruption')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText(/Search notices/i), {
            target: { value: 'water' }
        });

        await waitFor(() => {
            expect(screen.getByText('Water Supply Interruption')).toBeInTheDocument();
            expect(screen.queryByText('Electricity Maintenance')).not.toBeInTheDocument();
        });
    });

    it('WB-N05: search shows empty state when no match', async () => {
        renderNotice();
        await waitFor(() => {
            expect(screen.getByText('Water Supply Interruption')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText(/Search notices/i), {
            target: { value: 'xyzabc' }
        });

        await waitFor(() => {
            expect(screen.getByText(/No results for/i)).toBeInTheDocument();
        });
    });

    it('WB-N06: shows No Notices Found when empty', async () => {
        const { getNotices } = await import('../lib/supabase');
        getNotices.mockResolvedValueOnce([]);

        renderNotice();
        await waitFor(() => {
            expect(screen.getByText(/No Notices Found/i)).toBeInTheDocument();
        });
    });

    it('WB-N07: NEW badge shown for recent notice', async () => {
        renderNotice();
        await waitFor(() => {
            expect(screen.getAllByText('NEW').length).toBeGreaterThan(0);
        });
    });
});