import {style} from '@vanilla-extract/css';

import {palette} from '@/hub/tokens';

/*
 * Styles.
 */

export const main = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 'min(24rem, 92vw)',
  minWidth: 0,
  '@media': {
    '(pointer: coarse)': {
      flex: 1,
      alignItems: 'stretch',
      width: '100%',
      minHeight: 0
    }
  }
});

export const header = style({
  marginBottom: '1rem',
  width: '100%',
  '@media': {
    '(pointer: coarse)': {
      flexShrink: 0,
      marginBottom: '0.75rem'
    }
  }
});

export const title = style({
  margin: 0,
  fontSize: '1.25rem',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  textAlign: 'center',
  '@media': {
    '(pointer: coarse)': {
      textAlign: 'left'
    }
  }
});

export const siteTitle = style({
  color: 'inherit',
  textDecoration: 'none',
  borderRadius: '0.25rem',
  selectors: {
    '&:hover': {
      textDecoration: 'underline',
      textDecorationColor: palette.textSubtle,
      textUnderlineOffset: '0.2em'
    },
    '&:focus-visible': {
      outline: `2px solid ${palette.textSubtle}`,
      outlineOffset: '3px'
    }
  }
});

export const search = style({
  position: 'relative',
  width: '100%',
  minWidth: 0,
  '@media': {
    '(pointer: coarse)': {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      minHeight: 0
    }
  }
});

export const form = style({
  display: 'flex',
  gap: '0.5rem',
  flexShrink: 0
});

export const visuallyHidden = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0
});

export const input = style({
  flex: 1,
  minWidth: 0,
  padding: '0.6rem 0.75rem',
  border: `1px solid ${palette.border}`,
  borderRadius: '0.375rem',
  background: palette.surface,
  color: 'inherit',
  font: 'inherit',
  outline: 'none',
  selectors: {
    '&::placeholder': {
      color: palette.textSubtle
    },
    '&:focus': {
      borderColor: palette.borderFocus,
      boxShadow: `0 0 0 2px ${palette.focusRing}`
    }
  },
  '@media': {
    '(pointer: coarse)': {
      minHeight: '2.75rem'
    }
  }
});

export const submitButton = style({
  flexShrink: 0,
  padding: '0.6rem 1rem',
  border: 0,
  borderRadius: '0.375rem',
  background: palette.buttonBg,
  color: palette.buttonText,
  font: 'inherit',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 120ms ease',
  selectors: {
    '&:hover:not(:disabled)': {
      background: '#ffffff'
    },
    '&:focus-visible': {
      outline: `2px solid ${palette.borderFocus}`,
      outlineOffset: '2px'
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.4
    }
  },
  '@media': {
    '(pointer: coarse)': {
      minHeight: '2.75rem'
    }
  }
});

export const results = style({
  position: 'absolute',
  top: 'calc(100% + 0.5rem)',
  right: 0,
  left: 0,
  zIndex: 10,
  margin: 0,
  padding: 0,
  maxHeight: 'min(18rem, 40dvh)',
  listStyle: 'none',
  overflowX: 'hidden',
  overflowY: 'auto',
  border: `1px solid ${palette.border}`,
  borderRadius: '0.375rem',
  background: palette.surface,
  boxShadow: '0 12px 32px rgb(0 0 0 / 0.45)',
  '@media': {
    '(pointer: coarse)': {
      position: 'static',
      flex: 1,
      minHeight: 0,
      marginTop: '0.75rem',
      maxHeight: 'none',
      boxShadow: 'none'
    }
  }
});

export const resultLink = style({
  display: 'block',
  padding: '0.5rem 0.75rem',
  color: 'inherit',
  textDecoration: 'none',
  selectors: {
    '&:hover': {
      background: palette.surfaceHover
    },
    '&:focus-visible': {
      background: palette.surfaceHover,
      outline: 'none'
    }
  },
  '@media': {
    '(pointer: coarse)': {
      padding: '0.75rem 1rem'
    }
  }
});

export const resultName = style({
  display: 'block',
  fontWeight: 500
});

export const resultSlug = style({
  display: 'block',
  fontSize: '0.8125rem',
  color: palette.textMuted
});

export const emptyMessage = style({
  padding: '0.75rem',
  fontSize: '0.875rem',
  color: palette.textSubtle
});
