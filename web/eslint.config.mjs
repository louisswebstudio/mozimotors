import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // siaracash.ma clone (/v2) mirrors the original markup: plain <img> tags on purpose, and plain <a>
  // because /v2 has its own root layout, so links to the main site are full page loads anyway.
  {
    files: ["src/components/sites/siaracash-ma-449ca86b/**", "src/app/v2/**"],
    rules: { "@next/next/no-img-element": "off", "@next/next/no-html-link-for-pages": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
