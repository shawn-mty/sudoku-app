module.exports = {
  {
    "exclude": [
      ".eslintrc.cjs",
    ]
  },
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@angular-eslint/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    project: ["tsconfig.json"],
    createDefaultProgram: true,
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: [
    "@angular-eslint/eslint-plugin",
    "@typescript-eslint",
    "prettier"
  ],
  overrides: [
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["tsconfig.json"]
      },
      extends: [
        "plugin:@angular-eslint/recommended",
        "plugin:prettier/recommended"
      ],
      plugins: [
        "@angular-eslint/eslint-plugin",
        "@typescript-eslint"
      ]
    },
    {
      files: ["*.html"],
      extends: [
        "plugin:@angular-eslint/template/recommended",
        "plugin:prettier/recommended"
      ],
      parser: "@angular-eslint/template-parser"
    }
  ]
};
