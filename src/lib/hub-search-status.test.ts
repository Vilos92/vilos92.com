import {describe, expect, test} from 'vite-plus/test';

import {buildHubSearchStatusMessage} from '@/lib/hub-search-status';

/*
 * Tests.
 */

describe('buildHubSearchStatusMessage', () => {
  test('describes resolving, matches, and no-match states', () => {
    expect(
      buildHubSearchStatusMessage({
        hasMatches: false,
        hasQuery: true,
        isResolving: true,
        matchCount: 0,
        resolveError: undefined,
        showNoMatches: false,
        trimmedQuery: 'dot'
      })
    ).toBe('Opening project.');

    expect(
      buildHubSearchStatusMessage({
        hasMatches: true,
        hasQuery: true,
        isResolving: false,
        matchCount: 2,
        resolveError: undefined,
        showNoMatches: false,
        trimmedQuery: 'dot'
      })
    ).toBe('2 projects found.');

    expect(
      buildHubSearchStatusMessage({
        hasMatches: false,
        hasQuery: true,
        isResolving: false,
        matchCount: 0,
        resolveError: undefined,
        showNoMatches: true,
        trimmedQuery: 'zzz'
      })
    ).toBe('No project matches “zzz”.');
  });
});
