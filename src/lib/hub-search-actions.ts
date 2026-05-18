import type {JSX, RefObject} from 'preact';

import {syncHubSearchQuery} from '@/lib/hub-search';
import {handleMatchListKeyDown} from '@/lib/hub-search-keyboard';
import {highlightedProject} from '@/lib/hub-search-list';
import {requestOpenProjectSlug} from '@/lib/hub-search-open';
import type {Project} from '@/lib/projects';

/*
 * Types.
 */

type HubSearchActionDeps = {
  activeIndex: number | undefined;
  clearResolveState: () => void;
  hasMatches: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  isResolving: boolean;
  matches: Project[];
  optionRefs: RefObject<Array<HTMLButtonElement | null>>;
  setActiveIndex: (index: number | undefined) => void;
  setIsResolving: (isResolving: boolean) => void;
  setResolveError: (message: string | undefined) => void;
  setSubmitRejected: (submitRejected: boolean) => void;
  trimmedQuery: string;
};

/*
 * Helpers.
 */

/** Submit, open, clear, and keyboard handlers for the hub search combobox. */
export function createHubSearchActions(deps: HubSearchActionDeps) {
  const clearSearchUrl = () => {
    syncHubSearchQuery('');
    deps.clearResolveState();
  };

  const openSlug = (slug: string) => {
    if (deps.isResolving) {
      return;
    }

    void requestOpenProjectSlug(slug, {
      setSubmitRejected: deps.setSubmitRejected,
      setResolveError: deps.setResolveError,
      setIsResolving: deps.setIsResolving
    });
  };

  const submitQuery = () => {
    if (deps.isResolving) {
      return;
    }

    if (!deps.trimmedQuery) {
      clearSearchUrl();
      return;
    }

    syncHubSearchQuery(deps.trimmedQuery);

    const highlighted = highlightedProject(deps.matches, deps.activeIndex);
    if (highlighted) {
      openSlug(highlighted.slug);
      return;
    }

    openSlug(deps.trimmedQuery);
  };

  const onMatchListKeyDown = (
    keyboardEvent: JSX.TargetedKeyboardEvent<HTMLElement>,
    source: 'input' | 'option'
  ) => {
    const handled = handleMatchListKeyDown(keyboardEvent.key, source, {
      activeIndex: deps.activeIndex,
      hasMatches: deps.hasMatches,
      inputRef: deps.inputRef,
      matchCount: deps.matches.length,
      optionRefs: deps.optionRefs,
      setActiveIndex: deps.setActiveIndex
    });

    if (handled) {
      keyboardEvent.preventDefault();
    }
  };

  const onInputKeyDown = (keyboardEvent: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
    if (keyboardEvent.key === 'Enter' && !deps.trimmedQuery) {
      keyboardEvent.preventDefault();
      clearSearchUrl();
      return;
    }

    onMatchListKeyDown(keyboardEvent, 'input');
  };

  return {clearSearchUrl, onInputKeyDown, onMatchListKeyDown, openSlug, submitQuery};
}
