import {style} from '@vanilla-extract/css';

import {touchLayout} from '@/hub/hub-media';
import {palette} from '@/hub/tokens';

/*
 * Styles.
 */

const searchClearIcon = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#9490a8"><path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L8.94 10l-4.72 4.72a.75.75 0 1 0 1.06 1.06L10 11.06l4.72 4.72a.75.75 0 1 0 1.06-1.06L11.06 10l4.72-4.72a.75.75 0 0 0-1.06-1.06L10 8.94 5.28 4.22Z"/></svg>'
);

export const main = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 'min(24rem, 92vw)',
  minWidth: 0,
  '@media': {
    [touchLayout]: {
      flex: 1,
      alignItems: 'stretch',
      width: '100%',
      minHeight: 0
    }
  }
});

export const header = style({
  marginBottom: '1.25rem',
  width: '100%',
  '@media': {
    [touchLayout]: {
      flexShrink: 0,
      marginBottom: '0.875rem'
    }
  }
});

export const title = style({
  margin: 0,
  fontSize: '1.375rem',
  fontWeight: 600,
  letterSpacing: '-0.03em',
  textAlign: 'center',
  '@media': {
    [touchLayout]: {
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
      color: palette.accentHover
    },
    '&:focus-visible': {
      outlineOffset: '2px'
    }
  }
});

export const search = style({
  position: 'relative',
  width: '100%',
  minWidth: 0,
  '@media': {
    [touchLayout]: {
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
  flexShrink: 0,
  '@media': {
    [touchLayout]: {
      gap: '0.625rem'
    }
  }
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
  padding: '0.625rem 0.75rem',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: palette.border,
  borderRadius: '0.5rem',
  background: palette.surface,
  color: 'inherit',
  font: 'inherit',
  fontSize: '1rem',
  lineHeight: 1.5,
  outline: 'none',
  selectors: {
    '&::placeholder': {
      color: palette.textSubtle,
      opacity: 1
    },
    '&:focus-visible': {
      borderColor: palette.accent,
      outline: 'none'
    },
    '&::-webkit-search-cancel-button': {
      WebkitAppearance: 'none',
      height: '1.125rem',
      width: '1.125rem',
      marginInlineEnd: '0.125rem',
      cursor: 'pointer',
      backgroundImage: `url("data:image/svg+xml,${searchClearIcon}")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: '1.125rem'
    },
    '&::-webkit-search-decoration': {
      WebkitAppearance: 'none'
    }
  },
  '@media': {
    [touchLayout]: {
      minHeight: '2.75rem',
      padding: '0.75rem'
    }
  }
});

export const submitButton = style({
  flexShrink: 0,
  minWidth: '3.25rem',
  padding: '0.625rem 1.125rem',
  border: 0,
  borderRadius: '0.5rem',
  background: palette.buttonBg,
  color: palette.buttonText,
  font: 'inherit',
  fontSize: '1rem',
  fontWeight: 600,
  lineHeight: 1.5,
  cursor: 'pointer',
  transition: 'background 120ms ease',
  selectors: {
    '&:hover:not(:disabled)': {
      background: palette.buttonHover
    },
    '&:disabled': {
      cursor: 'not-allowed',
      background: palette.buttonDisabledBg,
      color: palette.buttonDisabledText
    },
    '&[data-empty="true"]': {
      cursor: 'not-allowed',
      background: palette.buttonDisabledBg,
      color: palette.buttonDisabledText,
      pointerEvents: 'none'
    },
    '&[data-resolving="true"]': {
      cursor: 'wait',
      opacity: 0.85,
      pointerEvents: 'none'
    }
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none'
    },
    [touchLayout]: {
      minHeight: '2.75rem',
      padding: '0.75rem 1.25rem'
    }
  }
});

export const searchPanel = style({
  position: 'absolute',
  top: 'calc(100% + 0.5rem)',
  right: 0,
  left: 0,
  zIndex: 10,
  maxHeight: 'min(18rem, 40dvh)',
  overflowX: 'hidden',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  border: `1px solid ${palette.border}`,
  borderRadius: '0.5rem',
  background: palette.surface,
  boxShadow: palette.shadow,
  WebkitOverflowScrolling: 'touch',
  '@media': {
    [touchLayout]: {
      position: 'static',
      flex: 1,
      minHeight: 0,
      marginTop: '0.75rem',
      maxHeight: 'none',
      boxShadow: 'none'
    }
  }
});

export const results = style({
  margin: 0,
  padding: 0,
  listStyle: 'none'
});

export const resultOption = style({
  display: 'block',
  width: '100%',
  minHeight: '2.75rem',
  padding: '0.5rem 0.75rem',
  border: 0,
  borderRadius: '0.25rem',
  background: 'transparent',
  color: 'inherit',
  font: 'inherit',
  fontSize: '1rem',
  lineHeight: 1.4,
  textAlign: 'left',
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      background: palette.surfaceHover
    },
    '&:focus-visible': {
      outlineOffset: '-1px'
    }
  },
  '@media': {
    [touchLayout]: {
      padding: '0.75rem 1rem'
    }
  }
});

export const resultOptionActive = style({
  background: palette.surfaceHover,
  selectors: {
    '&:focus-visible': {
      background: palette.surfaceHover
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

const panelMessage = {
  margin: 0,
  padding: '0.75rem',
  fontSize: '0.875rem',
  lineHeight: 1.5,
  color: palette.textMuted
};

export const noMatchesMessage = style({
  ...panelMessage,
  selectors: {
    [`${searchPanel} &:not(:last-child)`]: {
      borderBottom: `1px solid ${palette.border}`
    }
  }
});

export const resolveError = style({
  ...panelMessage,
  selectors: {
    [`${searchPanel} &:not(:last-child)`]: {
      borderBottom: `1px solid ${palette.border}`
    }
  }
});
