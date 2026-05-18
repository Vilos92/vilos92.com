import type {HubSearchViewModel} from '@/hub/use-hub-search';
import {hubComboboxInputA11y} from '@/lib/hub-combobox-a11y';
import {HUB_SEARCH_QUERY_PARAM} from '@/lib/hub-search';

import * as styles from '@/hub/hub.css';

/*
 * Component.
 */

type HubSearchSlugInputProps = {
  search: HubSearchViewModel;
};

export function HubSearchSlugInput({search}: HubSearchSlugInputProps) {
  return (
    <input
      {...hubComboboxInputA11y({
        activeIndex: search.activeIndex,
        inputDescribedBy: search.inputDescribedBy,
        isListboxOpen: search.listboxOpen
      })}
      autoComplete="off"
      autoFocus
      className={styles.input}
      enterKeyHint="go"
      id="slug"
      inputMode="search"
      name={HUB_SEARCH_QUERY_PARAM}
      onFocus={() => {
        if (search.hasMatches) {
          search.setActiveIndex(0);
        }
      }}
      onInput={inputEvent => {
        search.resetResolveState();
        search.setQuery((inputEvent.currentTarget as HTMLInputElement).value);
      }}
      onKeyDown={search.onInputKeyDown}
      placeholder="project slug"
      ref={search.inputRef}
      role="combobox"
      spellcheck={false}
      type="search"
      value={search.query}
    />
  );
}
