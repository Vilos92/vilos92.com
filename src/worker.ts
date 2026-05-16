import {Hono} from 'hono';

import {resolvePath} from './routing.ts';

const app = new Hono();

app.all('*', c => {
  const result = resolvePath(new URL(c.req.url).pathname);

  if (result.kind === 'redirect') {
    return c.redirect(result.location, 302);
  }

  return c.text(`Unknown project: ${result.slug}`, 404);
});

export default app;
