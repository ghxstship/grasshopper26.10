import type { Config } from "tailwindcss";
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
  plugins: [
    require("tailwindcss-animate"),
  ],
};

export default config;
