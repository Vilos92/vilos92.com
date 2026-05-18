import fuzzysort from 'fuzzysort';

import type {Project} from '@/lib/projects';

/*
 * Constants.
 */

/** Minimum `fuzzysort` score (0–1) for a match; see `FUZZY_MIN_SCORE`. */
export const FUZZY_MIN_SCORE = 0.5;

/** Top-two slug matches must differ by at least `FUZZY_SCORE_GAP` or `routing` treats the match as ambiguous. */
export const FUZZY_SCORE_GAP = 0.15;

const HUB_PREVIEW_LIMIT = 8;

/*
 * Helpers.
 */

/** `fuzzysort` projects with scores; empty `query` returns `[]`. */
export function searchProjectsScored(projects: readonly Project[], query: string, limit = HUB_PREVIEW_LIMIT) {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  return fuzzysort.go(trimmed, projects as Project[], {
    key: 'slug',
    threshold: FUZZY_MIN_SCORE,
    limit
  });
}

/** `fuzzysort` public projects with scores; empty `query` returns `[]`. */
export function searchPublicProjectsScored(
  projects: readonly Project[],
  query: string,
  limit = HUB_PREVIEW_LIMIT
) {
  const publicProjects = projects.filter(project => !project.private);
  return searchProjectsScored(publicProjects, query, limit);
}

/** `fuzzysort` public `Project`s for hub preview. */
export function searchPublicProjects(
  projects: readonly Project[],
  query: string,
  limit = HUB_PREVIEW_LIMIT
): Project[] {
  return searchPublicProjectsScored(projects, query, limit).map(result => result.obj);
}
