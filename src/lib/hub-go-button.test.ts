import {describe, expect, test} from 'vite-plus/test';

import {deriveHubGoButtonProps} from '@/lib/hub-go-button';

/*
 * Tests.
 */

describe('deriveHubGoButtonProps', () => {
  test('keeps submit enabled when query is empty so Enter can clear search', () => {
    expect(deriveHubGoButtonProps(false, false).disabled).toBe(false);
    expect(deriveHubGoButtonProps(false, false)['aria-disabled']).toBe(true);
  });

  test('disables only while resolving', () => {
    expect(deriveHubGoButtonProps(true, true).disabled).toBe(true);
    expect(deriveHubGoButtonProps(true, true)['aria-busy']).toBe(true);
  });
});
