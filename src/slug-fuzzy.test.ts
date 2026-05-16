import {describe, expect, test} from 'vite-plus/test';

import {projects} from './projects.ts';
import {resolvePath} from './routing.ts';
import {findFuzzyPublicProject} from './slug-fuzzy.ts';

describe('private repos', () => {
  test('exact private slug still resolves', () => {
    const privateProject = projects.find(p => p.private);
    if (!privateProject) {
      return;
    }
    expect(resolvePath(`/${privateProject.slug}`).kind).toBe('redirect');
  });

  test('does not fuzzy-match to private repos', () => {
    const privateProject = projects.find(p => p.private);
    if (!privateProject) {
      return;
    }
    expect(findFuzzyPublicProject(`${privateProject.slug}zzz`, projects)).toBeUndefined();
  });
});
