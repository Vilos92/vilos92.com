import {projects} from '@/lib/projects';
import type {Project} from '@/lib/projects';
import {fuzzyFindPublicProject} from '@/lib/slug-fuzzy';

/*
 * Types.
 */

type RedirectResult = {kind: 'redirect'; location: string} | {kind: 'not_found'; slug: string};

/*
 * Helpers.
 */

/** Resolve `/:slug` (not `/`) to a redirect target or `404`. */
export function resolveSlugPathWithProjects(
  projectList: readonly Project[],
  pathname: string
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
  const bySlug = new Map(projectList.map(project => [project.slug.toLowerCase(), project]));
  const exact = bySlug.get(normalized);
  if (exact) {
    return {kind: 'redirect', location: exact.githubUrl};
  }

  const fuzzy = fuzzyFindPublicProject(projectList, normalized);
  if (fuzzy) {
    return {kind: 'redirect', location: fuzzy.githubUrl};
  }

  return {kind: 'not_found', slug};
}

/** Resolve a slug path to a redirect target or `404`. */
export function resolveSlugPath(pathname: string): RedirectResult {
  return resolveSlugPathWithProjects(projects, pathname);
}
