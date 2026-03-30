import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { Spinner } from ".";

describe("Spinner", () => {
  describe("default variant", () => {
    it("renders a div with animate-spin", () => {
      const { container } = render(<Spinner />);
      expect(container.firstChild).toHaveClass("animate-spin");
    });

    it("applies size via inline style", () => {
      const { container } = render(<Spinner size={60} />);
      expect(container.firstChild).toHaveStyle({ width: "60px", height: "60px" });
    });

    it("applies thickness via borderWidth", () => {
      const { container } = render(<Spinner thickness={6} />);
      expect(container.firstChild).toHaveStyle({ borderWidth: "6px" });
    });

    it("applies custom className", () => {
      const { container } = render(<Spinner className="my-spinner" />);
      expect(container.firstChild).toHaveClass("my-spinner");
    });
  });

  describe("bars variant", () => {
    it("renders 8 bar elements", () => {
      const { container } = render(<Spinner variant="bars" size={48} />);
      const bars = container.querySelectorAll("div > div");
      expect(bars).toHaveLength(9);
    });

    it("applies size to the container", () => {
      const { container } = render(<Spinner variant="bars" size={64} />);
      expect(container.firstChild).toHaveStyle({ width: "64px", height: "64px" });
    });

    it("applies custom className to the container", () => {
      const { container } = render(<Spinner variant="bars" className="bar-spinner" />);
      expect(container.firstChild).toHaveClass("bar-spinner");
    });
  });

  describe("dots-bounce variant", () => {
    it("renders 5 dot elements", () => {
      const { container } = render(<Spinner variant="dots-bounce" thickness={10} />);
      const children = container.firstChild!.childNodes;
      expect(children.length).toBe(6); 
    });

    it("applies custom className to the container", () => {
      const { container } = render(<Spinner variant="dots-bounce" className="dots-spinner" />);
      expect(container.firstChild).toHaveClass("dots-spinner");
    });

    it("uses thickness to set dot size", () => {
      const { container } = render(<Spinner variant="dots-bounce" thickness={16} />);

      const allChildren = Array.from(
        container.querySelector("div")!.children
      ) as HTMLElement[];

      const dots = allChildren.slice(1);

      expect(dots).toHaveLength(5);

      dots.forEach((dot) => {
        expect(dot.style.width).toBe("16px");
        expect(dot.style.height).toBe("16px");
      });
    });
  });
});
