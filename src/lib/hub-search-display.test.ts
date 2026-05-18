import {describe, expect, test} from 'vite-plus/test';

import {deriveHubSearchDisplay} from '@/lib/hub-search-display';

/*
 * Tests.
 */

describe('deriveHubSearchDisplay', () => {
  test('shows panel with no-match copy and listbox when preview matches but submit was rejected', () => {
    const display = deriveHubSearchDisplay({
      hasMatches: true,
      isResolving: false,
      matchCount: 1,
      query: 'dot',
      resolveError: undefined,
      statusHintId: 'hint',
      statusLiveId: 'status',
      submitRejected: true
    });

    expect(display.showNoMatches).toBe(true);
    expect(display.showPanel).toBe(true);
    expect(display.listboxOpen).toBe(true);
    expect(display.statusMessage).toBe('1 project found.');
  });
});
