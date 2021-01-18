module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  plugins: [
    "eslint-plugin-react",
    "@typescript-eslint/eslint-plugin"
  ],
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  overrides: [
    {
      files: "**/**/*.js",
      rules: {
        "strict": "off",
      },
    },
  ],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "array-bracket-spacing": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "object-curly-spacing": ["error", "always"],
    "quotes": ["error", "double"],
    "semi": ["error", "never"],
    // @todo currently causes more issues then solve problems
    // "sort-imports": [ "error", {
    //   "allowSeparatedGroups": true,
    // } ],
    "sort-keys": ["error"],
    "space-in-parens": ["error", "always"],
  },
};
