/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        card: '#1A2235',
        primary: '#6366F1',
        primary_hover: '#4F46E5',
        accent: '#10B981',
        text: '#F3F4F6',
        text_muted: '#9CA3AF'
      }
    },
  },
  plugins: [],
}
