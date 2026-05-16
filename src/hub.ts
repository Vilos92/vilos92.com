/** Minimal / hub: submit navigates to /{slug} (worker applies exact + fuzzy routing). */
export const HUB_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>vilos92.com</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100dvh;
        display: grid;
        place-items: center;
        font-family: system-ui, sans-serif;
        background: #0f0f10;
        color: #f4f4f5;
      }
      main { width: min(24rem, 92vw); }
      h1 {
        margin: 0 0 1rem;
        font-size: 1.25rem;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      form { display: flex; gap: 0.5rem; }
      input {
        flex: 1;
        padding: 0.6rem 0.75rem;
        border: 1px solid #3f3f46;
        border-radius: 0.375rem;
        background: #18181b;
        color: inherit;
        font: inherit;
      }
      input:focus {
        outline: 2px solid #71717a;
        outline-offset: 1px;
      }
      button {
        padding: 0.6rem 1rem;
        border: 0;
        border-radius: 0.375rem;
        background: #f4f4f5;
        color: #18181b;
        font: inherit;
        font-weight: 600;
        cursor: pointer;
      }
      p {
        margin: 0.75rem 0 0;
        font-size: 0.8125rem;
        color: #a1a1aa;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>vilos92.com</h1>
      <form id="go">
        <input
          name="slug"
          type="text"
          placeholder="project slug"
          autocomplete="off"
          spellcheck="false"
          autofocus
          required
        />
        <button type="submit">Go</button>
      </form>
      <p>Public projects only for fuzzy matches.</p>
    </main>
    <script>
      document.getElementById('go').addEventListener('submit', (e) => {
        e.preventDefault();
        const slug = new FormData(e.currentTarget).get('slug')?.toString().trim();
        if (!slug) return;
        globalThis.location.assign('/' + encodeURIComponent(slug));
      });
    </script>
  </body>
</html>`;
