import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  TestimonialCard,
  TestimonialCardAuthor,
  TestimonialCardQuote,
  TestimonialCardSocialLinks,
} from ".";

// Type definitions for mock components
interface MockComponentProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
  variant?: string;
  'data-testid'?: string;
}

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: MockComponentProps) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));


/* -------------------------------------------------------------------------- */
/*                               TEST HELPERS                                 */
/* -------------------------------------------------------------------------- */

const renderBasicCard = (props = {}) =>
  render(
    <TestimonialCard {...props}>
      <TestimonialCardQuote>Great product!</TestimonialCardQuote>
      <TestimonialCardAuthor
        name="Michael Chen"
        title="CEO"
        company="InnovateLabs"
        avatar="avatar.jpg"
      />
    </TestimonialCard>
  );

/* -------------------------------------------------------------------------- */
/*                              CORE RENDERING                                */
/* -------------------------------------------------------------------------- */

describe("TestimonialCard – core rendering", () => {
  it("renders without crashing", () => {
    renderBasicCard();
    expect(screen.getByText("Great product!")).toBeInTheDocument();
  });

  it("applies default props correctly", () => {
    const { container } = renderBasicCard();
    expect(container.querySelector(".max-w-xl")).toBeInTheDocument(); // md size
  });

  it("accepts custom className", () => {
    const { container } = render(
      <TestimonialCard className="custom-class">
        <TestimonialCardQuote>Text</TestimonialCardQuote>
      </TestimonialCard>
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*                              SIZE VARIANTS                                 */
/* -------------------------------------------------------------------------- */

describe("TestimonialCard – size variants", () => {
  it.each([
    ["sm", "max-w-lg"],
    ["md", "max-w-xl"],
    ["lg", "max-w-2xl"],
  ])("applies correct width for size %s", (size, className) => {
    const { container } = renderBasicCard({ size });
    expect(container.querySelector(`.${className}`)).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*                              SPLIT LAYOUT                                  */
/* -------------------------------------------------------------------------- */

describe("TestimonialCard – split layout", () => {
  it("renders split layout when split=true", () => {
    const { container } = renderBasicCard({ split: true });
    expect(container.querySelector(".md\\:grid-cols-2")).toBeInTheDocument();
  });

  it("uses larger avatar size in split mode", () => {
    renderBasicCard({ split: true });
    expect(screen.getByAltText("Michael Chen")).toBeInTheDocument();
  });

  it("hides quote icon on small screens", () => {
    renderBasicCard({ split: true });
    expect(screen.queryByTestId("quote-icon")).not.toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*                          BACKGROUND IMAGE MODE                              */
/* -------------------------------------------------------------------------- */

describe("TestimonialCard – background image", () => {
  it("renders background image when provided", () => {
    renderBasicCard({
      backgroundImage: "bg.jpg",
      backgroundImageAlt: "Background",
    });

    expect(screen.getByAltText("Background")).toBeInTheDocument();
  });

  it("renders overlay content on top of background image", () => {
    renderBasicCard({ backgroundImage: "bg.jpg" });
    expect(screen.getByText("Great product!")).toBeInTheDocument();
  });

});

/* -------------------------------------------------------------------------- */
/*                              AUTHOR LOGIC                                  */
/* -------------------------------------------------------------------------- */

describe("TestimonialCardAuthor", () => {
  it("renders author name, title, and company", () => {
    renderBasicCard();
    expect(screen.getByText("Michael Chen")).toBeInTheDocument();
    expect(screen.getByText("CEO")).toBeInTheDocument();
    expect(screen.getByText("InnovateLabs")).toBeInTheDocument();
  });

  it("renders title and company on separate lines when split=true", () => {
    renderBasicCard({ split: true });
    const captions = screen.getAllByText(/CEO|InnovateLabs/);
    expect(captions.length).toBe(2);
  });

  it("centers author when avatarPosition=top", () => {
    const { container } = renderBasicCard({ avatarPosition: "top" });
    expect(container.querySelector(".text-center")).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*                              QUOTE COMPONENT                               */
/* -------------------------------------------------------------------------- */

describe("TestimonialCardQuote", () => {
  it("renders quote text", () => {
    renderBasicCard();
    expect(screen.getByText("Great product!")).toBeInTheDocument();
  });

  it("aligns text left when split=true", () => {
    renderBasicCard({ split: true });
    expect(screen.getByText("Great product!")).toHaveClass("text-left");
  });
});

/* -------------------------------------------------------------------------- */
/*                              SOCIAL LINKS                                  */
/* -------------------------------------------------------------------------- */

describe("TestimonialCardSocialLinks", () => {
  it("renders social links when provided", () => {
    const { container } = render(
      <TestimonialCard avatarPosition="top">
        <TestimonialCardSocialLinks>
          <a href="#">Twitter</a>
        </TestimonialCardSocialLinks>
      </TestimonialCard>
    );
    expect(container.querySelector(".justify-center")).toBeInTheDocument();
  });

  it("centers social links when avatarPosition=top", () => {
    const { container } = render(
      <TestimonialCard avatarPosition="top">
        <TestimonialCardSocialLinks>
          <a href="#">LinkedIn</a>
        </TestimonialCardSocialLinks>
      </TestimonialCard>
    );
    expect(container.querySelector(".justify-center")).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*                           CONTEXT SAFETY                                   */
/* -------------------------------------------------------------------------- */

describe("Context safety", () => {
  it("throws error when sub-component used outside TestimonialCard", () => {
    expect(() =>
      render(<TestimonialCardQuote>Invalid</TestimonialCardQuote>)
    ).toThrow();
  });
});

/* -------------------------------------------------------------------------- */
/*                               ADDITIONAL TESTS                             */
/* -------------------------------------------------------------------------- */

describe("TestimonialCard – additional cases", () => {
  it("renders author avatar when avatar prop is provided", () => {
    render(
      <TestimonialCard>
        <TestimonialCardAuthor
          name="Jane Doe"
          avatar="avatar.jpg"
        />
      </TestimonialCard>
    );

    expect(screen.getByAltText("Jane Doe")).toBeInTheDocument();
  });

  it("does not render avatar when avatar prop is missing", () => {
    render(
      <TestimonialCard>
        <TestimonialCardAuthor name="Jane Doe" />
      </TestimonialCard>
    );

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders company name when title is missing", () => {
    render(
      <TestimonialCard>
        <TestimonialCardAuthor
          name="Jane Doe"
          company="Acme Corp"
        />
      </TestimonialCard>
    );

    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
  });

  it("renders title and company on separate lines when split=true", () => {
    render(
      <TestimonialCard split>
        <TestimonialCardAuthor
          name="Jane Doe"
          title="CTO"
          company="Acme Corp"
        />
      </TestimonialCard>
    );

    expect(screen.getByText("CTO")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
  });

  it("renders background image when backgroundImage prop is provided", () => {
    render(
      <TestimonialCard backgroundImage="bg.jpg">
        <TestimonialCardQuote>Test quote</TestimonialCardQuote>
      </TestimonialCard>
    );

    expect(screen.getByAltText("Testimonial background")).toBeInTheDocument();
  });

  it("renders quote text inside background image layout", () => {
    render(
      <TestimonialCard backgroundImage="bg.jpg">
        <TestimonialCardQuote>Overlay quote</TestimonialCardQuote>
      </TestimonialCard>
    );

    expect(screen.getByText("Overlay quote")).toBeInTheDocument();
  });

  it("renders children content not matching known subcomponents", () => {
    render(
      <TestimonialCard>
        <div>Custom content</div>
      </TestimonialCard>
    );

    expect(screen.getByText("Custom content")).toBeInTheDocument();
  });

  it("uses author fullImage over card fullImage when both are provided", () => {
    render(
      <TestimonialCard fullImage="card.jpg">
        <TestimonialCardAuthor
          name="Jane Doe"
          fullImage="author.jpg"
        />
      </TestimonialCard>
    );

    expect(screen.getByAltText("Testimonial image")).toHaveAttribute(
      "src",
      "author.jpg"
    );
  });

  describe("TestimonialCard – additional coverage", () => {
    it("renders without crashing when only quote is provided", () => {
      render(
        <TestimonialCard>
          <TestimonialCardQuote>Simple testimonial</TestimonialCardQuote>
        </TestimonialCard>
      );

      expect(screen.getByText("Simple testimonial")).toBeInTheDocument();
    });

    it("does not render author section when author is not provided", () => {
      render(
        <TestimonialCard>
          <TestimonialCardQuote>No author here</TestimonialCardQuote>
        </TestimonialCard>
      );

      expect(screen.queryByText(/CEO|Designer|Engineer/i)).toBeNull();
    });

    it("renders company and title on separate lines when split=true", () => {
      render(
        <TestimonialCard split>
          <TestimonialCardAuthor
            name="Jane Doe"
            title="CTO"
            company="Tech Corp"
          />
        </TestimonialCard>
      );

      expect(screen.getByText("CTO")).toBeInTheDocument();
      expect(screen.getByText("Tech Corp")).toBeInTheDocument();
    });

    it("applies correct max-width class for lg size", () => {
      const { container } = render(
        <TestimonialCard size="lg">
          <TestimonialCardQuote>Large card</TestimonialCardQuote>
        </TestimonialCard>
      );

      expect(container.firstChild).toHaveClass("max-w-2xl");
    });

    it("does not render rating section when no rating child exists", () => {
      render(
        <TestimonialCard>
          <TestimonialCardQuote>No rating</TestimonialCardQuote>
        </TestimonialCard>
      );

      expect(screen.queryByLabelText(/rating/i)).toBeNull();
    });

    it("keeps quote centered when avatarPosition is top and split=false", () => {
      const { container } = render(
        <TestimonialCard avatarPosition="top">
          <TestimonialCardQuote>Centered quote</TestimonialCardQuote>
        </TestimonialCard>
      );

      expect(container.querySelector(".text-center")).toBeTruthy();
    });

    it("renders split layout with two columns on desktop", () => {
      const { container } = render(
        <TestimonialCard split>
          <TestimonialCardAuthor name="Alex" />
          <TestimonialCardQuote>Split content</TestimonialCardQuote>
        </TestimonialCard>
      );

      expect(container.querySelector(".md\\:grid-cols-2")).toBeTruthy();
    });

    it("renders background image when backgroundImage prop is provided", () => {
      render(
        <TestimonialCard backgroundImage="https://example.com/bg.jpg">
          <TestimonialCardQuote>With background</TestimonialCardQuote>
        </TestimonialCard>
      );

      expect(
        screen.getByAltText(/testimonial background/i)
      ).toBeInTheDocument();
    });
  });

});
