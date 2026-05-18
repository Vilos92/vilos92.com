import {useCallback, useMemo, useRef, useState} from 'preact/hooks';

import {useHubQuerySync} from '@/hub/use-hub-query-sync';
import {useMatchListNavigation} from '@/hub/use-match-list-navigation';
import {readHubSearchQuery} from '@/lib/hub-search';
import {createHubSearchActions} from '@/lib/hub-search-actions';
import {deriveHubSearchDisplay} from '@/lib/hub-search-display';
import {searchPublicProjects} from '@/lib/project-search';
import {publicProjects} from '@/lib/projects';

/*
 * Constants.
 */

export const HUB_SEARCH_HINT_ID = 'hub-search-hint';
export const HUB_SEARCH_STATUS_ID = 'hub-search-status';
export const HUB_SEARCH_RESULTS_REGION_ID = 'hub-search-results';

/*
 * Types.
 */

export type HubSearchViewModel = ReturnType<typeof useHubSearch>;

/*
 * Helpers.
 */

/** Hub search field state, keyboard navigation, and resolve/open handlers. */
export function useHubSearch() {
  const [query, setQuery] = useState(() =>
    typeof location === 'undefined' ? '' : readHubSearchQuery(location.href)
  );
  const [submitRejected, setSubmitRejected] = useState(false);
  const [resolveError, setResolveError] = useState<string | undefined>(undefined);
  const [isResolving, setIsResolving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useHubQuerySync(setQuery);

  const matches = useMemo(() => searchPublicProjects(publicProjects, query), [query]);
  const {activeIndex, hasMatches, optionRefs, setActiveIndex} = useMatchListNavigation(matches);

  const display = useMemo(
    () =>
      deriveHubSearchDisplay({
        hasMatches,
        isResolving,
        matchCount: matches.length,
        query,
        resolveError,
        statusHintId: HUB_SEARCH_HINT_ID,
        statusLiveId: HUB_SEARCH_STATUS_ID,
        submitRejected
      }),
    [hasMatches, isResolving, matches.length, query, resolveError, submitRejected]
  );

  const clearResolveState = useCallback(() => {
    setSubmitRejected(false);
    setResolveError(undefined);
  }, []);

  const actions = useMemo(
    () =>
      createHubSearchActions({
        activeIndex,
        clearResolveState,
        hasMatches,
        inputRef,
        isResolving,
        matches,
        optionRefs,
        setActiveIndex,
        setIsResolving,
        setResolveError,
        setSubmitRejected,
        trimmedQuery: display.trimmedQuery
      }),
    [activeIndex, clearResolveState, display.trimmedQuery, hasMatches, isResolving, matches]
  );

  return {
    activeIndex,
    hasMatches,
    hasQuery: display.hasQuery,
    inputDescribedBy: display.inputDescribedBy,
    inputRef,
    isResolving,
    listboxOpen: display.listboxOpen,
    matches,
    onInputKeyDown: actions.onInputKeyDown,
    onMatchListKeyDown: actions.onMatchListKeyDown,
    openSlug: actions.openSlug,
    optionRefs,
    query,
    resetResolveState: clearResolveState,
    resolveError,
    setActiveIndex,
    setQuery,
    showNoMatches: display.showNoMatches,
    showPanel: display.showPanel,
    statusMessage: display.statusMessage,
    submitQuery: actions.submitQuery,
    trimmedQuery: display.trimmedQuery
  };
}
