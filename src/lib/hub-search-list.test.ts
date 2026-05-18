import {describe, expect, test} from 'vite-plus/test';

import {highlightedProject, nextMatchIndex} from '@/lib/hub-search-list';
import type {Project} from '@/lib/projects';

/*
 * Constants.
 */

const MATCHES: Project[] = [
  {
    slug: 'dotfiles',
    name: 'dotfiles',
    githubUrl: 'https://github.com/Vilos92/dotfiles',
    private: false
  },
  {
    slug: 'clock',
    name: 'clock',
    githubUrl: 'https://github.com/Vilos92/clock',
    private: false
  }
];

/*
 * Tests.
 */

describe('nextMatchIndex', () => {
  test('moves down and up within bounds', () => {
    expect(nextMatchIndex('ArrowDown', 2, null)).toBe(0);
    expect(nextMatchIndex('ArrowDown', 2, 0)).toBe(1);
    expect(nextMatchIndex('ArrowUp', 2, 1)).toBe(0);
  });
});

describe('highlightedProject', () => {
  test('prefers the active row, then the first match', () => {
    expect(highlightedProject(MATCHES, 1)?.slug).toBe('clock');
    expect(highlightedProject(MATCHES, null)?.slug).toBe('dotfiles');
  });
});
