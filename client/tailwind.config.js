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
        // Official Ajira Digital Brand Colors
        'ajira': {
          'primary': '#1B4F72',     // Ajira Deep Blue (Primary)
          'secondary': '#2E8B57',   // Ajira Green (Secondary)
          'accent': '#FF6B35',      // Ajira Orange (Accent)
          'dark': '#0F2C3D',       // Ajira Dark Blue
          'light': '#E8F4F8',      // Ajira Light Blue
          'success': '#28A745',     // Success Green
          'warning': '#FFC107',     // Warning Yellow
          'danger': '#DC3545',      // Danger Red
          'info': '#17A2B8',       // Info Cyan
          'white': '#FFFFFF',       // Pure White
          'text': {
            'primary': '#1B4F72',   // Primary text color
            'secondary': '#495057', // Secondary text color
            'muted': '#6C757D',     // Muted text color
            'light': '#ADB5BD',     // Light text color
          },
          'blue': {
            50: '#E3F2FD',
            100: '#BBDEFB',
            200: '#90CAF9',
            300: '#64B5F6',
            400: '#42A5F5',
            500: '#1B4F72',    // Primary blue
            600: '#1565C0',
            700: '#0D47A1',
            800: '#0F2C3D',    // Dark blue
            900: '#0A1929',
          },
          'green': {
            50: '#E8F5E8',
            100: '#C8E6C9',
            200: '#A5D6A7',
            300: '#81C784',
            400: '#66BB6A',
            500: '#2E8B57',    // Primary green
            600: '#43A047',
            700: '#388E3C',
            800: '#2E7D32',
            900: '#1B5E20',
          },
          'orange': {
            50: '#FFF3E0',
            100: '#FFE0B2',
            200: '#FFCC80',
            300: '#FFB74D',
            400: '#FFA726',
            500: '#FF6B35',    // Primary orange
            600: '#FB8C00',
            700: '#F57C00',
            800: '#EF6C00',
            900: '#E65100',
          },
          'gray': {
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#EEEEEE',
            300: '#E0E0E0',
            400: '#BDBDBD',
            500: '#9E9E9E',
            600: '#757575',
            700: '#616161',
            800: '#424242',
            900: '#212121'
          }
        },
        // Kenyan Flag Colors (for patriotic elements)
        'kenya': {
          'black': '#000000',
          'red': '#CE1126',
          'green': '#006B3F',
          'white': '#FFFFFF'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        'body': ['Open Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'heading': ['Poppins', 'Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
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
        'gradient-ajira': 'linear-gradient(135deg, #1B4F72 0%, #2E8B57 50%, #FF6B35 100%)',
        'gradient-ajira-blue': 'linear-gradient(135deg, #1B4F72 0%, #0F2C3D 100%)',
        'gradient-ajira-green': 'linear-gradient(135deg, #2E8B57 0%, #1B5E20 100%)',
        'gradient-ajira-orange': 'linear-gradient(135deg, #FF6B35 0%, #E65100 100%)',
        'hero-pattern': 'linear-gradient(135deg, rgba(27, 79, 114, 0.9) 0%, rgba(46, 139, 87, 0.8) 50%, rgba(255, 107, 53, 0.7) 100%)',
      },
      boxShadow: {
        'ajira': '0 4px 6px -1px rgba(27, 79, 114, 0.1), 0 2px 4px -1px rgba(27, 79, 114, 0.06)',
        'ajira-lg': '0 10px 15px -3px rgba(27, 79, 114, 0.1), 0 4px 6px -2px rgba(27, 79, 114, 0.05)',
        'ajira-xl': '0 20px 25px -5px rgba(27, 79, 114, 0.1), 0 10px 10px -5px rgba(27, 79, 114, 0.04)',
      }
    },
  },
  plugins: [],
} 