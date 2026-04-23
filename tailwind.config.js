/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-bright": "rgb(var(--color-surface-bright) / <alpha-value>)",
        "surface-dim": "rgb(var(--color-surface-dim) / <alpha-value>)",
        "surface-container": "rgb(var(--color-surface-container) / <alpha-value>)",
        "surface-container-low": "rgb(var(--color-surface-container-low) / <alpha-value>)",
        "surface-container-high": "rgb(var(--color-surface-container-high) / <alpha-value>)",
        "surface-container-highest": "rgb(var(--color-surface-container-highest) / <alpha-value>)",
        "surface-container-lowest": "rgb(var(--color-surface-container-lowest) / <alpha-value>)",
        "surface-variant": "rgb(var(--color-surface-variant) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "primary-container": "rgb(var(--color-primary-container) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        tertiary: "rgb(var(--color-tertiary) / <alpha-value>)",
        midnight: "rgb(var(--color-midnight) / <alpha-value>)",
        "midnight-soft": "rgb(var(--color-midnight-soft) / <alpha-value>)",
        "on-surface": "rgb(var(--color-on-surface) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--color-on-surface-variant) / <alpha-value>)",
        outline: "rgb(var(--color-outline) / <alpha-value>)",
        "outline-variant": "rgb(var(--color-outline-variant) / <alpha-value>)",
        "primary-fixed": "rgb(var(--color-primary-fixed) / <alpha-value>)",
        "secondary-container": "rgb(var(--color-secondary-container) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
        "error-container": "rgb(var(--color-error-container) / <alpha-value>)",
        "on-primary": "rgb(var(--color-on-primary) / <alpha-value>)"
      },
      borderRadius: {
        sm: "0.75rem",
        DEFAULT: "1rem",
        xl: "2rem",
        "2xl": "2.5rem",
        "3xl": "3rem",
        "4xl": "3.5rem",
        "5xl": "4rem"
      },
      boxShadow: {
        ambient: "0 28px 70px -34px rgb(var(--color-on-surface) / 0.18)",
        "ambient-lg": "0 42px 90px -44px rgb(var(--color-on-surface) / 0.26)",
        soft: "0 18px 42px -30px rgb(var(--color-on-surface) / 0.12)",
        paper: "0 24px 54px -38px rgb(var(--color-on-surface) / 0.14)",
        lift: "0 22px 40px -28px rgb(var(--color-primary) / 0.14)"
      },
      backgroundImage: {
        "cta-gradient": "linear-gradient(135deg, rgb(var(--color-primary)) 0%, rgb(var(--color-primary-container)) 100%)",
        "cta-gradient-soft": "linear-gradient(135deg, rgb(var(--color-primary-fixed)) 0%, rgb(var(--color-secondary-container)) 100%)",
        "paper-glow": "radial-gradient(circle at top left, rgb(var(--color-primary-fixed) / 0.22), transparent 36%)",
        "night-veil": "linear-gradient(155deg, rgb(var(--color-midnight-soft)) 0%, rgb(var(--color-midnight)) 100%)",
        "teal-wash": "linear-gradient(135deg, rgb(var(--color-primary-fixed) / 0.68) 0%, rgb(var(--color-surface-bright) / 0.88) 100%)"
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"]
      },
      maxWidth: {
        editorial: "1400px"
      }
    }
  },
  plugins: []
};
