/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind where to look for class usage so unused styles are purged
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // System font stack - fast, no external requests
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      // Near-black text - softer than pure #000, easier on the eyes
      colors: {
        ink: '#1a1a1a',
      },
    },
  },
  plugins: [
    // Provides the `prose` class for rendering Markdown with clean typography
    require('@tailwindcss/typography'),
  ],
};
