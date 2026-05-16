import {describe, expect, test} from 'vite-plus/test';

import {projects} from './projects.ts';
import {resolvePath} from './routing.ts';
import {findFuzzyPublicProject} from './slug-fuzzy.ts';

describe('findFuzzyPublicProject', () => {
  test('matches close public slug', () => {
    const match = findFuzzyPublicProject('dotfile', projects);
    expect(match?.slug).toBe('dotfiles');
    expect(match?.private).toBe(false);
  });

  test('rejects ambiguous fuzzy matches', () => {
    expect(findFuzzyPublicProject('ck', projects)).toBeUndefined();
  });
});

describe('resolvePath', () => {
  test('redirects / to GitHub profile', () => {
    expect(resolvePath('/')).toEqual({
      kind: 'redirect',
      location: 'https://github.com/Vilos92'
    });
  });

  test('redirects exact slug to repo', () => {
    expect(resolvePath('/vilos92.com')).toEqual({
      kind: 'redirect',
      location: 'https://github.com/Vilos92/vilos92.com'
    });
  });

  test('redirects fuzzy typo for public repo', () => {
    expect(resolvePath('/dotfile').kind).toBe('redirect');
    expect(resolvePath('/dotfile')).toMatchObject({
      kind: 'redirect',
      location: 'https://github.com/Vilos92/dotfiles'
    });
  });

  test('returns not_found for unknown slug', () => {
    expect(resolvePath('/zzzznotarepo')).toEqual({kind: 'not_found', slug: 'zzzznotarepo'});
  });

  test('trailing slash on slug still resolves', () => {
    expect(resolvePath('/dotfiles/')).toEqual({
      kind: 'redirect',
      location: 'https://github.com/Vilos92/dotfiles'
    });
  });
});
