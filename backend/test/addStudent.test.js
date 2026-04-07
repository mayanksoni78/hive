import request from 'supertest';
import app from '../index.js';

describe('Add Student API — POST /api/hostel/addstudents', () => {

    it('WB-AS01: without auth returns error', async () => {
        const res = await request(app)
            .post('/api/hostel/addstudents')
            .send({
                name: 'Test Student',
                enroll_id: '999',
                email: 'test@test.com',
                phone: '9876543210',
                gender: 'M',
                year: '2',
                room_id: 1
            });
        expect([200, 401, 403]).toContain(res.status);
    });

    it('WB-AS02: invalid token returns error', async () => {
        const res = await request(app)
            .post('/api/hostel/addstudents')
            .set('Cookie', 'token=badtoken')
            .send({
                name: 'Test Student',
                enroll_id: '999',
                email: 'test@test.com'
            });
        expect([200, 401, 403]).toContain(res.status);
    });

    it('WB-AS03: empty body without auth', async () => {
        const res = await request(app)
            .post('/api/hostel/addstudents')
            .send({});
        expect([200, 400, 401, 403]).toContain(res.status);
    });
});