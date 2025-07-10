# Ignix UI

A modern, high-performance animated component library built with Radix UI, managed through a pnpm monorepo structure with Turborepo for optimal development experience.

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)
[![Turborepo](https://img.shields.io/badge/built%20with-Turborepo-cc00ff.svg)](https://turborepo.org/)
[![Radix UI](https://img.shields.io/badge/powered%20by-Radix%20UI-blue.svg)](https://www.radix-ui.com/)

## Project Overview

This monorepo contains several key packages and applications that work together to provide a complete UI component development ecosystem:

### Core Packages (`/packages`)

- **Registry (`/packages/registry`)**

  - Core UI component library
  - Contains all reusable, animated components
  - Built on top of Radix UI primitives
  - Includes component source code and tests
  - TypeScript definitions and documentation

- **CLI (`/packages/cli`)**

  - Command-line tools for component development
  - Component scaffolding utilities
  - Build and test automation
  - Development workflow helpers
  - Project configuration tools

- **TSConfig (`/packages/tsconfig`)**
  - Shared TypeScript configurations
  - Base configurations for different project types
  - Ensures consistency across packages

### Applications (`/apps`)

- **Documentation (`/apps/docs`)**

  - Built with Docusaurus
  - Component API documentation
  - Usage examples and guidelines
  - Development guides
  - Interactive component playground

- **POC (`/apps/poc`)**
  - Development playground
  - Component testing environment
  - Integration examples
  - Performance testing

## Project Structure

```
ignix-ui/
├── apps/
│   ├── docs/                 # Docusaurus documentation site
│   │   ├── docs/            # Documentation content
│   │   ├── src/             # Site source code
│   │   └── static/          # Static assets
│   │
│   └── poc/                 # Development playground
│       ├── src/             # Source code
│       ├── public/          # Static assets
│       └── components/      # Example implementations
│
├── packages/
│   ├── cli/                 # CLI package
│   │   ├── src/            # CLI source code
│   │   ├── bin/            # Executable scripts
│   │   └── templates/      # Component templates
│   │
│   ├── registry/           # Component registry
│   │   ├── src/           # Component source code
│   │   ├── styles/        # Base styles and themes
│   │   └── tests/         # Component tests
│   │
│   └── tsconfig/          # Shared TypeScript configs
│
├── scripts/               # Build and maintenance scripts
├── .changeset/           # Changesets for versioning
├── .github/              # GitHub workflows and templates
└── .husky/               # Git hooks
```

## Development Workflow

### Setting Up the Development Environment

1. **Prerequisites**:

   ```bash
   node -v  # Must be 18+
   pnpm -v  # Must be 8+
   ```

2. **Installation**:
   ```bash
   git clone https://github.com/mindfiredigital/ignix-ui
   cd ignix-ui
   pnpm install
   pnpm build
   ```

### Development Commands

```bash
# Start all development servers
pnpm dev

# Start specific applications
pnpm dev --filter=docs    # Start documentation site
pnpm dev --filter=poc     # Start development playground

# Build packages
pnpm build               # Build all packages
pnpm build --filter=registry  # Build only registry

# Testing
pnpm test               # Run all tests
pnpm test:watch        # Run tests in watch mode

# Linting and Formatting
pnpm lint              # Run ESLint
pnpm format           # Run Prettier
```

### Creating a New Component

1. **Use the CLI to scaffold**:

   ```bash
   pnpm cli create-component MyComponent
   ```

2. **Component Structure**:

   ```
   registry/src/components/MyComponent/
   ├── MyComponent.tsx        # Component code
   ├── MyComponent.test.tsx   # Tests
   ├── MyComponent.styles.ts  # Styles
   └── index.ts              # Exports
   ```

3. **Development Process**:
   - Write component code in `registry/src/components`
   - Add documentation in `apps/docs/docs/components`
   - Create examples in `apps/poc/src/examples`
   - Add tests in the component directory
   - Update the component registry

### Publishing Updates

1. **Create a changeset**:

   ```bash
   pnpm changeset
   ```

2. **Version packages**:

   ```bash
   pnpm version-packages
   ```

3. **Publish**:
   ```bash
   pnpm publish-packages
   ```

## Configuration Files

- **`turbo.json`**: Turborepo pipeline configuration
- **`pnpm-workspace.yaml`**: Workspace package definitions
- **`tsconfig.json`**: Base TypeScript configuration
- **`.eslintrc.js`**: ESLint rules
- **`.prettierrc`**: Code formatting rules
- **`.npmrc`**: npm registry settings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Run tests (`pnpm test`)
5. Commit with conventional commits (`git commit -m 'feat: Add amazing feature'`)
6. Push to your branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📚 [Documentation](https://your-docs-url.com)
- 🐛 [Issue Tracker](https://github.com/mindfiredigital/ignix-ui/issues)
- 💬 [Discussions](https://github.com/mindfiredigital/ignix-ui/discussions)

## Features

- High-Performance Animations - Optimized for smooth transitions and interactions
- Radix UI Integration - Built on top of production-ready, accessible components
- Zero-Config Setup - Works out of the box with popular frameworks
- Type-Safe - Written in TypeScript for better developer experience
- Customizable - Easily modify animations and styling to match your brand
- Accessible - WCAG 2.1 compliant with full keyboard navigation
- Responsive - Mobile-first design approach

## Quick Start

```bash
# Clone the repository
git clone https://github.com/mindfiredigital/ignix-ui

# Install dependencies
pnpm install


```

## Available Components

Our library includes a variety of animated components:

## Documentation

Comprehensive documentation is available at `http://localhost:3000` when running the development server. It includes:

- Getting Started Guide
- Component API Reference
- Animation Examples
- Best Practices
- Performance Tips
- Accessibility Guidelines
