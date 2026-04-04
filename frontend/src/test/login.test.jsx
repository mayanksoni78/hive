import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../components/student/login';

vi.mock('../lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    data: [{
                        enroll_id: '101',
                        email: 'test@gmail.com',
                        password: 'pass123'
                    }],
                    error: null
                }))
            }))
        }))
    }
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

function renderLogin() {
    return render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );
}

describe('Student Login', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('WB-L01: renders login form correctly', () => {
        renderLogin();
        expect(screen.getByPlaceholderText('101')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('name@university.edu')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    it('WB-L02: shows error when enroll_id not found', async () => {
        const { supabase } = await import('../lib/supabase');
        supabase.from.mockReturnValueOnce({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({ data: [], error: null }))
            }))
        });

        renderLogin();
        fireEvent.change(screen.getByPlaceholderText('101'),
            { target: { value: '999' } });
        fireEvent.change(screen.getByPlaceholderText('name@university.edu'),
            { target: { value: 'test@gmail.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'),
            { target: { value: 'pass123' } });
        fireEvent.click(screen.getByText('Login to Dashboard'));

        await waitFor(() => {
            expect(screen.getByText(/No student found/i)).toBeInTheDocument();
        });
    });

    it('WB-L03: shows error when email does not match', async () => {
        renderLogin();
        fireEvent.change(screen.getByPlaceholderText('101'),
            { target: { value: '101' } });
        fireEvent.change(screen.getByPlaceholderText('name@university.edu'),
            { target: { value: 'wrong@gmail.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'),
            { target: { value: 'pass123' } });
        fireEvent.click(screen.getByText('Login to Dashboard'));

        await waitFor(() => {
            expect(screen.getByText("Email doesn't match.")).toBeInTheDocument();
        });
    });

    it('WB-L04: shows error when password does not match', async () => {
        renderLogin();
        fireEvent.change(screen.getByPlaceholderText('101'),
            { target: { value: '101' } });
        fireEvent.change(screen.getByPlaceholderText('name@university.edu'),
            { target: { value: 'test@gmail.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'),
            { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByText('Login to Dashboard'));

        await waitFor(() => {
            expect(screen.getByText("Password doesn't match.")).toBeInTheDocument();
        });
    });

    it('WB-L05: valid login redirects to student-dashboard', async () => {
        const { supabase } = await import('../lib/supabase');
        supabase.from.mockReturnValue({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    single: vi.fn(() => ({
                        data: { enroll_id: '101', email: 'test@gmail.com', hostel_id: 'admin@test' },
                        error: null
                    })),
                    data: [{ enroll_id: '101', email: 'test@gmail.com', password: 'pass123' }],
                    error: null
                }))
            }))
        });

        renderLogin();
        fireEvent.change(screen.getByPlaceholderText('101'),
            { target: { value: '101' } });
        fireEvent.change(screen.getByPlaceholderText('name@university.edu'),
            { target: { value: 'test@gmail.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'),
            { target: { value: 'pass123' } });
        fireEvent.click(screen.getByText('Login to Dashboard'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/student-dashboard');
        });
    });
});