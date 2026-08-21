import { describe, expect, it } from 'vitest';
import { SIMPLE_ANALYTICS_HOSTNAME } from '../src/lib/site-config';

const SCRIPT_URL = 'https://scripts.simpleanalyticscdn.com/latest.js';
const QUEUE_URL = 'https://queue.simpleanalyticscdn.com/events';
const UA = `ServerSide/1.0 (+https://${SIMPLE_ANALYTICS_HOSTNAME}/)`;

describe('Simple Analytics (live)', () => {
  it('serves latest.js from the CSP script origin', async () => {
    const res = await fetch(SCRIPT_URL, { headers: { 'User-Agent': UA } });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/javascript/);
    const body = await res.text();
    expect(body.length).toBeGreaterThan(1000);
    expect(body).toContain('"https://queue."');
    expect(body).toContain('simpleanalyticscdn.com');
  }, 15_000);

  it('accepts an events POST for SIMPLE_ANALYTICS_HOSTNAME', async () => {
    const res = await fetch(QUEUE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': UA
      },
      body: JSON.stringify({
        type: 'event',
        hostname: SIMPLE_ANALYTICS_HOSTNAME,
        event: 'ci-integration',
        path: '/__sa-integration-test',
        ua: UA
      })
    });
    expect(res.status).toBe(201);
    const json: unknown = await res.json();
    expect(json).toMatchObject({ ok: true });
  }, 15_000);
});
