import test from 'node:test';
import assert from 'node:assert';
import supertest from 'supertest';
import app from '../src/app.js';
import { store } from '../src/models/store.js';

const request = supertest(app);

test('QueueLess Backend Integration Test Suite', async (t) => {
  let userToken = '';
  let staffToken = '';
  let activeTokenId = '';

  await t.test('1. Public Services List Endpoint', async () => {
    const res = await request.get('/api/public/services').expect(200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length > 0);
  });

  await t.test('2. Fresh User Registration & Login', async () => {
    const regRes = await request
      .post('/api/auth/register')
      .send({
        name: 'Test Citizen',
        email: `citizen_${Date.now()}@queueless.com`,
        password: 'Password123!',
        role: 'USER'
      })
      .expect(201);

    assert.strictEqual(regRes.body.success, true);
    assert.ok(regRes.body.data.token);
    userToken = regRes.body.data.token;
  });

  await t.test('3. Staff Login', async () => {
    const res = await request
      .post('/api/auth/login')
      .send({ email: 'staff1@queueless.com', password: 'Password123!' })
      .expect(200);

    assert.strictEqual(res.body.success, true);
    staffToken = res.body.data.token;
  });

  await t.test('4. Issue Virtual Token & Verify Duplicate Token Prevention', async () => {
    // Issue token
    const res = await request
      .post('/api/tokens')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ serviceId: 'serv-1' })
      .expect(201);

    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.tokenNumber);
    activeTokenId = res.body.data.tokenId;

    // Attempt second token for same user -> should be rejected with 400
    const dupRes = await request
      .post('/api/tokens')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ serviceId: 'serv-1' })
      .expect(400);

    assert.strictEqual(dupRes.body.success, false);
    assert.match(dupRes.body.error.message, /already has an active token/i);
  });

  await t.test('5. Check In via QR Code', async () => {
    const res = await request
      .post(`/api/tokens/${activeTokenId}/checkin`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'CHECKED_IN');
  });

  await t.test('6. Staff Call Next Token & Complete Token Lifecycle', async () => {
    const callRes = await request
      .post('/api/queue/next')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ counterId: 'count-1' })
      .expect(200);

    assert.strictEqual(callRes.body.success, true);

    const compRes = await request
      .post(`/api/queue/token/${callRes.body.data.tokenId}/complete`)
      .set('Authorization', `Bearer ${staffToken}`)
      .expect(200);

    assert.strictEqual(compRes.body.success, true);
    assert.strictEqual(compRes.body.data.status, 'COMPLETED');
  });
});
