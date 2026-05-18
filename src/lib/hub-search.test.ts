import {describe, expect, test} from 'vite-plus/test';

import {HUB_SEARCH_QUERY_PARAM, hubSearchUrl, readHubSearchQuery} from '@/lib/hub-search';

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
