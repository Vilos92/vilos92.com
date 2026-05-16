import fuzzysort from 'fuzzysort';

import type {Project} from './projects.ts';

/** Minimum fuzzysort score (0–1) to treat a slug as a close match. */
const MIN_SCORE = 0.5;

/** Top two matches must differ by at least this much or we treat the match as ambiguous. */
const SCORE_GAP = 0.15;

/** Fuzzy-match a slug against public projects only; requires a clear best fuzzysort result. */
export function findFuzzyPublicProject(input: string, projects: readonly Project[]): Project | undefined {
  const query = input.toLowerCase();
  const publicProjects = projects.filter(project => !project.private);

  const results = fuzzysort.go(query, publicProjects as Project[], {
    key: 'slug',
    threshold: MIN_SCORE,
    limit: 2
  });

  const best = results[0];
  if (!best) {
    return undefined;
  }

  const runnerUp = results[1];
  if (runnerUp && runnerUp.score >= MIN_SCORE && best.score - runnerUp.score < SCORE_GAP) {
    return undefined;
  }

  return best.obj;
}
