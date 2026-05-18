import type {JSX} from 'preact';

import {hubProjectOptionId} from '@/lib/hub-search-list';
import type {Project} from '@/lib/projects';

import * as styles from '@/hub/hub.css';

/*
 * Component.
 */

type HubResultsProps = {
  activeIndex: number | null;
  isResolving: boolean;
  listboxId: string;
  matches: Project[];
  onHighlight: (index: number) => void;
  onKeyDown: (keyboardEvent: JSX.TargetedKeyboardEvent<HTMLButtonElement>) => void;
  onOpenSlug: (slug: string) => void;
  optionRefs: {current: Array<HTMLButtonElement | null>};
};

export function HubResults({
  activeIndex,
  isResolving,
  listboxId,
  matches,
  onHighlight,
  onKeyDown,
  onOpenSlug,
  optionRefs
}: HubResultsProps) {
  return (
    <ul aria-label="Matching projects" className={styles.results} id={listboxId} role="listbox">
      {matches.map((project, index) => {
        const isActive = activeIndex === index;

        return (
          <li key={project.slug} role="presentation">
            <button
              aria-selected={isActive ? 'true' : 'false'}
              className={`${styles.resultOption}${isActive ? ` ${styles.resultOptionActive}` : ''}`}
              disabled={isResolving}
              id={hubProjectOptionId(index)}
              onClick={() => {
                onOpenSlug(project.slug);
              }}
              onFocus={() => {
                onHighlight(index);
              }}
              onKeyDown={onKeyDown}
              onMouseEnter={() => {
                onHighlight(index);
              }}
              ref={element => {
                optionRefs.current[index] = element;
              }}
              role="option"
              type="button"
            >
              <span className={styles.resultName}>{project.name}</span>
              <span className={styles.resultSlug}>/{project.slug}</span>
              <span className={styles.visuallyHidden}> (opens in new tab)</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
