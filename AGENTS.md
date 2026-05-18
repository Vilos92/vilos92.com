<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.

<!--VITE PLUS END-->

# Agent notes

Living conventions for this repo. Order and wording can evolve—ask whether new habits belong here.

## Bun

- **Bun-first** for installs and `package.json` scripts (`bun install`, `bun run …`, `bunx …`). Day-to-day app tooling uses **`vp`** (`vp dev`, `vp check`, `vp test`) per Vite+ above.
- When upstream docs show `npm` / `pnpm` / `npx`, prefer the **Bun** (or **`vp`**) equivalent.

## TypeScript

- Prefer **`type` over `interface`** unless you truly need declaration merging (we do not).
- Prefer **`undefined` over `null`**. Model absence as `undefined`; use **`.optional()`** in Zod, not **`.nullable().optional()`**. Do not use `?? null` in app code unless a type contract explicitly requires `null` (rare).
- **`??` vs `||`:** use **`??`** to default `null`/`undefined` only. Reserve **`||`** for boolean conditions and deliberate truthiness (e.g. empty path → `'/'` after trim). Treating `''` as absent belongs in a named helper, not `value || fallback`.
- **Avoid redundant nullish coalescing:** do not write `x ?? undefined` when `x` is already `T | undefined` with no `null`.
- **Exports:** do not export types, functions, or constants unless another file imports them (or we deliberately expose a stable public API, e.g. `GITHUB_PROFILE_URL` in `lib/github.ts`).
- **`?` vs `| undefined`:** use optional properties (`prop?:`) only when callers often omit the key; for internal modules prefer required keys with `T | undefined` when a value may be absent.

## Imports

- **`@/*` → `./src/*`** in `tsconfig` `paths`. Import every `src/` module via `@/` (`@/lib/projects`, `@/hub.css`); no relative paths between `src/` files.
- No **`.ts` / `.tsx`** suffixes on import paths (`allowImportingTsExtensions: false`).

## File layout (section comments)

Use `/* Section name. */` blocks. Read top-down: main entry first, **Helpers.** last.

**Order** (omit unused sections; never add empty **Types.** / **Helpers.** blocks):

1. **Schemas.** · **Runtime types.** · **Types.** · **Constants.** — Zod files: **Schemas.** → **Runtime types.** → **Constants.** (`parse` / `safeParse`); use **Types.** when the file defines hand-written top-level types
2. **Route.** · **API.** · **Script.** — file entry (`worker.ts` → **API.**; `hub-app.ts` → **Script.**; `routing.ts` → **API.**)
3. **Helpers.** — functions other modules import (`lib/project-search.ts`, `lib/slug-fuzzy.ts`) and private helpers (always last)

**Constants.** — module-level `const` / `export const`. Do not label `export const` **API.** or cross-module helper files **API.**

**Scripts** (`vite.config.ts`): **Constants.** → **API.** (default export). Module-level `const` above the entry; only `function` helpers may follow (hoisting).

**Lean files** (one export, few lines): a single **API.** or **Script.** block is enough.

**Tests** (`*.test.ts`): shared fixtures in **Constants.**; `describe` / `test` are the entry (no **Tests.** wrapper unless the file is large).

Blank line before and after each section block, and between the comment and the code below it.

## Code style

- Prefer a **functional** style: fewer reassignments unless performance or clarity really wins.
- Avoid deep nesting. Prefer **small helpers** with **early returns**.
- Prefer **array helpers** (`map`, `filter`, …) unless a hot path needs a hand-tuned loop. **Do not use `forEach`**—use **`for`…`of`** (or indexed `for`) for imperative iteration.

## Comments

- Prefer **why** (intent, tradeoffs, invariants) over **what**; drop comments that only restate the code.
- **JSDoc** on exports and non-trivial helpers when the contract is not obvious—often one crisp line is enough.
- In `//` / `/** */` prose, **backtick code identifiers** (`404`, `FUZZY_SCORE_GAP`, `/:slug`); not section headers (`/* API. */`).

## Naming

- **Booleans:** prefix with **`is`**, **`has`**, **`should`**, etc. (`isVitest`, `hasRunnerUp`).
- **Locals:** context-readable names (`projectList`, `runnerUp`, `normalizedSlug`)—not `e`, `res`, `n`, `c`, `x`.
- **Parameters:** stable context first (catalog, `projects`), per-request values after (`pathname`, `query`, `slug`) when both are passed.

## Fail fast

- Prefer **loud, immediate failure** over a misleading partial state. Validate required DOM, config, and env **as early as we can**, and **throw** with a clear message when something required is missing.
- Avoid **plausible-looking placeholders** for values the app cannot function without.

## Project hub (`src/projects.json`)

Hub data in `src/projects.json` (`src/lib/projects.ts`). To refresh from GitHub, follow `.cursor/skills/sync-projects-json/SKILL.md` (GitHub MCP → update JSON → `vp check` / `vp test`).

## CI

- **Fallow:** run `bun run fallow:audit` (lockfile-pinned CLI). Do not use `fallow-rs/fallow@v2` or Actions cache for `.fallow/`.

## Keeping this file useful

When we lock in a new convention, ask whether it should be added or tightened in `AGENTS.md`.
