module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
    tsconfigRootDir: __dirname,
  },
  plugins: [
    "eslint-plugin-import",
    "@typescript-eslint/eslint-plugin",
  ],
  extends: ["plugin:@typescript-eslint/recommended"],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "array-bracket-spacing": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "object-curly-spacing": ["error", "always"],
    "quotes": ["error", "double"],
    "semi": ["error", "never"],
    "import/order": [ "error", {
      "groups": [ "external", "builtin", "internal", "parent", "sibling", "index", "object" ],
      "alphabetize": {
        "order": "asc",
        "caseInsensitive": true
      }
    } ],
    "sort-keys": ["error"],
    "space-in-parens": ["error", "always"],
  },
};
