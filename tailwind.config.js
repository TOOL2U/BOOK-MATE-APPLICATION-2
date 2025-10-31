/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#1E40AF',
        },
        background: {
          DEFAULT: '#0F172A',
          card: '#1E293B',
          input: '#334155',
        },
        text: {
          primary: '#F1F5F9',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
      },
    },
  },
  plugins: [],
}

