/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#111',
        sidebar: '#161616',
        card: '#181818',
        border: '#1e1e1e',
        'border-hover': '#2a2a2a',
        'text-primary': '#e0e0e0',
        'text-secondary': '#bbb',
        'text-muted': '#666',
        'text-ghost': '#3a3a3a',
        'accent-yes': '#4ade80',
        'accent-no': '#f87171',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '7px',
        button: '5px',
        pill: '99px',
      },
    },
  },
  plugins: [],
}
