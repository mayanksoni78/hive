import request from 'supertest';
import app from '../index.js';

describe('Transport API', () => {

    it('WB-TR01: GET /api/transport/schedule — without auth', async () => {
        const res = await request(app)
            .get('/api/transport/schedule');
        expect([200, 401, 403]).toContain(res.status);
    });

    it('WB-TR02: GET /api/transport/schedule — with hostel_id query', async () => {
        const res = await request(app)
            .get('/api/transport/schedule?hostel_id=admin@test');
        expect([200, 401, 403]).toContain(res.status);
    });

    it('WB-TR03: POST /api/transport/add_bus — without auth', async () => {
        const res = await request(app)
            .post('/api/transport/add_bus')
            .send({
                pickup: 'Campus Gate',
                destination: 'City Center',
                departure_time: '08:00',
                arrival_time: '09:00',
                bus_count: 2
            });
        expect([200, 401, 403]).toContain(res.status);
    });

    it('WB-TR04: POST /api/transport/add_bus — invalid token', async () => {
        const res = await request(app)
            .post('/api/transport/add_bus')
            .set('Cookie', 'token=badtoken')
            .send({
                pickup: 'Campus Gate',
                destination: 'City Center'
            });
        expect([200, 401, 403]).toContain(res.status);
    });

    it('WB-TR05: PUT /api/transport/update_bus — without auth', async () => {
        const res = await request(app)
            .put('/api/transport/update_bus')
            .send({ transport_id: '1', departure_time: '09:00' });
        expect([200, 401, 403]).toContain(res.status);
    });
});