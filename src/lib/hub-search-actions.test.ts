import {describe, expect, test, vi} from 'vite-plus/test';

import {createHubSearchActions} from '@/lib/hub-search-actions';
import {requestOpenProjectSlug} from '@/lib/hub-search-open';

/*
 * Tests.
 */

vi.mock('@/lib/hub-search-open', () => ({
  requestOpenProjectSlug: vi.fn()
}));

describe('createHubSearchActions', () => {
  test('ignores submit while a resolve is in flight', () => {
    const actions = createHubSearchActions({
      activeIndex: 0,
      clearResolveState: vi.fn(),
      hasMatches: true,
      inputRef: {current: null},
      isResolving: true,
      matches: [
        {
          slug: 'dotfiles',
          name: 'dotfiles',
          githubUrl: 'https://github.com/Vilos92/dotfiles',
          private: false
        }
      ],
      optionRefs: {current: []},
      setActiveIndex: vi.fn(),
      setIsResolving: vi.fn(),
      setResolveError: vi.fn(),
      setSubmitRejected: vi.fn(),
      trimmedQuery: 'dot'
    });

    actions.submitQuery();

    expect(requestOpenProjectSlug).not.toHaveBeenCalled();
  });
});
