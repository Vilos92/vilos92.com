import {
  FUZZY_MIN_SCORE,
  FUZZY_SCORE_GAP,
  searchProjectsScored,
  searchPublicProjectsScored
} from '@/lib/project-search';
import type {Project} from '@/lib/projects';

/*
 * Helpers.
 */

function fuzzyFindProjectFromScored(results: ReturnType<typeof searchProjectsScored>): Project | undefined {
  const best = results[0];
  if (!best) {
    return undefined;
  }

  const runnerUp = results[1];
  // A close second plausible match (e.g. `ck` → `ck22` vs another repo) — return `undefined` so routing falls back to hub search instead of a wrong 302.
  if (runnerUp && runnerUp.score >= FUZZY_MIN_SCORE && best.score - runnerUp.score < FUZZY_SCORE_GAP) {
    return undefined;
  }

  return best.obj;
}

/** Dot-insensitive slug key for private repo matching (not fuzzy prefix). */
function privateSlugMatchKey(slug: string): string {
  return slug.toLowerCase().replaceAll('.', '');
}

/** Match a private `Project` by case or dot differences only (no fuzzy prefix). */
export function findPrivateProjectBySlugQuery(
  projects: readonly Project[],
  query: string
): Project | undefined {
  const queryKey = privateSlugMatchKey(query);
  if (!queryKey) {
    return undefined;
  }

  let match: Project | undefined;
  for (const project of projects) {
    if (!project.private || privateSlugMatchKey(project.slug) !== queryKey) {
      continue;
    }

    if (match) {
      return undefined;
    }

    match = project;
  }

  return match;
}

/** Fuzzy-match a public `Project` by slug; returns `undefined` when no match or top two are too close. */
export function fuzzyFindPublicProject(projects: readonly Project[], slug: string): Project | undefined {
  return fuzzyFindProjectFromScored(searchPublicProjectsScored(projects, slug, 2));
}
