import '@testing-library/jest-dom';
import '@testing-library/user-event';

// React 18+ setup for testing
import { vi } from 'vitest';
import React from 'react';

// Mock framer-motion for testing to avoid context issues
vi.mock('framer-motion', () => {
  interface MockMotion {
    (Component: any): any;
    div: (props: any) => React.ReactElement;
    span: (props: any) => React.ReactElement;
    button: (props: any) => React.ReactElement;
    create: (Component: any) => any;
  }

  const mockMotion = (((Component: any) => Component) as unknown) as MockMotion;
  mockMotion.div = ({ children, ...props }: any) => React.createElement('div', props, children);
  mockMotion.span = ({ children, ...props }: any) => React.createElement('span', props, children);
  mockMotion.button = ({ children, ...props }: any) =>
    React.createElement('button', props, children);
  mockMotion.create = (Component: any) => Component;

  return {
    motion: mockMotion,
    AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, null, children),
    useMotionValue: (initial: any) => ({
      get: () => initial,
      set: vi.fn(),
      onChange: vi.fn(() => vi.fn()),
      on: vi.fn(() => vi.fn()),
    }),
    useSpring: (val: any) => val,
    useTransform: (val: any, _inputOrFn: any, _output?: any) => val,
    useMotionTemplate: (strings: TemplateStringsArray, ...values: any[]) => ({
      get: () =>
        strings.reduce(
          (acc, str, i) => acc + str + (values[i]?.get ? values[i].get() : values[i] ?? ''),
          ''
        ),
    }),
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

// Mock window.matchMedia (used by CursorEffects and other components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
