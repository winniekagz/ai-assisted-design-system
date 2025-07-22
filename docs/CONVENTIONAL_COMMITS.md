# Conventional Commits

This document outlines the conventional commit format used in this project. Following these
guidelines ensures consistent, readable commit messages and enables automatic versioning and
changelog generation.

## Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Commit Types

### Primary Types

- **feat**: A new feature for the user
- **fix**: A bug fix for the user
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Extended Types (for component libraries)

- **component**: New component addition
- **story**: Storybook story changes
- **design**: Design system updates
- **accessibility**: Accessibility improvements
- **breaking**: Breaking changes (use with caution)

## Scopes

Scopes are optional but recommended for better organization. Common scopes include:

- **ui**: User interface components
- **api**: API-related changes
- **auth**: Authentication system
- **config**: Configuration files
- **deps**: Dependencies
- **docs**: Documentation
- **test**: Testing framework
- **build**: Build system
- **ci**: Continuous Integration

## Examples

### Simple Commits

```bash
feat: add button component
fix: resolve navigation menu overflow
docs: update installation guide
style: format code with prettier
```

### Commits with Scope

```bash
feat(ui): add new card component
fix(auth): resolve login redirect issue
docs(api): update endpoint documentation
test(components): add unit tests for button
```

### Commits with Body

```bash
feat(ui): add responsive navigation menu

- Implement mobile-first design approach
- Add hamburger menu for mobile devices
- Include smooth transitions and animations
- Support keyboard navigation

Closes #123
```

### Breaking Changes

```bash
feat(ui)!: redesign button component API

BREAKING CHANGE: Button component now requires `variant` prop instead of `type`.
The `type` prop is now used for HTML button types (submit, button, reset).

Migration guide:
- Replace `type="primary"` with `variant="primary"`
- Replace `type="secondary"` with `variant="secondary"`
```

### Reverting Commits

```bash
revert: feat(ui): add button component

This reverts commit abc123def456.
```

## Best Practices

### 1. Use Imperative Mood

Write commit messages in imperative mood, as if you're giving commands:

✅ **Good:**

```bash
feat: add user authentication
fix: resolve navigation bug
```

❌ **Avoid:**

```bash
feat: added user authentication
fix: resolved navigation bug
```

### 2. Keep Description Concise

The description should be clear and under 72 characters:

✅ **Good:**

```bash
feat: add dark mode toggle
```

❌ **Avoid:**

```bash
feat: add a really cool dark mode toggle that users can switch between light and dark themes
```

### 3. Use Body for Complex Changes

For complex changes, use the commit body to provide additional context:

```bash
feat(ui): implement new design system

- Replace old color palette with new brand colors
- Update typography scale and spacing
- Implement consistent component patterns
- Add design tokens for maintainability

Resolves #456
```

### 4. Reference Issues

Link commits to issues when relevant:

```bash
feat: add user profile page

Closes #123
Fixes #456
Relates to #789
```

### 5. Use Conventional Commits for Releases

This format enables automatic:

- Version bumping
- Changelog generation
- Release notes
- Dependency updates

## Tools and Automation

### Commitlint

This project uses [commitlint](https://commitlint.js.org/) to enforce conventional commit format.
Invalid commit messages will be rejected.

### Husky

Git hooks are configured to run commitlint on every commit.

### Semantic Release

Automated versioning and releases based on conventional commits.

## Migration from Traditional Commits

If you're transitioning from traditional commit messages:

1. **Start small**: Begin with basic types (feat, fix, docs)
2. **Add scopes gradually**: Introduce scopes as you become comfortable
3. **Use tools**: Leverage commitlint to catch formatting issues
4. **Team training**: Ensure all team members understand the format

## Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format)
- [Commitlint Documentation](https://commitlint.js.org/)
- [Semantic Release](https://semantic-release.gitbook.io/)

## Questions?

If you have questions about conventional commits or need help formatting a specific commit message,
please reach out to the team or create an issue.
