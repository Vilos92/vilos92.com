/*
 * Types.
 */

export type HubResolveOk = {ok: true; slug: string; name: string; url: string};

export type HubResolveReject = {ok: false};

export type HubResolveResponse = HubResolveOk | HubResolveReject;

/*
 * Helpers.
 */

/** Ask the worker whether a slug query may open a repo tab. */
export async function fetchHubResolve(query: string): Promise<HubResolveResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {ok: false};
  }

  const params = new URLSearchParams({q: trimmed});
  const response = await fetch(`/api/resolve?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`resolve failed (${response.status})`);
  }

  return (await response.json()) as HubResolveResponse;
}
