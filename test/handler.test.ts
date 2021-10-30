import { handleRequest } from '../src/handler'
import makeServiceWorkerEnv from 'service-worker-mock'

declare var global: any

global.LICENSE_STORE = {
  get: jest.fn(() => "AAAA-AAAA-AAAA-AAAA"),
  put: jest.fn(() => "AAAA-AAAA-AAAA-AAAA"),
};

describe('handle', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv())
    jest.resetModules()
  })

  test('handle /generate', async () => {
    const result = await handleRequest(new Request('/generate', { method: 'POST', body: JSON.stringify({ userId: "foo" }), }))
    expect(result.status).toEqual(200);
    const resultObj = await result.json();
    // @ts-ignore
    expect(resultObj["userId"]).toEqual("foo");
  })

  test('handle /verify', async () => {
    const result = await handleRequest(new Request('/verify', { method: 'GET', body: JSON.stringify({ userId: "foo", licenseKey: "AAAA-AAAA-AAAA-AAAA" }), }))
    expect(result.status).toEqual(200);
    const resultObj = await result.json();
    // @ts-ignore
    expect(resultObj["valid"]).toEqual(true);
  })
})
