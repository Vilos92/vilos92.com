import {projects} from './projects.ts';
import type {Project} from './projects.ts';
import {findFuzzyPublicProject} from './slug-fuzzy.ts';

export type RedirectResult = {kind: 'redirect'; location: string} | {kind: 'not_found'; slug: string};

/** Resolve /:slug (not /) to a redirect target or 404. */
export function resolveSlugPathWithProjects(
  pathname: string,
  projectList: readonly Project[]
): RedirectResult {
  const path = pathname.replace(/\/+$/, '') || '/';

  if (path === '/') {
    return {kind: 'not_found', slug: '(root)'};
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

/** @deprecated Use resolveSlugPathWithProjects; kept as alias for tests. */
export const resolvePathWithProjects = resolveSlugPathWithProjects;

/** Resolve a slug path to a redirect target or 404. */
export function resolveSlugPath(pathname: string): RedirectResult {
  return resolveSlugPathWithProjects(pathname, projects);
}

/** @deprecated Use resolveSlugPath. */
export const resolvePath = resolveSlugPath;
