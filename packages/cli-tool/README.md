# Ignix CLI

[![NPM Version](https://img.shields.io/npm/v/ignix-cli.svg)](https://www.npmjs.com/package/@mindfiredigital/ignix-cli)
[![License](https://img.shields.io/npm/l/ignix-cli.svg)](https://github.com/mindfiredigital/ignix-ui/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](../../CONTRIBUTING.md)

The Ignix CLI is a powerful command-line tool that helps you quickly scaffold, manage, and interact with Ignix components and themes in your projects. It provides both interactive and command-based interfaces for seamless development.

## Installation

Install the CLI globally using npm or yarn:

```bash
npm install -g ignix-cli
```

Or use it directly with npx:

```bash
npx ignix-cli
```

## Usage Modes

### Interactive Mode

Simply run `ignix` without any arguments to enter interactive mode:

```bash
ignix
```

The interactive mode provides a beautiful, guided interface with the following options:

- 🚀 **Initialize Ignix UI** - Set up your project
- ➕ **Add components** - Add components to your project
- 📋 **List components** - View available components
- 🎨 **Manage themes** - Configure and manage themes
- 🚪 **Exit** - Close the CLI

### Command Mode

Run specific commands directly:

```bash
ignix <command> [options]
```

## Commands

### `ignix init`

Initialize Ignix UI in your project. This command sets up the necessary configuration and directory structure.

```bash
ignix init
```

**What it does:**

- Creates an `ignix.config.js` configuration file
- Sets up the components directory structure
- Creates utility files (e.g., `utils/cn.ts` for className utilities)
- Installs required dependencies

**Interactive prompts:**

- Project framework selection
- Components directory path
- Styling preferences
- Additional configuration options

### `ignix add`

Add components or themes to your project from the Ignix UI registry.

#### Add Components

```bash
ignix add component <component-names...>
```

**Examples:**

```bash
# Add a single component
ignix add component button

# Add multiple components
ignix add component button card modal input

# Interactive mode - prompts for component selection
ignix add component
```

**What it does:**

- Fetches component files from the registry
- Creates a dedicated folder for each component
- Writes component files to your components directory
- Handles dependencies automatically

#### Add Themes

```bash
ignix add theme <theme-name>
```

**Example:**

```bash
ignix add theme dark
```

### `ignix list`

List all available components or themes from the Ignix UI registry.

#### List Components

```bash
ignix list component
```

**Output:**

- Component name
- Description
- Available variants

#### List Themes

```bash
ignix list theme
```

**Output:**

- Theme name
- Description
- Color palette information

### `ignix themes`

Manage and configure themes for your project.

```bash
ignix themes
```

**Features:**

- View installed themes
- Switch between themes
- Customize theme variables
- Export theme configurations

## Configuration

The CLI uses an `ignix.config.js` file in your project root for configuration.

### Example Configuration

```javascript
/* eslint-env node */
/** @type {import('ignix-cli').IgnixConfig} */
module.exports = {
  // URL to the raw registry.json file on GitHub
  registryUrl:
    'https://raw.githubusercontent.com/mindfiredigital/ignix-ui/main/packages/registry/registry.json',

  // URL to the raw themes.json file on GitHub
  themeUrl:
    'https://raw.githubusercontent.com/mindfiredigital/ignix-ui/main/packages/registry/themes.json',

  // Default directory for UI components
  componentsDir: 'src/components/ui',

  // Your other configuration options...
};
```

## Contributing

We welcome contributions! Please see our [contributing guidelines](https://mindfiredigital.github.io/ignix-ui/docs/contribution-guide/how-to-contribute) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/mindfiredigital/ignix-ui/blob/main/LICENSE) file for details.
