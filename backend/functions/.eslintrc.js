module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "arrow-parens": ["error", "always"],
    "new-cap": "off",
    "no-console": "off",
    "require-jsdoc": "off",
    "valid-jsdoc": "off",
    "no-undef": "off",
    "no-unused-expressions": "off",
    "max-len": "off",
    "object-curly-spacing": "off",
    "camelcase": "off",
    "linebreak-style": "off",
    "indent": "off",
    "padded-blocks": "off",
    "no-magic-numbers": "off",
    "comma-dangle": "off",
    "quotes": "off",
    "brace-style": "off",
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
