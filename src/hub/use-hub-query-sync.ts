import {useEffect} from 'preact/hooks';

import {readHubSearchQuery} from '@/lib/hub-search';

/*
 * Helpers.
 */

/** Keep hub query state aligned with `/?q=` when the user navigates with back/forward. */
export function useHubQuerySync(setQuery: (query: string) => void) {
  useEffect(() => {
    const onPopState = () => {
      setQuery(readHubSearchQuery(location.href));
    };

    addEventListener('popstate', onPopState);
    return () => {
      removeEventListener('popstate', onPopState);
    };
  }, [setQuery]);
}
