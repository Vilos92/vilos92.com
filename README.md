# vilos92.com

Source for [vilos92.com](https://vilos92.com), my GitHub project hub.

One search box on `/`, short paths like [`/gdex`](https://vilos92.com/gdex) that redirect to the matching [Vilos92](https://github.com/Vilos92) repo. Miss a slug and you land back on the hub with the query pre-filled so you can pick from fuzzy matches.

I built it because I got tired of digging through GitHub's UI to find my own projects. More on motivation, architecture, and tradeoffs in the [write-up on greglinscheid.com](https://greglinscheid.com/blog/vilos92-com).

## How it works

- **Search:** public repo names and slugs ship in the static bundle. [fuzzysort](https://github.com/farzher/fuzzysort) runs in the browser as you type. No search API on keystrokes.
- **Private repos:** left out of the combobox list. The worker still resolves them when you submit an exact or dot-normalized slug via `/api/resolve`.
- **Short links:** `GET /:slug` 302s to GitHub on an exact or unambiguous fuzzy match. Otherwise it redirects to `/?q=…` for hub search.
- **Catalog:** `src/projects.json`, regenerated with `bun run sync:projects`. The site does not call the GitHub API on every page load.

## Stack

[Preact](https://preactjs.com/), [Vanilla Extract](https://vanilla-extract.style/), [Vite+](https://viteplus.dev/guide/), [Hono](https://hono.dev/) on [Cloudflare Workers](https://developers.cloudflare.com/workers/). Hub shell prerendered at build time. Worker handles redirects and resolve.

## About this repo

Public for transparency. Not a template and not looking for contributors. I don't document a supported setup for running it elsewhere.
