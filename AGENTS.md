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

**Order** (omit unused sections): **Constants.** · **Types.** · **Route.** / **API.** / **Script.** · **Helpers.**

**Constants.** — module-level `const` and `export const` (config, parsed JSON, derived lists). **API.** — exported **functions** and file entry points (`src/worker.ts` → **API.**; `src/hub-app.ts` → **Script.**). Do not label `export const` blocks **API.**

**Zod:** **Schemas.** → **Runtime types.** → **Constants.** (`parse` / `safeParse` results and other `export const`). Schemas stay module-private unless another file imports them.

Blank line before and after each section block, and between the comment and the code below it.

## Project hub (`src/projects.json`)

Hub data in `src/projects.json` (`src/lib/projects.ts`). To refresh the list from GitHub, follow `.cursor/skills/sync-projects-json/SKILL.md` (GitHub MCP → update JSON → `vp check` / `vp test`).

<!--VITE PLUS END-->
