import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import { generateTailwindTheme } from "./src/design-system/utils/generate-tailwind-config";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/design-system/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: generateTailwindTheme(),
  plugins: [tailwindcssAnimate],
};

export default config;
