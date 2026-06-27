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

Living conventions for this repo. Order and wording can evolve—ask whether new habits belong here vs `README.md`.

## Bun

- **Bun-first** for installs and `package.json` scripts (`bun install`, `bun run …`, `bunx …`). Day-to-day app tooling uses **`vp`** (`vp dev`, `vp check`, `vp test`) per Vite+ above.
- When upstream docs show `npm` / `pnpm` / `npx`, prefer the **Bun** (or **`vp`**) equivalent.

## TypeScript

- Prefer **`type` over `interface`** unless you truly need declaration merging (we do not).
- Prefer **`undefined` over `null`**. Model absence as `undefined`; use **`.optional()`** in Zod, not **`.nullable().optional()`**. Do not use `?? null` in app code unless a type contract explicitly requires `null` (rare).
- **`??` vs `||`:** use **`??`** to default `null`/`undefined` only. Reserve **`||`** for boolean conditions and deliberate truthiness (e.g. empty path → `'/'` after trim). Treating `''` as absent belongs in a named helper, not `value || fallback`.
- **Avoid redundant nullish coalescing:** do not write `x ?? undefined` when `x` is already `T | undefined` with no `null`.
- **Exports:** module-private until another file imports (or we ship a stable public API). Fallow flags unused exports—wire, **`entry`**, or delete (see **Validation**).
- **`?` vs `| undefined`:** use optional properties (`prop?:`) when callers often omit the key entirely (e.g. wide public surfaces). For **internal** modules, prefer required keys with `T | undefined` when a value may be absent—call sites pass the prop explicitly, and absence is `undefined`, not “key not passed.” **Exception:** props normally omitted when unused—especially **`className?`** and other familiar DOM-style optional props—stay `prop?: T`; do not write `prop={undefined}` at call sites.
- **Readonly arrays** for read-only / pass-through data (`readonly T[]`).

## Imports

- **`@/*` → `./src/*`** in `tsconfig` `paths`. Import every `src/` module via `@/` (`@/lib/projects`, `@/hub/HubApp`); no relative paths between `src/` files.
- No **`.ts` / `.tsx`** suffixes on import paths (`allowImportingTsExtensions: false`).
- Use **`import type`** for type-only imports (`verbatimModuleSyntax`).

## Vanilla Extract

- **`*.css.ts`** colocated with UI (`src/hub/hub.css.ts`); shared globals under **`src/hub/global.css.ts`**.
- **`data-*` attribute variants over class composition.** Encode discrete state with `data-` attributes and match them in `selectors` (`'&[data-empty="true"]'`). Do not toggle separate BEM modifier classes.
- **Runtime-varying values via `createVar` + `setElementVar`.** CSS variables that change at runtime flow through a `createVar()` in `.css.ts` and are updated by `setElementVar` from `@vanilla-extract/dynamic`. The static rule stays in `.css.ts`; only the value moves at runtime.
- **Imperative `element.style` is the last resort.** Reach for it only when neither pattern above fits.

## File layout (section comments)

Use `/* Section name. */` blocks. Read top-down: main entry first, **Helpers.** last.

**Order** (omit unused sections; never add empty **Types.** / **Helpers.** blocks):

1. **Schemas.** · **Runtime types.** · **Types.** · **Constants.** — Zod/data: **Schemas.** → **Runtime types.** → **Constants.** (`parse` / `safeParse`); hand-written top-level types use **Types.** (e.g. `routing.ts`)
2. Entry surface (one per file — pick what matches):
   - **API.** — Hono worker HTTP entry only (`worker.ts` default export)
   - **Script.** — browser bootstrap (`hub-app.tsx`)
   - **Component.** — Preact UI (`Hub*.tsx`)
   - **Styles.** — Vanilla Extract (`*.css.ts`, including `global.css.ts`)
   - **Config.** — tooling default export (`vite.config.ts`)
3. **Helpers.** — functions other modules import (`routing.ts`, `lib/project-search.ts`, `lib/slug-fuzzy.ts`) and private helpers in the same file (always last)

**Constants.** — module-level `const` / `export const` (e.g. `lib/github.ts`, `hub/tokens.ts`). Do not use **API.** for constants, shared libraries, or UI.

**Config** (`vite.config.ts`): **Constants.** → **Config.** (default export). Module-level `const` above the entry; only `function` helpers may follow (hoisting).

**Lean files** (one export, few lines): one matching entry block (**API.**, **Script.**, **Component.**, **Config.**, etc.) is enough—skip extra section markers when they add ceremony only.

**Tests:** one `{module}.test.ts` per module under test (`routing.test.ts` → `routing.ts`, `lib/slug-fuzzy.test.ts` → `lib/slug-fuzzy.ts`). **Constants.** (fixtures) → **Tests.** (`describe` / `test`).

Blank line before and after each section block, and between the comment and the code below it.

## Code style

- Prefer a **functional** style: fewer reassignments unless performance or clarity really wins.
- Avoid deep nesting. Prefer **small helpers** with **early returns**.
- Prefer **array helpers** (`map`, `filter`, …) unless a hot path needs a hand-tuned loop. **Do not use `forEach`**—use **`for`…`of`** (or indexed `for`) for imperative iteration.
- **`no-nested-ternary`** and **`curly: all`** are Oxlint errors (via `vp check`)—always brace blocks; no nested ternaries.

## Comments

- Prefer **why** (intent, tradeoffs, invariants) over **what**; drop comments that only restate the code.
- **State intent positively.** Explain what we do and why, not what we avoid or what could fail. Prefer `// ensures Y` over `// prevents X` when the code already makes X impossible.
- **Layer once.** Put shared why on a constant, type field, or entry closure. Do not repeat the same rationale at every call site.
- **JSDoc** on exports and non-trivial helpers when the contract is not obvious—often one crisp line is enough. Do not document module-private types (see **Exports**).
- In `//` / `/** */` prose, **backtick code identifiers** (`404`, `FUZZY_SCORE_GAP`, `/:slug`); not section headers (`/* API. */`).
- **Section blocks** (see **File layout**) label structure only — no extra explanation inside the marker.
- **`@sideEffect` (house tag):** flag non-pure functions, even when prose is trimmed to the tag alone. Terse clause names the effect (e.g. "Mutates DOM.", "Async I/O.", "Registers listener."). On exports and closures, use a multi-line block: why line, then `@sideEffect`. Covers mutation, async I/O, non-determinism, and DOM/event registration. Not standard JSDoc/TSDoc. Pure functions get **no** tag.

## Naming

- **Booleans:** prefix with **`is`**, **`has`**, **`should`**, **`can`**, etc. (`isVitest`, `hasRunnerUp`)—not bare adjectives or state nouns.
- **Boolean predicates:** name functions that return yes/no so the call reads as a question (`canResolveSlug`, `hasRunnerUp`, `checkIsExactMatch`). Prefer `can` / `has` / `check` / `should` over `getIs…` / `getShould…`—that pattern reads like a property accessor for a stored flag. Reserve **`is` / `has` / …** on functions for type guards only.
- **`compute` / `calc`** for calculated non-boolean results (`computeFuzzyScore`).
- **Locals:** context-readable names (`projectList`, `runnerUp`, `normalizedSlug`)—not `e`, `res`, `n`, `c`, `x` unless scope is tiny.
- **Parameters:** stable context first (catalog, `projects`), per-request values after (`pathname`, `query`, `slug`) when both are passed.
- **Name for what a thing is, not where it lives.** When a folder or module already conveys context, do not restate it as an identifier prefix.

## Fail fast

- Prefer **loud, immediate failure** over a misleading partial state. Validate required DOM, config, and env **as early as we can**, and **throw** with a clear message when something required is missing.
- Avoid **plausible-looking placeholders** for values the app cannot function without.

## Validation

**When:** after a **large diff** or **high-impact** touch (routing, hub/`projects.json`, shared `lib/`, worker, config) and **always before commit** (e.g. when closing a milestone task).

**Loop** (shortest → longest; stop on first failure):

1. `vp check` — fmt, lint, typecheck
2. `vp test`
3. `bun run fallow:audit` — dead code, unused exports, baselines (CI passes `--base`; see workflow)

**Findings:** fix—wire code, add `.fallowrc.jsonc` `entry` (`src/worker.ts`, `src/hub-app.tsx`), or delete. Do not suppress to greenwash.

**Must ignore?** Ask the human first; aim for a healthy codebase, not a quiet audit.

- **Temporary** (follow-up PR): `TODO` + reason; smallest suppression only if needed.
- **Permanent** (e.g. generated export): comment at the ignore explaining why.

No fallow/lint waivers or “reserved for later” files without human approval and that documentation.

## Project hub (`src/projects.json`)

Hub data in `src/projects.json` (`src/lib/projects.ts`). To refresh from GitHub, follow `.cursor/skills/sync-projects-json/SKILL.md` (`bun run sync:projects` / gh CLI, GitHub MCP fallback → **Validation** loop).

## CI

CI splits `fmt:check`, `lint`, `typecheck`, `test`, and **fallow** (`bun run fallow:audit -- --base …`); locally use the **Validation** loop before push. Do not use `fallow-rs/fallow@v2` in workflows.

## Keeping this file useful

When we lock in a new convention, ask whether it should be added or tightened in `AGENTS.md`.
