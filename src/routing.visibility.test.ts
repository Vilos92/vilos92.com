import {describe, expect, test} from 'vite-plus/test';

import type {Project} from '@/lib/projects';
import {fuzzyFindPublicProject} from '@/lib/slug-fuzzy';
import {resolveSlugPathWithProjects} from '@/routing';

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

describe('public vs private slug routing (fixture)', () => {
  test('exact public slug redirects', () => {
    expect(resolveSlugPathWithProjects(FIXTURE_PROJECTS, '/dotfiles')).toEqual({
      kind: 'redirect',
      location: 'https://github.com/Vilos92/dotfiles'
    });
  });

  test('fuzzy typo resolves for public slug', () => {
    expect(resolveSlugPathWithProjects(FIXTURE_PROJECTS, '/dotfile')).toEqual({
      kind: 'redirect',
      location: 'https://github.com/Vilos92/dotfiles'
    });
  });

  test('exact private slug redirects', () => {
    expect(resolveSlugPathWithProjects(FIXTURE_PROJECTS, '/cynth')).toEqual({
      kind: 'redirect',
      location: 'https://github.com/Vilos92/cynth'
    });
  });

  test('typo near private slug does not redirect', () => {
    expect(resolveSlugPathWithProjects(FIXTURE_PROJECTS, '/cynht')).toEqual({
      kind: 'not_found',
      slug: 'cynht'
    });
  });

  test('findFuzzyPublicProject never returns private repos', () => {
    expect(fuzzyFindPublicProject(FIXTURE_PROJECTS, 'cynht')).toBeUndefined();
    expect(fuzzyFindPublicProject(FIXTURE_PROJECTS, 'cynth')).toBeUndefined();
    expect(fuzzyFindPublicProject(FIXTURE_PROJECTS, 'dotfile')?.private).toBe(false);
  });
});
