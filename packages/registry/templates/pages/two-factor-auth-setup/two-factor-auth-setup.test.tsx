/**
 * Unit tests for TwoFactorAuthSetupPage template
 *
 * This suite covers:
 * - Rendering and step flow (QR → Manual → Backup → Verify → Success)
 * - Verification behavior (error on incomplete code, success path, failure path)
 * - Backup codes actions (copy single, copy all)
 */

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from "vitest";
import { TwoFactorAuthSetupPage } from ".";

/**
 * Mock @ignix-ui/button as a simple <button>
 */
vi.mock("@ignix-ui/button", () => {
  return {
    Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  };
});

/**
 * Mock @ignix-ui/card primitives as simple div/heading wrappers
 */
vi.mock("@ignix-ui/card", () => {
  return {
    Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CardDescription: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CardTitle: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  };
});

/**
 * Mock framer-motion to avoid animation complexity in tests
 */
vi.mock("framer-motion", async () => {
  const react = await vi.importActual<typeof import("react")>("react");

  const MockMotion = react.forwardRef(({ children, ...props }: any, ref: any) =>
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

/**
 * Mock lucide-react icons as simple spans
 */
vi.mock("lucide-react", () => ({
  Shield: () => <span data-testid="icon-shield" />,
  Copy: () => <span data-testid="icon-copy" />,
  Download: () => <span data-testid="icon-download" />,
  CheckCircle2: () => <span data-testid="icon-check" />,
  XCircle: () => <span data-testid="icon-x" />,
  Key: () => <span data-testid="icon-key" />,
}));

describe("TwoFactorAuthSetupPage", () => {
  let onVerifyMock: ReturnType<typeof vi.fn>;
  let onSaveBackupCodesMock: ReturnType<typeof vi.fn>;

  // Shared clipboard mock for all tests
  const writeTextMock = vi.fn();

  // Define a writable clipboard once for the jsdom navigator
  beforeAll(() => {
    Object.defineProperty(globalThis.navigator, "clipboard", {
      value: { writeText: writeTextMock },
      configurable: true,
    });
  });

  beforeEach(() => {
    onVerifyMock = vi.fn();
    onSaveBackupCodesMock = vi.fn();
    writeTextMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = (props: Partial<React.ComponentProps<typeof TwoFactorAuthSetupPage>> = {}) =>
    render(
      <TwoFactorAuthSetupPage
        onVerify={onVerifyMock}
        onSaveBackupCodes={onSaveBackupCodesMock}
        {...props}
      />
    );

  it("renders initial QR setup step", () => {
    renderComponent();

    expect(screen.getByText("Set Up Two-Factor Authentication")).toBeInTheDocument();
    expect(screen.getByText("Set Up Authenticator App")).toBeInTheDocument();
    expect(
      screen.getByText(/Scan this QR code with your authenticator app/i)
    ).toBeInTheDocument();

    const qrImg = screen.getByAltText("QR Code for 2FA setup") as HTMLImageElement;
    expect(qrImg).toBeInTheDocument();
  });

  it("navigates from QR to Manual step when 'Enter Code Manually' is clicked", async () => {
    const user = userEvent.setup();
    renderComponent({ secretKey: "TESTSECRET" });

    await user.click(screen.getByRole("button", { name: /enter code manually/i }));

    expect(screen.getByText("Enter Code Manually")).toBeInTheDocument();
    expect(
      screen.getByText(/If you can't scan the QR code, enter this secret key manually/i)
    ).toBeInTheDocument();
    // Manual code (grouped secret) should be visible
    expect(screen.getByText(/TEST/i)).toBeInTheDocument();
  });

  it("navigates from Manual to Backup step and shows backup codes", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: /enter code manually/i }));
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByText("Save Your Backup Codes")).toBeInTheDocument();
    // One of the default backup codes
    expect(screen.getByText("1234-5678")).toBeInTheDocument();
  });

  it("copies a single backup code when copy button is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: /continue/i }));

    // Find the first backup code row and its copy button
    const firstCodeRow = screen.getByText("1234-5678").closest("div") as HTMLElement;
    const copyButton = firstCodeRow.querySelector("button") as HTMLButtonElement;

    // Initially, the icon should be the generic copy icon
    expect(within(copyButton).getByTestId("icon-copy")).toBeInTheDocument();

    await user.click(copyButton);

    // After click, the icon should switch to the check icon (copied state)
    await waitFor(() => {
      expect(within(copyButton).getByTestId("icon-check")).toBeInTheDocument();
    });
  });

  it("copies all backup codes when 'Copy All' is clicked", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: /continue/i }));

    const copyAllButton = screen.getByRole("button", { name: /copy all/i });
    await user.click(copyAllButton);

    // Label should change to 'Copied!' after click
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /copied!/i })).toBeInTheDocument();
    });
  });

  it("keeps Verify button disabled when verification code is incomplete", async () => {
    const user = userEvent.setup();
    renderComponent();

    // Go to backup → verify
    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /i've saved my codes/i }));

    const verifyButton = screen.getByRole("button", { name: /verify & complete setup/i });

    // With no digits entered, button should remain disabled and handler not invoked
    expect(verifyButton).toBeDisabled();
  });

  it("calls onVerify and onSaveBackupCodes on successful verification", async () => {
    const user = userEvent.setup();

    onVerifyMock.mockResolvedValue({ success: true, message: "ok" });

    renderComponent();

    // QR → Backup → Verify
    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /i've saved my codes/i }));

    const inputs = screen.getAllByRole("textbox");
    // There may be other inputs; restrict to 6 OTP inputs by length
    const otpInputs = inputs.slice(0, 6);

    for (let i = 0; i < otpInputs.length; i++) {
      await user.type(otpInputs[i], String(i + 1));
    }

    await user.click(screen.getByRole("button", { name: /verify & complete setup/i }));

    await waitFor(() => {
      expect(onVerifyMock).toHaveBeenCalledWith("123456");
      expect(onSaveBackupCodesMock).toHaveBeenCalled();
      expect(
        screen.getByText(/Two-Factor Authentication Enabled!/i)
      ).toBeInTheDocument();
    });
  });

  it("shows verification error if onVerify returns failure", async () => {
    const user = userEvent.setup();

    onVerifyMock.mockResolvedValue({ success: false, message: "Invalid code" });

    renderComponent();

    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /i've saved my codes/i }));

    const inputs = screen.getAllByRole("textbox");
    const otpInputs = inputs.slice(0, 6);

    for (let i = 0; i < otpInputs.length; i++) {
      await user.type(otpInputs[i], "1");
    }

    await user.click(screen.getByRole("button", { name: /verify & complete setup/i }));

    await waitFor(() => {
      expect(onVerifyMock).toHaveBeenCalled();
      expect(screen.getByText(/invalid code/i)).toBeInTheDocument();
    });
  });
});
