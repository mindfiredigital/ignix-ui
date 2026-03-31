import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ToastProvider, useToast, ToastContext } from './index';
import type { ToastManagerRef } from './index';

vi.mock('framer-motion', () => {
  const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  AnimatePresence.displayName = 'AnimatePresence';

  interface MotionProps {
    children?: React.ReactNode;
    initial?: unknown;
    animate?: unknown;
    exit?: unknown;
    variants?: unknown;
    custom?: unknown;
    layout?: unknown;
    whileHover?: unknown;
    whileTap?: unknown;
    transition?: unknown;
    style?: React.CSSProperties;
    className?: string;
    role?: React.AriaRole;
    'aria-live'?: React.AriaAttributes['aria-live'];
    'aria-label'?: string;
    onMouseEnter?: React.MouseEventHandler<HTMLElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLElement>;
    onClick?: React.MouseEventHandler<HTMLElement>;
  }

  const makeMotionComponent = (tag: string) => {
    const Component = React.forwardRef<HTMLElement, MotionProps>(
      (
        {
          children,
          initial: _i,
          animate: _a,
          exit: _e,
          variants: _v,
          custom: _c,
          layout: _l,
          whileHover: _wh,
          whileTap: _wt,
          transition: _tr,
          ...domProps
        },
        ref
      ) =>
        React.createElement(tag, { ref, ...(domProps as any) }, children)
    );
    Component.displayName = `motion.${tag}`;
    return Component;
  };

  const motion = new Proxy({} as Record<string, ReturnType<typeof makeMotionComponent>>, {
    get: (_target, tag: string) => makeMotionComponent(tag),
  });

  return { AnimatePresence, motion };
});

vi.mock('@radix-ui/react-icons', () => ({
  CrossCircledIcon: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg data-testid="cross-icon" className={className} style={style} />
  ),
  CheckCircledIcon: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg data-testid="check-icon" className={className} style={style} />
  ),
  ExclamationTriangleIcon: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg data-testid="exclamation-icon" className={className} style={style} />
  ),
  InfoCircledIcon: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg data-testid="info-icon" className={className} style={style} />
  ),
}));

vi.mock('../../../utils/cn', () => ({
  cn: (...args: (string | undefined | null | boolean)[]) =>
    args.filter(Boolean).join(' '),
}));

const renderWithProvider = (
  ui: React.ReactNode,
  providerProps: {
    maxToasts?: number;
    defaultPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  } = {}
) => render(<ToastProvider {...providerProps}>{ui}</ToastProvider>);

const ToastConsumer = () => {
  const toast = useToast();
  return (
    <div>
      <button onClick={() => toast.success('Success message')}>success</button>
      <button onClick={() => toast.error('Error message')}>error</button>
      <button onClick={() => toast.warning('Warning message')}>warning</button>
      <button onClick={() => toast.info('Info message')}>info</button>
      <button
        onClick={() =>
          toast.addToast({
            message: 'Custom toast',
            variant: 'default',
            animation: 'slide',
            appearance: 'glassmorphism',
            duration: 3000,
          })
        }
      >
        custom
      </button>
      <button
        onClick={() =>
          toast.addToast({
            message: 'Action toast',
            variant: 'info',
            animation: 'fade',
            actionButton: { label: 'Undo', onClick: vi.fn() },
            dismissible: true,
          })
        }
      >
        action
      </button>
      <button onClick={() => toast.clearAll()}>clearAll</button>
    </div>
  );
};

describe('ToastProvider', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders children without crashing', () => {
    renderWithProvider(<div data-testid="child">hello</div>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('provides a ToastContext value to descendants', () => {
    let ctxValue: ToastManagerRef | undefined;
    const Spy = () => {
      ctxValue = React.useContext(ToastContext);
      return null;
    };
    renderWithProvider(<Spy />);
    expect(ctxValue).toBeDefined();
    expect(typeof ctxValue!.addToast).toBe('function');
    expect(typeof ctxValue!.removeToast).toBe('function');
    expect(typeof ctxValue!.clearAll).toBe('function');
  });
});

describe('useToast', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('throws when used outside ToastProvider', () => {
    class ErrorBoundary extends React.Component<
      { children: React.ReactNode },
      { error: Error | null }
    > {
      constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { error: null };
      }
      static getDerivedStateFromError(error: Error) {
        return { error };
      }

      render() {
        if (this.state.error) {
          return <div data-testid="error-msg">{this.state.error.message}</div>;
        }
        return this.props.children;
      }
    }

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

    render(
      <ErrorBoundary>
        <ToastConsumer />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('error-msg')).toHaveTextContent(
      'useToast must be used within a ToastProvider'
    );

    consoleSpy.mockRestore();
  });

  it('returns addToast, removeToast, clearAll, success, error, warning, info helpers', () => {
    let api: ReturnType<typeof useToast> | undefined;
    const Spy = () => {
      api = useToast();
      return null;
    };
    renderWithProvider(<Spy />);
    expect(typeof api!.addToast).toBe('function');
    expect(typeof api!.removeToast).toBe('function');
    expect(typeof api!.clearAll).toBe('function');
    expect(typeof api!.success).toBe('function');
    expect(typeof api!.error).toBe('function');
    expect(typeof api!.warning).toBe('function');
    expect(typeof api!.info).toBe('function');
  });
});

describe('Toast rendering', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders a success toast with correct message', () => {
    renderWithProvider(<ToastConsumer />);
    fireEvent.click(screen.getByText('success'));
    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('renders an error toast with correct message', () => {
    renderWithProvider(<ToastConsumer />);
    fireEvent.click(screen.getByText('error'));
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('renders a warning toast with correct message', () => {
    renderWithProvider(<ToastConsumer />);
    fireEvent.click(screen.getByText('warning'));
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('renders an info toast with correct message', () => {
    renderWithProvider(<ToastConsumer />);
    fireEvent.click(screen.getByText('info'));
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('renders a custom toast with correct message', () => {
    renderWithProvider(<ToastConsumer />);
    fireEvent.click(screen.getByText('custom'));
    expect(screen.getByText('Custom toast')).toBeInTheDocument();
  });

  it('renders CheckCircledIcon for success variant', () => {
    renderWithProvider(<ToastConsumer />);
    fireEvent.click(screen.getByText('success'));
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });

  it('renders CrossCircledIcon for error variant', () => {
    renderWithProvider(<ToastConsumer />);
    fireEvent.click(screen.getByText('error'));
    const icons = screen.getAllByTestId('cross-icon');
    expect(icons.length).toBeGreaterThanOrEqual(1);
  });

  it('renders ExclamationTriangleIcon for warning variant', () => {
    renderWithProvider(<ToastConsumer />);
    fireEvent.click(screen.getByText('warning'));
    expect(screen.getByTestId('exclamation-icon')).toBeInTheDocument();
  });

  it('renders InfoCircledIcon for info variant', () => {
    renderWithProvider(<ToastConsumer />);
    fireEvent.click(screen.getByText('info'));
    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
  });

  it('renders dismiss button when dismissible=true (default)', () => {
    renderWithProvider(<ToastConsumer />);
    fireEvent.click(screen.getByText('success'));
    expect(screen.getByLabelText('Close notification')).toBeInTheDocument();
  });

  it('renders action button when provided', () => {
    renderWithProvider(<ToastConsumer />);
    fireEvent.click(screen.getByText('action'));
    expect(screen.getByText('Undo')).toBeInTheDocument();
  });

  it('renders toast with role="alert"', () => {
    renderWithProvider(<ToastConsumer />);
    fireEvent.click(screen.getByText('info'));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders multiple toasts stacked', () => {
    renderWithProvider(<ToastConsumer />);
    fireEvent.click(screen.getByText('success'));
    fireEvent.click(screen.getByText('error'));
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});

describe('Toast dismissal', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('removes a toast when dismiss button is clicked', () => {
    renderWithProvider(<ToastConsumer />);
    fireEvent.click(screen.getByText('success'));
    expect(screen.getByText('Success message')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Close notification'));

    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });

  it('auto-removes a toast after its duration elapses', () => {
    renderWithProvider(<ToastConsumer />);
    fireEvent.click(screen.getByText('success')); 
    expect(screen.getByText('Success message')).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(4100));

    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });

  it('clearAll removes every toast', () => {
    renderWithProvider(<ToastConsumer />);
    fireEvent.click(screen.getByText('success'));
    fireEvent.click(screen.getByText('error'));
    fireEvent.click(screen.getByText('warning'));

    fireEvent.click(screen.getByText('clearAll'));

    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    expect(screen.queryByText('Error message')).not.toBeInTheDocument();
    expect(screen.queryByText('Warning message')).not.toBeInTheDocument();
  });
});

describe('Toast maxToasts cap', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('never shows more toasts than maxToasts', () => {
    const MaxConsumer = () => {
      const { addToast } = useToast();
      return (
        <button
          onClick={() => {
            for (let i = 1; i <= 6; i++) {
              addToast({ message: `Toast ${i}`, variant: 'info', animation: 'fade' });
            }
          }}
        >
          flood
        </button>
      );
    };

    renderWithProvider(<MaxConsumer />, { maxToasts: 3 });
    fireEvent.click(screen.getByText('flood'));

    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeLessThanOrEqual(3);
  });
});

describe('ToastContext direct usage', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('addToast via context renders toast', () => {
    const ref = React.createRef<ToastManagerRef>();

    const ContextAdder = () => {
      const ctx = React.useContext(ToastContext)!;
      React.useEffect(() => {
        (ref as React.RefObject<ToastManagerRef>).current = ctx;
      }, [ctx]);
      return null;
    };

    renderWithProvider(<ContextAdder />);

    act(() => {
      ref.current!.addToast({
        message: 'Direct context toast',
        variant: 'success',
        animation: 'pop',
      });
    });

    expect(screen.getByText('Direct context toast')).toBeInTheDocument();
  });

  it('removeToast via context removes the correct toast', () => {
    const ctxRef = React.createRef<ToastManagerRef>();
    const FIXED_NOW = 1_700_000_000_000;
    const EXPECTED_ID = FIXED_NOW + 0;

    const ContextRemover = () => {
      const ctx = React.useContext(ToastContext)!;
      React.useEffect(() => {
        (ctxRef as React.MutableRefObject<ToastManagerRef>).current = ctx;
      });
      return (
        <>
          <button
            onClick={() => {
              vi.spyOn(Date, 'now').mockReturnValueOnce(FIXED_NOW);
              vi.spyOn(Math, 'random').mockReturnValueOnce(0);
              ctx.addToast({ message: 'To remove', variant: 'info', animation: 'fade' });
              vi.restoreAllMocks();
            }}
          >
            add
          </button>
          <button onClick={() => ctxRef.current?.removeToast(EXPECTED_ID)}>
            remove
          </button>
        </>
      );
    };

    renderWithProvider(<ContextRemover />);

    fireEvent.click(screen.getByText('add'));
    expect(screen.getByText('To remove')).toBeInTheDocument();

    fireEvent.click(screen.getByText('remove'));
    expect(screen.queryByText('To remove')).not.toBeInTheDocument();
  });
});

describe('Toast appearance styles', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  const appearances = ['premium', 'gradient', 'glassmorphism', 'neon', 'glow'] as const;

  appearances.forEach((appearance) => {
    it(`renders without crashing with appearance="${appearance}"`, () => {
      const AppearanceConsumer = () => {
        const { addToast } = useToast();
        return (
          <button
            onClick={() =>
              addToast({ message: `${appearance} toast`, variant: 'success', animation: 'slide', appearance })
            }
          >
            show
          </button>
        );
      };

      renderWithProvider(<AppearanceConsumer />);
      fireEvent.click(screen.getByText('show'));
      expect(screen.getByText(`${appearance} toast`)).toBeInTheDocument();
    });
  });
});

describe('Toast animation variants', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  const animations = ['slide', 'fade', 'bounce', 'pop', 'elastic', 'flip'] as const;

  animations.forEach((animation) => {
    it(`renders without crashing with animation="${animation}"`, () => {
      const AnimConsumer = () => {
        const { addToast } = useToast();
        return (
          <button
            onClick={() =>
              addToast({ message: `${animation} toast`, variant: 'info', animation })
            }
          >
            show
          </button>
        );
      };

      renderWithProvider(<AnimConsumer />);
      fireEvent.click(screen.getByText('show'));
      expect(screen.getByText(`${animation} toast`)).toBeInTheDocument();
    });
  });
});

describe('Toast size variants', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  (['sm', 'md', 'lg'] as const).forEach((size) => {
    it(`renders without crashing with size="${size}"`, () => {
      const SizeConsumer = () => {
        const { addToast } = useToast();
        return (
          <button
            onClick={() =>
              addToast({ message: `${size} toast`, variant: 'info', animation: 'fade', size })
            }
          >
            show
          </button>
        );
      };

      renderWithProvider(<SizeConsumer />);
      fireEvent.click(screen.getByText('show'));
      expect(screen.getByText(`${size} toast`)).toBeInTheDocument();
    });
  });
});

describe('Toast custom icon', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders a custom icon instead of the default one', () => {
    const CustomIconConsumer = () => {
      const { addToast } = useToast();
      return (
        <button
          onClick={() =>
            addToast({
              message: 'Custom icon toast',
              variant: 'success',
              animation: 'slide',
              icon: <span data-testid="custom-icon">★</span>,
            })
          }
        >
          show
        </button>
      );
    };

    renderWithProvider(<CustomIconConsumer />);
    fireEvent.click(screen.getByText('show'));
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
  });
});

describe('Toast priority', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('urgent toast appears at the top of the stack', () => {
    const PriorityConsumer = () => {
      const { addToast } = useToast();
      return (
        <>
          <button
            onClick={() =>
              addToast({ message: 'Normal toast', variant: 'info', animation: 'fade', priority: 'normal' })
            }
          >
            normal
          </button>
          <button
            onClick={() =>
              addToast({ message: 'Urgent toast', variant: 'error', animation: 'bounce', priority: 'urgent' })
            }
          >
            urgent
          </button>
        </>
      );
    };

    renderWithProvider(<PriorityConsumer />);
    fireEvent.click(screen.getByText('normal'));
    fireEvent.click(screen.getByText('urgent'));

    const alerts = screen.getAllByRole('alert');
    expect(alerts[0]).toHaveTextContent('Urgent toast');
  });
});

describe('ToastProvider defaultPosition', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('applies bottom-left position classes to the container', () => {
    const { container } = renderWithProvider(<ToastConsumer />, { defaultPosition: 'bottom-left' });

    fireEvent.click(screen.getByText('success'));

    const wrapper = container.querySelector('.fixed');
    expect(wrapper?.className).toMatch(/bottom-4/);
    expect(wrapper?.className).toMatch(/left-4/);
  });

  it('applies top-center position classes to the container', () => {
    const { container } = renderWithProvider(<ToastConsumer />, { defaultPosition: 'top-center' });

    fireEvent.click(screen.getByText('success'));

    const wrapper = container.querySelector('.fixed');
    expect(wrapper?.className).toMatch(/top-4/);
    expect(wrapper?.className).toMatch(/left-1\/2/);
  });
});