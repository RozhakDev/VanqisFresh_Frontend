import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Semantic overrides
        border: "#E5E7EB",
        input: "#F3F4F6",
        ring: "var(--feature-accent)",
        background: "#FFFFFF",
        foreground: "#134E4A",

        primary: {
          DEFAULT: "var(--feature-accent)",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F3F4F6",
          foreground: "#134E4A",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F3F4F6",
          foreground: "#6B7280",
        },
        accent: {
          DEFAULT: "var(--feature-accent-soft)",
          foreground: "var(--feature-accent)",
        },
        
        // Vanqis Brand Colors
        vanqis: {
          base: {
            white: "#FFFFFF",
            layout: "#F4F7F5",
            soft: "#E2E8E4",
            text: "#134E4A",
          },
          core: {
            green: "#2F855A",
            lightGreen: "#A7F3D0",
          },
          fresh: {
            tomato: "#EF4444",
            carrot: "#F97316",
            banana: "#FACC15",
            grape: "#8B5CF6",
            leaf: "#22C55E",
          },
          accent: "var(--feature-accent)",
          "accent-soft": "var(--feature-accent-soft)",
        },

        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1F2937",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1F2937",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
