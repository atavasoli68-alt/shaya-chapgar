import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2f7',
          100: '#d5e0ee',
          200: '#abc1de',
          300: '#7fa0ca',
          400: '#5380b5',
          500: '#3461a0',
          600: '#264d88',
          700: '#1e3a6e',
          800: '#162b54',
          900: '#0e1c38',
          950: '#070e1c',
        },
        gold: {
          50: '#fef9ee',
          100: '#fdf0cc',
          200: '#fae095',
          300: '#f7ca58',
          400: '#f5b930',
          500: '#f5a623',
          600: '#e08a0a',
          700: '#b86b0b',
          800: '#955310',
          900: '#7a4411',
        },
      },
      fontFamily: {
        sans: ['var(--font-vazirmatn)', 'Vazirmatn', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 2px 20px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.12)',
        'navy': '0 4px 24px rgba(30,58,110,0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
