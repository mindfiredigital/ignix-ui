import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Container } from "./index";

const getRoot = () => screen.getByTestId("container");

function renderContainer(props = {}, children = <span>content</span>) {
  return render(
    <Container data-testid="container" {...props}>
      {children}
    </Container>
  );
}

describe("Container rendering", () => {
  it("renders children", () => {
    renderContainer({}, <p>Hello World</p>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders a <div> by default", () => {
    renderContainer();
    expect(getRoot().tagName).toBe("DIV");
  });

  it("always carries the w-full class", () => {
    renderContainer();
    expect(getRoot()).toHaveClass("w-full");
  });
});

describe("Container size prop", () => {
  const cases: Array<[string, string]> = [
    ["small", "max-w-sm"],
    ["normal", "max-w-md"],
    ["large", "max-w-3xl"],
    ["full", "max-w-full"],
    ["readable", "max-w-prose"],
  ];

  it.each(cases)('size="%s" applies class "%s"', (size, expected) => {
    renderContainer({ size });
    expect(getRoot()).toHaveClass(expected);
  });

  it('defaults to size="normal" (max-w-md)', () => {
    renderContainer();
    expect(getRoot()).toHaveClass("max-w-md");
  });
});

describe("Container padding prop", () => {
  const cases: Array<[string, string]> = [
    ["none", "p-0"],
    ["small", "p-2"],
    ["normal", "p-4"],
    ["large", "p-6"],
    ["xl", "p-8"],
  ];

  it.each(cases)('padding="%s" applies class "%s"', (padding, expected) => {
    renderContainer({ padding });
    expect(getRoot()).toHaveClass(expected);
  });

  it('defaults to padding="normal" (p-4)', () => {
    renderContainer();
    expect(getRoot()).toHaveClass("p-4");
  });
});

describe("Container center prop", () => {
  it("applies mx-auto when center=true (default)", () => {
    renderContainer();
    expect(getRoot()).toHaveClass("mx-auto");
  });

  it("does NOT apply mx-auto when center=false", () => {
    renderContainer({ center: false });
    expect(getRoot()).not.toHaveClass("mx-auto");
  });
});

describe("Container responsive prop", () => {
  it("applies responsive padding classes when responsive=true (default)", () => {
    renderContainer();
    const el = getRoot();
    expect(el).toHaveClass("px-4");
    expect(el).toHaveClass("sm:px-6");
    expect(el).toHaveClass("lg:px-8");
  });

  it("omits responsive padding classes when responsive=false", () => {
    renderContainer({ responsive: false });
    const el = getRoot();
    expect(el).not.toHaveClass("px-4");
    expect(el).not.toHaveClass("sm:px-6");
    expect(el).not.toHaveClass("lg:px-8");
  });
});

describe("Container maxWidth prop (custom string)", () => {
  it("applies custom string as inline style", () => {
    renderContainer({ maxWidth: "720px" });
    expect(getRoot().style.maxWidth).toBe("720px");
  });

  it("applies a rem string as inline style", () => {
    renderContainer({ maxWidth: "48rem" });
    expect(getRoot().style.maxWidth).toBe("48rem");
  });
});