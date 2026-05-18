import {HUB_PROJECT_LISTBOX_ID, hubProjectOptionId} from '@/lib/hub-search-list';

/*
 * Types.
 */

type ComboboxA11yInput = {
  activeIndex: number | null;
  inputDescribedBy: string;
  listboxOpen: boolean;
};

/*
 * Helpers.
 */

/** Shared combobox ARIA attributes for the hub slug input. */
export function hubComboboxInputA11y(input: ComboboxA11yInput) {
  return {
    'aria-activedescendant':
      input.activeIndex !== null && input.listboxOpen ? hubProjectOptionId(input.activeIndex) : undefined,
    'aria-autocomplete': 'list' as const,
    'aria-controls': input.listboxOpen ? HUB_PROJECT_LISTBOX_ID : undefined,
    'aria-describedby': input.inputDescribedBy,
    'aria-expanded': input.listboxOpen,
    'aria-haspopup': 'listbox' as const
  };
}
