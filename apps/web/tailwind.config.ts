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
        v: { DEFAULT: "#7B6FFF", dark: "#5A4FD4", soft: "#A89FFF", glow: "#C4BFFF" },
        t: { DEFAULT: "#00E5B8", dark: "#00B892" },
        bg: { DEFAULT: "#03030A", 2: "#08081A", 3: "#0D0D22", 4: "#13132E", 5: "#1A1A3A" },
        txt: { DEFAULT: "#EEECff", 2: "#8B89BB", 3: "#3D3B6E", 4: "#25244A" },
      },
      fontFamily: {
        clash: ["Clash Display", "system-ui", "sans-serif"],
        cabinet: ["Cabinet Grotesk", "system-ui", "sans-serif"],
      },
      animation: {
        "drift1": "drift1 18s ease-in-out infinite",
        "drift2": "drift2 22s ease-in-out infinite",
        "drift3": "drift3 15s ease-in-out infinite",
        "marquee": "marquee 28s linear infinite",
        "fadeUp": "fadeUp 0.8s ease both",
        "pulse-dot": "pulse-dot 2s ease infinite",
        "scroll-line": "scroll-line 2s ease infinite",
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
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(0.8)" },
        },
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
