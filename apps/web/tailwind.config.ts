import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#05050E", 2: "#0C0C1E", 3: "#121228", 4: "#1A1A38", 5: "#222250" },
        v: { DEFAULT: "#6C63FF", dark: "#5A52D9", soft: "#9D97FF", glow: "#C4BFFF" },
        t: { DEFAULT: "#00D4AA", dark: "#00A888" },
        txt: { DEFAULT: "#F0EFFF", 2: "#9999BB", 3: "#4D4D7A", 4: "#2A2A50" },
        bd: { DEFAULT: "rgba(255,255,255,0.04)", v: "rgba(108,99,255,0.16)", t: "rgba(0,212,170,0.12)" },
      },
      fontFamily: {
        syne: ["Syne", "system-ui", "sans-serif"],
        dm: ["DM Sans", "system-ui", "sans-serif"],
      },
      animation: {
        drift1: "drift1 18s ease-in-out infinite",
        drift2: "drift2 22s ease-in-out infinite",
        drift3: "drift3 15s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
        fadeUp: "fadeUp 0.8s ease both",
        "pulse-dot": "pulse-dot 2s ease infinite",
        "scroll-line": "scroll-line 2s ease infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        drift1: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(80px,60px) scale(1.1)" },
          "66%": { transform: "translate(-40px,100px) scale(0.95)" },
        },
        drift2: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(-70px,-80px) scale(1.05)" },
          "66%": { transform: "translate(50px,-30px) scale(1.1)" },
        },
        drift3: {
          "0%, 100%": { transform: "translate(-50%,-50%) scale(1)" },
          "50%": { transform: "translate(-50%,-50%) scale(1.3)" },
        },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        fadeUp: { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "pulse-dot": { "0%, 100%": { opacity: "1", transform: "scale(1)" }, "50%": { opacity: "0.6", transform: "scale(0.8)" } },
        "scroll-line": {
          "0%": { transform: "scaleY(0)", transformOrigin: "top" },
          "50%": { transform: "scaleY(1)", transformOrigin: "top" },
          "51%": { transform: "scaleY(1)", transformOrigin: "bottom" },
          "100%": { transform: "scaleY(0)", transformOrigin: "bottom" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
