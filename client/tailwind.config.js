/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        lg: '992px',
      },
      colors: {
        light: {
          DEFAULT: '#FFFFFF',
          100: '#F2F2F2',
          200: '#E9EAE8',
          300: '#CDCECB',
          400: '#C0C1BD',
          500: '#AFB0A4',
          600: '#8C8D7F',
          700: '#717264',
          800: '#152E24',
          900: '#06100D',
          1000: '#090B00',
          1100: '#030B11',
        },
        night: {
          DEFAULT: '#030B11',
          100: '#222320',
          200: '#161E1B',
          300: '#1C353C',
          400: '#717264',
          500: '#8C8D7F',
          600: '#AFB0A4',
          700: '#C0C1BD',
          800: '#CDCECB',
          900: '#E9EAE8',
          1000: '#E9EAE8',
          1100: '#FFFFFF',
        },
        via: {
          100: '#262E35',
          200: '#303841',
          300: '#36404A',
          400: '#F5F7FB',
          500: '#E6EBF5',
          600: '#272C3B',
        },
      },
    },
  },
  daisyui: {
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    themes: [
      {
        mytheme: {
          primary: '#7269EF',
          secondary: '#F000B8',
          accent: '#37CDBE',
          neutral: '#3D4451',
          'base-100': '#FFFFFF',
          info: '#007BFF',
          success: '#28A745',
          warning: '#FFC107',
          error: '#DC3545',
        },
      },
    ],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
