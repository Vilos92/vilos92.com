import {cloudflare} from '@cloudflare/vite-plugin';
import preact from '@preact/preset-vite';
import {vanillaExtractPlugin} from '@vanilla-extract/vite-plugin';
import {defineConfig} from 'vite-plus';

/*
 * Constants.
 */

const isVitest = process.env.VITEST === 'true';

const REPO_TS_FMT_OPTIONS = {
  arrowParens: 'avoid' as const,
  bracketSpacing: false,
  printWidth: 110,
  trailingComma: 'none' as const,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  sortImports: true
};

/*
 * Config.
 */

export default defineConfig({
  resolve: {
    tsconfigPaths: true
  },
  plugins: isVitest
    ? []
    : [
        cloudflare(),
        vanillaExtractPlugin(),
        preact({
          prerender: {
            enabled: true,
            renderTarget: '#root',
            additionalPrerenderRoutes: ['/'],
            previewMiddlewareEnabled: true
          }
        })
      ],
  staged: {
    '*': 'vp check --fix'
  },
  fmt: REPO_TS_FMT_OPTIONS,
  lint: {
    options: {typeAware: true, typeCheck: true},
    rules: {
      curly: ['error', 'all'],
      'no-nested-ternary': 'error'
    }
  },
  test: {
    include: ['src/**/*.test.ts']
  }
});
