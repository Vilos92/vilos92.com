import './hub.css';
import {publicProjects} from './lib/projects.ts';
import {searchPublicProjects} from './search-public.ts';

/*
 * Constants.
 */

const form = requireElement<HTMLFormElement>('#go');
const input = requireElement<HTMLInputElement>('#slug');
const resultsEl = requireElement<HTMLUListElement>('#results');

/*
 * Script.
 */

input.addEventListener('input', () => {
  renderResults(input.value);
});

form.addEventListener('submit', event => {
  event.preventDefault();
  goToSlug(input.value);
});

/*
 * Helpers.
 */

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`hub markup missing ${selector}`);
  }
  return element;
}

function openInNewTab(url: string) {
  globalThis.open(url, '_blank', 'noopener,noreferrer');
}

function goToSlug(slug: string) {
  const trimmed = slug.trim();
  if (!trimmed) {
    return;
  }
  openInNewTab(`/${encodeURIComponent(trimmed)}`);
}

function newTabLink(url: string): HTMLAnchorElement {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

function newTabHint(): HTMLSpanElement {
  const hint = document.createElement('span');
  hint.className = 'visually-hidden';
  hint.textContent = ' (opens in new tab)';
  return hint;
}

function renderResults(query: string) {
  const matches = searchPublicProjects(query, publicProjects);
  resultsEl.replaceChildren(
    ...matches.map(project => {
      const item = document.createElement('li');
      const link = newTabLink(`/${encodeURIComponent(project.slug)}`);
      const name = document.createElement('span');
      name.className = 'name';
      name.textContent = project.name;
      const slug = document.createElement('span');
      slug.className = 'slug';
      slug.textContent = `/${project.slug}`;
      link.append(name, slug, newTabHint());
      item.append(link);
      return item;
    })
  );
}
