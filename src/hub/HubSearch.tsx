import type {JSX} from 'preact';
import {useEffect, useMemo, useRef, useState} from 'preact/hooks';

import {fetchHubResolve} from '@/lib/hub-resolve';
import {HUB_SEARCH_QUERY_PARAM, readHubSearchQuery, syncHubSearchQuery} from '@/lib/hub-search';
import {searchPublicProjects} from '@/lib/project-search';
import {publicProjects, type Project} from '@/lib/projects';

import * as styles from '@/hub/hub.css';

/*
 * Constants.
 */

const LISTBOX_ID = 'hub-project-listbox';
const INPUT_HINT_ID = 'hub-search-hint';
const SEARCH_STATUS_ID = 'hub-search-status';
const SEARCH_RESULTS_REGION_ID = 'hub-search-results';

/*
 * Component.
 */

export function HubSearch() {
  const [query, setQuery] = useState(() =>
    typeof location === 'undefined' ? '' : readHubSearchQuery(location.href)
  );
  const [submitRejected, setSubmitRejected] = useState(false);
  const [resolveError, setResolveError] = useState<string | undefined>(undefined);
  const [isResolving, setIsResolving] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const onPopState = () => {
      setQuery(readHubSearchQuery(location.href));
    };

    addEventListener('popstate', onPopState);
    return () => {
      removeEventListener('popstate', onPopState);
    };
  }, []);

  const matches = useMemo(() => searchPublicProjects(publicProjects, query), [query]);
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const hasMatches = matches.length > 0;
  const showNoMatches = hasQuery && (!hasMatches || submitRejected);
  const showPanel = showNoMatches || hasMatches || resolveError !== undefined;
  const listboxOpen = hasMatches;

  const statusMessage = useMemo(() => {
    if (isResolving) {
      return 'Opening project.';
    }

    if (!hasQuery) {
      return '';
    }

    if (resolveError) {
      return resolveError;
    }

    if (hasMatches) {
      return matches.length === 1 ? '1 project found.' : `${matches.length} projects found.`;
    }

    if (showNoMatches) {
      return `No project matches “${trimmedQuery}”.`;
    }

    return '';
  }, [hasMatches, hasQuery, isResolving, matches.length, resolveError, showNoMatches, trimmedQuery]);

  const inputDescribedBy = statusMessage ? `${INPUT_HINT_ID} ${SEARCH_STATUS_ID}` : INPUT_HINT_ID;

  useEffect(() => {
    setActiveIndex(hasMatches ? 0 : null);
    optionRefs.current = [];
  }, [matches, hasMatches]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    optionRefs.current[activeIndex]?.scrollIntoView({block: 'nearest', behavior: 'auto'});
  }, [activeIndex]);

  const openSlug = (slug: string) => {
    void requestOpenSlug(slug, setSubmitRejected, setResolveError, setIsResolving);
  };

  const clearSearchUrl = () => {
    syncHubSearchQuery('');
    setSubmitRejected(false);
    setResolveError(undefined);
  };

  const submitQuery = () => {
    if (!trimmedQuery) {
      clearSearchUrl();
      return;
    }

    syncHubSearchQuery(trimmedQuery);

    const highlighted = highlightedProject(matches, activeIndex);

    if (highlighted) {
      openSlug(highlighted.slug);
      return;
    }

    openSlug(trimmedQuery);
  };

  const handleMatchListKeyDown = (
    keyboardEvent: JSX.TargetedKeyboardEvent<HTMLElement>,
    source: 'input' | 'option'
  ) => {
    if (!hasMatches) {
      return;
    }

    if (keyboardEvent.key === 'Escape') {
      keyboardEvent.preventDefault();
      setActiveIndex(null);
      if (source === 'option') {
        inputRef.current?.focus();
      }

      return;
    }

    if (keyboardEvent.key === 'ArrowUp' && source === 'option' && (activeIndex ?? 0) <= 0) {
      keyboardEvent.preventDefault();
      setActiveIndex(0);
      inputRef.current?.focus();
      return;
    }

    const nextIndex = nextMatchIndex(keyboardEvent.key, matches.length, activeIndex);
    if (nextIndex === undefined) {
      return;
    }

    keyboardEvent.preventDefault();
    setActiveIndex(nextIndex);

    if (source === 'option') {
      optionRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className={styles.search}>
      <form
        action="/"
        className={styles.form}
        method="get"
        role="search"
        onSubmit={submitEvent => {
          submitEvent.preventDefault();
          submitQuery();
        }}
      >
        <label className={styles.visuallyHidden} for="slug">
          Project slug
        </label>
        <span className={styles.visuallyHidden} id={INPUT_HINT_ID}>
          Suggestions appear as you type. Arrow keys move through matches from the field or a suggestion;
          Enter opens the highlighted project or checks your slug.
        </span>
        <div aria-atomic="true" aria-live="polite" className={styles.visuallyHidden} id={SEARCH_STATUS_ID}>
          {statusMessage}
        </div>
        <input
          aria-activedescendant={activeIndex !== null && listboxOpen ? optionId(activeIndex) : undefined}
          aria-autocomplete="list"
          aria-controls={listboxOpen ? LISTBOX_ID : undefined}
          aria-describedby={inputDescribedBy}
          aria-expanded={listboxOpen}
          aria-haspopup="listbox"
          autoComplete="off"
          autoFocus
          className={styles.input}
          enterKeyHint="go"
          id="slug"
          inputMode="search"
          name={HUB_SEARCH_QUERY_PARAM}
          onFocus={() => {
            if (hasMatches) {
              setActiveIndex(0);
            }
          }}
          onInput={inputEvent => {
            setSubmitRejected(false);
            setResolveError(undefined);
            setQuery((inputEvent.currentTarget as HTMLInputElement).value);
          }}
          onKeyDown={keyboardEvent => {
            if (keyboardEvent.key === 'Enter' && !trimmedQuery) {
              keyboardEvent.preventDefault();
              clearSearchUrl();
              return;
            }

            handleMatchListKeyDown(keyboardEvent, 'input');
          }}
          placeholder="project slug"
          ref={inputRef}
          role="combobox"
          spellcheck={false}
          type="search"
          value={query}
        />
        <button
          aria-busy={isResolving}
          aria-disabled={!hasQuery || undefined}
          aria-label={isResolving ? 'Opening project' : 'Go'}
          className={styles.submitButton}
          data-empty={!hasQuery ? 'true' : undefined}
          data-resolving={isResolving ? 'true' : undefined}
          disabled={isResolving}
          type="submit"
        >
          Go
        </button>
      </form>

      {showPanel && (
        <div
          aria-label="Project search results"
          className={styles.searchPanel}
          id={SEARCH_RESULTS_REGION_ID}
          role="region"
        >
          {showNoMatches && (
            <p className={styles.noMatchesMessage} id="hub-search-no-matches">
              No project matches &ldquo;{trimmedQuery}&rdquo;
            </p>
          )}
          {resolveError && (
            <p className={styles.resolveError} id="hub-search-resolve-error">
              {resolveError}
            </p>
          )}
          {hasMatches && (
            <HubResults
              activeIndex={activeIndex}
              isResolving={isResolving}
              listboxId={LISTBOX_ID}
              matches={matches}
              onHighlight={setActiveIndex}
              onKeyDown={keyboardEvent => {
                handleMatchListKeyDown(keyboardEvent, 'option');
              }}
              onOpenSlug={openSlug}
              optionRefs={optionRefs}
            />
          )}
        </div>
      )}
    </div>
  );
}

/*
 * Helpers.
 */

type HubResultsProps = {
  activeIndex: number | null;
  isResolving: boolean;
  listboxId: string;
  matches: Project[];
  onHighlight: (index: number) => void;
  onKeyDown: (keyboardEvent: JSX.TargetedKeyboardEvent<HTMLButtonElement>) => void;
  onOpenSlug: (slug: string) => void;
  optionRefs: {current: Array<HTMLButtonElement | null>};
};

function HubResults({
  activeIndex,
  isResolving,
  listboxId,
  matches,
  onHighlight,
  onKeyDown,
  onOpenSlug,
  optionRefs
}: HubResultsProps) {
  return (
    <ul aria-label="Matching projects" className={styles.results} id={listboxId} role="listbox">
      {matches.map((project, index) => {
        const isActive = activeIndex === index;

        return (
          <li key={project.slug} role="presentation">
            <button
              aria-selected={isActive ? 'true' : 'false'}
              className={`${styles.resultOption}${isActive ? ` ${styles.resultOptionActive}` : ''}`}
              disabled={isResolving}
              id={optionId(index)}
              onClick={() => {
                onOpenSlug(project.slug);
              }}
              onFocus={() => {
                onHighlight(index);
              }}
              onKeyDown={onKeyDown}
              onMouseEnter={() => {
                onHighlight(index);
              }}
              ref={element => {
                optionRefs.current[index] = element;
              }}
              role="option"
              type="button"
            >
              <span className={styles.resultName}>{project.name}</span>
              <span className={styles.resultSlug}>/{project.slug}</span>
              <span className={styles.visuallyHidden}> (opens in new tab)</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function optionId(index: number): string {
  return `${LISTBOX_ID}-option-${index}`;
}

function nextMatchIndex(key: string, matchCount: number, activeIndex: number | null): number | undefined {
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

function highlightedProject(matches: Project[], activeIndex: number | null): Project | undefined {
  if (activeIndex !== null && activeIndex < matches.length) {
    return matches[activeIndex];
  }

  if (matches.length > 0) {
    return matches[0];
  }

  return undefined;
}

async function requestOpenSlug(
  slug: string,
  setSubmitRejected: (submitRejected: boolean) => void,
  setResolveError: (message: string | undefined) => void,
  setIsResolving: (isResolving: boolean) => void
) {
  const trimmed = slug.trim();
  if (!trimmed) {
    return;
  }

  setIsResolving(true);

  try {
    const result = await fetchHubResolve(trimmed);
    if (!result.ok) {
      setSubmitRejected(true);
      setResolveError(undefined);
      return;
    }

    setSubmitRejected(false);
    setResolveError(undefined);

    globalThis.open(result.url, '_blank', 'noopener,noreferrer');
  } catch {
    setResolveError('Could not check that slug right now.');
  } finally {
    setIsResolving(false);
  }
}
