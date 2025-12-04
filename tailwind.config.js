/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ios: {
          bg: '#000000',
          surface: '#1C1C1E',
          secondary: '#2C2C2E',
          tertiary: '#3A3A3C',
          text: '#FFFFFF',
          'text-secondary': '#EBEBF5',
          'text-tertiary': '#EBEBF560',
          accent: '#007AFF',
        },
      },
      fontFamily: {
        ios: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'sans-serif'],
      },
      animation: {
        aurora: 'aurora 60s linear infinite',
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: '50% 50%, 50% 50%',
          },
          to: {
            backgroundPosition: '350% 50%, 350% 50%',
          },
        },
      },
    },
  },
  plugins: [],
}

