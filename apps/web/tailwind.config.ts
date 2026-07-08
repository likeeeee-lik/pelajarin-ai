import type { Config } from "tailwindcss";

/**
 * Design token Pelajarin.ai (lihat docs/ai-memory/design-system.md).
 * Tema gelap default, aksen oranye.
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#F97316",
          50: "#FFF3E9",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA6A0C",
        },
        ink: {
          900: "#0B0F1A", // background paling gelap
          800: "#0F1420",
          700: "#131A2A",
          600: "#1A2130", // surface
          500: "#232B3D", // surface terang / border
        },
        muted: "#9AA3B2",
        discord: "#5865F2",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        brand: "0 10px 30px -8px rgba(249,115,22,0.45)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
