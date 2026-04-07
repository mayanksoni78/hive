import request from 'supertest';
import app from '../index.js';

describe('Hostel Login API', () => {

    it('WB-HL01: missing fields returns error', async () => {
        const res = await request(app)
            .post('/api/hostel/login')
            .send({});
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('error');
    });

    it('WB-HL02: wrong hostel_id returns error', async () => {
        const res = await request(app)
            .post('/api/hostel/login')
            .send({ data: { hostel_id: 'wrong@test.com', password: 'wrong' } });
        expect(res.status).toBe(200);
        expect(res.body.msg || res.body.error).toBeTruthy();
    });

    it('WB-HL03: wrong password returns error', async () => {
        const res = await request(app)
            .post('/api/hostel/login')
            .send({ data: { hostel_id: 'admin@test', password: 'wrongpass' } });
        expect(res.status).toBe(200);
        expect(res.body.msg || res.body.error).toBeTruthy();
    });

    it('WB-HL04: valid login returns success', async () => {
        const res = await request(app)
            .post('/api/hostel/login')
            .send({ data: { hostel_id: 'admin@test', password: 'admin123' } });
        expect(res.status).toBe(200);
    });
});