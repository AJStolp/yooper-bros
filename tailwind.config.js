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
        accent: '#C8102E',
        secondary: '#3F2305',
        primary: '#2B4D2F',
        smokey: '#f5f5f5',
      },
    },
  },
};
