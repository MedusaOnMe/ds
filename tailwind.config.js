/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'disney-purple': '#5B4B8A',
        'disney-purple-light': '#7B6BA8',
        'disney-purple-dark': '#3D3266',
        'disney-blue': '#1E88E5',
        'disney-blue-light': '#64B5F6',
        'disney-gold': '#FFD700',
        'disney-gold-dark': '#DAA520',
        'disney-pink': '#FF69B4',
        'disney-pink-light': '#FFB6C1',
        'disney-teal': '#00CED1',
        'disney-bg': '#0F0A1A',
        'disney-bg-light': '#1A1429',
        'disney-card': '#252040',
      },
      fontFamily: {
        'disney': ['var(--font-disney)', 'sans-serif'],
      },
      backgroundImage: {
        'disney-gradient': 'linear-gradient(135deg, #1A1429 0%, #0F0A1A 50%, #1A1429 100%)',
        'magic-shimmer': 'linear-gradient(90deg, transparent, rgba(255,215,0,0.3), transparent)',
        'button-magic': 'linear-gradient(135deg, #5B4B8A 0%, #7B6BA8 50%, #5B4B8A 100%)',
      },
      boxShadow: {
        'magic': '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(91, 75, 138, 0.2)',
        'magic-hover': '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(91, 75, 138, 0.4)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 215, 0, 0.1)',
      },
      animation: {
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'magic-glow': 'magic-glow 2s ease-in-out infinite',
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'magic-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(91, 75, 138, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(91, 75, 138, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};
