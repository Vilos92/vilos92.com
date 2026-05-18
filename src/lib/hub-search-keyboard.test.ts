import {describe, expect, test, vi} from 'vite-plus/test';

import {handleMatchListKeyDown} from '@/lib/hub-search-keyboard';

/*
 * Tests.
 */

describe('handleMatchListKeyDown', () => {
  test('moves highlight on arrow keys', () => {
    const setActiveIndex = vi.fn();
    const optionRefs = {current: [] as Array<HTMLButtonElement | null>};

    const handled = handleMatchListKeyDown('ArrowDown', 'input', {
      activeIndex: 0,
      hasMatches: true,
      inputRef: {current: null},
      matchCount: 3,
      optionRefs,
      setActiveIndex
    });

    expect(handled).toBe(true);
    expect(setActiveIndex).toHaveBeenCalledWith(1);
  });

  test('returns focus to the input on escape from an option', () => {
    const focus = vi.fn();
    const setActiveIndex = vi.fn();

    const handled = handleMatchListKeyDown('Escape', 'option', {
      activeIndex: 1,
      hasMatches: true,
      inputRef: {current: {focus} as unknown as HTMLInputElement},
      matchCount: 2,
      optionRefs: {current: []},
      setActiveIndex
    });

    expect(handled).toBe(true);
    expect(setActiveIndex).toHaveBeenCalledWith(null);
    expect(focus).toHaveBeenCalled();
  });
});
