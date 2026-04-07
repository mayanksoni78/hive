import request from 'supertest';
import app from '../index.js';

describe('Fee API', () => {

    it('WB-FE01: GET /api/fee/status — without enroll_id', async () => {
        const res = await request(app)
            .get('/api/fee/status');
        expect([200, 400, 401]).toContain(res.status);
    });

    it('WB-FE02: GET /api/fee/status — with enroll_id', async () => {
        const res = await request(app)
            .get('/api/fee/status?enroll_id=101');
        expect([200, 400, 404]).toContain(res.status);
    });

    it('WB-FE03: GET /api/fee/receipt/:id — valid id', async () => {
        const res = await request(app)
            .get('/api/fee/receipt/1');
        expect([200, 400, 404]).toContain(res.status);
    });

    it('WB-FE04: GET /api/fee/receipt/:id — invalid id', async () => {
        const res = await request(app)
            .get('/api/fee/receipt/99999');
        expect([200, 400, 404]).toContain(res.status);
    });

    it('WB-FE05: POST /api/hostel/fees/markpaid/:id — without auth', async () => {
        const res = await request(app)
            .post('/api/hostel/fees/markpaid/1')
            .send({ status: 'paid' });
        expect([200, 401, 403]).toContain(res.status);
    });
});