import {describe, expect, test} from 'vite-plus/test';

import type {Project} from './projects.ts';
import {resolvePathWithProjects} from './routing.ts';
import {findFuzzyPublicProject} from './slug-fuzzy.ts';

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
    expect(resolvePathWithProjects('/dotfiles', FIXTURE_PROJECTS)).toEqual({
      kind: 'redirect',
      location: 'https://github.com/Vilos92/dotfiles'
    });
  });

  test('fuzzy typo resolves for public slug', () => {
    expect(resolvePathWithProjects('/dotfile', FIXTURE_PROJECTS)).toEqual({
      kind: 'redirect',
      location: 'https://github.com/Vilos92/dotfiles'
    });
  });

  test('exact private slug redirects', () => {
    expect(resolvePathWithProjects('/cynth', FIXTURE_PROJECTS)).toEqual({
      kind: 'redirect',
      location: 'https://github.com/Vilos92/cynth'
    });
  });

  test('typo near private slug does not redirect', () => {
    expect(resolvePathWithProjects('/cynht', FIXTURE_PROJECTS)).toEqual({
      kind: 'not_found',
      slug: 'cynht'
    });
  });

  test('findFuzzyPublicProject never returns private repos', () => {
    expect(findFuzzyPublicProject('cynht', FIXTURE_PROJECTS)).toBeUndefined();
    expect(findFuzzyPublicProject('cynth', FIXTURE_PROJECTS)).toBeUndefined();
    expect(findFuzzyPublicProject('dotfile', FIXTURE_PROJECTS)?.private).toBe(false);
  });
});
