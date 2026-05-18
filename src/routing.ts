import {hubSearchUrl} from '@/lib/hub-search';
import {projects} from '@/lib/projects';
import type {Project} from '@/lib/projects';
import {findPrivateProjectBySlugQuery, fuzzyFindPublicProject} from '@/lib/slug-fuzzy';

/*
 * Types.
 */

type RedirectResult = {kind: 'redirect'; location: string} | {kind: 'not_found'; slug: string};

type SlugOpenResult = {kind: 'open'; slug: string; name: string; url: string} | {kind: 'reject'};

/*
 * Helpers.
 */

/** Resolve `/:slug` (not `/`) to a redirect target or hub search fallback. */
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

  return {kind: 'redirect', location: hubSearchUrl(slug)};
}

/** Resolve a slug path to a redirect target or hub search fallback. */
export function resolveSlugPath(pathname: string): RedirectResult {
  return resolveSlugPathWithProjects(projects, pathname);
}

/** Hub/API: resolve a slug query to a repo open target, or reject when nothing matches. */
export function resolveSlugOpenWithProjects(projectList: readonly Project[], query: string): SlugOpenResult {
  const trimmed = query.trim();
  if (!trimmed) {
    return {kind: 'reject'};
  }

  const normalized = trimmed.toLowerCase();
  const bySlug = new Map(projectList.map(project => [project.slug.toLowerCase(), project]));
  const exact = bySlug.get(normalized);
  if (exact) {
    return {kind: 'open', slug: exact.slug, name: exact.name, url: exact.githubUrl};
  }

  const privateMatch = findPrivateProjectBySlugQuery(projectList, trimmed);
  if (privateMatch) {
    return {
      kind: 'open',
      slug: privateMatch.slug,
      name: privateMatch.name,
      url: privateMatch.githubUrl
    };
  }

  const fuzzy = fuzzyFindPublicProject(projectList, normalized);
  if (fuzzy) {
    return {kind: 'open', slug: fuzzy.slug, name: fuzzy.name, url: fuzzy.githubUrl};
  }

  return {kind: 'reject'};
}

/** Resolve a slug query for hub open (exact or fuzzy, including private repos). */
export function resolveSlugOpen(query: string): SlugOpenResult {
  return resolveSlugOpenWithProjects(projects, query);
}
