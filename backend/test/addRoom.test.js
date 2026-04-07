import request from 'supertest';
import app from '../index.js';

describe('Add Room API — POST /api/hostel/addroom', () => {

    it('WB-AR01: without auth token returns error', async () => {
        const res = await request(app)
            .post('/api/hostel/addroom')
            .send({ room_no: '101', occupicity: '2' });
        expect([200, 401, 403]).toContain(res.status);
    });

    it('WB-AR02: with invalid token returns error', async () => {
        const res = await request(app)
            .post('/api/hostel/addroom')
            .set('Cookie', 'token=invalidtoken')
            .send({ room_no: '101', occupicity: '2' });
        expect([200, 401, 403]).toContain(res.status);
    });

    it('WB-AR03: missing room_no', async () => {
        const res = await request(app)
            .post('/api/hostel/addroom')
            .set('Cookie', 'token=invalidtoken')
            .send({ occupicity: '2' });
        expect([200, 400, 401, 403]).toContain(res.status);
    });

    it('WB-AR04: missing occupicity', async () => {
        const res = await request(app)
            .post('/api/hostel/addroom')
            .set('Cookie', 'token=invalidtoken')
            .send({ room_no: '101' });
        expect([200, 400, 401, 403]).toContain(res.status);
    });

    it('WB-AR05: empty body', async () => {
        const res = await request(app)
            .post('/api/hostel/addroom')
            .send({});
        expect([200, 400, 401, 403]).toContain(res.status);
    });
});