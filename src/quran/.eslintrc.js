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
    "eslint-plugin-import",
    "eslint-plugin-react",
    "@typescript-eslint/eslint-plugin"
  ],
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
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
        "@typescript-eslint/no-var-requires": "off",
        "strict": "off",
      },
    },
  ],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/triple-slash-reference": "off",
    "array-bracket-spacing": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "object-curly-spacing": ["error", "always"],
    "quotes": ["error", "double"],
    "semi": ["error", "never"],
    "import/order": ["error", {
      "groups": ["external", "builtin", "internal", "parent", "sibling", "index", "object"],
      "alphabetize": {
        "order": "asc",
        "caseInsensitive": true
      }
    } ],
    "space-in-parens": ["error", "always"],
  },
};
