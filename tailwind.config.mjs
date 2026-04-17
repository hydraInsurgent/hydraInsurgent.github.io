/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        display: [
          '"Iowan Old Style"',
          '"Palatino Linotype"',
          '"Book Antiqua"',
          'Georgia',
          'serif',
        ],
        sans: [
          '"Avenir Next"',
          '"Segoe UI"',
          'Inter',
          'Roboto',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        ink: '#172033',
        paper: '#f7f1e5',
        sand: '#eadfc8',
        coral: '#ff7a59',
        teal: '#1f7a8c',
        pine: '#103f4a',
      },
      boxShadow: {
        glow: '0 24px 60px rgba(23, 32, 51, 0.12)',
      },
      animation: {
        'fade-up': 'fade-up 700ms ease-out both',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
