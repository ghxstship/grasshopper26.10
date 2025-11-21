import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        anton: ['var(--font-anton)', 'Anton', 'sans-serif'],
        bebas: ['var(--font-bebas)', 'Bebas Neue', 'sans-serif'],
        'bebas-neue': ['var(--font-bebas)', 'Bebas Neue', 'sans-serif'],
        oswald: ['var(--font-oswald)', 'Oswald', 'sans-serif'],
        'share-tech': ['var(--font-share-tech)', 'Share Tech', 'monospace'],
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
