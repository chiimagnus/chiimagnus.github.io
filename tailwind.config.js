/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./dice.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src-3d/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-yellow': '#FDE68A',
        'custom-pink': '#FBCFE8',
        'custom-blue': '#BFDBFE',
        'glass-bg': 'rgba(255, 255, 255, 0.15)',
        'glass-border': 'rgba(255, 255, 255, 0.2)',
        
        // Theme colors that support opacity modifiers (e.g., bg-primary/50)
        primary: 'rgb(var(--primary-color-rgb) / <alpha-value>)',
        secondary: 'rgb(var(--secondary-color-rgb) / <alpha-value>)',
        accent: 'var(--accent-color)',
        link: 'var(--link-color)',
        hover: 'var(--hover-color)',
      },
      backgroundImage: {
        'gradient-main': 'var(--bg-gradient)',
      },
      typography: {
        DEFAULT: {
          css: {
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
      backdropFilter: {
        'blur': 'blur(10px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-filters'),
  ],
} 