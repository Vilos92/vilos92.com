import {Hono} from 'hono';

import {resolveSlugOpen, resolveSlugPath} from '@/routing';

/*
 * API.
 */

const app = new Hono();

app.get('/api/resolve', context => {
  const query = context.req.query('q')?.trim() ?? '';
  if (!query) {
    return context.json({error: 'missing q'}, 400);
  }

  const result = resolveSlugOpen(query);
  if (result.kind === 'open') {
    return context.json({ok: true, slug: result.slug, name: result.name, url: result.url});
  }

  return context.json({ok: false});
});

app.all('*', context => {
  const pathname = new URL(context.req.url).pathname;
  const result = resolveSlugPath(pathname);

  if (result.kind === 'redirect') {
    return context.redirect(result.location, 302);
  }

  return context.text(`Unknown project: ${result.slug}`, 404);
});

export default app;
