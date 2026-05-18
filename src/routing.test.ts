import {describe, expect, test} from 'vite-plus/test';

import {projects} from '@/lib/projects';
import {fuzzyFindPublicProject} from '@/lib/slug-fuzzy';
import {resolveSlugPath} from '@/routing';

describe('findFuzzyPublicProject', () => {
  test('matches close public slug', () => {
    const match = fuzzyFindPublicProject('dotfile', projects);
    expect(match?.slug).toBe('dotfiles');
    expect(match?.private).toBe(false);
  });

  test('rejects ambiguous fuzzy matches', () => {
    expect(fuzzyFindPublicProject('ck', projects)).toBeUndefined();
  });
});

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
