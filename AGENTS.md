<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.

## File layout (section comments)

Use `/* Section name. */` blocks. Read top-down: main entry first, **Helpers.** last.

**Order** (omit unused sections; never add empty **Types.** / **Helpers.** blocks):

1. **Types.** · **Constants.** — swap when paths or literals must come first; use **Types.** when the file defines top-level types
2. **Route.** · **API.** · **Script.** — the file’s main entry (`src/worker.ts` → **API.**; `src/hub-app.ts` and `scripts/*.ts` → **Script.**)
3. **Helpers.** — private helpers only; always after the main entry

**Scripts** stack **Constants.** → **Types.** → **Script.** → **Helpers.** Module-level `const` the script needs live in **Constants.**; only `function` helpers may follow **Script.** (hoisting).

**Lean files** (one export, few lines): a single **API.** or **Script.** block is enough—no empty **Types.** / **Helpers.** wrappers.

**Tests** (`*.test.ts`): put shared fixtures in **Constants.**; `describe` / `test` blocks are the entry (no **Tests.** wrapper unless the file is large).

Blank line before and after each section block, and between the comment and the code below it.

## TypeScript

- Prefer **`type` over `interface`** unless you truly need declaration merging (we do not).
- Prefer **`undefined` over `null`**. Model absence as `undefined` in app and AI shapes; use **`.optional()`** in Zod, not **`.nullable().optional()`**. Use **`toSqlNull()`** (`#/lib/nullish`) only at Drizzle write boundaries where the column must be SQL `NULL`. Do not use `?? null` in app code unless a type contract explicitly requires `null` (rare). Do not add helpers to map `null` → `undefined`; type app surfaces without `null` so conversion stays rare.
- **`??` vs `||`:** use **`??`** to default `null`/`undefined` only. Reserve **`||`** for boolean conditions and deliberate truthiness (e.g. `disabled={isSaving || isDeleting}`). Treating `''` as absent belongs in **`trimmedOrUndefined()`**, not `value || fallback`.
- **Avoid redundant nullish coalescing:** do not write `x ?? undefined` when `x` is already `T | undefined` with no `null`.
- **Exports:** do not export types, functions, or constants unless another file imports them (or we deliberately expose a stable public API). Prefer module-private symbols until then.
- **`?` vs `| undefined`:** use optional properties (`prop?:`) only when callers often omit the key entirely (e.g. wide public or library-style surfaces). For **internal** components and modules, prefer required keys with `T | undefined` when a value may be absent—every call site passes the prop explicitly, and “missing meaning” is modeled as `undefined`, not “key not passed.”

## Project hub (`src/projects.json`)

Hub data in `src/projects.json` (`src/lib/projects.ts`). To refresh the list from GitHub, follow `.cursor/skills/sync-projects-json/SKILL.md` (GitHub MCP → update JSON → `vp check` / `vp test`).

<!--VITE PLUS END-->
