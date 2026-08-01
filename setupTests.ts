import '@testing-library/jest-dom';
import '@testing-library/user-event';

// React 18+ setup for testing
import { vi } from 'vitest';
import React from 'react';

// Mock framer-motion for testing to avoid context issues
vi.mock('framer-motion', () => {
  const mockMotion = (Component: any) => Component;
  mockMotion.div = ({ children, ...props }: any) => React.createElement('div', props, children);
  mockMotion.span = ({ children, ...props }: any) => React.createElement('span', props, children);
  mockMotion.button = ({ children, ...props }: any) =>
    React.createElement('button', props, children);
  mockMotion.create = (Component: any) => Component;

  return {
    motion: mockMotion,
    AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
  };
});

// Mock React 18 features if needed
global.React = React;

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
