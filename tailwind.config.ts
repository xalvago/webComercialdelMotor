import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        red: {
          primary: "#EF0029",
          dark: "#B30825",
          900: "#7A0018",
        },
        dark: {
          900: "#0A0A0A",
          800: "#1A1A1A",
          700: "#2A2A2A",
          600: "#3A3A3A",
        },
        surface: "#F5F5F5",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "Arial", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-red": "pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "pulse-red": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(239,0,41,0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(239,0,41,0)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "red-glow": "radial-gradient(ellipse at center, rgba(239,0,41,0.15) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
