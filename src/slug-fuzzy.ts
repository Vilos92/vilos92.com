import type {Project} from './projects.ts';
import {FUZZY_MIN_SCORE, FUZZY_SCORE_GAP, searchPublicProjectsScored} from './search-public.ts';

/*
 * API.
 */

/** Fuzzy-match a slug against public projects only; requires a clear best fuzzysort result. */
export function findFuzzyPublicProject(input: string, projects: readonly Project[]): Project | undefined {
  const results = searchPublicProjectsScored(input, projects, 2);
  const best = results[0];
  if (!best) {
    return undefined;
  }

  const runnerUp = results[1];
  if (runnerUp && runnerUp.score >= FUZZY_MIN_SCORE && best.score - runnerUp.score < FUZZY_SCORE_GAP) {
    return undefined;
  }

  return best.obj;
}
