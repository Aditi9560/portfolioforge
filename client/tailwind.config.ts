import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#10b981',
        dark: {
          bg:     '#0a0a0a',
          card:   '#111111',
          border: '#1f1f1f',
        },
      },
      fontFamily: {
        sans:     ['DM Sans', 'sans-serif'],
        display:  ['Syne', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
