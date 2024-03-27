import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  plugins: [formsPlugin, typographyPlugin],
  theme: {
    extend: {
      colors: {
        text: '#050315',
        background: '#ffffff',
        primary: '#C8102E',
        secondary: '#3F2305',
        accent: '#2B4D2F',
      },
    },
  },
};
