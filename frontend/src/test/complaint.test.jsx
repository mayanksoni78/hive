import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ComplainPage from '../Pages/ComplainPage';

vi.mock('../lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            insert: vi.fn(() => ({ data: [{}], error: null })),
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    order: vi.fn(() => ({ data: [], error: null }))
                }))
            }))
        }))
    }
}));

beforeEach(() => {
    localStorage.setItem('student', JSON.stringify({
        enroll_id: '101',
        hostel_id: 'admin@test',
        name: 'Test Student'
    }));
});

function renderComplaint() {
    return render(
        <BrowserRouter>
            <ComplainPage />
        </BrowserRouter>
    );
}

describe('Complaint Module', () => {

    beforeEach(() => vi.clearAllMocks());

    it('WB-C01: renders complaint form', () => {
        renderComplaint();
        expect(screen.getByRole('button', { name: /Submit Record/i }))
            .toBeInTheDocument();
    });

    it('WB-C02: form has required fields', () => {
        renderComplaint();
        const roomInput = screen.getByPlaceholderText(/A-204/i);
        expect(roomInput).toBeRequired();
        const description = screen.getByPlaceholderText(/Please provide specifics/i);
        expect(description).toBeRequired();
    });

    it('WB-C03: dropdown has correct options', () => {
        renderComplaint();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByText('Maintenance & Repairs')).toBeInTheDocument();
        expect(screen.getByText('Food & Mess')).toBeInTheDocument();
        expect(screen.getByText('Transportation')).toBeInTheDocument();
        expect(screen.getByText('Other / General')).toBeInTheDocument();
    });

    it('WB-C04: student name pre-filled from localStorage', () => {
        renderComplaint();
        expect(screen.getByText('Test Student')).toBeInTheDocument();
    });

    it('WB-C05: student enroll_id shown from localStorage', () => {
        renderComplaint();
        expect(screen.getByText('101')).toBeInTheDocument();
    });

    it('WB-C06: room input accepts value', () => {
        renderComplaint();
        const roomInput = screen.getByPlaceholderText(/A-204/i);
        fireEvent.change(roomInput, { target: { value: 'B-101' } });
        expect(roomInput.value).toBe('B-101');
    });

    it('WB-C07: description textarea accepts value', () => {
        renderComplaint();
        const desc = screen.getByPlaceholderText(/Please provide specifics/i);
        fireEvent.change(desc, { target: { value: 'Fan not working' } });
        expect(desc.value).toBe('Fan not working');
    });

    it('WB-C08: Reset Form button present', () => {
        renderComplaint();
        expect(screen.getByRole('button', { name: /Reset Form/i }))
            .toBeInTheDocument();
    });

    it('WB-C09: image upload accepts images only', () => {
        renderComplaint();
        const fileInput = document.querySelector('input[type="file"]');
        expect(fileInput).toBeInTheDocument();
        expect(fileInput.accept).toBe('image/*');
    });

    it('WB-C10: Complaint Page header visible', () => {
        renderComplaint();
        expect(screen.getByText('Complaint Page')).toBeInTheDocument();
    });
});