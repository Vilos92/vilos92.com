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

/** `fuzzysort` public projects with scores; empty `query` returns `[]`. */
export function searchPublicProjectsScored(
  query: string,
  projects: readonly Project[],
  limit = HUB_PREVIEW_LIMIT
) {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const publicProjects = projects.filter(project => !project.private);

  return fuzzysort.go(trimmed, publicProjects as Project[], {
    key: 'slug',
    threshold: FUZZY_MIN_SCORE,
    limit
  });
}

/** `fuzzysort` public `Project`s for hub preview. */
export function searchPublicProjects(
  query: string,
  projects: readonly Project[],
  limit = HUB_PREVIEW_LIMIT
): Project[] {
  return searchPublicProjectsScored(query, projects, limit).map(result => result.obj);
}
