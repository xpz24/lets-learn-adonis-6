// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
export default {
  trailingComma: "es5",
  semi: false,
  singleQuote: true,
  useTabs: false,
  quoteProps: "consistent",
  bracketSpacing: true,
  arrowParens: "always",
  printWidth: 100,
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss', 'prettier-edgejs', 'prettier-plugin-sh'],
}
