module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ghost: {
          950: '#020617',
          900: '#08101f',
          800: '#111828',
          700: '#1e293b',
          600: '#334155'
        },
        neon: {
          blue: '#38bdf8',
          violet: '#a855f7',
          teal: '#14b8a6'
        }
      },
      boxShadow: {
        soft: '0 25px 80px rgba(15, 23, 42, 0.24)',
        glow: '0 0 120px rgba(56, 189, 248, 0.18)',
        panel: '0 30px 60px rgba(15, 23, 42, 0.28)'
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at 10% 10%, rgba(56,189,248,0.18), transparent 18%), radial-gradient(circle at 90% 20%, rgba(168,85,247,0.16), transparent 16%), radial-gradient(circle at 50% 100%, rgba(59,130,246,0.1), transparent 20%)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 10s linear infinite'
      }
    }
  },
  plugins: []
};