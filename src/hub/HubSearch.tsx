import {useEffect, useMemo, useState} from 'preact/hooks';

import {fetchHubResolve} from '@/lib/hub-resolve';
import {HUB_SEARCH_QUERY_PARAM, readHubSearchQuery, syncHubSearchQuery} from '@/lib/hub-search';
import {searchPublicProjects} from '@/lib/project-search';
import {publicProjects, type Project} from '@/lib/projects';

import * as styles from '@/hub/hub.css';

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
  const showNoMatches = hasQuery && (matches.length === 0 || submitRejected);
  const showPanel = showNoMatches || matches.length > 0 || resolveError !== undefined;

  return (
    <div className={styles.search}>
      <form
        action="/"
        className={styles.form}
        method="get"
        onSubmit={submitEvent => {
          submitEvent.preventDefault();
          const trimmed = query.trim();
          if (!trimmed) {
            return;
          }

          syncHubSearchQuery(trimmed);
          void requestOpenSlug(trimmed, setSubmitRejected, setResolveError, setIsResolving);
        }}
      >
        <label className={styles.visuallyHidden} for="slug">
          Project slug
        </label>
        <input
          autoComplete="off"
          autoFocus
          className={styles.input}
          id="slug"
          name={HUB_SEARCH_QUERY_PARAM}
          onInput={inputEvent => {
            setSubmitRejected(false);
            setResolveError(undefined);
            setQuery((inputEvent.currentTarget as HTMLInputElement).value);
          }}
          placeholder="project slug"
          spellcheck={false}
          type="search"
          value={query}
        />
        <button
          aria-busy={isResolving}
          className={styles.submitButton}
          data-resolving={isResolving ? 'true' : undefined}
          disabled={!hasQuery}
          type="submit"
        >
          Go
        </button>
      </form>

      {showPanel && (
        <div className={styles.searchPanel}>
          {showNoMatches && (
            <p className={styles.noMatchesMessage} role="status">
              No project matches &ldquo;{trimmedQuery}&rdquo;
            </p>
          )}
          {resolveError && (
            <p className={styles.resolveError} role="alert">
              {resolveError}
            </p>
          )}
          {matches.length > 0 && (
            <HubResults
              isResolving={isResolving}
              matches={matches}
              onOpenSlug={slug => {
                void requestOpenSlug(slug, setSubmitRejected, setResolveError, setIsResolving);
              }}
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
  isResolving: boolean;
  matches: Project[];
  onOpenSlug: (slug: string) => void;
};

function HubResults({isResolving, matches, onOpenSlug}: HubResultsProps) {
  return (
    <ul aria-label="Matching projects" className={styles.results}>
      {matches.map(project => (
        <li key={project.slug}>
          <a
            className={styles.resultLink}
            href={`/${encodeURIComponent(project.slug)}`}
            onClick={clickEvent => {
              clickEvent.preventDefault();
              if (isResolving) {
                return;
              }

              onOpenSlug(project.slug);
            }}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className={styles.resultName}>{project.name}</span>
            <span className={styles.resultSlug}>/{project.slug}</span>
            <span className={styles.visuallyHidden}> (opens in new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
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
