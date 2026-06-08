import {describe, expect, test} from 'vite-plus/test';

import {HUB_SEARCH_QUERY_PARAM} from '@/lib/hub-search';
import type {Project} from '@/lib/projects';
import {
  resolveSlugOpen,
  resolveSlugOpenWithProjects,
  resolveSlugPath,
  resolveSlugPathWithProjects
} from '@/routing';

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
  },
  {
    slug: 'vilos92.com',
    name: 'vilos92.com',
    githubUrl: 'https://github.com/Vilos92/vilos92.com',
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

  test('redirects unknown slug to hub search', () => {
    expect(resolveSlugPath('/zzzznotarepo')).toEqual({
      kind: 'redirect',
      location: `/?${HUB_SEARCH_QUERY_PARAM}=zzzznotarepo`
    });
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

  test('typo near private slug redirects to hub search', () => {
    expect(resolveSlugPathWithProjects(FIXTURE_PROJECTS, '/cynht')).toEqual({
      kind: 'redirect',
      location: `/?${HUB_SEARCH_QUERY_PARAM}=cynht`
    });
  });
});

describe('resolveSlugOpen', () => {
  test('opens exact public slug', () => {
    expect(resolveSlugOpen('dotfiles')).toEqual({
      kind: 'open',
      slug: 'dotfiles',
      name: 'dotfiles',
      url: 'https://github.com/Vilos92/dotfiles'
    });
  });

  test('opens exact slug case-insensitively', () => {
    expect(resolveSlugOpen('VILOS92.com')).toEqual({
      kind: 'open',
      slug: 'vilos92.com',
      name: 'vilos92.com',
      url: 'https://github.com/Vilos92/vilos92.com'
    });
  });

  test('opens exact private slug case-insensitively', () => {
    expect(resolveSlugOpen('GRYNTHIA.CAT')).toEqual({
      kind: 'open',
      slug: 'grynthia.cat',
      name: 'grynthia.cat',
      url: 'https://github.com/Vilos92/grynthia.cat'
    });
  });

  test('rejects unknown slug', () => {
    expect(resolveSlugOpen('zzzznotarepo')).toEqual({kind: 'reject'});
  });

  test('does not fuzzy-open private repo from short prefix', () => {
    expect(resolveSlugOpenWithProjects(FIXTURE_PROJECTS, 'vil')).toEqual({kind: 'reject'});
  });
});

describe('resolveSlugOpenWithProjects', () => {
  test('fuzzy-opens public typo', () => {
    expect(resolveSlugOpenWithProjects(FIXTURE_PROJECTS, 'dotfile')).toEqual({
      kind: 'open',
      slug: 'dotfiles',
      name: 'dotfiles',
      url: 'https://github.com/Vilos92/dotfiles'
    });
  });

  test('opens private slug when only dots differ', () => {
    expect(resolveSlugOpenWithProjects(FIXTURE_PROJECTS, 'vilos92com')).toEqual({
      kind: 'open',
      slug: 'vilos92.com',
      name: 'vilos92.com',
      url: 'https://github.com/Vilos92/vilos92.com'
    });
  });
});
