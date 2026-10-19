import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  { ignores: [".next/**", ".superpowers/**", "playwright-report/**", "test-results/**", "next-env.d.ts"] },
];

export default eslintConfig;
