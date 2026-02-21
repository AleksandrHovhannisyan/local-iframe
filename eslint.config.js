import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfig([
  globalIgnores(["**/node_modules", "./dist/"]),
  {
    extends: [eslint.configs.recommended],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ["src/**/*.ts"],
    extends: [eslint.configs.recommended, tseslint.configs.recommended],
    plugins: {
      tseslint,
    },
    languageOptions: {
      parser: tsParser,
    },
  },
  eslintPluginPrettierRecommended,
]);
