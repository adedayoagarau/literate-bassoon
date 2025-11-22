/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'paper': '#fdfbf7',
        'ink': '#333333',
      },
      fontFamily: {
        'courier': ['Courier Prime', 'Courier New', 'monospace'],
        'crimson': ['Crimson Text', 'serif'],
        'times': ['Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
