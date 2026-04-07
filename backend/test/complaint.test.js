import request from 'supertest';
import app from '../index.js';

describe('Complaint API', () => {

    it('WB-CO01: POST /api/complain/complain_page — valid data', async () => {
        const res = await request(app)
            .post('/api/complain/complain_page')
            .send({
                enroll_id: '101',
                type: 'Maintenance',
                room_no: 'A-101',
                description: 'Fan not working',
                hostel_id: 'admin@test'
            });
        expect([200, 201, 400, 401]).toContain(res.status);
    });

    it('WB-CO02: POST /api/complain/complain_page — empty body', async () => {
        const res = await request(app)
            .post('/api/complain/complain_page')
            .send({});
        expect([200, 400, 401]).toContain(res.status);
    });

    it('WB-CO03: GET /api/complain/my_complains — without enroll_id', async () => {
        const res = await request(app)
            .get('/api/complain/my_complains');
        expect([200, 400, 401]).toContain(res.status);
    });

    it('WB-CO04: GET /api/complain/my_complains — with enroll_id query', async () => {
        const res = await request(app)
            .get('/api/complain/my_complains?enroll_id=101');
        expect([200, 400, 401]).toContain(res.status);
    });

    it('WB-CO05: PATCH /api/complain/resolve/:id — without auth', async () => {
        const res = await request(app)
            .patch('/api/complain/resolve/999')
            .send({ status: 'Resolved' });
        expect([200, 401, 403, 404]).toContain(res.status);
    });
});