/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    'tailwindcss/nesting': 'postcss-nesting',
    'tailwindcss': {},
    'postcss-preset-env': { 'nesting-rules': false },
  },
}
