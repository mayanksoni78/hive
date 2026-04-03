import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminLogin from '../components/admin/login';

// fetch mock
global.fetch = vi.fn();

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

function renderAdminLogin() {
    return render(
        <BrowserRouter>
            <AdminLogin />
        </BrowserRouter>
    );
}

describe('Admin Login', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch.mockResolvedValue({
            json: async () => ({ msg: 'success' })
        });
    });

    it('WB-AL01: renders admin portal heading', () => {
        renderAdminLogin();
        expect(screen.getByText('Admin Portal')).toBeInTheDocument();
    });

    it('WB-AL02: renders Mess Admin and Transport Admin toggle buttons', () => {
        renderAdminLogin();
        expect(screen.getByText('Mess Admin')).toBeInTheDocument();
        expect(screen.getByText('Transport Admin')).toBeInTheDocument();
    });

    it('WB-AL03: Mess Admin selected by default', () => {
        renderAdminLogin();
        const messBtn = screen.getByText('Mess Admin');
        expect(messBtn.className).toContain('bg-white');
    });

    it('WB-AL04: clicking Transport Admin switches toggle', () => {
        renderAdminLogin();
        fireEvent.click(screen.getByText('Transport Admin'));
        const transportBtn = screen.getByText('Transport Admin');
        expect(transportBtn.className).toContain('bg-white');
    });

    it('WB-AL05: email placeholder changes with admin type', () => {
        renderAdminLogin();
        // Default Mess Admin
        expect(screen.getByPlaceholderText('admin@mess.hive.edu')).toBeInTheDocument();

        // Switch to Transport
        fireEvent.click(screen.getByText('Transport Admin'));
        expect(screen.getByPlaceholderText('admin@transport.hive.edu')).toBeInTheDocument();
    });

    it('WB-AL06: email field accepts input', () => {
        renderAdminLogin();
        const emailInput = screen.getByPlaceholderText('admin@mess.hive.edu');
        fireEvent.change(emailInput, { target: { value: 'admin@mess.com' } });
        expect(emailInput.value).toBe('admin@mess.com');
    });

    it('WB-AL07: password field accepts input', () => {
        renderAdminLogin();
        const passInput = screen.getByPlaceholderText('••••••••');
        fireEvent.change(passInput, { target: { value: 'secret123' } });
        expect(passInput.value).toBe('secret123');
    });

    it('WB-AL08: Login button present', () => {
        renderAdminLogin();
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('WB-AL09: Mess Admin login navigates to /admin/mess-menu', async () => {
        renderAdminLogin();
        fireEvent.click(screen.getByText('Login'));
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/admin/mess-menu');
        });
    });

    it('WB-AL10: Transport Admin login navigates to /update_bus', async () => {
        renderAdminLogin();
        fireEvent.click(screen.getByText('Transport Admin'));
        fireEvent.click(screen.getByText('Login'));
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/update_bus');
        });
    });

    it('WB-AL11: calls correct API endpoint on submit', async () => {
        renderAdminLogin();
        fireEvent.change(screen.getByPlaceholderText('admin@mess.hive.edu'), {
            target: { value: 'admin@mess.com' }
        });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), {
            target: { value: 'secret123' }
        });
        fireEvent.click(screen.getByText('Login'));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:3000/admin/login',
                expect.objectContaining({ method: 'POST' })
            );
        });
    });

    it('WB-AL12: back button present', () => {
        renderAdminLogin();
        // Back button SVG wala hai — navigate('/') call karega
        const backBtn = screen.getByRole('button', { name: '' });
        expect(backBtn).toBeInTheDocument();
    });

    it('WB-AL13: email field is required', () => {
        renderAdminLogin();
        const emailInput = screen.getByPlaceholderText('admin@mess.hive.edu');
        expect(emailInput).toBeRequired();
    });

    it('WB-AL14: password field is required', () => {
        renderAdminLogin();
        const passInput = screen.getByPlaceholderText('••••••••');
        expect(passInput).toBeRequired();
    });

    it('WB-AL15: footer branding visible', () => {
        renderAdminLogin();
        expect(screen.getByText(/HIVE CORE SYSTEMS/i)).toBeInTheDocument();
        expect(screen.getByText(/Systems Online/i)).toBeInTheDocument();
    });
});