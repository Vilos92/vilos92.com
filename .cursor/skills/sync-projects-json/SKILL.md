---
name: sync-projects-json
description: >-
  Regenerates src/projects.json from GitHub repos owned by Vilos92. Prefer
  scripts/sync-projects-json.sh (gh CLI); fall back to GitHub MCP when gh is
  unavailable or not authenticated. Use when the user asks to sync, refresh, or
  update projects.json, add a repo to the hub, or keep the project list in sync
  with GitHub.
disable-model-invocation: true
---

# Sync projects.json

Refresh `src/projects.json`, then validate with `vp check`, `vp test`, and
`bun run fallow:audit`.

## One-shot workflow

From the **vilos92.com repo root**:

### 1. Sync script (preferred: gh CLI)

```bash
bun run sync:projects
```

| Exit | Meaning                                                           | Next step                                  |
| ---- | ----------------------------------------------------------------- | ------------------------------------------ |
| `0`  | File updated or already in sync (stdout reports count + `via gh`) | Go to **§4 Validate**                      |
| `10` | `gh` not installed or not authenticated                           | **§2 GitHub MCP fallback**                 |
| `1`  | Other error (`jq` missing, `gh repo list` failed, …)              | Fix and retry script; do not mark dex done |

Requires **`gh`** and **`jq`** on `PATH`. Auth: `gh auth login`.

### 2. GitHub MCP fallback

Use only when **§1** exited **`10`**.

1. Read the tool schema:
   `mcps/user-github/tools/search_repositories.json` (or list MCP tools for
   server `user-github`).
2. Call **`search_repositories`** on server **`user-github`**:

   | Argument         | Value                     |
   | ---------------- | ------------------------- |
   | `query`          | `user:Vilos92 fork:false` |
   | `minimal_output` | `true`                    |
   | `perPage`        | `100`                     |
   | `page`           | `1`, then `2`, …          |

3. Paginate until `items.length` is less than `perPage` or the API reports no
   more pages (`incomplete_results: false` and you have `total_count` items).
4. **Do not include forks** — `fork:false` in the query is required.

If MCP auth or tool calls fail, **stop**. Report that both paths need credentials:

- **gh:** `gh auth login`
- **MCP:** GitHub MCP credentials in Cursor

Do not mark dex done until one path succeeds.

### 3. Build / write `src/projects.json` (MCP path only)

Skip when **§1** succeeded (`bun run sync:projects` exit `0`).

For each repo in `items`:

| Field       | Source                                    |
| ----------- | ----------------------------------------- |
| `slug`      | `repo.name.toLowerCase()`                 |
| `name`      | `repo.name` (preserve GitHub casing)      |
| `githubUrl` | `https://github.com/Vilos92/${repo.name}` |
| `private`   | `repo.private`                            |

Sort the array by `slug` ascending (same byte order as the script’s `sort_by(.slug)` —
not `localeCompare`; e.g. `carlin-pi` before `carlin_node`).

1. Read `src/projects.json`.
2. Serialize as `JSON.stringify(projects, null, 2) + '\n'` (2-space indent,
   trailing newline).
3. If the serialized string **equals** the file contents, **leave the file
   unchanged** and report: `projects.json already in sync (N projects) via MCP`.
4. Otherwise **write** the full file (do not patch individual entries).

Shape (matches `src/lib/projects.ts` `Project` type):

```json
[
  {
    "slug": "astro-greg",
    "name": "astro-greg",
    "githubUrl": "https://github.com/Vilos92/astro-greg",
    "private": false
  }
]
```

### 4. Validate

```bash
vp check
vp test
bun run fallow:audit
```

Run from repo root. All must pass before you commit or mark a dex task done.

### 5. Dex tasks (optional)

`gdex greg complete <id> --result "..."` only when sync succeeded (script or MCP:
file updated or already correct) **and** validation passed (`vp check`, `vp test`,
`bun run fallow:audit`).

Example result: `projects.json in sync (N projects); vp check, vp test, and fallow:audit passed.`

Commit only if `src/projects.json` changed and validation passed.

### Agent kickoff (dex task `evdimxnk`)

Copy this prompt to run the skill end-to-end:

```text
Work on gdex task evdimxnk (greg profile). Run `gdex greg show evdimxnk --full` first.

Then immediately:
1. Read and follow `.cursor/skills/sync-projects-json/SKILL.md` (sync-projects-json skill).
2. From the vilos92.com repo root: `bun run sync:projects`, or GitHub MCP fallback per the skill, then `vp check`, `vp test`, and `bun run fallow:audit`.

If sync succeeded (file updated or already in sync) and validation passed, mark the task done:

   gdex greg complete evdimxnk --result "projects.json in sync (N projects); vp check, vp test, and fallow:audit passed."

If anything fails, do not complete the task—report what failed (gh auth, MCP auth, JSON diff, tests, fallow, etc.).
```

## Field rules (reference)

- **Owner:** `Vilos92` only.
- **Source:** every non-fork repo owned by that user (`gh repo list` or search
  `user:Vilos92 fork:false`).
- **Exclude:** nothing beyond forks (archived repos stay listed).

## Troubleshooting

| Problem                  | Action                                                             |
| ------------------------ | ------------------------------------------------------------------ |
| Script exit `10`         | Run `gh auth login`, or use **§2** MCP fallback.                   |
| MCP auth / tool errors   | Fix GitHub MCP credentials in Cursor; retry `search_repositories`. |
| Both paths fail auth     | Configure `gh` and MCP; do not mark dex done.                      |
| Count mismatch vs GitHub | Re-run script; for MCP, confirm pagination and `fork:false`.       |
| Validation fails         | Fix code, formatting, or fallow findings; do not mark dex done.    |

## Related files

- `scripts/sync-projects-json.sh` — gh CLI sync (exit `10` → MCP)
- `src/projects.json` — hub data (generated / synced by agents)
- `src/lib/projects.ts` — `Project` type and exports (`projects`, `publicProjects`, …)
