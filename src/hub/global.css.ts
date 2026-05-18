import {globalStyle} from '@vanilla-extract/css';

import {touchLayout} from '@/hub/hub-media';
import {fonts, palette} from '@/hub/tokens';

/*
 * Styles.
 */

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box'
});

globalStyle('html', {
  colorScheme: 'dark'
});

globalStyle('body', {
  margin: 0,
  minHeight: '100dvh',
  display: 'grid',
  placeItems: 'center',
  fontFamily: fonts.sans,
  fontSize: '1rem',
  lineHeight: 1.5,
  backgroundColor: palette.pageBg,
  backgroundImage: palette.pageBgAccent,
  color: palette.text,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  '@media': {
    [touchLayout]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      padding:
        'max(1rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) max(1rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left))'
    }
  }
});

globalStyle(':focus', {
  outline: 'none'
});

globalStyle(':focus-visible', {
  outline: `1px solid ${palette.accent}`,
  outlineOffset: '2px'
});

globalStyle('.skip-link', {
  position: 'absolute',
  left: '1rem',
  top: '-100%',
  zIndex: 100,
  padding: '0.5rem 0.75rem',
  borderRadius: '0.375rem',
  background: palette.surface,
  color: palette.text,
  font: 'inherit',
  fontWeight: 600,
  textDecoration: 'none',
  boxShadow: palette.shadow
});

globalStyle('.skip-link:focus-visible', {
  top: 'max(1rem, env(safe-area-inset-top))'
});

globalStyle('a, button, input[type="search"], [role="option"]', {
  WebkitTapHighlightColor: 'rgb(167 139 250 / 0.25)'
});
