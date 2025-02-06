import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2C3E50', // Deep blue-gray
          light: '#34495E',
          dark: '#1A252F',
        },
        secondary: {
          DEFAULT: '#E74C3C', // Accent red
          light: '#EC7063',
          dark: '#C0392B',
        },
        neutral: {
          DEFAULT: '#ECF0F1', // Light gray background
          dark: '#BDC3C7',
        },
        text: {
          DEFAULT: '#2C3E50', // Main text color
          light: '#7F8C8D', // Secondary text color
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      spacing: {
        '128': '32rem',
      },
      container: {
        center: true,
        padding: '2rem',
      },
    },
  },
  plugins: [],
};

export default config;