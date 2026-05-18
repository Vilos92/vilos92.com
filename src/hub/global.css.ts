import {globalStyle} from '@vanilla-extract/css';

import {palette} from '@/hub/tokens';

/*
 * Styles.
 */

globalStyle('*', {
  boxSizing: 'border-box'
});

globalStyle('body', {
  margin: 0,
  minHeight: '100dvh',
  display: 'grid',
  placeItems: 'center',
  fontFamily: 'system-ui, sans-serif',
  background: palette.pageBg,
  color: palette.text,
  '@media': {
    '(pointer: coarse)': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      padding: 'max(1rem, env(safe-area-inset-top)) 1rem max(1rem, env(safe-area-inset-bottom))'
    }
  }
});
