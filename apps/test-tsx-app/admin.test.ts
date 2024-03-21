import test, { describe } from 'node:test';
import { getPriciSdk, updateAdminUi } from './utils/prici-runner.js';
import assert from 'node:assert';

const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.e4vybEZSMruiGm8XgTxlD2QDGuOBz5l3gRfmjlmb1PY';

describe('admin api route', async () => {
  test('should throw 401 exception when ADMIN_UI is invalid', async () => {
    const { quit, priciUBaseUrl } = await getPriciSdk();
    const response = await fetch(`${priciUBaseUrl}/api/admin`);
    await quit();

    assert.deepStrictEqual(response.status, 401);
  });

  test('should throw 404 exception when ADMIN_UI is false and user is authenticated', async () => {
    const { quit, priciUBaseUrl } = await getPriciSdk();
    const response = await fetch(`${priciUBaseUrl}/api/admin`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    await quit();

    assert.deepStrictEqual(response.status, 404);
  });

  test('should throw 401 exception when ADMIN_UI is true and user is not authenticated', async () => {
    updateAdminUi('true');
    const { quit, priciUBaseUrl } = await getPriciSdk();
    const response = await fetch(`${priciUBaseUrl}/api/admin`);
    await quit();

    assert.deepStrictEqual(response.status, 401);
  });

  test('should return 200 when ADMIN_UI is true and user is authenticated', async () => {
    updateAdminUi('true');
    const { sdk, quit, priciUBaseUrl } = await getPriciSdk();
    const response = await fetch(`${priciUBaseUrl}/api/admin`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    await quit();

    assert.deepStrictEqual(response.status, 200);
  });
});
