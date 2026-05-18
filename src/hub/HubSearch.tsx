import {HubSearchForm} from '@/hub/HubSearchForm';
import {HubSearchPanel} from '@/hub/HubSearchPanel';
import {useHubSearch} from '@/hub/use-hub-search';

import * as styles from '@/hub/hub.css';

/*
 * Component.
 */

export function HubSearch() {
  const search = useHubSearch();

  return (
    <div className={styles.search}>
      <HubSearchForm search={search} />
      <HubSearchPanel search={search} />
    </div>
  );
}
