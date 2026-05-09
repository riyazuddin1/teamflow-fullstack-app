/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(240 5% 18%)",
        input: "hsl(240 5% 16%)",
        ring: "hsl(234 89% 63%)",
        background: "hsl(222 47% 8%)",
        foreground: "hsl(210 40% 98%)",
        primary: {
          DEFAULT: "hsl(234 89% 63%)",
          foreground: "hsl(0 0% 100%)"
        },
        secondary: {
          DEFAULT: "hsl(240 5% 16%)",
          foreground: "hsl(210 40% 98%)"
        },
        muted: {
          DEFAULT: "hsl(240 5% 14%)",
          foreground: "hsl(215 20% 65%)"
        },
        card: {
          DEFAULT: "hsl(240 6% 10%)",
          foreground: "hsl(210 40% 98%)"
        },
        destructive: {
          DEFAULT: "hsl(0 72% 51%)",
          foreground: "hsl(0 0% 98%)"
        }
      },
      borderRadius: {
        lg: "0.8rem",
        md: "0.6rem",
        sm: "0.45rem"
      }
    }
  },
  plugins: []
};
