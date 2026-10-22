import type { Config } from "tailwindcss";

/**
 * ONAOSI Design System — token ufficiali estratti da https://onaosi.it/
 * (css/my_style.css + template SmartAdmin). Font istituzionale: Titillium Web.
 */
const config: Config = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx,vue,svelte}", "./index.html"],
  theme: {
    extend: {
      colors: {
        // Blu primario istituzionale (scala navy → brand)
        primary: {
          950: "#00264d",
          900: "#003366", // navy logo / titoli
          800: "#004080",
          700: "#004d99", // sfondo header
          600: "#0059b3", // bordo ribbon
          500: "#0066cc", // BLU BRAND — link, stati attivi
          400: "#2079d4", // sfondo ribbon
          350: "#4390d8",
          300: "#66a5e3", // carousel attivo
          200: "#8ebeed", // sfondi menu
          100: "#d1e7ff", // tinta chiara
          DEFAULT: "#0066cc",
        },
        // Accento azzurro/ciano
        accent: {
          DEFAULT: "#65dde0", // ciano — bordi, highlight hover
          soft: "#428fdb",
        },
        // Testo
        text: {
          DEFAULT: "#1c2024", // primario (scuro)
          secondary: "#5a6772", // medio
          inverse: "#f5f5f0", // su fondo scuro (chiaro)
        },
        // Neutri / sfondi
        neutral: {
          0: "#ffffff",
          50: "#fafafa", // sfondo body
          100: "#f5f5f0", // off-white
          150: "#f2f4f8", // sfondo alternativo
          300: "#c6cace", // grigio su scuro
          800: "#30373d", // pannello scuro
        },
        border: {
          DEFAULT: "#e0e0e0",
          accent: "#65dde0",
        },
      },
      fontFamily: {
        sans: [
          '"Titillium Web"',
          '"Open Sans"',
          "Arial",
          "Helvetica",
          "sans-serif",
        ],
        heading: ['"Titillium Web"', "Arial", "sans-serif"],
      },
      fontWeight: {
        thin: "200",
        light: "300",
        normal: "400",
        semibold: "600",
        bold: "700",
        black: "900",
      },
      boxShadow: {
        // Ombreggiature native del sito (template SmartAdmin)
        card: "0 2px 4px rgba(30,30,100,0.25)",
        "inset-subtle": "inset 0 0 3px 1px rgba(0,0,0,0.15)",
        "inset-body": "inset 2px 2px 5px rgba(0,0,0,0.04)",
        "inset-field": "inset 1px 1px 0 rgba(0,0,0,0.1), inset 0 -1px 0 rgba(0,0,0,0.07)",
      },
    },
  },
  plugins: [],
};

export default config;
