import {FUZZY_MIN_SCORE, FUZZY_SCORE_GAP, searchPublicProjectsScored} from '@/lib/project-search';
import type {Project} from '@/lib/projects';

/*
 * Helpers.
 */

/** Fuzzy-match a public `Project` by slug; returns `undefined` when no match or top two are too close. */
export function fuzzyFindPublicProject(projects: readonly Project[], slug: string): Project | undefined {
  const results = searchPublicProjectsScored(projects, slug, 2);
  const best = results[0];
  if (!best) {
    return undefined;
  }

  const runnerUp = results[1];
  // A close second plausible match (e.g. `ck` → `ck22` vs another repo) — return `undefined` so routing 404s instead of a wrong 302.
  if (runnerUp && runnerUp.score >= FUZZY_MIN_SCORE && best.score - runnerUp.score < FUZZY_SCORE_GAP) {
    return undefined;
  }

  return best.obj;
}
