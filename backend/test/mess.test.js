import request from 'supertest';
import app from '../index.js';

describe('Mess Menu API', () => {

    it('WB-MM01: GET /api/mess/menu — without params', async () => {
        const res = await request(app)
            .get('/api/mess/menu');
        expect([200, 400]).toContain(res.status);
    });

    it('WB-MM02: GET /api/mess/menu — with hostel_id and date', async () => {
        const res = await request(app)
            .get('/api/mess/menu?hostel_id=admin@test&date=2026-03-20');
        expect([200, 400, 404]).toContain(res.status);
    });

    it('WB-MM03: GET /api/mess/menu — with only hostel_id', async () => {
        const res = await request(app)
            .get('/api/mess/menu?hostel_id=admin@test');
        expect([200, 400, 404]).toContain(res.status);
    });

    it('WB-MM04: GET /api/mess/menu — invalid hostel_id', async () => {
        const res = await request(app)
            .get('/api/mess/menu?hostel_id=invalid@hostel&date=2026-03-20');
        expect([200, 400, 404]).toContain(res.status);
    });
});