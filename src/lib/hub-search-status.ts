/*
 * Types.
 */

type HubSearchStatusInput = {
  hasMatches: boolean;
  hasQuery: boolean;
  isResolving: boolean;
  matchCount: number;
  resolveError: string | undefined;
  showNoMatches: boolean;
  trimmedQuery: string;
};

/*
 * Helpers.
 */

/** Screen-reader status for the hub search combobox. */
export function buildHubSearchStatusMessage(input: HubSearchStatusInput): string {
  if (input.isResolving) {
    return 'Opening project.';
  }

  if (!input.hasQuery) {
    return '';
  }

  if (input.resolveError) {
    return input.resolveError;
  }

  if (input.hasMatches) {
    return input.matchCount === 1 ? '1 project found.' : `${input.matchCount} projects found.`;
  }

  if (input.showNoMatches) {
    return `No project matches “${input.trimmedQuery}”.`;
  }

  return '';
}
