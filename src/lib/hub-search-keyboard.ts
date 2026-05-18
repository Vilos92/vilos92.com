import type {RefObject} from 'preact';

import {nextMatchIndex} from '@/lib/hub-search-list';

/*
 * Types.
 */

export type MatchListKeySource = 'input' | 'option';

type MatchListKeyboardContext = {
  activeIndex: number | null;
  hasMatches: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  matchCount: number;
  optionRefs: RefObject<Array<HTMLButtonElement | null>>;
  setActiveIndex: (index: number | null) => void;
};

/*
 * Helpers.
 */

/** Handle arrow, home, end, and escape keys for the project match list. */
export function handleMatchListKeyDown(
  key: string,
  source: MatchListKeySource,
  context: MatchListKeyboardContext
): boolean {
  if (!context.hasMatches) {
    return false;
  }

  if (key === 'Escape') {
    context.setActiveIndex(null);
    if (source === 'option') {
      context.inputRef.current?.focus();
    }

    return true;
  }

  if (key === 'ArrowUp' && source === 'option' && (context.activeIndex ?? 0) <= 0) {
    context.setActiveIndex(0);
    context.inputRef.current?.focus();
    return true;
  }

  const nextIndex = nextMatchIndex(key, context.matchCount, context.activeIndex);
  if (nextIndex === undefined) {
    return false;
  }

  context.setActiveIndex(nextIndex);

  if (source === 'option') {
    context.optionRefs.current?.[nextIndex]?.focus();
  }

  return true;
}
