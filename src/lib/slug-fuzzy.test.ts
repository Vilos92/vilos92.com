import {describe, expect, test} from 'vite-plus/test';

import type {Project} from '@/lib/projects';
import {fuzzyFindPublicProject} from '@/lib/slug-fuzzy';

/*
 * Constants.
 */

const FIXTURE_PROJECTS: Project[] = [
  {
    slug: 'dotfiles',
    name: 'dotfiles',
    githubUrl: 'https://github.com/Vilos92/dotfiles',
    private: false
  },
  {
    slug: 'cynth',
    name: 'cynth',
    githubUrl: 'https://github.com/Vilos92/cynth',
    private: true
  }
];

const AMBIGUOUS_FIXTURE_PROJECTS: Project[] = [
  {
    slug: 'clock',
    name: 'clock',
    githubUrl: 'https://github.com/Vilos92/clock',
    private: false
  },
  {
    slug: 'click',
    name: 'click',
    githubUrl: 'https://github.com/Vilos92/click',
    private: false
  }
];

/*
 * Tests.
 */

describe('fuzzyFindPublicProject', () => {
  test('matches close public slug', () => {
    const match = fuzzyFindPublicProject(FIXTURE_PROJECTS, 'dotfile');
    expect(match?.slug).toBe('dotfiles');
    expect(match?.private).toBe(false);
  });

  test('rejects ambiguous fuzzy matches', () => {
    expect(fuzzyFindPublicProject(AMBIGUOUS_FIXTURE_PROJECTS, 'clck')).toBeUndefined();
  });

  test('never returns private repos', () => {
    expect(fuzzyFindPublicProject(FIXTURE_PROJECTS, 'cynht')).toBeUndefined();
    expect(fuzzyFindPublicProject(FIXTURE_PROJECTS, 'cynth')).toBeUndefined();
    expect(fuzzyFindPublicProject(FIXTURE_PROJECTS, 'dotfile')?.private).toBe(false);
  });
});
