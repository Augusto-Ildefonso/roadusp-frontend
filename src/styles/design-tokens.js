export const colors = {
  primary: {
    50: '#e0f7fa',
    100: '#b2ebf2',
    200: '#80deea',
    300: '#4dd0e1',
    400: '#26c6da',
    500: '#1094ab',
    600: '#0e7f94',
    700: '#0b6b7d',
    800: '#095666',
    900: '#06424f',
    DEFAULT: '#1094ab',
  },

  secondary: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#fcb421',
    600: '#e5a21e',
    700: '#cf8f1a',
    800: '#b87d16',
    900: '#a16a12',
    DEFAULT: '#fcb421',
  },

  accent: {
    teal: '#4ED7F1',
    amber: '#f59e0b',
    pink: '#ff00a8',
  },

  surface: {
    base: '#080c18',
    card: '#111b2e',
    elevated: '#1a2740',
    modal: '#0f1729',
  },

  border: {
    subtle: '#1e293b',
    default: '#334155',
    hover: '#475569',
  },

  text: {
    primary: '#f1f5f9',
    secondary: '#94a3b8',
    muted: '#64748b',
    inverse: '#080c18',
  },

  semantic: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  graph: {
    highlight: '#1094ab',
    highlightGlow: 'rgba(16, 148, 171, 0.4)',
    nodeDefault: '#94a3b8',
    nodeStroke: '#1e293b',
    linkColor: '#475569',
    linkOpacity: 0.6,
    background: '#080c18',
    semesterPalette: [
      '#4e79a7', '#f28e2b', '#e15759', '#76b7b2',
      '#59a14f', '#edc948', '#b07aa1', '#ff9da7',
      '#9c755f', '#bab0ac',
    ],
  },
};

export const spacing = {
  container: '1200px',
  cardPadding: '2rem',
  cardRadius: '2rem',
  elementRadius: '1rem',
  buttonRadius: '0.75rem',
  pillRadius: '9999px',
};

export const animation = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

export const typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  heading: {
    hero: 'clamp(2.5rem, 8vw, 5rem)',
    h1: 'clamp(1.75rem, 4vw, 2.5rem)',
    h2: 'clamp(1.25rem, 3vw, 1.75rem)',
    h3: 'clamp(1rem, 2vw, 1.25rem)',
  },
};

export const zIndex = {
  modal: 1000,
  overlay: 900,
  dropdown: 800,
  sticky: 700,
  graph: {
    node: 10,
    link: 1,
    label: 5,
    modal: 1000,
  },
};

const tokens = { colors, spacing, animation, typography, zIndex };
export default tokens;
