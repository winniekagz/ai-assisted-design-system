// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import { FlatCompat } from "@eslint/eslintrc";
import { createRequire } from "module";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const nextConfig = compat.extends("next/core-web-vitals", "next/typescript");
const storybookConfig = await loadStorybookConfig();
const prettierConfig = loadPrettierConfig();

const eslintConfig = [
  // Base configurations
  ...nextConfig,
  ...storybookConfig,
  ...prettierConfig, // Disable conflicting rules when available

  // Global settings
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
      },
    },
  },

  // Rules for all files
  {
    rules: {
      // General code quality (not too strict)
      "no-console": "warn", // Allow console but warn
      "no-debugger": "error",
      "no-unused-vars": "warn", // Warn instead of error
      "no-undef": "error",
      "prefer-const": "warn",
      "no-var": "error",

      // React specific rules
      "react/prop-types": "off", // Using TypeScript
      "react/react-in-jsx-scope": "off", // Not needed in Next.js
      "react/jsx-uses-react": "off", // Not needed in React 17+
      "react/jsx-uses-vars": "error",
      "react/no-unescaped-entities": "warn",
      "react/no-unknown-property": "warn",
      "react/self-closing-comp": "warn",
      "react/jsx-boolean-value": "off", // Allow both <Component /> and <Component></Component>

      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn", // Warn but allow
      "@typescript-eslint/explicit-function-return-type": "off", // Not too strict
      "@typescript-eslint/explicit-module-boundary-types": "off", // Not too strict
      "@typescript-eslint/no-non-null-assertion": "warn", // Warn but allow
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",

      // Import rules
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],

      // Accessibility rules
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-has-content": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",

      // Next.js specific rules
      "@next/next/no-img-element": "warn", // Prefer Next.js Image component
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-page-custom-font": "off", // Allow custom fonts
    },
  },

  // TypeScript handles undefined symbols more accurately than ESLint's
  // JavaScript-only no-undef rule, especially for type-only React namespaces.
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-undef": "off",
    },
  },

  // Rules for test files
  {
    files: [
      "**/*.test.{js,jsx,ts,tsx}",
      "**/*.spec.{js,jsx,ts,tsx}",
      "**/__tests__/**/*",
    ],
    rules: {
      "no-console": "off", // Allow console in tests
      "@typescript-eslint/no-explicit-any": "off", // Allow any in tests
    },
  },

  // Rules for Storybook files
  {
    files: ["**/*.stories.{js,jsx,ts,tsx}"],
    rules: {
      "no-console": "off", // Allow console in stories
      "@typescript-eslint/no-explicit-any": "off", // Allow any in stories
    },
  },
];

export default eslintConfig;

async function loadStorybookConfig() {
  try {
    require.resolve("eslint-plugin-storybook");
    const storybook = require("eslint-plugin-storybook");
    return storybook.configs?.["flat/recommended"] ?? [];
  } catch (error) {
    if (isMissingStorybookPlugin(error)) {
      return [];
    }

    throw error;
  }
}

function isMissingStorybookPlugin(error) {
  return (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error.code === "ERR_MODULE_NOT_FOUND" || error.code === "MODULE_NOT_FOUND") &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message.includes("eslint-plugin-storybook")
  );
}

function loadPrettierConfig() {
  try {
    return compat.extends("prettier");
  } catch (error) {
    if (isMissingPrettierConfig(error)) {
      return [];
    }

    throw error;
  }
}

function isMissingPrettierConfig(error) {
  return (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message.includes('Failed to load config "prettier"')
  );
}
