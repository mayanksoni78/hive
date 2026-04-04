import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginHostel from '../components/hostel/login';

global.fetch = vi.fn();

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

function renderLogin() {
    return render(
        <BrowserRouter>
            <LoginHostel />
        </BrowserRouter>
    );
}

describe('Hostel Login', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch.mockResolvedValue({
            json: async () => ({ mssg: 'success' })
        });
    });

    it('WB-HL01: renders login form correctly', () => {
        renderLogin();
        expect(screen.getByPlaceholderText('admin@hostel.com')).toBeInTheDocument();
        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('WB-HL02: email field accepts input', () => {
        renderLogin();
        const emailInput = screen.getByPlaceholderText('admin@hostel.com');
        fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
        expect(emailInput.value).toBe('admin@test.com');
    });

    it('WB-HL03: password field accepts input', () => {
        renderLogin();
        const passwordInput = screen.getByLabelText(/password/i);
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        expect(passwordInput.value).toBe('password123');
    });

    it('WB-HL04: password toggle shows and hides password', () => {
        renderLogin();
        const passwordInput = screen.getByLabelText(/password/i);
        expect(passwordInput.type).toBe('password');

        const toggleBtn = screen.getByRole('button', { name: '' });
        fireEvent.click(toggleBtn);
        expect(passwordInput.type).toBe('text');
    });

    it('WB-HL05: shows Signing in on submit', async () => {
        renderLogin();
        fireEvent.change(screen.getByPlaceholderText('admin@hostel.com'), {
            target: { value: 'admin@test.com' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password123' }
        });
        fireEvent.click(screen.getByText('Sign In'));
        await waitFor(() => {
            expect(screen.getByText(/Signing in/i)).toBeInTheDocument();
        });
    });

    it('WB-HL06: remember me checkbox works', () => {
        renderLogin();
        const checkbox = screen.getByLabelText(/Remember me/i);
        expect(checkbox.checked).toBe(false);
        fireEvent.click(checkbox);
        expect(checkbox.checked).toBe(true);
    });

    it('WB-HL07: register link present', () => {
        renderLogin();
        expect(screen.getByText(/Register your hostel account/i)).toBeInTheDocument();
    });

    it('WB-HL08: calls correct API endpoint on submit', async () => {
        renderLogin();
        fireEvent.change(screen.getByPlaceholderText('admin@hostel.com'), {
            target: { value: 'admin@test.com' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password123' }
        });
        fireEvent.click(screen.getByText('Sign In'));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:3000/api/hostel/login',
                expect.objectContaining({ method: 'POST' })
            );
        });
    });
});