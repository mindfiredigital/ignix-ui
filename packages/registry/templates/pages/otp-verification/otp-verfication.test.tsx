import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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

  const stripMotionProps = (props: any) => {
    const {
      ...rest
    } = props;
    return rest;
  };

  const MockMotion = react.forwardRef(
    ({ children, ...props }: any, ref: any) =>
      react.createElement("div", { ref, ...stripMotionProps(props) }, children)
  );

  return {
    motion: new Proxy({}, { get: () => MockMotion }),
    AnimatePresence: ({ children }: any) => <div>{children}</div>,
  };
});

/* ---------------- Test Suite ---------------- */
describe("OTPVerificationPage", () => {
  let onVerifyOtpMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onVerifyOtpMock = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it("disables verify button until OTP is complete", async () => {
    renderComponent();
    const button = screen.getByRole("button", { name: /verify code/i });
    expect(button).toBeDisabled();
  });

  it("enables verify button when OTP is complete", async () => {
    const user = userEvent.setup();
    renderComponent();

    const inputs = screen.getAllByRole("textbox");
    for (let i = 0; i < 6; i++) {
      await user.type(inputs[i], "1");
    }

    expect(
      screen.getByRole("button", { name: /verify code/i })
    ).toBeEnabled();
  });

  it("disables verify button when OTP is incomplete", async () => {
    const user = userEvent.setup();
    renderComponent();

    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "1");
    await user.type(inputs[1], "2");
    await user.type(inputs[2], "3");

    expect(
      screen.getByRole("button", { name: /verify code/i })
    ).toBeDisabled();
  });

  it("calls onVerifyOtp with entered code", async () => {
    const user = userEvent.setup();
    const mockVerify = vi.fn().mockResolvedValue({ success: true });

    renderComponent({ onVerifyOtp: mockVerify });

    const inputs = screen.getAllByRole("textbox");
    for (let i = 0; i < 6; i++) {
      await user.type(inputs[i], String(i + 1));
    }

    await user.click(screen.getByRole("button", { name: /verify code/i }));

    expect(mockVerify).toHaveBeenCalledWith("123456");
  });

  it("shows backend verification error", async () => {
    const user = userEvent.setup();
    const mockVerify = vi.fn().mockResolvedValue({
      success: false,
      message: "Invalid OTP",
    });

    renderComponent({ onVerifyOtp: mockVerify });

    const inputs = screen.getAllByRole("textbox");
    for (let i = 0; i < 6; i++) {
      await user.type(inputs[i], "1");
    }

    await user.click(screen.getByRole("button", { name: /verify code/i }));

    expect(await screen.findByText(/invalid otp/i)).toBeInTheDocument();
  });

  it("autofocuses first OTP input on mount", () => {
    renderComponent();
    const inputs = screen.getAllByRole("textbox");
    expect(document.activeElement).toBe(inputs[0]);
  });

  it("moves focus to next input on entry", async () => {
    const user = userEvent.setup();
    renderComponent();

    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "1");

    expect(document.activeElement).toBe(inputs[1]);
  });

  it("moves focus back on backspace", async () => {
    const user = userEvent.setup();
    renderComponent();

    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "1");
    await user.type(inputs[1], "{backspace}");

    expect(document.activeElement).toBe(inputs[0]);
  });

  it("handles arrow key navigation", async () => {
    const user = userEvent.setup();
    renderComponent();

    const inputs = screen.getAllByRole("textbox");
    inputs[2].focus();
    await user.keyboard("{ArrowLeft}");

    expect(document.activeElement).toBe(inputs[1]);
  });

  it("fills OTP when pasting full code", async () => {
    const user = userEvent.setup();
    renderComponent();

    const inputs = screen.getAllByRole("textbox");
    inputs[0].focus();
    await user.paste("123456");

    inputs.forEach((input, i) =>
      expect(input).toHaveValue(String(i + 1))
    );
  });

  it("ignores non-numeric paste", async () => {
    const user = userEvent.setup();
    renderComponent();

    const input = screen.getAllByRole("textbox")[0];
    await user.paste("abc");

    expect(input).toHaveValue("");
  });

  it("resend button triggers callback", async () => {
    const user = userEvent.setup();
    const resendMock = vi.fn().mockResolvedValue({ success: true });

    renderComponent({ onResendOtp: resendMock });

    await user.click(screen.getByText(/resend code/i));
    expect(resendMock).toHaveBeenCalled();
  });

  it("shows resend success message", async () => {
    const user = userEvent.setup();
    const resendMock = vi.fn().mockResolvedValue({
      success: true,
      message: "Sent!",
    });

    renderComponent({ onResendOtp: resendMock });
    await user.click(screen.getByText(/resend code/i));

    expect(await screen.findByText(/sent!/i)).toBeInTheDocument();
  });

  it("calls navigation callback", async () => {
    const user = userEvent.setup();
    const navMock = vi.fn();

    renderComponent({ onNavigateTo: navMock });

    await user.click(screen.getByText(/back to login/i));
    expect(navMock).toHaveBeenCalled();
  });

  it("edits email and validates invalid email", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: /edit email/i }));
    // Use getByLabelText to specifically get the email input, not OTP inputs
    const input = screen.getByLabelText(/email address/i);

    await user.clear(input);
    await user.type(input, "invalid");
    fireEvent.blur(input);

    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });

  it("esc cancels editing", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: /edit email/i }));
    // Use getByLabelText to specifically get the email input, not OTP inputs
    const input = screen.getByLabelText(/email address/i);

    await user.keyboard("{Escape}");
    expect(input).not.toBeInTheDocument();
  });

  it("shows success message on verification", async () => {
    const user = userEvent.setup();
    const mockVerify = vi.fn().mockResolvedValue({
      success: true,
      message: "Verified!",
    });

    renderComponent({ onVerifyOtp: mockVerify });

    const inputs = screen.getAllByRole("textbox");
    for (let i = 0; i < 6; i++) {
      await user.type(inputs[i], "1");
    }

    await user.click(screen.getByRole("button", { name: /verify code/i }));
    expect(await screen.findByText(/verified!/i)).toBeInTheDocument();
  });

  it("handles phone number editing and validation", async () => {
    const user = userEvent.setup();
    renderComponent({ 
      contactType: "phone", 
      contactDetail: "+91 9876543210" 
    });

    await user.click(screen.getByRole("button", { name: /edit phone/i }));
    const input = screen.getByLabelText(/phone number/i);

    await user.clear(input);
    await user.type(input, "1234567890");
    fireEvent.blur(input);

    // Phone should be validated and saved
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
  });

  it("disables resend button when there is a validation error", async () => {
    const user = userEvent.setup();
    renderComponent();
    
    await user.click(screen.getByRole("button", { name: /edit email/i }));
    const input = screen.getByLabelText(/email address/i);
    
    await user.clear(input);
    await user.type(input, "invalid-email");
    fireEvent.blur(input);

    // Wait for error to appear
    await screen.findByText(/valid email/i);
    
    const resendButton = screen.getByRole("button", { name: /resend code/i });
    expect(resendButton).toBeDisabled();
  });

  it("shows cooldown message after resend", async () => {
    const user = userEvent.setup();
    const resendMock = vi.fn().mockResolvedValue({ success: true });

    renderComponent({ onResendOtp: resendMock, resendCooldown: 30 });

    await user.click(screen.getByText(/resend code/i));

    // Check cooldown message appears (text shows countdown)
    expect(await screen.findByText(/resend in/i)).toBeInTheDocument();
  });

  it("supports custom OTP length", async () => {
    const user = userEvent.setup();
    renderComponent({ length: 4 });

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(4);

    // Fill all 4 inputs
    for (let i = 0; i < 4; i++) {
      await user.type(inputs[i], String(i + 1));
    }

    const verifyButton = screen.getByRole("button", { name: /verify code/i });
    expect(verifyButton).toBeEnabled();
  });

  it("handles paste with partial code", async () => {
    const user = userEvent.setup();
    renderComponent();

    const inputs = screen.getAllByRole("textbox");
    inputs[0].focus();
    await user.paste("123");

    // First 3 inputs should be filled
    expect(inputs[0]).toHaveValue("1");
    expect(inputs[1]).toHaveValue("2");
    expect(inputs[2]).toHaveValue("3");
    expect(inputs[3]).toHaveValue("");
  });

  it("clears OTP input on delete", async () => {
    const user = userEvent.setup();
    renderComponent();

    const inputs = screen.getAllByRole("textbox");
    await user.type(inputs[0], "1");
    expect(inputs[0]).toHaveValue("1");

    await user.type(inputs[0], "{backspace}");
    expect(inputs[0]).toHaveValue("");
  });

  it("handles resend error scenario", async () => {
    const user = userEvent.setup();
    const resendMock = vi.fn().mockResolvedValue({
      success: false,
      message: "Failed to resend code",
    });

    renderComponent({ onResendOtp: resendMock });

    await user.click(screen.getByText(/resend code/i));
    expect(await screen.findByText(/failed to resend code/i)).toBeInTheDocument();
  });

  it("renders custom title and labels", () => {
    renderComponent({
      title: "Custom Title",
      submitButtonLabel: "Submit",
      navigateToLabel: "Go Back",
    });

    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("Go Back")).toBeInTheDocument();
  });

  it("validates email with invalid TLD (ending with digit)", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: /edit email/i }));
    const input = screen.getByLabelText(/email address/i);

    await user.clear(input);
    await user.type(input, "user@example.9");
    fireEvent.blur(input);

    expect(await screen.findByText(/domain must end with letters/i)).toBeInTheDocument();
  });

  it("submits email on Enter key press in edit mode", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: /edit email/i }));
    const input = screen.getByLabelText(/email address/i);

    await user.clear(input);
    await user.type(input, "newemail@example.com");
    await user.keyboard("{Enter}");

    // Email should be saved (input should disappear)
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
  });

});

