import {describe, expect, test} from 'vite-plus/test';

import app from '@/worker';

/*
 * Tests.
 */

describe('GET /api/resolve', () => {
  test('returns open payload for known slug', async () => {
    const response = await app.request('/api/resolve?q=vilos92.com');
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      slug: 'vilos92.com',
      name: 'vilos92.com',
      url: 'https://github.com/Vilos92/vilos92.com'
    });
  });

  test('returns reject for unknown slug', async () => {
    const response = await app.request('/api/resolve?q=zzzznotarepo');
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ok: false});
  });

  test('returns 400 when q is missing', async () => {
    const response = await app.request('/api/resolve');
    expect(response.status).toBe(400);
  });
});
