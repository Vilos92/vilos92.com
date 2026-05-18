import {HubResults} from '@/hub/HubResults';
import type {HubSearchViewModel} from '@/hub/use-hub-search';
import {HUB_SEARCH_RESULTS_REGION_ID} from '@/hub/use-hub-search';
import {HUB_PROJECT_LISTBOX_ID} from '@/lib/hub-search-list';

import * as styles from '@/hub/hub.css';

/*
 * Component.
 */

type HubSearchPanelProps = {
  search: HubSearchViewModel;
};

export function HubSearchPanel({search}: HubSearchPanelProps) {
  if (!search.showPanel) {
    return null;
  }

  return (
    <div
      aria-label="Project search results"
      className={styles.searchPanel}
      id={HUB_SEARCH_RESULTS_REGION_ID}
      role="region"
    >
      <HubSearchPanelMessages search={search} />
      {search.hasMatches && <HubSearchMatchList search={search} />}
    </div>
  );
}

type HubSearchPanelSectionProps = {
  search: HubSearchViewModel;
};

function HubSearchPanelMessages({search}: HubSearchPanelSectionProps) {
  return (
    <>
      {search.showNoMatches && (
        <p className={styles.noMatchesMessage} id="hub-search-no-matches">
          No project matches &ldquo;{search.trimmedQuery}&rdquo;
        </p>
      )}
      {search.resolveError && (
        <p className={styles.resolveError} id="hub-search-resolve-error">
          {search.resolveError}
        </p>
      )}
    </>
  );
}

function HubSearchMatchList({search}: HubSearchPanelSectionProps) {
  return (
    <HubResults
      activeIndex={search.activeIndex}
      isResolving={search.isResolving}
      listboxId={HUB_PROJECT_LISTBOX_ID}
      matches={search.matches}
      onHighlight={search.setActiveIndex}
      onKeyDown={keyboardEvent => {
        search.onMatchListKeyDown(keyboardEvent, 'option');
      }}
      onOpenSlug={search.openSlug}
      optionRefs={search.optionRefs}
    />
  );
}
