import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#080808",
        "bg-secondary": "#111111",
        "bg-card": "#161616",
        "text-primary": "#f0ece4",
        "text-secondary": "#9a9690",
        "text-muted": "#5a5650",
        "accent-gold": "#c9a96e",
        "accent-gold-light": "#e8d5b0",
        border: "#222222",
        "border-subtle": "#1a1a1a",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
      },
      letterSpacing: {
        label: "0.12em",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};
export default config;
