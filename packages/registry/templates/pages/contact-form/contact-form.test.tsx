// contact-form.test.tsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { ContactForm } from ".";

/* ================= MOCKS ================= */

// framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      return <div {...props}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,

  useMotionValue: () => 0,
  useSpring: () => 0,
  useTransform: () => 0,
}));

/* ================= INPUT ================= */
vi.mock('@ignix-ui/input', () => ({
  __esModule: true,
  default: ({ value, onChange, placeholder, type }: any) => (
    <input
      type={type || 'text'}
      value={value || ''}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
}));

/* ================= TEXTAREA ================= */
vi.mock("@ignix-ui/textarea", () => ({
  __esModule: true,
  default: ({ value, onChange, placeholder }: any) => (
    <textarea
      data-testid="textarea"
      value={value || ""}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
}));

/* ================= BUTTON ================= */
vi.mock("@ignix-ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

/* ================= FILE UPLOAD ================= */
vi.mock("@ignix-ui/file-upload", () => ({
  default: ({ onFilesChange }: any) => (
    <input
      data-testid="file"
      type="file"
      onChange={(e: any) => onFilesChange?.(e.target.files)}
    />
  ),
}));

/* ================= ICONS ================= */
vi.mock('@radix-ui/react-icons', () => ({
  ExclamationTriangleIcon: () => <div data-testid="exclamation-triangle-icon">⚠️</div>,
  InfoCircledIcon: () => <div data-testid="info-icon">ℹ️</div>,
  AlertCircle: () => <div data-testid="alert-circle-icon">❗</div>,
}));


const mockToast = {
  addToast: vi.fn(),
};

vi.mock("@ignix-ui/toast/use-toast", () => ({
  useToast: () => mockToast,
}));

/* ================= TEST SETUP ================= */

const setup = (props = {}) => {
  const defaultProps = {
    variant: "default" as const,
    onSubmit: vi.fn().mockResolvedValue(undefined),
  };
  return render(
    <ContactForm {...defaultProps} {...props}>
      <ContactForm.Header />
      <ContactForm.Content>
        <ContactForm.Field name="name" label="Name" />
        <ContactForm.Field name="email" label="Email" />
        <ContactForm.Field name="subject" label="Subject" />
        <ContactForm.Textarea name="message" />
        <ContactForm.FileUpload />
      </ContactForm.Content>
      <ContactForm.Actions />
    </ContactForm>
  );
};

/* ================= TESTS ================= */

describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders fields and submit button", () => {
    setup();

    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Subject")).toBeInTheDocument();
    expect(screen.getByText("Send Message")).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    setup();

    fireEvent.click(screen.getByText("Send Message"));

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(await screen.findByText("Subject is required")).toBeInTheDocument();
  });

  it("shows invalid email error", async () => {
    setup();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invalid" },
    });

    fireEvent.click(screen.getByText("Send Message"));

    expect(
      await screen.findByText("Enter a valid email address")
    ).toBeInTheDocument();
  });

  it("calls onSubmit and onSuccess", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onSuccess = vi.fn();

    setup({ onSubmit, onSuccess });

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Subject"), {
      target: { value: "Hello" },
    });

    fireEvent.click(screen.getByText("Send Message"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("shows success toast when onSuccess not provided", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    setup({ onSubmit });

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Subject"), {
      target: { value: "Hello" },
    });

    fireEvent.click(screen.getByText("Send Message"));
    await waitFor(() => {
      expect(mockToast.addToast).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Message sent successfully!",
        })
      );
    });
  });

  it("handles submit error and shows toast", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("fail"));

    setup({ onSubmit });

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Subject"), {
      target: { value: "Hello" },
    });

    fireEvent.click(screen.getByText("Send Message"));

    await waitFor(() => {
      expect(mockToast.addToast).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to send message. Please try again.",
        })
      );
    });
  });

  it("disables button while submitting", async () => {
    let resolvePromise: any;
    const onSubmit = vi.fn(
      () =>
        new Promise((res) => {
          resolvePromise = res;
        })
    );

    setup({ onSubmit });

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Subject"), {
      target: { value: "Hello" },
    });

    fireEvent.click(screen.getByText("Send Message"));

    expect(screen.getByText("Sending...")).toBeDisabled();

    resolvePromise();

    await waitFor(() => {
      expect(screen.getByText("Send Message")).toBeInTheDocument();
    });
  });

  it("trims values before submit", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    setup({ onSubmit });

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "  John  " },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "  john@test.com  " },
    });
    fireEvent.change(screen.getByPlaceholderText("Subject"), {
      target: { value: "  Hello  " },
    });

    fireEvent.click(screen.getByText("Send Message"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "John",
          email: "john@test.com",
          subject: "Hello",
        })
      );
    });
  });

  it("clears error when user types", async () => {
    setup();

    fireEvent.click(screen.getByText("Send Message"));

    expect(await screen.findByText("Name is required")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John" },
    });

    await waitFor(() => {
      expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
    });
  });
});