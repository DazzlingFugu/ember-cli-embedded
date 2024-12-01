import ember from "eslint-plugin-ember";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "blueprints/*/files/",
        "dist/",
        "coverage/",
        "!**/.*",
        "**/.*/",
        ".node_modules.ember-try/",
        "npm-shrinkwrap.json.ember-try",
        "package.json.ember-try",
        "package-lock.json.ember-try",
        "yarn.lock.ember-try",
    ],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:ember/recommended",
    "plugin:prettier/recommended",
), {
    plugins: {
        ember,
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "script",
    },

    rules: {
        "@typescript-eslint/ban-ts-comment": ["error", {
            "ts-check": "allow-with-description",
            "ts-expect-error": "allow-with-description",
            "ts-ignore": "allow-with-description",
            "ts-nocheck": "allow-with-description",
            minimumDescriptionLength: 7,
        }],

        "@typescript-eslint/explicit-module-boundary-types": "off",
        "no-empty-function": "off",
        "@typescript-eslint/no-empty-function": ["error"],
    },
}, ...compat.extends(
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
).map(config => ({
    ...config,
    files: ["**/*.ts"],
})), {
    files: ["**/*.ts"],
    rules: {},
}, ...compat.extends("plugin:n/recommended").map(config => ({
    ...config,

    files: [
        "./.eslintrc.js",
        "./.prettierrc.js",
        "./.stylelintrc.js",
        "./.template-lintrc.js",
        "./ember-cli-build.js",
        "./index.js",
        "./testem.js",
        "./blueprints/*/index.js",
        "./config/**/*.js",
        "./tests/dummy/config/**/*.js",
    ],
})), {
    files: [
        "./.eslintrc.js",
        "./.prettierrc.js",
        "./.stylelintrc.js",
        "./.template-lintrc.js",
        "./ember-cli-build.js",
        "./index.js",
        "./testem.js",
        "./blueprints/*/index.js",
        "./config/**/*.js",
        "./tests/dummy/config/**/*.js",
    ],

    languageOptions: {
        globals: {
            ...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, "off"])),
            ...globals.node,
        },
    },
}, ...compat.extends("plugin:qunit/recommended").map(config => ({
    ...config,
    files: ["tests/**/*-test.{js,ts}"],
})), {
    files: ["**/*.ts"],

    rules: {
        "@typescript-eslint/explicit-module-boundary-types": ["error"],
    },
}, {
    files: ["**/*.ts"],

    rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "no-undef": "off",
        "no-unused-vars": "off",
    },
}];