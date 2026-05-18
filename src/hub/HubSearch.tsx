import {useMemo, useState} from 'preact/hooks';

import {searchPublicProjects} from '@/lib/project-search';
import {projects, publicProjects, type Project} from '@/lib/projects';

import * as styles from '@/hub/hub.css';

/*
 * Component.
 */

export function HubSearch() {
  const [query, setQuery] = useState('');
  const matches = useMemo(() => searchPublicProjects(publicProjects, query), [query]);
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const showEmptyState = hasQuery && matches.length === 0;
  const showResults = matches.length > 0 || showEmptyState;

  return (
    <div className={styles.search}>
      <form
        className={styles.form}
        onSubmit={submitEvent => {
          submitEvent.preventDefault();
          openProjectSlug(query);
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
          name="slug"
          onInput={inputEvent => {
            setQuery((inputEvent.currentTarget as HTMLInputElement).value);
          }}
          placeholder="project slug"
          spellcheck={false}
          type="search"
          value={query}
        />
        <button className={styles.submitButton} disabled={!hasQuery} type="submit">
          Go
        </button>
      </form>

      {showResults && (
        <HubResults matches={matches} showEmptyState={showEmptyState} trimmedQuery={trimmedQuery} />
      )}
    </div>
  );
}

/*
 * Helpers.
 */

type HubResultsProps = {
  matches: Project[];
  showEmptyState: boolean;
  trimmedQuery: string;
};

function HubResults({matches, showEmptyState, trimmedQuery}: HubResultsProps) {
  return (
    <ul aria-label={showEmptyState ? 'No matching projects' : 'Matching projects'} className={styles.results}>
      {showEmptyState ? (
        <li className={styles.emptyMessage} role="presentation">
          No project matches &ldquo;{trimmedQuery}&rdquo;
        </li>
      ) : (
        matches.map(project => (
          <li key={project.slug}>
            <a
              className={styles.resultLink}
              href={`/${encodeURIComponent(project.slug)}`}
              onClick={clickEvent => {
                clickEvent.preventDefault();
                openProjectSlug(project.slug);
              }}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className={styles.resultName}>{project.name}</span>
              <span className={styles.resultSlug}>/{project.slug}</span>
              <span className={styles.visuallyHidden}> (opens in new tab)</span>
            </a>
          </li>
        ))
      )}
    </ul>
  );
}

function openProjectSlug(slug: string) {
  const trimmed = slug.trim();
  if (!trimmed) {
    return;
  }

  const normalized = trimmed.toLowerCase();
  const project = projects.find(entry => entry.slug.toLowerCase() === normalized);
  if (project) {
    globalThis.open(project.githubUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  globalThis.open(`/${encodeURIComponent(trimmed)}`, '_blank', 'noopener,noreferrer');
}
