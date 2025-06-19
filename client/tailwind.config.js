/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          900: '#0f172a',
        },
        'ajira': {
          'primary': '#000000',    // Kenyan Black
          'accent': '#CE1126',     // Kenyan Red
          'success': '#006B3F',    // Kenyan Green
          'light': '#FFFFFF',      // White
          'blue': '#15325C',       // Deep Blue
          'gray': {
            100: '#F7FAFC',
            200: '#EDF2F7',
            300: '#E2E8F0',
            400: '#CBD5E0',
            500: '#A0AEC0',
            600: '#718096',
            700: '#4A5568',
            800: '#2D3748',
            900: '#1A202C'
          }
        },
        // Kenyan Flag Colors
        'kenya': {
          'black': '#000000',
          'red': '#CE1126',
          'green': '#006B3F',
          'white': '#FFFFFF'
        }
      },
      fontFamily: {
        'sans': ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        'body': ['Open Sans', 'system-ui', '-apple-system', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s infinite',
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
      },
      backgroundImage: {
        // 'hero-pattern': "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/hero-bg.jpg')", // commented out because the image does not exist
        'gradient-ajira': 'linear-gradient(135deg, #000000 0%, #15325C 100%)'
      },
      boxShadow: {
        'ajira': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'ajira-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }
    },
  },
  plugins: [],
} 