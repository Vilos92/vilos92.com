import {HubSearchGoButton} from '@/hub/HubSearchGoButton';
import {HubSearchSlugInput} from '@/hub/HubSearchSlugInput';
import type {HubSearchViewModel} from '@/hub/use-hub-search';
import {HUB_SEARCH_HINT_ID, HUB_SEARCH_STATUS_ID} from '@/hub/use-hub-search';

import * as styles from '@/hub/hub.css';

/*
 * Component.
 */

type HubSearchFormProps = {
  search: HubSearchViewModel;
};

export function HubSearchForm({search}: HubSearchFormProps) {
  return (
    <form
      action="/"
      className={styles.form}
      method="get"
      role="search"
      onSubmit={submitEvent => {
        submitEvent.preventDefault();
        search.submitQuery();
      }}
    >
      <label className={styles.visuallyHidden} for="slug">
        Project slug
      </label>
      <span className={styles.visuallyHidden} id={HUB_SEARCH_HINT_ID}>
        Suggestions appear as you type. Arrow keys move through matches from the field or a suggestion; Enter
        opens the highlighted project or checks your slug.
      </span>
      <div aria-atomic="true" aria-live="polite" className={styles.visuallyHidden} id={HUB_SEARCH_STATUS_ID}>
        {search.statusMessage}
      </div>
      <HubSearchSlugInput search={search} />
      <HubSearchGoButton search={search} />
    </form>
  );
}
