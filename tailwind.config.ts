import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0b0d10',
          soft: '#111418'
        },
        fg: { 
          DEFAULT: '#e6e8eb', 
          muted: '#9aa3af' 
        },
        primary: { 
          DEFAULT: '#7c9fff' 
        }
      },
      borderRadius: { 
        xl: '1rem', 
        '2xl': '1.25rem' 
      }
    }
  },
  plugins: []
} satisfies Config
