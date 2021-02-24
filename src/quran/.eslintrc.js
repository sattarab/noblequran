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
    "eslint-plugin-simple-import-sort",
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
    {
      files: "**/**/*.d.ts",
      rules: {
        "@typescript-eslint/triple-slash-reference": "off",
      },
    },
  ],
  rules: {
    "@typescript-eslint/ban-types": [ "warn", {
      "types": {
        "{}": "Don't use `{}` as a type. `{}` actually means \"any non-nullish value\". Use the type EmptyObject instead.",
      },
    } ],
    "@typescript-eslint/consistent-type-imports": [ "warn", { "prefer": "type-imports" } ],
    "@typescript-eslint/no-extra-non-null-assertion": [ "warn" ],
    "@typescript-eslint/member-delimiter-style": [ "warn", {
      "multiline": { "delimiter": "none" },
      "singleline": { "delimiter": "comma", "requireLast": false },
    } ],
    "@typescript-eslint/no-empty-interface": [ "warn" ],
    "@typescript-eslint/no-explicit-any": [ "warn" ],
    "@typescript-eslint/no-shadow": [ "warn" ],
    "@typescript-eslint/no-unused-vars": [ "warn" ],
    "@typescript-eslint/prefer-optional-chain": [ "warn" ],
    "@typescript-eslint/type-annotation-spacing": [ "warn" ],
    "array-bracket-spacing": [ "warn", "always" ],
    "camelcase": [ "error" ],
    "comma-spacing": [ "warn", { "before": false, "after": true } ],
    "computed-property-spacing": [ "warn", "always" ],
    "eslint-comments/no-unlimited-disable": "off",
    "generator-star-spacing": [ "warn", { "before": true, "after": false } ],
    "indent": [ "warn", 2, {
      "SwitchCase": 1,
    } ],
    "key-spacing": [ "warn" ],
    "keyword-spacing": [ "warn", {
      "overrides": {
        "if": { "after": false },
        "catch": { "after": false },
        "for": { "after": false },
        "switch": { "after": false },
        "while": { "after": false },
      },
    } ],
    "no-case-declarations": "warn",
    "no-multi-spaces": "warn",
    "no-multiple-empty-lines": "warn",
    "no-shadow": "off",
    "no-undef": "off",
    "no-unexpected-multiline": "warn",
    "no-unsafe-finally": "warn",
    "no-whitespace-before-property": "warn",
    "object-curly-spacing": [ "warn", "always" ],
    "operator-linebreak": [ "warn", "before" ],
    "prefer-const": "warn",
    "prettier/prettier": "off",
    "quotes": [ "warn", "double" ],
    "react/jsx-curly-spacing": [ "warn", { "when": "always", "children": true } ],
    "semi": [ "warn", "never" ],
    "simple-import-sort/exports": "warn",
    "simple-import-sort/imports": "warn",
    "space-in-parens": [ "warn", "always", { "exceptions": [ "empty" ] } ],
    "space-unary-ops": [
      "warn",
      {
        "words": true,
        "nonwords": false,
        "overrides": {
          "!": true,
        },
      },
    ],
    "template-curly-spacing": [ "warn", "always" ],
    "yield-star-spacing": [ "warn", "after" ],
  },
};
