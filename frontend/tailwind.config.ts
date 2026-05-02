import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      colors: {
        base: "#0f0f0f",
        panel: "#1a1a1a",
        accent: "#3b82f6"
      }
    }
  },
  plugins: []
} satisfies Config;
