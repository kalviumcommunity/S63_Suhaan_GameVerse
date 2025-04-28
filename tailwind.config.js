/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gunmetal: '#1A1C1D',    // Background
        lightgray: '#E5E5E5',   // Foreground
        electric: '#A020F0',    // Primary Accent
        neon: '#00FFAB',        // Success
        crimson: '#FF3B3F',     // Error
        cyanblue: '#00BFFF',    // Secondary Accent
        charcoal: '#2A2D34',    // Card/Section Background
        slate: '#3C3F44',       // Borders
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUpAndFade: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
        scrollDown: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in-out',
        slideUp: 'slideUp 0.5s ease-out',
        slideUpAndFade: 'slideUpAndFade 0.7s ease-out',
        shake: 'shake 0.8s ease-in-out',
        slowZoom: 'slowZoom 20s ease-in-out infinite alternate',
        scrollDown: 'scrollDown 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} 