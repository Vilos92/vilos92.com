import {GITHUB_PROFILE_URL, projects} from './projects.ts';
import type {Project} from './projects.ts';
import {findFuzzyPublicProject} from './slug-fuzzy.ts';

export type RedirectResult = {kind: 'redirect'; location: string} | {kind: 'not_found'; slug: string};

/** Resolve a pathname using the given project list (for tests and production). */
export function resolvePathWithProjects(pathname: string, projectList: readonly Project[]): RedirectResult {
  const path = pathname.replace(/\/+$/, '') || '/';

  if (path === '/') {
    return {kind: 'redirect', location: GITHUB_PROFILE_URL};
  }

  const slug = path.slice(1);
  if (!slug || slug.includes('/')) {
    return {kind: 'not_found', slug: slug || '(empty)'};
  }

  const normalized = slug.toLowerCase();
  const bySlug = new Map(projectList.map(project => [project.slug, project]));
  const exact = bySlug.get(normalized);
  if (exact) {
    return {kind: 'redirect', location: exact.githubUrl};
  }

  const fuzzy = findFuzzyPublicProject(normalized, projectList);
  if (fuzzy) {
    return {kind: 'redirect', location: fuzzy.githubUrl};
  }

  return {kind: 'not_found', slug};
}

/** Resolve a pathname to a redirect target or 404. */
export function resolvePath(pathname: string): RedirectResult {
  return resolvePathWithProjects(pathname, projects);
}
