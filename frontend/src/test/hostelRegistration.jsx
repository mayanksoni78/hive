import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../components/hostel/registration';

global.fetch = vi.fn();

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

function renderRegistration() {
    return render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}

describe('Hostel Registration', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch.mockResolvedValue({
            json: async () => ({ msg: 'success' })
        });
    });

    it('WB-HR01: renders registration form', () => {
        renderRegistration();
        expect(screen.getByText('Hostel Registration')).toBeInTheDocument();
    });

    it('WB-HR02: hostel name field accepts input', () => {
        renderRegistration();
        const input = screen.getByPlaceholderText(/Sunrise Student Living/i);
        fireEvent.change(input, { target: { value: 'My Hostel' } });
        expect(input.value).toBe('My Hostel');
    });

    it('WB-HR03: address textarea accepts input', () => {
        renderRegistration();
        const textarea = screen.getByPlaceholderText(/Street address/i);
        fireEvent.change(textarea, { target: { value: '123 Main St' } });
        expect(textarea.value).toBe('123 Main St');
    });

    it('WB-HR04: owner name field accepts input', () => {
        renderRegistration();
        const input = screen.getByLabelText(/Owner Name/i);
        fireEvent.change(input, { target: { value: 'John Doe' } });
        expect(input.value).toBe('John Doe');
    });

    it('WB-HR05: owner contact accepts input', () => {
        renderRegistration();
        const input = screen.getByPlaceholderText(/\+91 98765/i);
        fireEvent.change(input, { target: { value: '9876543210' } });
        expect(input.value).toBe('9876543210');
    });

    it('WB-HR06: submit button present', () => {
        renderRegistration();
        expect(screen.getByText(/Register Hostel/i)).toBeInTheDocument();
    });

    it('WB-HR07: shows Registering on submit', async () => {
        renderRegistration();
        fireEvent.change(screen.getByPlaceholderText(/Sunrise/i), { target: { value: 'My Hostel' } });
        fireEvent.change(screen.getByLabelText(/Owner Name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText(/\+91 98765/i), { target: { value: '9876543210' } });

        fireEvent.click(screen.getByText(/Register Hostel/i));
        await waitFor(() => {
            expect(screen.getByText(/Registering/i)).toBeInTheDocument();
        });
    });

    it('WB-HR08: calls correct API on submit', async () => {
        renderRegistration();
        fireEvent.change(screen.getByPlaceholderText(/Sunrise/i), { target: { value: 'My Hostel' } });
        fireEvent.change(screen.getByLabelText(/Owner Name/i), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText(/\+91 98765/i), { target: { value: '9876543210' } });

        fireEvent.click(screen.getByText(/Register Hostel/i));
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:3000/api/hostel/signup',
                expect.objectContaining({ method: 'POST' })
            );
        });
    });

    it('WB-HR09: already have account link present', () => {
        renderRegistration();
        expect(screen.getByText(/Already have account/i)).toBeInTheDocument();
    });

    it('WB-HR10: password field present', () => {
        renderRegistration();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });
});