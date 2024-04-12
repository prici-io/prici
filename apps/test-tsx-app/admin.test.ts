import test, { after, describe } from 'node:test';
import { getPriciSdk } from './utils/prici-runner.js';
import assert from 'node:assert';

const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.e4vybEZSMruiGm8XgTxlD2QDGuOBz5l3gRfmjlmb1PY';

describe('admin api route while ADMIN_UI=false', async () => {
  const { quit, priciUBaseUrl } = await getPriciSdk();

  after(() => {
    quit();
  });

  test('should throw 401 exception when no auth token is sent', async () => {
    const response = await fetch(`${priciUBaseUrl}/api/admin`);

    assert.deepStrictEqual(response.status, 401);
  });

  test('should throw 404 exception when user is authenticated', async () => {
    const response = await fetch(`${priciUBaseUrl}/api/admin`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    assert.deepStrictEqual(response.status, 404);
  });
});

describe('admin api route while ADMIN_UI=true', async () => {
  const { quit, priciUBaseUrl } = await getPriciSdk({ adminUi: true });

  after(() => {
    quit();
  });

  test('should throw 401 exception when user is not authenticated', async () => {
    const response = await fetch(`${priciUBaseUrl}/api/admin`);

    assert.deepStrictEqual(response.status, 401);
  });

  test('should return 200 when user is authenticated', async () => {
    const response = await fetch(`${priciUBaseUrl}/api/admin`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    assert.deepStrictEqual(response.status, 200);
  });
});
