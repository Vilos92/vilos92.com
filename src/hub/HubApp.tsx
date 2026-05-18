import {HubHeader} from '@/hub/HubHeader';
import {HubSearch} from '@/hub/HubSearch';

import * as styles from '@/hub/hub.css';

/*
 * Component.
 */

export function HubApp() {
  return (
    <main className={styles.main}>
      <HubHeader />
      <HubSearch />
    </main>
  );
}
