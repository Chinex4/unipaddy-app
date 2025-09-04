/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          base: '#265BFF',
          50: '#EEF4FF',
          100: '#D9E5FF',
          200: '#BCD2FF',
          300: '#8EB6FF',
          400: '#598EFF',
          500: '#1B73FF',
          600: '#1B41F5',
          700: '#142EE1',
          800: '#1726B6',
          900: '#19278F',
          950: '#141A57',
        },
        light: '#F9F9F9',
        dark: '#111212',
        unigrey: '#98A2B3',
        lightgrey: '#E4E7EC',
        success: '#00B37E',
        warning: '#FBA94C',
        error: '#F75A68',
      },
      fontFamily: {
        general: ["General"],       // maps to General-Regular
        "general-bold": ["General-Bold"],
        "general-italic": ["General-Italic"],
        "general-semibold": ["General-Semibold"]
      },
    },
  },
  plugins: [],
};
