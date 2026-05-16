import {GITHUB_PROFILE_URL, projects, projectsBySlug} from './projects.ts';
import {findFuzzyPublicProject} from './slug-fuzzy.ts';

export type RedirectResult = {kind: 'redirect'; location: string} | {kind: 'not_found'; slug: string};

/** Resolve a pathname to a redirect target or 404. */
export function resolvePath(pathname: string): RedirectResult {
  const path = pathname.replace(/\/+$/, '') || '/';

  if (path === '/') {
    return {kind: 'redirect', location: GITHUB_PROFILE_URL};
  }

  const slug = path.slice(1);
  if (!slug || slug.includes('/')) {
    return {kind: 'not_found', slug: slug || '(empty)'};
  }

  const normalized = slug.toLowerCase();
  const exact = projectsBySlug.get(normalized);
  if (exact) {
    return {kind: 'redirect', location: exact.githubUrl};
  }

  const fuzzy = findFuzzyPublicProject(normalized, projects);
  if (fuzzy) {
    return {kind: 'redirect', location: fuzzy.githubUrl};
  }

  return {kind: 'not_found', slug};
}
