import {render} from 'preact';

import {HubApp} from '@/hub/HubApp';

import '@/hub/global.css';

/*
 * Script.
 */

const root = document.getElementById('root');
if (!root) {
  throw new Error('hub markup missing #root');
}

render(<HubApp />, root);
