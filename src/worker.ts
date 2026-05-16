import {Hono} from 'hono';

import {resolveSlugPath} from './routing.ts';

const app = new Hono();

app.all('*', c => {
  const pathname = new URL(c.req.url).pathname;
  const result = resolveSlugPath(pathname);

  if (result.kind === 'redirect') {
    return c.redirect(result.location, 302);
  }

  return c.text(`Unknown project: ${result.slug}`, 404);
});

export default app;
