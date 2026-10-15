/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Pinterest palette
        ink:    { DEFAULT: "#0A1931", light: "#132F4F", softer: "#1A3D63" },
        navy:   { DEFAULT: "#1A3D63", deep: "#0F2A47", light: "#2E5D80" },
        steel:  { DEFAULT: "#4A7FA7", light: "#7BA8C9", dark: "#356585" },
        powder: { DEFAULT: "#B3CFE5", light: "#D4E2F0", deep: "#8FB8D6" },
        mist:   { DEFAULT: "#F6FAFD", dark: "#E8F1F8" },
        crimson:{ DEFAULT: "#DC2626", dark: "#B91C1C", light: "#EF4444" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "Inter", "sans-serif"],
      },
      boxShadow: {
        soft:        "0 4px 20px rgba(10, 25, 49, 0.06)",
        card:        "0 8px 30px rgba(10, 25, 49, 0.08)",
        cardHover:   "0 24px 60px rgba(10, 25, 49, 0.18)",
        modal:       "0 30px 80px rgba(10, 25, 49, 0.3)",
        glow:        "0 0 40px rgba(74, 127, 167, 0.4)",
        glowCrimson: "0 0 30px rgba(220, 38, 38, 0.45)",
        inner:       "inset 0 1px 2px rgba(10, 25, 49, 0.06)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #DC2626 0%, #0A1931 100%)",
        "navy-gradient":  "linear-gradient(135deg, #0A1931 0%, #1A3D63 50%, #4A7FA7 100%)",
        "steel-gradient": "linear-gradient(135deg, #4A7FA7 0%, #1A3D63 100%)",
        "powder-gradient":"linear-gradient(135deg, #F6FAFD 0%, #B3CFE5 100%)",
        "crimson-gradient":"linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
        "hero-overlay":   "linear-gradient(180deg, rgba(10,25,49,0.35) 0%, rgba(10,25,49,0.85) 100%)",
        "shimmer":        "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
      },
      animation: {
        "fade-in":    "fadeIn 0.6s ease-out forwards",
        "slide-up":   "slideUp 0.7s ease-out forwards",
        "slide-right":"slideRight 0.7s ease-out forwards",
        "float":      "float 6s ease-in-out infinite",
        "pulse-slow": "pulseSlow 4s ease-in-out infinite",
        "shimmer":    "shimmer 2.5s linear infinite",
        "bounce-slow":"bounce 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:     { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp:    { "0%": { opacity: 0, transform: "translateY(30px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        slideRight: { "0%": { opacity: 0, transform: "translateX(-30px)" }, "100%": { opacity: 1, transform: "translateX(0)" } },
        float:      { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-20px)" } },
        pulseSlow:  { "0%, 100%": { opacity: 0.4 }, "50%": { opacity: 0.7 } },
        shimmer:    { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(100%)" } },
      },
    },
  },
  plugins: [],
};