# Ignix UI Playground

Development playground and testing environment for Ignix UI components.

## Overview

This application serves as a development and testing environment for Ignix UI components, providing:

- Component development workspace
- Visual testing environment
- Performance testing
- Integration examples
- Theme testing
- Animation playground

## Structure

```
poc/
├── src/
│   ├── components/     # Example implementations
│   ├── pages/         # Test pages
│   ├── examples/      # Usage examples
│   ├── themes/        # Theme variations
│   └── utils/         # Helper utilities
├── public/           # Static assets
├── tests/           # Test suites
│   ├── e2e/        # End-to-end tests
│   └── visual/     # Visual regression tests
└── vite.config.ts  # Build configuration
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Run visual regression tests
pnpm test:visual

# Build application
pnpm build
```

## Features

### Component Development

- Hot module reloading
- TypeScript support
- Automatic prop documentation
- Visual testing environment
- Performance monitoring

### Testing Environment

- Visual regression testing
- Performance benchmarking
- Accessibility testing
- Cross-browser testing
- Mobile responsiveness testing

### Theme Testing

```tsx
// Example theme testing
import { ThemeProvider } from 'path to registry';
import { lightTheme, darkTheme } from '../themes';

export const ThemeTest = () => (
  <>
    <ThemeProvider theme={lightTheme}>
      <Components />
    </ThemeProvider>
    <ThemeProvider theme={darkTheme}>
      <Components />
    </ThemeProvider>
  </>
);
```

### Animation Testing

```tsx
// Example animation testing
import { Button } from 'path to registry';

export const AnimationTest = () => (
  <div className="animation-test">
    <Button
      animation={{
        type: 'slide',
        duration: 300,
        direction: 'left'
      }}
    >
      Slide Left
    </Button>
    {/* More animation variations */}
  </div>
);
```

## Adding New Examples

1. Create a new component in `src/examples/`:

```tsx
// MyExample.tsx
import { Component } from 'path to registry';

export const MyExample = () => (
  <div className="example">
    <Component>
      Example content
    </Component>
  </div>
);
```

2. Add it to the examples page:

```tsx
// pages/examples.tsx
import { MyExample } from '../examples';

export default function Examples() {
  return (
    <div className="examples">
      <h1>Examples</h1>
      <MyExample />
    </div>
  );
}
```

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

### Development Guidelines

- Test all components across browsers
- Ensure mobile responsiveness
- Test with different themes
- Document performance impacts
- Include accessibility tests

## License

MIT - See [LICENSE](../../LICENSE) for details.
