module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Enforce conventional commit format
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
        // Custom types for component libraries
        "component",
        "story",
        "design",
        "accessibility",
        "breaking",
      ],
    ],
    // Enforce lowercase type
    "type-case": [2, "always", "lower-case"],
    // Enforce lowercase subject
    "subject-case": [2, "always", "lower-case"],
    // Enforce no trailing period in subject
    "subject-full-stop": [2, "never", "."],
    // Enforce maximum subject length
    "subject-max-length": [2, "always", 72],
    // Enforce maximum header length
    "header-max-length": [2, "always", 100],
    // Enforce body line length
    "body-max-line-length": [2, "always", 100],
    // Enforce footer line length
    "footer-max-line-length": [2, "always", 100],
    // Allow scope to be optional (remove this rule to make scopes truly optional)
    // 'scope-empty': [2, 'always'],
    // Enforce lowercase scope
    "scope-case": [2, "always", "lower-case"],
    // Common scopes for component libraries
    "scope-enum": [
      2,
      "always",
      [
        "ui",
        "api",
        "auth",
        "config",
        "deps",
        "docs",
        "test",
        "build",
        "ci",
        "storybook",
        "components",
        "design",
        "accessibility",
      ],
    ],
  },
};
