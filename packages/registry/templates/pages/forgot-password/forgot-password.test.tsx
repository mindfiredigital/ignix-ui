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
  
  it("renders custom submit button label", () => {
    renderComponent({ submitbuttonLabel: "Reset Now" })

    expect(
      screen.getByRole("button", { name: /reset now/i })
    ).toBeInTheDocument()
  })

  it("renders custom navigate link label", () => {
    renderComponent({ navigateToLabel: "Go Back" })

    expect(
      screen.getByRole("button", { name: /go back/i })
    ).toBeInTheDocument()
  })

  it("renders split layout by default", () => {
    renderComponent()

    // Split layout contains 2 main sections (header + form)
    expect(
      document.querySelectorAll(".md\\:w-1\\/2").length
    ).toBeGreaterThan(0)
  })

  it("renders center layout when formType is center", () => {
    renderComponent({ formType: "center" })

    expect(
      document.querySelector(".min-h-screen")
    ).toBeInTheDocument()
  })

  it("renders forgotSplitHeader when provided", () => {
    render(
      <ForgotPasswordPage
        forgotSplitHeader={{
          head: "Split Header",
          para: "Split description",
        }}
      />
    )

    expect(screen.getByText("Split Header")).toBeInTheDocument()
    expect(screen.getByText("Split description")).toBeInTheDocument()
  })

  it("falls back to formCardHeader node when forgotPasswordHeader is not provided", () => {
    render(
      <ForgotPasswordPage
        formCardHeader={<h1>Custom Card Header</h1>}
      />
    )

    expect(screen.getByText("Custom Card Header")).toBeInTheDocument()
  })

  it("does not show error message before submit", () => {
    renderComponent()

    expect(
      screen.queryByText(/please enter a valid email/i)
    ).not.toBeInTheDocument()
  })

  it("does not show success message before submit", () => {
    renderComponent()

    expect(
      screen.queryByText(/check your email/i)
    ).not.toBeInTheDocument()
  })

  it("renders input with correct placeholder", () => {
    renderComponent()

    expect(
      screen.getByPlaceholderText("Enter your email")
    ).toBeInTheDocument()
  })

  it("submits only once per click", async () => {
    renderComponent()
    const user = userEvent.setup()

    const input = screen.getByPlaceholderText(/enter your email/i)
    const button = screen.getByRole("button", { name: /send reset link/i })

    await user.type(input, "user@example.com")
    await user.click(button)

    expect(onSubmitMock).toHaveBeenCalledTimes(1)
  })

  it("renders custom submit button label", () => {
    renderComponent({ submitbuttonLabel: "Reset Now" })

    expect(
      screen.getByRole("button", { name: /reset now/i })
    ).toBeInTheDocument()
  })

  it("renders custom navigation label", () => {
    renderComponent({ navigateToLabel: "Go Back" })

    expect(
      screen.getByRole("button", { name: /go back/i })
    ).toBeInTheDocument()
  })

  it("does not show error initially", () => {
    renderComponent()

    expect(
      screen.queryByText(/please enter a valid email/i)
    ).not.toBeInTheDocument()
  })

  it("does not show success message initially", () => {
    renderComponent()

    expect(
      screen.queryByText(/check your email/i)
    ).not.toBeInTheDocument()
  })

  it("renders center layout when formType is center", () => {
    renderComponent({ formType: "center" })

    expect(
      screen.getByText("Forgot Password")
    ).toBeInTheDocument()
  })

  it("renders split layout header when provided", () => {
    render(
      <ForgotPasswordPage
        forgotSplitHeader={{
          head: "Welcome Back",
          para: "Reset your password",
        }}
        onSubmit={onSubmitMock}
        onNavigateTo={onNavigateMock}
      />
    )

    expect(screen.getByText("Welcome Back")).toBeInTheDocument()
    expect(screen.getByText("Reset your password")).toBeInTheDocument()
  })

  it("updates input value correctly", async () => {
    renderComponent()
    const user = userEvent.setup()

    const input = screen.getByPlaceholderText(/enter your email/i)
    await user.type(input, "test@example.com")

    expect(input).toHaveValue("test@example.com")
  })

  it("allows submitting again after validation error", async () => {
    renderComponent()
    const user = userEvent.setup()

    const input = screen.getByPlaceholderText(/enter your email/i)
    const button = screen.getByRole("button", { name: /send reset link/i })

    await user.type(input, "bad-email")
    await user.click(button)

    expect(
      screen.getByText(/please enter a valid email/i)
    ).toBeInTheDocument()

    await user.clear(input)
    await user.type(input, "valid@example.com")
    await user.click(button)

    expect(onSubmitMock).toHaveBeenCalledWith("valid@example.com")
  })

  it("renders dark variant styles without crashing", () => {
    renderComponent({ variant: "dark", formType: "center" })

    expect(
      screen.getByText("Forgot Password")
    ).toBeInTheDocument()
  })

  it("renders input placeholder correctly", () => {
    renderComponent()

    expect(
      screen.getByPlaceholderText("Enter your email")
    ).toBeInTheDocument()
  })

})
