import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["src/app/_os/**/*.ts", "src/app/_os/**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react/no-unescaped-entities": "off",
    },
  },
  {
    files: [
      "src/components/dashboard/**/*.ts",
      "src/components/dashboard/**/*.tsx",
      "src/components/modals/**/*.ts",
      "src/components/modals/**/*.tsx",
      "src/components/shell/**/*.ts",
      "src/components/shell/**/*.tsx",
      "src/components/slide-overs/**/*.ts",
      "src/components/slide-overs/**/*.tsx",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
