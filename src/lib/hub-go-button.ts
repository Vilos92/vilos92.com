/*
 * Types.
 */

type HubGoButtonProps = {
  'aria-busy': boolean;
  'aria-disabled': true | undefined;
  'aria-label': string;
  'data-empty': 'true' | undefined;
  'data-resolving': 'true' | undefined;
  disabled: boolean;
};

/*
 * Helpers.
 */

/** Accessible Go button state: empty query is not disabled so Enter can clear `?q=`. */
export function deriveHubGoButtonProps(hasQuery: boolean, isResolving: boolean): HubGoButtonProps {
  if (isResolving) {
    return {
      'aria-busy': true,
      'aria-disabled': hasQuery ? undefined : true,
      'aria-label': 'Opening project',
      'data-empty': hasQuery ? undefined : 'true',
      'data-resolving': 'true',
      disabled: true
    };
  }

  return {
    'aria-busy': false,
    'aria-disabled': hasQuery ? undefined : true,
    'aria-label': 'Go',
    'data-empty': hasQuery ? undefined : 'true',
    'data-resolving': undefined,
    disabled: false
  };
}
