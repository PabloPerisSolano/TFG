import { defineConfig } from "eslint-define-config";
import eslintPluginNext from "@next/eslint-plugin-next";

export default defineConfig([
  {
    plugins: {
      "@next/next": eslintPluginNext,
    },
    rules: {
      "@next/next/no-html-link-for-pages": ["error", "/pages/"],
    },
  },
  {
    files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
    rules: {},
  },
]);
