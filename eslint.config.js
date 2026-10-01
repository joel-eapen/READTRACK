import js from "@eslint/js";
import globals from "globals";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  // Ignore patterns
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "coverage/**"],
  },

  // Base recommended JS rules
  js.configs.recommended,

  // Project-specific settings
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": "off",
      "prefer-const": "error",
      eqeqeq: ["error", "always"],
    },
  },

  // Prettier integration (must be last to disable conflicting rules)
  prettierRecommended,
];
