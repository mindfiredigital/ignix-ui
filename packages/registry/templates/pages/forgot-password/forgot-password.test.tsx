import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ForgotPasswordPage } from ".";
import userEvent from "@testing-library/user-event";

vi.mock("@ignix-ui/button", () => {
  return {
    Button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  };
});

vi.mock("@ignix-ui/input", () => {
  const AnimatedInput = ({ value, onChange, ...props }: any) => (
    <input
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );

  return { default: AnimatedInput };
});


vi.mock("framer-motion", async () => {
  const react = await vi.importActual<typeof import("react")>("react");

  // Simple passthrough motion component
  const MockMotion = react.forwardRef(
    ({ children, ...props }: any, ref: any) =>
      react.createElement("div", { ref, ...props }, children)
  );

  const mockFn = () => 0; // safe dummy function

  return {
    motion: new Proxy(
      {},
      {
        get: () => MockMotion,
      }
    ),

    // Hooks — return minimal values
    useMotionValue: mockFn,
    useTransform: mockFn,
    useSpring: mockFn,
    useVelocity: mockFn,
    useReducedMotion: () => false,
    useAnimate: () => [react.useRef(null), mockFn],

    // Components
    AnimatePresence: ({ children }: any) => <div>{children}</div>,
    LayoutGroup: ({ children }: any) => <div>{children}</div>,

  };
});

/* Mock framer-motion: provide all motion.<element> used in the component */
describe("ForgotPasswordPage", () => {
  let onSubmitMock: ReturnType<typeof vi.fn>;
  let onNavigateMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onSubmitMock = vi.fn();
    onNavigateMock = vi.fn();
  });

  const renderComponent = (props = {}) =>
    render(
    <ForgotPasswordPage
      onSubmit={onSubmitMock}
      onNavigateTo={onNavigateMock}
      forgotPasswordHeader={{
        head: "Forgot Password",
        para: "Enter your email to get reset link",
      }}
      {...props}
    />
  );

  it("renders the header text", () => {
    renderComponent();
    expect(screen.getByText("Forgot Password")).toBeInTheDocument();
    expect(screen.getByText("Enter your email to get reset link")).toBeInTheDocument();
  });

  it("validates email and shows error for invalid email", async () => {
    renderComponent();
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText(/enter your email/i);
    const button = screen.getByRole("button", { name: /send reset link/i });

    await user.type(input, "invalid-email");
    await user.click(button);

    expect(
      screen.getByText("Please enter a valid email address.")
    ).toBeInTheDocument();
  });
  
  it("calls onSubmit with valid email", async () => {
    renderComponent();
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText(/enter your email/i);
    const button = screen.getByRole("button", { name: /send reset link/i });

    await user.type(input, "user@example.com");
    await user.click(button);

    expect(onSubmitMock).toHaveBeenCalledTimes(1);
    expect(onSubmitMock).toHaveBeenCalledWith("user@example.com");
  });

  it("shows success message when submit succeeds", async () => {
    renderComponent();
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText(/enter your email/i);
    const button = screen.getByRole("button", { name: /send reset link/i });

    await user.type(input, "user@example.com");
    await user.click(button);

    expect(
      screen.getByText("Check your email for a reset link")
    ).toBeInTheDocument();
  });

  it("shows error when onSubmit throws", async () => {
    onSubmitMock.mockImplementation(() => {
      throw new Error("Failed to submit");
    });

    renderComponent();
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText(/enter your email/i);
    const button = screen.getByRole("button", { name: /send reset link/i });

    await user.type(input, "user@example.com");
    await user.click(button);

    expect(screen.getByText("Failed to submit")).toBeInTheDocument();
  });

  it("calls onNavigateTo when Back to Login is clicked", async () => {
    renderComponent();
    const user = userEvent.setup();

    const link = screen.getByRole("button", { name: /back to login/i });
    await user.click(link);

    expect(onNavigateMock).toHaveBeenCalledTimes(1);
  });
  
})
