import nextVitals from "eslint-config-next/core-web-vitals";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  eslintConfigPrettier,
  {
    rules: {
      "react-hooks/incompatible-library": "off",
    },
  },
]);

export default eslintConfig;
