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
        // Official Ajira Digital Brand Colors with Full Palette
        'ajira-primary': '#1B4F72',
        'ajira-secondary': '#2E8B57',
        'ajira-accent': '#FF6B35',
        'ajira-gold': '#FFD600',
        'ajira-black': '#222',
        'ajira-white': '#fff',
        'ajira-light': '#F8FAFC',
        'ajira-dark': '#0F172A',
        
        // Extended Ajira Blue Palette
        'ajira-blue': {
          50: '#EBF8FF',
          100: '#BEE3F8',
          200: '#90CDF4',
          300: '#63B3ED',
          400: '#4299E1',
          500: '#3182CE',
          600: '#2B77CB',
          700: '#2C5282',
          800: '#2A4365',
          900: '#1A365D',
        },
        
        // Extended Ajira Green Palette
        'ajira-green': {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        
        // Extended Ajira Orange/Accent Palette
        'ajira-orange': {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        
        // Text Colors
        'ajira-text': {
          primary: '#1B4F72',
          secondary: '#444',
          muted: '#888',
          light: '#9CA3AF',
        },
        
        // Additional Colors
        'ajira-info': '#3B82F6',
        'ajira-success': '#22C55E',
        'ajira-warning': '#F59E0B',
        'ajira-error': '#EF4444',
        
        // Kenyan Flag Colors (for patriotic elements)
        'kenya': {
          'black': '#000000',
          'red': '#CE1126',
          'green': '#006B3F',
          'white': '#FFFFFF'
        },
        
        // Kenyan Flag inspired color system
        'kenya-black': '#000000',
        'kenya-red': '#CE1126',
        'kenya-green': '#006B3F', 
        'kenya-white': '#FFFFFF',
        
        // Extended Kenyan theme colors
        'kenya-primary': '#000000',
        'kenya-accent': '#CE1126',
        'kenya-text': {
          primary: '#000000',
          muted: '#666666',
        },
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
        'gradient-ajira': 'linear-gradient(135deg, #1B4F72 0%, #2E8B57 60%, #FF6B35 100%)',
        'gradient-ajira-blue': 'linear-gradient(135deg, #1B4F72 0%, #2B77CB 100%)',
        'gradient-ajira-green': 'linear-gradient(135deg, #2E8B57 0%, #15803D 100%)',
        'gradient-ajira-orange': 'linear-gradient(135deg, #FF6B35 0%, #C2410C 100%)',
        'hero-pattern': 'linear-gradient(135deg, rgba(27, 79, 114, 0.9) 0%, rgba(46, 139, 87, 0.8) 50%, rgba(255, 107, 53, 0.7) 100%)',
      },
      boxShadow: {
        'ajira': '0 4px 6px -1px rgba(27, 79, 114, 0.1), 0 2px 4px -1px rgba(27, 79, 114, 0.06)',
        'ajira-lg': '0 10px 15px -3px rgba(27, 79, 114, 0.1), 0 4px 6px -2px rgba(27, 79, 114, 0.05)',
        'ajira-xl': '0 20px 25px -5px rgba(27, 79, 114, 0.1), 0 10px 10px -5px rgba(27, 79, 114, 0.04)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [],
} 