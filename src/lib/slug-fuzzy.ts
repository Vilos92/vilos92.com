import {FUZZY_MIN_SCORE, FUZZY_SCORE_GAP, searchPublicProjectsScored} from '../search-public.ts';
import type {Project} from './projects.ts';

/*
 * API.
 */

/** Fuzzy-match a slug against public `Project`s only; requires a clear best `fuzzysort` result. */
export function findFuzzyPublicProject(input: string, projects: readonly Project[]): Project | undefined {
  const results = searchPublicProjectsScored(input, projects, 2);
  const best = results[0];
  if (!best) {
    return undefined;
  }

  const runnerUp = results[1];
  // Ambiguous: runner-up also clears `FUZZY_MIN_SCORE` and is within `FUZZY_SCORE_GAP` of the winner — skip auto-redirect.
  if (runnerUp && runnerUp.score >= FUZZY_MIN_SCORE && best.score - runnerUp.score < FUZZY_SCORE_GAP) {
    return undefined;
  }

  return best.obj;
}
