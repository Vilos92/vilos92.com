---
name: Preact + Vanilla Extract hub (qq345m35)
overview: 'Upgrade vilos92.com `/` hub from vanilla DOM + hub.css to Preact with Vanilla Extract (zero-runtime, Workers-friendly). Reuse `publicProjects` / `searchPublicProjects`; validate with `vp check`, `vp test`, `bun run fallow:audit` before commit.'
todos:
  - id: deps-ve-preact
    content: 'Install Preact + @preact/preset-vite + @vanilla-extract/css + @vanilla-extract/vite-plugin via `bun i`; remove any Tailwind packages if present'
    status: pending
  - id: vite-tsconfig
    content: 'Wire @preact/preset-vite and @vanilla-extract/vite-plugin in vite.config.ts; jsxImportSource preact in tsconfig'
    status: pending
  - id: hub-preact
    content: 'Replace hub-app.ts with hub-app.tsx mount + HubApp component; slim index.html (#root only)'
    status: pending
  - id: hub-styles-ve
    content: 'Replace hub.css utilities with Vanilla Extract styles (`.css.ts` modules); preserve dark minimal hub look + mobile layout'
    status: pending
  - id: validate-deploy
    content: 'Run vp check, vp test, bun run fallow:audit; vp build + spot-check dev; do not complete qq345m35 until deploy-ready'
    status: pending
isProject: false
---

# Preact + Vanilla Extract hub (`qq345m35`)

**Dex:** `gdex greg show qq345m35 --full` · parent `stfb9fq5` (vilos92.com)

## Stack (locked)

| Layer        | Choice                                                                       |
| ------------ | ---------------------------------------------------------------------------- |
| UI           | Preact (`preact`, `@preact/preset-vite`)                                     |
| Styles       | **Vanilla Extract** — `@vanilla-extract/css`, `@vanilla-extract/vite-plugin` |
| Not in scope | Tailwind, Panda                                                              |

## Context on main

- Hub entry: `src/hub-app.ts` + `index.html` + `src/hub.css`
- Search: `@/lib/project-search` (`searchPublicProjects`), catalog `@/lib/projects` (`publicProjects`)
- Worker: slug redirects only (`src/worker.ts`, `@/routing`)

## Implementation notes

- Entry stays `src/hub-app.tsx` per `.fallowrc.jsonc` `entry`
- Co-locate VE files e.g. `src/hub/HubApp.tsx` + `src/hub/hub.css.ts`
- Import global resets from `hub-app.tsx` or a small `src/hub/global.css.ts` if needed
- Match AGENTS.md section comments and `@/` imports

## Done criteria (dex)

- `/` uses Preact + Vanilla Extract
- Dev and production deploy look intentional, not starter-template
