import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AIChatInput } from "./index";
import React from "react";

vi.mock("framer-motion", () => {
  const motion = new Proxy(
    {},
    {
      get: (_target, tag: string) =>
        React.forwardRef(({ children, ...rest }: any, ref) =>
          React.createElement(tag, { ...rest, ref }, children)
        ),
    }
  );

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

const Controlled = React.forwardRef<
  HTMLTextAreaElement,
  Partial<React.ComponentProps<typeof AIChatInput>>
>((props, ref) => {
  const [value, setValue] = React.useState(props.value ?? "");
  return (
    <AIChatInput
      ref={ref}
      value={value}
      onChange={setValue}
      onSend={vi.fn()}
      {...props}
    />
  );
});

describe("AIChatInput rendering", () => {
  it("renders without crashing", () => {
    render(<Controlled />);
    expect(screen.getByPlaceholderText("Message...")).toBeInTheDocument();
  });

  it("renders a custom placeholder", () => {
    render(<Controlled placeholder="Ask anything" />);
    expect(screen.getByPlaceholderText("Ask anything")).toBeInTheDocument();
  });

  it("renders the attachment slot", () => {
    render(<Controlled attachmentSlot={<button>Attach</button>} />);
    expect(screen.getByRole("button", { name: "Attach" })).toBeInTheDocument();
  });
});

describe("AIChatInput typing", () => {
  it("calls onChange as the user types", () => {
    render(<Controlled />);
    const textarea = screen.getByPlaceholderText("Message...");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    expect(textarea).toHaveValue("Hello");
  });
});

describe("AIChatInput Enter/Shift+Enter behavior", () => {
  it("sends the trimmed value on Enter", () => {
    const onSend = vi.fn();
    render(<Controlled value="  Hello world  " onSend={onSend} />);
    const textarea = screen.getByPlaceholderText("Message...");
    fireEvent.keyDown(textarea, { key: "Enter" });
    expect(onSend).toHaveBeenCalledWith("Hello world");
  });

  it("does not send on Shift+Enter", () => {
    const onSend = vi.fn();
    render(<Controlled value="Hello" onSend={onSend} />);
    const textarea = screen.getByPlaceholderText("Message...");
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });
    expect(onSend).not.toHaveBeenCalled();
  });

  it("does not send an empty/whitespace-only value on Enter", () => {
    const onSend = vi.fn();
    render(<Controlled value="   " onSend={onSend} />);
    const textarea = screen.getByPlaceholderText("Message...");
    fireEvent.keyDown(textarea, { key: "Enter" });
    expect(onSend).not.toHaveBeenCalled();
  });

  it("does not send on Enter while streaming", () => {
    const onSend = vi.fn();
    render(<Controlled value="Hello" onSend={onSend} isStreaming />);
    const textarea = screen.getByPlaceholderText("Message...");
    fireEvent.keyDown(textarea, { key: "Enter" });
    expect(onSend).not.toHaveBeenCalled();
  });

  it("calls a consumer-supplied onKeyDown before its own handling", () => {
    const onKeyDown = vi.fn();
    const onSend = vi.fn();
    render(<Controlled value="Hello" onSend={onSend} onKeyDown={onKeyDown} />);
    const textarea = screen.getByPlaceholderText("Message...");
    fireEvent.keyDown(textarea, { key: "Enter" });
    expect(onKeyDown).toHaveBeenCalled();
    expect(onSend).toHaveBeenCalledWith("Hello");
  });
});

describe("AIChatInput send/stop button", () => {
  it("shows a send button and calls onSend when clicked", () => {
    const onSend = vi.fn();
    render(<Controlled value="Hello" onSend={onSend} />);
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(onSend).toHaveBeenCalledWith("Hello");
  });

  it("disables the send button when the value is empty", () => {
    render(<Controlled value="" />);
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
  });

  it("shows a stop button instead of send while streaming", () => {
    const onStop = vi.fn();
    render(<Controlled value="Hello" isStreaming onStop={onStop} />);
    expect(screen.queryByRole("button", { name: "Send message" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Stop generating" }));
    expect(onStop).toHaveBeenCalled();
  });
});

describe("AIChatInput disabled state", () => {
  it("disables the textarea and send button", () => {
    render(<Controlled value="Hello" disabled />);
    expect(screen.getByPlaceholderText("Message...")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
  });
});

describe("AIChatInput variant prop", () => {
  it.each([
    ["default", "bg-background"],
    ["dark", "bg-[var(--color-dark-dropdown-bg)]"],
    ["glass", "backdrop-blur-xl"],
    ["minimal", "bg-transparent"],
  ] as const)('variant="%s" applies class "%s"', (variant, expectedClass) => {
    const { container } = render(<Controlled variant={variant} />);
    expect(container.firstElementChild?.className).toContain(expectedClass);
  });
});

describe("AIChatInput ref forwarding", () => {
  it("forwards a ref to the underlying textarea", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Controlled ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});

describe("AIChatInput displayName", () => {
  it("has correct displayName", () => {
    expect(AIChatInput.displayName).toBe("AIChatInput");
  });
});
