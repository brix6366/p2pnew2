/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ffe5e5',
          100: '#ffcccc',
          200: '#ff9999',
          300: '#ff6666',
          400: '#ff3333',
          500: '#ff0000', // base dark red
          600: '#cc0000',
          700: '#990000',
          800: '#660000',
          900: '#330000',
        },
        neutral: {
          50: '#f9f9f9',
          100: '#f1f1f1',
          200: '#e1e1e1',
          300: '#d1d1d1',
          400: '#c1c1c1',
          500: '#b1b1b1',
          600: '#919191',
          700: '#717171',
          800: '#313131',
          900: '#111111',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
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
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'elevation': '0 8px 24px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}