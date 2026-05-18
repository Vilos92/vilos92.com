import {fetchHubResolve} from '@/lib/hub-resolve';

/*
 * Types.
 */

type OpenSlugCallbacks = {
  setIsResolving: (isResolving: boolean) => void;
  setResolveError: (message: string | undefined) => void;
  setSubmitRejected: (submitRejected: boolean) => void;
};

/*
 * Helpers.
 */

/** Resolve a slug on the server and open the repo in a new tab when allowed. */
export async function requestOpenProjectSlug(slug: string, callbacks: OpenSlugCallbacks) {
  const trimmed = slug.trim();
  if (!trimmed) {
    return;
  }

  callbacks.setIsResolving(true);

  try {
    const result = await fetchHubResolve(trimmed);
    if (!result.ok) {
      callbacks.setSubmitRejected(true);
      callbacks.setResolveError(undefined);
      return;
    }

    callbacks.setSubmitRejected(false);
    callbacks.setResolveError(undefined);

    globalThis.open(result.url, '_blank', 'noopener,noreferrer');
  } catch {
    callbacks.setResolveError('Could not check that slug right now.');
  } finally {
    callbacks.setIsResolving(false);
  }
}
