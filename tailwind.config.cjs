/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-purple':{
          100: '#9d92aa',
          200: '#7a6a8d',
          300: '#5f4c75',
          400: '#48355e',
          500: '#35204e',
          600: '#4e3366',
          700: '#4e2b57',
          800: '#382449',
          900: '#2c1d3a',
          950: '#21152b',
        },
        'off-black':{
          100: '#454444',
          200: '#363636',
          300: '#2c2c2c',
          400: '#232323',
          500: '#1d1c1c',
          600: '#161616',
          700: '#0a0a0a',
        },
      },
      fontFamily: {
        neuropol: ['Neuropol', 'sans-serif'],
      },
      fontSize: {
        'xxs': ['10px', {
          lineHeight: '1rem',
        // letterSpacing: '-0.01em',
        // fontWeight: '500',
        }],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'lg-top': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}

