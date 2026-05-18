import {hydrate} from 'preact';
import renderToString from 'preact-render-to-string';

import {HubApp} from '@/hub/HubApp';

import '@/hub/global.css';

/*
 * Script.
 */

if (typeof document !== 'undefined') {
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('hub markup missing #root');
  }

  hydrate(<HubApp />, root);
}

export async function prerender() {
  return {html: renderToString(<HubApp />)};
}
