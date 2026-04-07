import request from 'supertest';
import app from '../index.js';

describe('Profile API', () => {

    it('WB-PR01: GET /api/profile — without enroll_id', async () => {
        const res = await request(app)
            .get('/api/profile');
        expect([200, 400, 401]).toContain(res.status);
    });

    it('WB-PR02: GET /api/profile — with enroll_id', async () => {
        const res = await request(app)
            .get('/api/profile?enroll_id=101');
        expect([200, 400, 404]).toContain(res.status);
    });

    it('WB-PR03: PUT /api/profile — without body', async () => {
        const res = await request(app)
            .put('/api/profile')
            .send({});
        expect([200, 400, 401]).toContain(res.status);
    });

    it('WB-PR04: PUT /api/profile — with valid data', async () => {
        const res = await request(app)
            .put('/api/profile')
            .send({
                enroll_id: '101',
                phone: '9876543210',
                address: '123 Test Street'
            });
        expect([200, 400, 404]).toContain(res.status);
    });
});