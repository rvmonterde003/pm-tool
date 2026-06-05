import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#111111',
        canvas: '#1a1a1a',
        surface: '#1e1e1e',
        panel: '#252525',
        border: '#2e2e2e',
        'text-primary': '#f0f0f0',
        'text-muted': '#6b6b6b',
        orange: '#ff6b00',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        orange: '0 0 8px #ff6b00',
      },
    },
  },
  plugins: [],
}

export default config
