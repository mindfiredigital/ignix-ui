# Ignix UI Documentation

Documentation site for Ignix UI, built with Docusaurus.

## Overview

This package contains the documentation website for Ignix UI, providing:

- Component API documentation
- Usage examples
- Development guides
- Interactive playground
- Theme customization guides
- Animation system documentation

## Structure

```
docs/
├── docs/                 # Documentation content
│   ├── components/      # Component documentation
│   ├── guides/         # Development guides
│   ├── api/            # API documentation
│   └── examples/       # Usage examples
├── src/
│   ├── components/     # Site components
│   ├── pages/         # Static pages
│   ├── css/           # Styles
│   └── theme/         # Docusaurus theme
├── static/            # Static assets
└── docusaurus.config.js  # Site configuration
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build documentation
pnpm build

# Serve built documentation
pnpm serve
```

## Writing Documentation

### Adding a New Component Page

1. Create a new MDX file in `docs/components/`:

```mdx
---
sidebar_position: 1
---

# ComponentName

Description of the component.

## Usage

\`\`\`tsx
import { ComponentName } from '@animate-ui/registry';

<ComponentName>Content</ComponentName>
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| prop | type | default | description |

## Examples

### Basic Usage

\`\`\`tsx live
<ComponentName>Example</ComponentName>
\`\`\`
```

### Adding a Guide

1. Create a new MDX file in `docs/guides/`:

```mdx
---
sidebar_position: 1
---

# Guide Title

Guide content...
```

## Features

- MDX support
- Live code editing
- Automatic API documentation
- Versioned documentation
- Full-text search
- Dark mode support

## Configuration

### Site Configuration

Edit `docusaurus.config.js`:

```js
module.exports = {
  title: 'Ignix UI',
  tagline: 'Beautiful animated components',
  // ... other configuration
};
```

### Sidebar Configuration

Edit `sidebars.js`:

```js
module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['introduction', 'installation']
    },
    // ... other sidebar items
  ]
};
```

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

### Documentation Style Guide

- Use clear, concise language
- Include practical examples
- Provide TypeScript types
- Show live demos where possible
- Include accessibility information
- Document animation options

## License

MIT - See [LICENSE](../../LICENSE) for details.
