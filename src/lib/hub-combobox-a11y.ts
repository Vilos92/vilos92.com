import {HUB_PROJECT_LISTBOX_ID, hubProjectOptionId} from '@/lib/hub-search-list';

/*
 * Types.
 */

type ComboboxA11yInput = {
  activeIndex: number | undefined;
  inputDescribedBy: string;
  isListboxOpen: boolean;
};

/*
 * Helpers.
 */

/** Shared combobox ARIA attributes for the hub slug input. */
export function hubComboboxInputA11y(input: ComboboxA11yInput) {
  return {
    'aria-activedescendant':
      input.activeIndex !== undefined && input.isListboxOpen
        ? hubProjectOptionId(input.activeIndex)
        : undefined,
    'aria-autocomplete': 'list' as const,
    'aria-controls': input.isListboxOpen ? HUB_PROJECT_LISTBOX_ID : undefined,
    'aria-describedby': input.inputDescribedBy,
    'aria-expanded': input.isListboxOpen,
    'aria-haspopup': 'listbox' as const
  };
}
