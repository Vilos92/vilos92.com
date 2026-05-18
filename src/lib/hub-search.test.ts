import {afterEach, describe, expect, test, vi} from 'vite-plus/test';

import {HUB_SEARCH_QUERY_PARAM, hubSearchUrl, readHubSearchQuery, syncHubSearchQuery} from '@/lib/hub-search';

/*
 * Tests.
 */

describe('hubSearchUrl', () => {
  test('builds root search URL', () => {
    expect(hubSearchUrl('zzzznotarepo')).toBe(`/?${HUB_SEARCH_QUERY_PARAM}=zzzznotarepo`);
  });
});

describe('readHubSearchQuery', () => {
  test('reads q param', () => {
    expect(readHubSearchQuery('https://vilos92.com/?q=dotfiles')).toBe('dotfiles');
  });

  test('returns empty when q is absent', () => {
    expect(readHubSearchQuery('https://vilos92.com/')).toBe('');
  });
});

describe('syncHubSearchQuery', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('removes q from the address bar when slug is empty', () => {
    const replaceState = vi.fn();
    vi.stubGlobal('location', new URL('https://vilos92.com/?q=dotfiles'));
    vi.stubGlobal('history', {replaceState, state: null});

    syncHubSearchQuery('');

    expect(replaceState).toHaveBeenCalledWith(null, '', '/');
  });
});
