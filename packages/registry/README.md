# Ignix UI Registry

Core UI component library built on Radix UI primitives with beautiful animations.

## Features

- High-performance animations
- Accessible components
- Customizable themes
- TypeScript support
- Modern React patterns


## Usage

## Available Components

### Layout
- Container
- Grid
- Stack
- Flex

### Navigation
- Menu
- Tabs
- Breadcrumb
- Pagination

### Forms
- Button
- Input
- Select
- Checkbox
- Radio
- Switch

### Feedback
- Alert
- Toast
- Progress
- Spinner

### Overlay
- Modal
- Drawer
- Popover
- Tooltip

### Data Display
- Table
- Card
- List
- Badge

## Component Structure

Each component follows a consistent structure:

```
├── components/
│   ├── ComponentName/                 # CLI package
│       ├── index.tsx       # Main component
│       ├── index.types.ts # types
│       ├──  useIndex.ts  # hook   
│       └──config.ts  # tailwind-config              
└── registry.json  #Info about all component and dependencies
```

## Tailwind-Config Structure
### Always add Tailwind-config in below defined Struture
```tsx
module.exports = {
  theme: {
    extend: {
      keyframes: {
        // add keyframes here
      },
      animation: {
      // add animations here
      },
    },
  },
  plugins: [],
}

```

## File Types

- component
- hook
- types
- tailwind-config

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

MIT - See [LICENSE](../../LICENSE) for details.
