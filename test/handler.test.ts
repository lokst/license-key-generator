import { handleRequest } from '../src/handler'
import makeServiceWorkerEnv from 'service-worker-mock'

declare var global: any



beforeEach(() => {
  Object.assign(global, makeServiceWorkerEnv())
  jest.resetModules()
})

describe('/generate', () => {
  beforeEach(() => {
    global.LICENSE_STORE = {
      get: jest.fn(() => null),
      put: jest.fn(),
    };
  });

  afterAll(() => {
    global.LICENSE_STORE = null;
  });

  test('generates a license key', async () => {
    const result = await handleRequest(new Request('/generate', { method: 'POST', body: JSON.stringify({ userId: "foo" }), }))
    expect(result.status).toEqual(200);
    const resultObj = await result.json();
    // @ts-ignore
    expect(resultObj["licenseKey"]).not.toBeNull();
  });

  describe('disallows regeneration', () => {
    beforeEach(() => {
      global.LICENSE_STORE = {
        get: jest.fn(() => "AAAA-AAAA-AAAA-AAAA"),
      };
    });

    test('returns an error', async () => {
      const result = await handleRequest(new Request('/generate', { method: 'POST', body: JSON.stringify({ userId: "foo" }), }))
      expect(result.status).toEqual(400);
      const errorMessage = await result.text();
      expect(errorMessage).toEqual("License key already exists");
    });
  });
});

describe('/verify', () => {
  beforeEach(() => {
    global.LICENSE_STORE = {
      get: jest.fn(() => "AAAA-AAAA-AAAA-AAAA"),
      put: jest.fn(() => "AAAA-AAAA-AAAA-AAAA"),
    };
  });

  afterAll(() => {
    global.LICENSE_STORE = null;
  });

  test('verifies a valid license key', async () => {
    const result = await handleRequest(new Request('/verify', { method: 'POST', body: JSON.stringify({ userId: "foo", licenseKey: "AAAA-AAAA-AAAA-AAAA" }), }))
    expect(result.status).toEqual(200);
    const resultObj = await result.json();
    // @ts-ignore
    expect(resultObj["valid"]).toEqual(true);
  });
});
