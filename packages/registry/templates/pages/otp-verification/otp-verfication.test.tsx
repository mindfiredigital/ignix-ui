// OTPVerificationPage.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { OTPVerificationPage } from ".";
import userEvent from "@testing-library/user-event";

/* ---------------- Mock Button ---------------- */
vi.mock("@ignix-ui/button", () => {
  return {
    Button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  };
});

/* ---------------- Mock Framer Motion ---------------- */
vi.mock("framer-motion", async () => {
  const react = await vi.importActual<typeof import("react")>("react");

  const MockMotion = react.forwardRef(
    ({ children, ...props }: any, ref: any) =>
      react.createElement("div", { ref, ...props }, children)
  );

  return {
    motion: new Proxy(
      {},
      {
        get: () => MockMotion,
      }
    ),
    useReducedMotion: () => false,
    LayoutGroup: ({ children }: any) => <div>{children}</div>,
  };
});

/* ---------------- Test Suite ---------------- */
describe("OtpVerificationPage", () => {
  let onVerifyOtpMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onVerifyOtpMock = vi.fn();
  });

  const renderComponent = (props = {}) =>
    render(
      <OTPVerificationPage
        length={6}
        onVerifyOtp={onVerifyOtpMock}
        contactType="email"
        contactDetail="user@example.com"
        {...props}
      />
    );

  /* --------------------------------- */
  it("renders the header text", () => {
    renderComponent();
    expect(screen.getByText("Enter Verification Code")).toBeInTheDocument();
    expect(screen.getByText("Back To Login")).toBeInTheDocument();
  });

  /* --------------------------------- */
  it("shows error when OTP is not fully entered", async () => {
    renderComponent();

    const user = userEvent.setup();
    const verifyBtn = screen.getByRole("button", { name: /verify code/i });

    await user.click(verifyBtn);

    expect(
      screen.getByText(/please enter the full code/i)
    ).toBeInTheDocument();
  });

  /* --------------------------------- */
  it("formats phone number into 3-3-4 format", async () => {
    const user = userEvent.setup();

    renderComponent({
      contactType: "phone",
      contactDetail: "9999999999"
    });

    const editButton = screen.getByLabelText("pencil");
    await user.click(editButton);

    const input = screen.getByLabelText("editValue");

    await user.clear(input);
    await user.type(input, "9999999999");
    
    // Blur triggers formatting
    input.blur();
    await screen.findByText("999 999 9999");
  });

  it("shows phone validation error for invalid number", async () => {
    const user = userEvent.setup();

    renderComponent({ contactType: "phone", contactDetail: "123" });

    const editButton = screen.getByLabelText("pencil");
    await user.click(editButton);

    const input = screen.getByLabelText("editValue");

    await user.clear(input);
    await user.type(input, "123");

    // Trigger blur (important: use fireEvent)
    fireEvent.blur(input);

    // Now await the error text
    expect(
      await screen.findByText(/Phone must be 10 digits \(numbers only\)/i)
    ).toBeInTheDocument();
  });

  /* --------------------------------- */
  it("fills OTP inputs when user pastes a 6-digit code", async () => {
    const user = userEvent.setup();

    renderComponent({ length: 6 });

    const inputs = screen.getAllByLabelText("otp-input");

    // Focus first box
    await user.click(inputs[0]);

    // Paste text (this API only accepts 1 argument)
    await user.paste("123456");

    inputs.forEach((input, i) => {
      expect(input).toHaveValue(String(i + 1));
    });
  });

  /* --------------------------------- */
  it("calls onVerifyOtp with the entered OTP", async () => {
    const user = userEvent.setup();
    const mockVerify = vi.fn().mockResolvedValue({ success: true });

    renderComponent({ onVerifyOtp: mockVerify });

    const inputs = screen.getAllByLabelText("otp-input");

    for (let i = 0; i < inputs.length; i++) {
      await user.type(inputs[i], String(i + 1));
    }

    const verifyBtn = screen.getByRole("button", { name: /verify code/i });
    await user.click(verifyBtn);

    expect(mockVerify).toHaveBeenCalledWith("123456");
  });

  /* --------------------------------- */
  it("shows verification error when backend returns failure", async () => {
    const user = userEvent.setup();
    const mockVerify = vi.fn().mockResolvedValue({
      success: false,
      message: "Invalid OTP"
    });

    renderComponent({ onVerifyOtp: mockVerify });

    const inputs = screen.getAllByLabelText("otp-input");
    for (let i = 0; i < inputs.length; i++) {
      await user.type(inputs[i], "1");
    }

    await user.click(screen.getByRole("button", { name: /verify code/i }));

    expect(screen.getByText(/invalid otp/i)).toBeInTheDocument();
  });

});
