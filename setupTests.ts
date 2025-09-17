import '@testing-library/jest-dom';
import '@testing-library/user-event';

// React 18+ setup for testing
import { vi } from 'vitest';
import React from 'react';

// Mock framer-motion for testing to avoid context issues
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    span: ({ children, ...props }: any) => React.createElement('span', props, children),
  },
  AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
}));

// Mock React 18 features if needed
global.React = React;
