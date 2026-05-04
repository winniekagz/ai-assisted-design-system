# ComponentIQ (AI-assisted design system demo)

ComponentIQ is a **review-first internal tool / future SaaS simulation** built on this Next.js design system. It demonstrates how a frontend platform team would combine **mentor-grade guidance**, **token and component whitelists**, **governance**, and **safe AI usage** (prompts on the server, Zod-validated JSON, draft-only code).

### Product goal (MVP)

- Help engineers **choose the right component** before inventing new UI.
- Surface **design token** expectations and **accessibility / state gaps** early.
- Route duplication into **governance** (compose → variant → pattern → proposal → local).
- Keep **API keys off the client** and treat model output as **untrusted** until humans review.

### Architecture (high level)

- **UI**: Next.js App Router screens under `src/app` and feature modules under `src/features/*`.
- **Design system data**: `src/design-system/data` (components, tokens, patterns, rules) — used in prompts and product UI.
- **AI**: Prompts in `src/ai/prompts`, Zod schemas in `src/ai/schemas`, shared server helpers in `src/ai/server.ts`, deterministic **mock fallbacks** in `src/ai/mock-service.ts`.
- **API routes**: `src/app/api/ai/{recommend,audit,governance}/route.ts` — JSON in/out, no secrets exposed to the browser.

### Configure an LLM (optional)

Set **`OPENAI_API_KEY`** or **`LLM_API_KEY`**. Optional: **`LLM_BASE_URL`** (defaults to OpenAI-compatible `https://api.openai.com/v1`) and **`LLM_MODEL`** (defaults to `gpt-4o-mini`). If keys are missing or the response fails validation, the app uses **structured mocks** so demos stay reliable.

### What is mocked vs real

- **Real**: Routes, forms, navigation, component catalog, Zod validation, server-side fetch to the configured chat-completions API when keys work.
- **Mocked / fallback**: Session-only storage for saved recommendations; dashboard “metrics” and activity; audit/governance/recommendation **mock payloads** whenever the API is absent or returns invalid JSON.

### Scripts

Use `npm run dev` for the app and `npm run storybook` for the underlying component library stories.

---

# componentIq Component Library

A modern, accessible React component library built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Modern Design System** - Consistent, beautiful components
- ♿ **Accessibility First** - WCAG compliant components
- 📱 **Responsive** - Mobile-first design approach
- 🧪 **Tested** - Comprehensive test coverage with Vitest
- 📖 **Documented** - Full Storybook documentation
- 🚀 **TypeScript** - Full type safety and IntelliSense
- 🎯 **Conventional Commits** - Standardized commit messages

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/leja-component-library.git
cd leja-component-library

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Storybook

View and interact with components in Storybook:

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006) to explore the component library.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run storybook` - Start Storybook
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Documentation

- **[Contributing Guide](./docs/CONTRIBUTING.md)** - How to contribute to the project
- **[Conventional Commits](./docs/CONVENTIONAL_COMMITS.md)** - Commit message guidelines
- **[Component Documentation](./docs/)** - Detailed component documentation

## Development

This project uses:

- **Next.js** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Storybook** - Component documentation
- **Vitest** - Testing framework
- **ESLint** - Code linting
- **Conventional Commits** - Standardized commit messages

## Contributing

We welcome contributions! Please read our [Contributing Guide](./docs/CONTRIBUTING.md) for details
on our code of conduct and the process for submitting pull requests.

### Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. See our
detailed guide in [`docs/CONVENTIONAL_COMMITS.md`](./docs/CONVENTIONAL_COMMITS.md).

Quick reference:

```bash
feat: add new component
fix: resolve bug
docs: update documentation
style: format code
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](./docs/)
- 🐛 [Report Issues](https://github.com/your-username/leja-component-library/issues)
- 💬 [Discussions](https://github.com/your-username/leja-component-library/discussions)
