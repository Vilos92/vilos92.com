import {GITHUB_PROFILE_URL} from '@/lib/github';

import * as styles from '@/hub/hub.css';

/*
 * Component.
 */

export function HubHeader() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <a className={styles.siteTitle} href={GITHUB_PROFILE_URL} rel="noopener noreferrer" target="_blank">
          vilos92
          <span className={styles.visuallyHidden}> on GitHub (opens in new tab)</span>
        </a>
      </h1>
    </header>
  );
}
