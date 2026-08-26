export default {
  darkMode: 'class',
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)',
        surface: 'var(--surface)',
        elevated: 'var(--elevated)',
        ink: 'var(--ink)',
        body: 'var(--body)',
        subtle: 'var(--subtle)',
        line: 'var(--line)',
        primary: {
          DEFAULT: 'var(--primary)',
          tint: 'var(--primary-tint)',
          hover: 'var(--primary-hover)',
          fg: 'var(--primary-fg)',
        },
        sky: {
          bg: 'var(--sky-bg)',
          line: 'var(--sky-line)',
          text: 'var(--sky-text)',
        },
        lavender: {
          bg: 'var(--lavender-bg)',
          line: 'var(--lavender-line)',
          text: 'var(--lavender-text)',
        },
        sand: {
          bg: 'var(--sand-bg)',
          line: 'var(--sand-line)',
          text: 'var(--sand-text)',
        },
        blush: {
          bg: 'var(--blush-bg)',
          line: 'var(--blush-line)',
          text: 'var(--blush-text)',
        },
        mist: {
          bg: 'var(--mist-bg)',
          line: 'var(--mist-line)',
          text: 'var(--mist-text)',
        },
        success: { DEFAULT: 'var(--success)', bg: 'var(--success-bg)' },
        warning: { DEFAULT: 'var(--warning)', bg: 'var(--warning-bg)' },
        danger: { DEFAULT: 'var(--danger)', bg: 'var(--danger-bg)' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Newsreader', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(24, 35, 31, 0.04), 0 8px 24px -16px rgba(24, 35, 31, 0.14)',
        pop: '0 24px 60px -24px rgba(24, 35, 31, 0.35)',
      },
      transitionTimingFunction: {
        calm: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
  plugins: [],
}
