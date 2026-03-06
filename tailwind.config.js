/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "syne": ["var(--font-syne)", "sans-serif"],
        "dm-sans": ["var(--font-dm-sans)", "sans-serif"],
        "mono": ["var(--font-mono)", "monospace"],
      },
      colors: {
        primary: {
          DEFAULT: "#0A84FF",
          dark: "#0060DF",
          light: "#70BFFF",
        },
        accent: "#FF6B35",
        surface: {
          DEFAULT: "#111827",
          light: "#1F2937",
        },
        border: "#1E293B",
      },
      animation: {
        "fade-in": "fade-in 0.5s ease forwards",
        "slide-right": "slide-in-right 0.4s ease forwards",
        "shimmer": "shimmer 1.5s linear infinite",
        "pulse-ring": "pulse-ring 2s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "pulse-ring": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.4" },
          "50%": { transform: "scale(1.08)", opacity: "0.6" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
