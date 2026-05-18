import {useEffect, useRef, useState} from 'preact/hooks';

import type {Project} from '@/lib/projects';

/*
 * Helpers.
 */

/** Highlight index and option refs for the public project match list. */
export function useMatchListNavigation(matches: Project[]) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const hasMatches = matches.length > 0;

  useEffect(() => {
    setActiveIndex(hasMatches ? 0 : undefined);
    optionRefs.current = [];
  }, [matches, hasMatches]);

  useEffect(() => {
    if (activeIndex === undefined) {
      return;
    }

    optionRefs.current[activeIndex]?.scrollIntoView({block: 'nearest', behavior: 'auto'});
  }, [activeIndex]);

  return {activeIndex, hasMatches, optionRefs, setActiveIndex};
}
