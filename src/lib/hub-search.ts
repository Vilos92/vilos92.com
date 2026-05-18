/*
 * Constants.
 */

/** Query param on `/` that pre-fills the hub slug search input. */
export const HUB_SEARCH_QUERY_PARAM = 'q';

/*
 * Helpers.
 */

/** `/?q=…` for a failed `/:slug` resolution. */
export function hubSearchUrl(slug: string): string {
  const params = new URLSearchParams({[HUB_SEARCH_QUERY_PARAM]: slug});
  return `/?${params.toString()}`;
}

/** Read the hub search term from a page URL. */
export function readHubSearchQuery(href: string): string {
  return new URL(href).searchParams.get(HUB_SEARCH_QUERY_PARAM) ?? '';
}

/** Keep the address bar in sync with the current search term (same-tab, no navigation). */
export function syncHubSearchQuery(slug: string): void {
  if (typeof location === 'undefined' || typeof history === 'undefined') {
    return;
  }

  const url = new URL(location.href);
  url.pathname = '/';
  const trimmed = slug.trim();
  if (trimmed) {
    url.searchParams.set(HUB_SEARCH_QUERY_PARAM, trimmed);
  } else {
    url.searchParams.delete(HUB_SEARCH_QUERY_PARAM);
  }

  const next = `${url.pathname}${url.search}`;
  history.replaceState(history.state, '', next);
}
