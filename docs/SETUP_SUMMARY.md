# Conventional Commits Setup Summary

This document summarizes the conventional commits setup implemented in the componentIq Component Library.

## What Was Implemented

### 1. Documentation Structure

- **`docs/` folder** - Organized documentation structure
- **`docs/CONVENTIONAL_COMMITS.md`** - Comprehensive conventional commits guide
- **`docs/CONTRIBUTING.md`** - Contributing guidelines with commit references
- **`docs/README.md`** - Documentation index and overview

### 2. Configuration Files

- **`commitlint.config.js`** - Commitlint configuration with custom rules
- **`.husky/commit-msg`** - Git hook to validate commits
- **Updated `README.md`** - Project overview with documentation links

### 3. Dependencies Added

- `@commitlint/cli` - Command-line interface for commitlint
- `@commitlint/config-conventional` - Conventional commits configuration
- `husky` - Git hooks manager

## How It Works

### Commit Validation

Every commit is automatically validated against the conventional commits specification:

```bash
# ✅ Valid commits
git commit -m "feat: add new component"
git commit -m "fix(ui): resolve button alignment"
git commit -m "docs: update installation guide"

# ❌ Invalid commits (will be rejected)
git commit -m "added new component"
git commit -m "fix:"
git commit -m "FEAT: Add Component"
```

### Supported Commit Types

- **Primary**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`,
  `revert`
- **Component Library**: `component`, `story`, `design`, `accessibility`, `breaking`

### Supported Scopes

- `ui`, `api`, `auth`, `config`, `deps`, `docs`, `test`, `build`, `ci`, `storybook`, `components`,
  `design`, `accessibility`

## Usage Examples

### Simple Commits

```bash
feat: add button component
fix: resolve navigation bug
docs: update README
```

### Commits with Scope

```bash
feat(ui): add card component
fix(auth): resolve login redirect
docs(api): update endpoint docs
```

### Breaking Changes

```bash
feat!: redesign button API
BREAKING CHANGE: Button component now requires variant prop
```

### Commits with Body

```bash
feat(ui): implement responsive navigation

- Add mobile-first design approach
- Include hamburger menu for mobile
- Support keyboard navigation

Closes #123
```

## Benefits

1. **Consistency** - Standardized commit messages across the team
2. **Automation** - Enables automatic versioning and changelog generation
3. **Clarity** - Clear, readable commit history
4. **Tooling** - Works with semantic release and other tools
5. **Documentation** - Self-documenting commit history

## Troubleshooting

### Commit Rejected

If your commit is rejected, check:

1. Commit message format follows conventional commits
2. Type is one of the supported types
3. Scope (if used) is one of the supported scopes
4. Subject is lowercase and under 72 characters

### Hook Not Working

If the commit hook isn't working:

1. Ensure Husky is properly installed: `npm run prepare`
2. Check hook permissions: `ls -la .husky/`
3. Verify commitlint configuration: `npx commitlint --help`

## Next Steps

1. **Team Training** - Share the conventional commits guide with your team
2. **CI/CD Integration** - Add commitlint to your CI pipeline
3. **Semantic Release** - Set up automatic versioning based on commits
4. **Changelog Generation** - Automate changelog creation

## Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Commitlint Documentation](https://commitlint.js.org/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Detailed Guide](./CONVENTIONAL_COMMITS.md)

---

_This setup provides a solid foundation for maintaining clean, consistent commit history and
enabling automated workflows._
