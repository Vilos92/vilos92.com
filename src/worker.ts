import {Hono} from 'hono';

import {resolveSlugPath} from '@/routing';

/*
 * API.
 */

const app = new Hono();

app.all('*', context => {
  const pathname = new URL(context.req.url).pathname;
  const result = resolveSlugPath(pathname);

  if (result.kind === 'redirect') {
    return context.redirect(result.location, 302);
  }

  return context.text(`Unknown project: ${result.slug}`, 404);
});

export default app;
