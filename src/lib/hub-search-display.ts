import {buildHubSearchStatusMessage} from '@/lib/hub-search-status';

/*
 * Types.
 */

type HubSearchDisplayInput = {
  hasMatches: boolean;
  isResolving: boolean;
  matchCount: number;
  query: string;
  resolveError: string | undefined;
  submitRejected: boolean;
  statusHintId: string;
  statusLiveId: string;
};

type HubSearchDisplay = {
  hasQuery: boolean;
  inputDescribedBy: string;
  listboxOpen: boolean;
  showNoMatches: boolean;
  showPanel: boolean;
  statusMessage: string;
  trimmedQuery: string;
};

/*
 * Helpers.
 */

/** Derived hub search panel, listbox, and live-region copy from field state. */
export function deriveHubSearchDisplay(input: HubSearchDisplayInput): HubSearchDisplay {
  const trimmedQuery = input.query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const showNoMatches = hasQuery && (!input.hasMatches || input.submitRejected);
  const showPanel = showNoMatches || input.hasMatches || input.resolveError !== undefined;
  const listboxOpen = input.hasMatches;

  const statusMessage = buildHubSearchStatusMessage({
    hasMatches: input.hasMatches,
    hasQuery,
    isResolving: input.isResolving,
    matchCount: input.matchCount,
    resolveError: input.resolveError,
    showNoMatches,
    trimmedQuery
  });

  const inputDescribedBy = statusMessage ? `${input.statusHintId} ${input.statusLiveId}` : input.statusHintId;

  return {
    hasQuery,
    inputDescribedBy,
    listboxOpen,
    showNoMatches,
    showPanel,
    statusMessage,
    trimmedQuery
  };
}
