import type {Project} from '@/lib/projects';

/*
 * Constants.
 */

export const HUB_PROJECT_LISTBOX_ID = 'hub-project-listbox';

/*
 * Helpers.
 */

/** Stable DOM id for a listbox option row. */
export function hubProjectOptionId(index: number): string {
  return `${HUB_PROJECT_LISTBOX_ID}-option-${index}`;
}

/** Next highlighted index for list keyboard navigation, or `undefined` when key is not handled. */
export function nextMatchIndex(
  key: string,
  matchCount: number,
  activeIndex: number | undefined
): number | undefined {
  if (matchCount === 0) {
    return undefined;
  }

  const lastIndex = matchCount - 1;

  if (key === 'ArrowDown') {
    return Math.min((activeIndex ?? -1) + 1, lastIndex);
  }

  if (key === 'ArrowUp') {
    return Math.max((activeIndex ?? 0) - 1, 0);
  }

  if (key === 'Home') {
    return 0;
  }

  if (key === 'End') {
    return lastIndex;
  }

  return undefined;
}

/** Project to open on submit: active row, else first match, else `undefined`. */
export function highlightedProject(matches: Project[], activeIndex: number | undefined): Project | undefined {
  if (activeIndex !== undefined && activeIndex < matches.length) {
    return matches[activeIndex];
  }

  if (matches.length > 0) {
    return matches[0];
  }

  return undefined;
}
