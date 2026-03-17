/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        base: '#080C14',
        surface: '#0E1420',
        elevated: '#141B2D',
        overlay: '#1A2238',
        accent: {
          blue: '#4F8EF7',
          green: '#10D98A',
          red: '#FF5757',
          gold: '#FFB547',
          purple: '#A78BFA',
          cyan: '#22D3EE',
        },
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        lg: '16px',
        xl: '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease both',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16,1,0.3,1) both',
        'number-up': 'numberUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: 0, transform: 'scale(0.95)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
        numberUp: {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'glow-blue': '0 0 24px rgba(79,142,247,0.25)',
        'glow-green': '0 0 24px rgba(16,217,138,0.20)',
        card: '0 4px 16px rgba(0,0,0,0.5)',
        modal: '0 24px 64px rgba(0,0,0,0.8)',
      },
    },
  },
  plugins: [],
}
