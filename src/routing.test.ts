import {describe, expect, test} from 'vite-plus/test';

import type {Project} from '@/lib/projects';
import {resolveSlugPath, resolveSlugPathWithProjects} from '@/routing';

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

/*
 * Tests.
 */

describe('resolveSlugPath', () => {
  test('redirects exact slug to repo', () => {
    expect(resolveSlugPath('/vilos92.com')).toEqual({
      kind: 'redirect',
      location: 'https://github.com/Vilos92/vilos92.com'
    });
  });

  test('redirects fuzzy typo for public repo', () => {
    expect(resolveSlugPath('/dotfile')).toMatchObject({
      kind: 'redirect',
      location: 'https://github.com/Vilos92/dotfiles'
    });
  });

  test('returns not_found for unknown slug', () => {
    expect(resolveSlugPath('/zzzznotarepo')).toEqual({kind: 'not_found', slug: 'zzzznotarepo'});
  });

  test('trailing slash on slug still resolves', () => {
    expect(resolveSlugPath('/dotfiles/')).toEqual({
      kind: 'redirect',
      location: 'https://github.com/Vilos92/dotfiles'
    });
  });
});

describe('resolveSlugPathWithProjects (public vs private fixture)', () => {
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
});
