module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './containers/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',
        secondary: '#FF9800',
        accent: '#03A9F4',
        neutralLight: '#F5F5F5',
        neutralDark: '#9E9E9E',
        hoverBackground: '#FFD699',
      },
      container: {
        center: true,  // Center all containers by default
        padding: {
          DEFAULT: '1rem',   // Default padding for all screens
          sm: '2rem',
          md: '3rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      spacing: {
        'section-top-bottom': '3rem',
        'datablock-top-bottom': '2rem',
        'subheader-top-bottom': '1rem',  // Updated subheader margin for minimal distance
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      boxShadow: {
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        lg: '1rem', // Rounded corners for cards
      },
      objectFit: {
        'cover': 'cover',
        'contain': 'contain',
      },
      objectPosition: {
        'center': 'center',
        'top': 'top',
        'bottom': 'bottom',
        'left': 'left',
        'right': 'right',
      },
      maxHeight: {
        'screen': '100vh',
      },
      maxWidth: {
        'full': '100%',
      },
    },
  },
  darkMode: 'class',  // Enable dark mode via class
  plugins: [],
};
