import {HubHeader} from '@/hub/HubHeader';
import {HubSearch} from '@/hub/HubSearch';

import * as styles from '@/hub/hub.css';

/*
 * Component.
 */

export function HubApp() {
  return (
    <>
      <a className="skip-link" href="#slug">
        Skip to search
      </a>
      <main className={styles.main}>
        <HubHeader />
        <HubSearch />
      </main>
    </>
  );
}
