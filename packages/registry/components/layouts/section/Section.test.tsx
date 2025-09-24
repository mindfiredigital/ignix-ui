import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import React from "react";
import { Section } from ".";

describe("<Section />", () => {
  it("renders children correctly", () => {
    render(<Section>hello world</Section>);
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });

  it("applies default spacing class", () => {
    const { container } = render(<Section>content</Section>);
    expect(container.firstChild).toHaveClass("my-8");
  });

  it("applies spacing classes", () => {
    const { container } = render(<Section spacing="large">content</Section>);
    expect(container.firstChild).toHaveClass("my-12");
  });

  it("applies custom spacing as number (px)", () => {
    const { container } = render(<Section spacing={16 as any}>content</Section>);
    expect(container.firstChild).toHaveStyle({ marginTop: "16px", marginBottom: "16px" });
  });

  it("applies custom spacing as string", () => {
    const { container } = render(<Section spacing="2rem">content</Section>);
    expect(container.firstChild).toHaveStyle({ margin: "2rem" });
  });

  it("applies default padding class", () => {
    const { container } = render(<Section>content</Section>);
    expect(container.firstChild).toHaveClass("p-6");
  });

  it("applies padding classes", () => {
    const { container } = render(<Section padding="generous">content</Section>);
    expect(container.firstChild).toHaveClass("p-12");
  });

  it("applies custom padding as number (px)", () => {
    const { container } = render(<Section padding={20 as any}>content</Section>);
    expect(container.firstChild).toHaveStyle({ padding: "20px" });
  });

  it("applies custom padding as string", () => {
    const { container } = render(<Section padding="1.5rem">content</Section>);
    expect(container.firstChild).toHaveStyle({ padding: "1.5rem" });
  });

  it("applies background classes", () => {
    const { container } = render(<Section background="white">content</Section>);
    expect(container.firstChild).toHaveClass("bg-white", "dark:bg-gray-900");
  });

  it("applies no background when background is none", () => {
    const { container } = render(<Section background="none">content</Section>);
    expect(container.firstChild).not.toHaveClass("bg");
  });

  it("applies maxWidth predefined class", () => {
    const { container } = render(<Section maxWidth="lg">content</Section>);
    expect(container.firstChild).toHaveClass("max-w-lg");
  });

  it("applies custom maxWidth as number (px)", () => {
    const { container } = render(<Section maxWidth={800 as any}>content</Section>);
    expect(container.firstChild).toHaveStyle({ maxWidth: "800px" });
  });

  it("applies custom maxWidth as string", () => {
    const { container } = render(<Section maxWidth="1200px">content</Section>);
    expect(container.firstChild).toHaveStyle({ maxWidth: "1200px" });
  });

  it("applies responsive horizontal padding", () => {
    const { container } = render(<Section>content</Section>);
    expect(container.firstChild).toHaveClass("px-4", "sm:px-6", "lg:px-8");
  });

  it("centers content horizontally", () => {
    const { container } = render(<Section>content</Section>);
    expect(container.firstChild).toHaveClass("mx-auto");
  });

  it("applies custom className", () => {
    const { container } = render(<Section className="custom-class">content</Section>);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Section ref={ref}>content</Section>);
    expect(ref.current).toBeInTheDocument();
  });

  it("combines multiple props correctly", () => {
    const { container } = render(
      <Section 
        spacing="large" 
        padding="comfortable" 
        background="gray" 
        maxWidth="md"
        className="test-class"
      >
        content
      </Section>
    );
    
    expect(container.firstChild).toHaveClass("my-12", "p-10", "bg-gray-50", "dark:bg-gray-800", "max-w-md", "test-class");
  });

  it("handles empty children", () => {
    const { container } = render(<Section>{null}</Section>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("handles null children", () => {
    const { container } = render(<Section>{null}</Section>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("passes through additional props", () => {
    render(
      <Section data-testid="section-test">
        content
      </Section>
    );
  });

  it("handles custom spacing and padding together", () => {
    const { container } = render(
      <Section spacing={24 as any} padding={32 as any}>
        content
      </Section>
    );
    expect(container.firstChild).toHaveStyle({ 
      marginTop: "24px", 
      marginBottom: "24px", 
      padding: "32px" 
    });
  });

  it("handles custom maxWidth with other props", () => {
    const { container } = render(
      <Section maxWidth={1024 as any} background="slate" spacing="small">
        content
      </Section>
    );
    expect(container.firstChild).toHaveStyle({ maxWidth: "1024px" });
    expect(container.firstChild).toHaveClass("my-4", "bg-slate-50", "dark:bg-slate-900");
  });
});