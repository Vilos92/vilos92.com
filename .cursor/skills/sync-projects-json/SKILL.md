---
name: sync-projects-json
description: >-
  Regenerates src/projects.json from GitHub repos owned by Vilos92 via the GitHub
  MCP. Use when the user asks to sync, refresh, or update projects.json, add a
  repo to the hub, or keep the project list in sync with GitHub.
disable-model-invocation: true
---

# Sync projects.json

List repos with **GitHub MCP**, then write or skip `src/projects.json`. Validate
with `vp check` and `vp test`.

## One-shot workflow

From the **vilos92.com repo root**:

### 1. List repos (GitHub MCP)

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

### 2. Build the project list

For each repo in `items`:

| Field       | Source                                    |
| ----------- | ----------------------------------------- |
| `slug`      | `repo.name.toLowerCase()`                 |
| `name`      | `repo.name` (preserve GitHub casing)      |
| `githubUrl` | `https://github.com/Vilos92/${repo.name}` |
| `private`   | `repo.private`                            |

Sort the array by `slug` ascending (`localeCompare`).

### 3. Update `src/projects.json` (only if needed)

1. Read `src/projects.json`.
2. Serialize the built list as `JSON.stringify(projects, null, 2) + '\n'`
   (2-space indent, trailing newline).
3. If the serialized string **equals** the file contents, **leave the file
   unchanged** and report: `projects.json already in sync (N projects)`.
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
```

Run from repo root. Both must pass before you commit or mark a dex task done.

### 5. Dex tasks (optional)

`gdex greg complete <id> --result "..."` only when MCP sync succeeded (file
updated or already correct) **and** `vp check` and `vp test` passed.

Example result: `projects.json in sync (52 projects); vp check and vp test passed.`

Commit only if `src/projects.json` changed and validation passed.

### Agent kickoff (dex task `evdimxnk`)

Copy this prompt to run the skill end-to-end:

```
Work on gdex task evdimxnk (greg profile). Run `gdex greg show evdimxnk --full` first.

Then immediately:
1. Read and follow `.cursor/skills/sync-projects-json/SKILL.md` (sync-projects-json skill).
2. From the vilos92.com repo root, follow the skill: GitHub MCP sync of `src/projects.json`, then `vp check` and `vp test`.

If MCP sync succeeded (file updated or already in sync) and `vp check` and `vp test` pass, mark the task done:

   gdex greg complete evdimxnk --result "projects.json in sync (N projects); vp check and vp test passed."

If anything fails, do not complete the task—report what failed (MCP auth, JSON diff, tests, etc.).
```

## Field rules (reference)

- **Owner:** `Vilos92` only.
- **Source:** every non-fork repo owned by that user.
- **Exclude:** nothing beyond forks (archived repos stay listed).

## Troubleshooting

| Problem                     | Action                                                             |
| --------------------------- | ------------------------------------------------------------------ |
| MCP auth / tool errors      | Fix GitHub MCP credentials in Cursor; retry `search_repositories`. |
| Count mismatch vs GitHub    | Re-run with pagination; confirm `fork:false` in query.             |
| `vp check` / `vp test` fail | Fix code or formatting; do not mark dex task complete.             |

## Related files

- `src/projects.json` — hub data (generated / synced by agents)
- `src/lib/projects.ts` — `Project` type and exports (`projects`, `publicProjects`, …)
