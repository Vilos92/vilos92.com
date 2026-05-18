import type {HubSearchViewModel} from '@/hub/use-hub-search';
import {deriveHubGoButtonProps} from '@/lib/hub-go-button';

import * as styles from '@/hub/hub.css';

/*
 * Component.
 */

type HubSearchGoButtonProps = {
  search: HubSearchViewModel;
};

export function HubSearchGoButton({search}: HubSearchGoButtonProps) {
  const buttonProps = deriveHubGoButtonProps(search.hasQuery, search.isResolving);

  return (
    <button {...buttonProps} className={styles.submitButton} type="submit">
      Go
    </button>
  );
}
