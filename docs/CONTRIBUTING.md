# Contributing to ComponentIQ Component Library

Thank you for your interest in contributing to the ComponentIQ Component Library! This document provides
guidelines and information for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/leja-component-library.git
cd leja-component-library

# Install dependencies
npm install

# Start development server
npm run dev

# Start Storybook
npm run storybook
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run storybook` - Start Storybook
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Code Style

### TypeScript

- Use TypeScript for all new code
- Follow strict TypeScript configuration
- Use proper type annotations
- Avoid `any` type when possible

### React Components

- Use functional components with hooks
- Follow React best practices
- Use proper prop types and interfaces
- Implement proper error boundaries

### Styling

- Use Tailwind CSS for styling
- Follow design system guidelines
- Ensure responsive design
- Maintain accessibility standards

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. Please
read our detailed guide in [`docs/CONVENTIONAL_COMMITS.md`](./CONVENTIONAL_COMMITS.md).

### Quick Reference

```bash
# Feature
feat: add new button component

# Bug fix
fix: resolve button click handler issue

# Documentation
docs: update component usage examples

# Breaking change
feat!: redesign button API

# With scope
feat(ui): add card component
fix(auth): resolve login redirect
```

## Pull Request Process

1. **Create a feature branch** from `main`

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** following the code style guidelines

3. **Write tests** for new functionality

4. **Update documentation** if needed

5. **Commit your changes** using conventional commits

6. **Push your branch** and create a pull request

7. **Fill out the PR template** completely

8. **Request review** from maintainers

### PR Template

When creating a pull request, please include:

- **Description**: What does this PR do?
- **Type of change**: feat, fix, docs, style, refactor, test, chore
- **Breaking changes**: Are there any breaking changes?
- **Testing**: How have you tested these changes?
- **Screenshots**: If applicable, include screenshots
- **Checklist**: Confirm all requirements are met

## Testing

### Unit Tests

- Write unit tests for all new components
- Maintain good test coverage
- Use Vitest for testing
- Follow testing best practices

### Storybook

- Create stories for new components
- Include different states and variants
- Add accessibility tests
- Document component usage

### Manual Testing

- Test in different browsers
- Verify responsive behavior
- Check accessibility compliance
- Test with screen readers

## Documentation

### Component Documentation

- Document all component props
- Provide usage examples
- Include accessibility notes
- Add design guidelines

### API Documentation

- Keep API documentation up to date
- Include TypeScript interfaces
- Provide migration guides for breaking changes

### Storybook Stories

- Create comprehensive stories
- Include all component variants
- Add interactive examples
- Document component behavior

## Code Review

All contributions require review before merging. Reviewers will check for:

- Code quality and style
- Test coverage
- Documentation updates
- Accessibility compliance
- Performance considerations
- Security implications

## Getting Help

If you need help or have questions:

1. Check existing documentation
2. Search existing issues
3. Create a new issue with detailed information
4. Join our community discussions

## License

By contributing to this project, you agree that your contributions will be licensed under the same
license as the project.

---

Thank you for contributing to the ComponentIQ Component Library! 🎉
