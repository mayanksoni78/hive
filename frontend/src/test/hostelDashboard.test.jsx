import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../components/hostel/hostel';

// fetch mock
global.fetch = vi.fn();

const mockDashboardData = {
    data: [{
        hostel_id: 'admin@test',
        hostel_name: 'Test Hostel',
        room: [
            { room_id: 1, room_no: '101', capacity: 2, occupied: 1, status: 'available' },
            { room_id: 2, room_no: '102', capacity: 2, occupied: 2, status: 'occupied' }
        ],
        student: [
            { enroll_id: '101', name: 'Raj Patel', email: 'raj@gmail.com', phone: '9876543210', gender: 'Male', year: '2nd Year', room_id: 1 }
        ],
        complaints: [
            { complaint_id: 1, complain_type: 'Maintenance', room_no: '101', description: 'Fan not working', status: 'Pending', date: '2026-03-20' }
        ],
        fee: [
            { fee_id: 1, enroll_id: '101', amount: '12000', status: 'paid', due_date: '2026-03-31', paid_date: '2026-03-10' },
            { fee_id: 2, enroll_id: '102', amount: '12000', status: 'unpaid', due_date: '2026-03-31', paid_date: null }
        ],
        admin: [
            { admin_id: 1, name: 'Super Admin', email: 'admin@hive.com', department: 'Hostel_Admin', phone: '9876543210' }
        ]
    }]
};

function renderDashboard() {
    return render(
        <BrowserRouter>
            <Dashboard />
        </BrowserRouter>
    );
}

describe('Hostel Dashboard', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch.mockResolvedValue({
            json: async () => mockDashboardData
        });
    });

    it('WB-HD01: shows loading state initially', () => {
        renderDashboard();
        expect(screen.getByText(/Loading dashboard/i)).toBeInTheDocument();
    });

    it('WB-HD02: renders hostel name after data loads', async () => {
        renderDashboard();
        await waitFor(() => {
            expect(screen.getByText('Test Hostel')).toBeInTheDocument();
        });
    });

    it('WB-HD03: renders all nav tabs', async () => {
    renderDashboard();
    await waitFor(() => {
        expect(screen.getAllByText('Overview').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Rooms').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Students').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Complaints').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Fees').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Admins').length).toBeGreaterThan(0);
    });
});

    it('WB-HD04: shows correct room count in stat card', async () => {
        renderDashboard();
        await waitFor(() => {
            expect(screen.getByText('Total Rooms')).toBeInTheDocument();
        });
    });

    it('WB-HD05: clicking Rooms tab shows rooms section', async () => {
        renderDashboard();
        await waitFor(() => screen.getByText('Test Hostel'));
        fireEvent.click(screen.getAllByText('Rooms')[0]);
        await waitFor(() => {
            expect(screen.getByText(/Room 101/i)).toBeInTheDocument();
        });
    });

    it('WB-HD06: clicking Students tab shows students section', async () => {
        renderDashboard();
        await waitFor(() => screen.getByText('Test Hostel'));
        fireEvent.click(screen.getAllByText('Students')[0]);
        await waitFor(() => {
            expect(screen.getByText('Raj Patel')).toBeInTheDocument();
        });
    });

    it('WB-HD07: clicking Complaints tab shows complaint', async () => {
        renderDashboard();
        await waitFor(() => screen.getByText('Test Hostel'));
        fireEvent.click(screen.getAllByText('Complaints')[0]);
        await waitFor(() => {
            expect(screen.getByText(/Fan not working/i)).toBeInTheDocument();
        });
    });

    it('WB-HD08: clicking Fees tab shows fee records', async () => {
        renderDashboard();
        await waitFor(() => screen.getByText('Test Hostel'));
        fireEvent.click(screen.getAllByText('Fees')[0]);
        await waitFor(() => {
            expect(screen.getAllByText(/101/i).length).toBeGreaterThan(0);
        });
    });

    it('WB-HD09: clicking Admins tab shows admin info', async () => {
        renderDashboard();
        await waitFor(() => screen.getByText('Test Hostel'));
        fireEvent.click(screen.getAllByText('Admins')[0]);
        await waitFor(() => {
            expect(screen.getByText('Super Admin')).toBeInTheDocument();
        });
    });

    it('WB-HD10: shows error when API fails', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network Error'));
        renderDashboard();
        await waitFor(() => {
            expect(screen.getByText(/Failed to load dashboard/i)).toBeInTheDocument();
        });
    });

    it('WB-HD11: pending complaints count shown correctly', async () => {
        renderDashboard();
        await waitFor(() => {
            expect(screen.getByText(/1 pending/i)).toBeInTheDocument();
        });
    });

    it('WB-HD12: unpaid fees count shown correctly', async () => {
        renderDashboard();
        await waitFor(() => {
            expect(screen.getByText(/1 unpaid/i)).toBeInTheDocument();
        });
    });

    it('WB-HD13: Add Room button visible in rooms tab', async () => {
        renderDashboard();
        await waitFor(() => screen.getByText('Test Hostel'));
        fireEvent.click(screen.getAllByText('Rooms')[0]);
        await waitFor(() => {
            expect(screen.getByText(/Add Room/i)).toBeInTheDocument();
        });
    });

    it('WB-HD14: Add Student button visible in students tab', async () => {
        renderDashboard();
        await waitFor(() => screen.getByText('Test Hostel'));
        fireEvent.click(screen.getAllByText('Students')[0]);
        await waitFor(() => {
            expect(screen.getByText(/Add Student/i)).toBeInTheDocument();
        });
    });

    it('WB-HD15: fee collected amount shows correctly', async () => {
        renderDashboard();
        await waitFor(() => screen.getByText('Test Hostel'));
        fireEvent.click(screen.getAllByText('Fees')[0]);
        await waitFor(() => {
            expect(screen.getByText('Collected')).toBeInTheDocument();
            expect(screen.getByText('Pending')).toBeInTheDocument();
        });
    });
});