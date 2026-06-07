import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Apostrophes/guillemets dans le texte JSX : valides en React, rendus
      // correctement. Règle purement stylistique → désactivée.
      "react/no-unescaped-entities": "off",
      // Patterns d'hydratation/montage (setHydrated, init au mount, timers) :
      // légitimes et nécessaires. On garde en avertissement, pas en erreur.
      "react-hooks/set-state-in-effect": "warn",
      // Variables/params préfixés "_" = volontairement inutilisés.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Artefacts dupliqués par la synchro iCloud ("xxx 2.ts")
    "**/* 2.ts",
    "**/* 2.tsx",
  ]),
]);

export default eslintConfig;
