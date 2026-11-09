import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core duotone — black & white do the heavy lifting.
        ink: "#0B0C0E",
        "ink-raised": "#15171A",
        paper: "#FAFAF9",
        "paper-dim": "#F0EFED",
        line: "#0B0C0E", // used with /opacity, e.g. border-line/10

        // Logo gradient — used only as accent (nav underline, CTA,
        // one hero mark). Never a background wash.
        // brand-violet is darkened from the raw logo value (#6D6FC4)
        // to clear WCAG AA (4.5:1) as small text on the paper
        // background — checked, raw value only hit 4.26:1.
        "brand-sky": "#1C98D8",
        "brand-violet": "#4F4FA0",
        "brand-magenta": "#C45D96",
      },
      backgroundImage: {
        // Decorative only (dividers, nav underline) — no text sits on
        // this one, so it can stay at the logo's true brightness.
        "brand-gradient":
          "linear-gradient(135deg, #1C98D8 0%, #6D6FC4 50%, #C45D96 100%)",
        // For solid fills carrying white text (primary buttons) —
        // darkened ~20% from the raw stops so white text clears AA
        // at every point along the gradient, checked end to end.
        "brand-gradient-solid":
          "linear-gradient(135deg, #1679AC 0%, #4E4F8D 50%, #9C4A78 100%)",
      },
      fontFamily: {
        display: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        logo: ["var(--font-logo)", "Georgia", "serif"],
      },
      maxWidth: {
        prose: "42rem",
      },
    },
  },
  plugins: [],
};
export default config;
