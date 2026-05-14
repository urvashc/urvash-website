/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f0f0f',
        'ink-2': '#3a3a3a',
        'ink-3': '#888',
        'ink-4': '#bbb',
        rule: '#e2e2e2',
        'rule-2': '#ebebeb',
        bg: '#fafaf8',
        'bg-2': '#f4f4f1',
        'bg-3': '#eeecea',
        red: '#c8392b',
      },
      fontFamily: {
        mono: ["'DM Mono'", 'monospace'],
        serif: ["'Instrument Serif'", 'Georgia', 'serif'],
        sans: ["'DM Sans'", 'system-ui', 'sans-serif'],
      },
      spacing: {
        gutter: '52px',
      },
      transitionTimingFunction: {
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
