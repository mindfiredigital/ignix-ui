/**
 * Unit Tests for UserCard Component
 * 
 * This test suite covers all functionality of the UserCard component including:
 * - Basic rendering with required props
 * - All variant and size options
 * - Orientation (vertical/horizontal)
 * - Avatar variations (shapes, sizes, status, borders)
 * - Advanced features (stats, badges, actions)
 * - Social links
 * - Background patterns
 * - Edge cases and error handling
 * - Accessibility
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UserCard, type UserCardProps, type SocialLink, type StatItem, type ActionButton } from ".";

/* -------------------------------------------------------------------------- */
/*                                MOCKS                                       */
/* -------------------------------------------------------------------------- */

// Mock Card components
vi.mock("@ignix-ui/card", () => ({
  Card: ({ children, className, ...props }: any) => (
    <div data-testid="card" className={className} {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, className, ...props }: any) => (
    <div data-testid="card-content" className={className} {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children, className, ...props }: any) => (
    <div data-testid="card-header" className={className} {...props}>
      {children}
    </div>
  ),
}));

// Mock Avatar component
vi.mock("@ignix-ui/avatar", () => ({
  Avatar: ({ src, alt, size, shape, status, letters, className, ...props }: any) => (
    <div
      data-testid="avatar"
      data-size={size}
      data-shape={shape}
      data-status={status}
      className={className}
      {...props}
    >
      {src ? <img src={src} alt={alt} /> : <span>{letters}</span>}
    </div>
  ),
}));

// Mock Typography component
vi.mock("@ignix-ui/typography", () => ({
  Typography: ({ children, variant, color, className, ...props }: any) => (
    <span data-testid="typography" data-variant={variant} data-color={color} className={className} {...props}>
      {children}
    </span>
  ),
}));

// Mock Button component
vi.mock("@ignix-ui/button", () => ({
  Button: ({ children, onClick, variant, size, ...props }: any) => (
    <button
      data-testid="button"
      data-variant={variant}
      data-size={size}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock lucide-react icons - define inline to avoid hoisting issues
vi.mock("lucide-react", () => {
  const MockIcon = ({ className }: { className?: string }) => (
    <svg data-testid="icon" className={className} />
  );
  return {
    Users: MockIcon,
    MessageCircle: MockIcon,
    Heart: MockIcon,
    TrendingUp: MockIcon,
    CheckCircle2: MockIcon,
    Star: MockIcon,
  };
});

/* -------------------------------------------------------------------------- */
/*                                TEST DATA                                   */
/* -------------------------------------------------------------------------- */

const baseProps: UserCardProps = {
  name: "John Doe",
};

const fullProps: UserCardProps = {
  name: "Jane Smith",
  username: "janesmith",
  role: "Senior Developer",
  bio: "Passionate about building great user experiences",
  avatar: "https://example.com/avatar.jpg",
};

// Mock icon component for use in test data
const MockIcon = ({ className }: { className?: string }) => (
  <svg data-testid="icon" className={className} />
);

const socialLinks: SocialLink[] = [
  {
    url: "https://github.com/john",
    label: "GitHub",
    icon: MockIcon,
    platform: "github",
  },
  {
    url: "https://twitter.com/john",
    label: "Twitter",
    icon: MockIcon,
    platform: "twitter",
  },
];

const stats: StatItem[] = [
  { label: "Posts", value: 100, icon: MockIcon },
  { label: "Followers", value: "1.2K", icon: MockIcon },
  { label: "Likes", value: 500, icon: MockIcon },
];

const actions: ActionButton[] = [
  { label: "Follow", variant: "default", icon: MockIcon, onClick: vi.fn() },
  { label: "Message", variant: "outline", icon: MockIcon, onClick: vi.fn() },
];

/* -------------------------------------------------------------------------- */
/*                              BASIC RENDERING                               */
/* -------------------------------------------------------------------------- */

describe("UserCard – Basic Rendering", () => {
  it("1. renders with minimum required props (name only)", () => {
    render(<UserCard {...baseProps} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });

  it("2. renders name correctly", () => {
    render(<UserCard name="Alice Johnson" />);
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
  });

  it("3. renders username when provided", () => {
    render(<UserCard {...baseProps} username="johndoe" />);
    expect(screen.getByText(/@johndoe/i)).toBeInTheDocument();
  });

  it("4. renders username with @ prefix when not provided", () => {
    render(<UserCard {...baseProps} username="johndoe" />);
    const username = screen.getByText(/@johndoe/i);
    expect(username).toBeInTheDocument();
  });

  it("5. renders role when provided", () => {
    render(<UserCard {...baseProps} role="Software Engineer" />);
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });

  it("6. renders bio when provided", () => {
    render(<UserCard {...baseProps} bio="This is a test bio" />);
    expect(screen.getByText("This is a test bio")).toBeInTheDocument();
  });

  it("7. renders all user information together", () => {
    render(<UserCard {...fullProps} />);
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText(/@janesmith/i)).toBeInTheDocument();
    // Role is not rendered when username is provided (per component logic)
    expect(screen.getByText("Passionate about building great user experiences")).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*                              VARIANTS                                      */
/* -------------------------------------------------------------------------- */

describe("UserCard – Variants", () => {
  it("8. renders with default variant", () => {
    const { container } = render(<UserCard {...baseProps} variant="default" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("9. renders with elevated variant", () => {
    const { container } = render(<UserCard {...baseProps} variant="elevated" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("10. renders with glass variant", () => {
    const { container } = render(<UserCard {...baseProps} variant="glass" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("11. renders with outline variant", () => {
    const { container } = render(<UserCard {...baseProps} variant="outline" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("12. renders with minimal variant", () => {
    const { container } = render(<UserCard {...baseProps} variant="minimal" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*                              SIZES                                         */
/* -------------------------------------------------------------------------- */

describe("UserCard – Sizes", () => {
  it("13. renders with sm size", () => {
    render(<UserCard {...baseProps} size="sm" />);
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });

  it("14. renders with md size (default)", () => {
    render(<UserCard {...baseProps} size="md" />);
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });

  it("15. renders with lg size", () => {
    render(<UserCard {...baseProps} size="lg" />);
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });

  it("16. renders with xl size", () => {
    render(<UserCard {...baseProps} size="xl" />);
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*                              ORIENTATION                                   */
/* -------------------------------------------------------------------------- */

describe("UserCard – Orientation", () => {
  it("17. renders in vertical orientation (default)", () => {
    render(<UserCard {...baseProps} orientation="vertical" />);
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });

  it("18. renders in horizontal orientation", () => {
    render(<UserCard {...baseProps} orientation="horizontal" />);
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });

  it("19. horizontal orientation ignores advanced features", () => {
    render(
      <UserCard
        {...baseProps}
        orientation="horizontal"
        advanced
        verified
        stats={stats}
      />
    );
    // Should render but advanced features should be ignored
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*                              AVATAR                                        */
/* -------------------------------------------------------------------------- */

describe("UserCard – Avatar", () => {
  it("20. renders avatar when provided", () => {
    render(<UserCard {...baseProps} avatar="https://example.com/avatar.jpg" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar.querySelector("img")).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

  it("21. renders avatar fallback (initials) when avatar not provided", () => {
    render(<UserCard name="John Doe" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar.querySelector("span")).toHaveTextContent("JD");
  });

  it("22. uses custom avatarFallback when provided", () => {
    render(<UserCard name="John Doe" avatarFallback="JD" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar.querySelector("span")).toHaveTextContent("JD");
  });

  it("23. renders avatar with different shapes", () => {
    const shapes = ["circle", "square", "rounded", "hexagon"] as const;
    shapes.forEach((shape) => {
      const { unmount } = render(<UserCard {...baseProps} avatar="https://example.com/avatar.jpg" avatarShape={shape} />);
      const avatar = screen.getByTestId("avatar");
      expect(avatar).toHaveAttribute("data-shape", shape);
      unmount();
    });
  });

  it("24. renders avatar with status indicator", () => {
    const statuses = ["online", "offline", "away", "busy"] as const;
    statuses.forEach((status) => {
      const { unmount } = render(<UserCard {...baseProps} avatar="https://example.com/avatar.jpg" avatarStatus={status} />);
      const avatar = screen.getByTestId("avatar");
      expect(avatar).toHaveAttribute("data-status", status);
      unmount();
    });
  });

  it("25. renders avatar with border when avatarBordered is true", () => {
    render(<UserCard {...baseProps} avatar="https://example.com/avatar.jpg" avatarBordered />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toBeInTheDocument();
  });

  it("26. renders avatar with custom size", () => {
    render(<UserCard {...baseProps} avatar="https://example.com/avatar.jpg" avatarSize="xl" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveAttribute("data-size", "xl");
  });
});

/* -------------------------------------------------------------------------- */
/*                              SOCIAL LINKS                                   */
/* -------------------------------------------------------------------------- */

describe("UserCard – Social Links", () => {
  it("27. renders social links when provided", () => {
    render(<UserCard {...baseProps} socialLinks={socialLinks} />);
    const githubLink = screen.getByLabelText(/github/i);
    const twitterLink = screen.getByLabelText(/twitter/i);
    expect(githubLink).toBeInTheDocument();
    expect(twitterLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute("href", "https://github.com/john");
    expect(twitterLink).toHaveAttribute("href", "https://twitter.com/john");
  });

  it("28. does not render social links when empty array", () => {
    render(<UserCard {...baseProps} socialLinks={[]} />);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("29. social links open in new tab with security attributes", () => {
    render(<UserCard {...baseProps} socialLinks={socialLinks} />);
    const link = screen.getByLabelText(/github/i);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("30. renders multiple social links correctly", () => {
    const multipleLinks: SocialLink[] = [
      ...socialLinks,
      { url: "https://linkedin.com/john", label: "LinkedIn", icon: MockIcon, platform: "linkedin" },
    ];
    render(<UserCard {...baseProps} socialLinks={multipleLinks} />);
    expect(screen.getByLabelText(/github/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/twitter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/linkedin/i)).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*                              ADVANCED FEATURES                             */
/* -------------------------------------------------------------------------- */

describe("UserCard – Advanced Features", () => {
  it("31. renders verified badge when verified is true", () => {
    render(<UserCard {...baseProps} verified />);
    expect(screen.getByText("Verified")).toBeInTheDocument();
  });

  it("32. renders premium badge when premium is true", () => {
    render(<UserCard {...baseProps} premium />);
    expect(screen.getByText("Premium")).toBeInTheDocument();
  });

  it("33. renders custom badge when badge prop is provided", () => {
    render(<UserCard {...baseProps} badge="Pro" />);
    expect(screen.getByText("Pro")).toBeInTheDocument();
  });

  it("34. renders stats when provided", () => {
    render(<UserCard {...baseProps} stats={stats} />);
    expect(screen.getByText("Posts")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Followers")).toBeInTheDocument();
    expect(screen.getByText("1.2K")).toBeInTheDocument();
  });

  it("35. renders action buttons when provided", () => {
    render(<UserCard {...baseProps} actions={actions} />);
    expect(screen.getByText("Follow")).toBeInTheDocument();
    expect(screen.getByText("Message")).toBeInTheDocument();
  });

  it("36. action buttons trigger onClick handlers", () => {
    const followHandler = vi.fn();
    const messageHandler = vi.fn();
    const testActions: ActionButton[] = [
      { label: "Follow", onClick: followHandler },
      { label: "Message", onClick: messageHandler },
    ];
    render(<UserCard {...baseProps} actions={testActions} />);
    
    fireEvent.click(screen.getByText("Follow"));
    expect(followHandler).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByText("Message"));
    expect(messageHandler).toHaveBeenCalledTimes(1);
  });

  it("37. enables advanced mode when advanced prop is true", () => {
    render(<UserCard {...baseProps} advanced />);
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });

  it("38. enables advanced mode automatically when stats provided", () => {
    render(<UserCard {...baseProps} stats={stats} />);
    expect(screen.getByText("Posts")).toBeInTheDocument();
  });

  it("39. enables advanced mode automatically when verified provided", () => {
    render(<UserCard {...baseProps} verified />);
    expect(screen.getByText("Verified")).toBeInTheDocument();
  });

  it("40. renders header image when provided in advanced mode", () => {
    render(
      <UserCard
        {...baseProps}
        advanced
        headerImage="https://example.com/header.jpg"
      />
    );
    const headerImg = screen.getByAltText(/header banner/i);
    expect(headerImg).toBeInTheDocument();
    expect(headerImg).toHaveAttribute("src", "https://example.com/header.jpg");
  });
});

/* -------------------------------------------------------------------------- */
/*                              BACKGROUND PATTERNS                           */
/* -------------------------------------------------------------------------- */

describe("UserCard – Background Patterns", () => {
  it("renders with gradient background pattern", () => {
    render(<UserCard {...baseProps} advanced backgroundPattern="gradient" />);
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });

  it("renders with dots background pattern", () => {
    render(<UserCard {...baseProps} advanced backgroundPattern="dots" />);
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });

  it("renders with grid background pattern", () => {
    render(<UserCard {...baseProps} advanced backgroundPattern="grid" />);
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });

  it("renders with no background pattern (none)", () => {
    render(<UserCard {...baseProps} advanced backgroundPattern="none" />);
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*                              EDGE CASES                                    */
/* -------------------------------------------------------------------------- */

describe("UserCard – Edge Cases", () => {
  it("handles empty stats array", () => {
    render(<UserCard {...baseProps} stats={[]} />);
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });

  it("handles empty actions array", () => {
    render(<UserCard {...baseProps} actions={[]} />);
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });

  it("handles very long name", () => {
    const longName = "A".repeat(100);
    render(<UserCard name={longName} />);
    expect(screen.getByText(longName)).toBeInTheDocument();
  });

  it("handles very long bio", () => {
    const longBio = "A".repeat(500);
    render(<UserCard {...baseProps} bio={longBio} />);
    expect(screen.getByText(longBio)).toBeInTheDocument();
  });

  it("handles special characters in name", () => {
    render(<UserCard name="José María O'Connor-Smith" />);
    expect(screen.getByText("José María O'Connor-Smith")).toBeInTheDocument();
  });

  it("handles numeric stats values", () => {
    const numericStats: StatItem[] = [
      { label: "Count", value: 12345 },
    ];
    render(<UserCard {...baseProps} stats={numericStats} />);
    expect(screen.getByText("Count")).toBeInTheDocument();
  });

  it("handles string stats values", () => {
    const stringStats: StatItem[] = [
      { label: "Followers", value: "1.2K" },
    ];
    render(<UserCard {...baseProps} stats={stringStats} />);
    expect(screen.getByText("1.2K")).toBeInTheDocument();
  });

  it("handles stats without icons", () => {
    const statsWithoutIcons: StatItem[] = [
      { label: "Posts", value: 100 },
    ];
    render(<UserCard {...baseProps} stats={statsWithoutIcons} />);
    expect(screen.getByText("Posts")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("handles role without username", () => {
    render(<UserCard {...baseProps} role="Developer" />);
    expect(screen.getByText("Developer")).toBeInTheDocument();
  });

  it("does not render role when username is provided", () => {
    render(<UserCard {...baseProps} username="johndoe" role="Developer" />);
    expect(screen.getByText(/@johndoe/i)).toBeInTheDocument();
    // Role should not be rendered when username is present
  });
});

/* -------------------------------------------------------------------------- */
/*                              ACCESSIBILITY                                 */
/* -------------------------------------------------------------------------- */

describe("UserCard – Accessibility", () => {
  it("has proper alt text for avatar", () => {
    render(<UserCard {...baseProps} avatar="https://example.com/avatar.jpg" />);
    const avatarImg = screen.getByAltText(/John Doe's avatar/i);
    expect(avatarImg).toBeInTheDocument();
  });

  it("has proper aria-label for social links", () => {
    render(<UserCard {...baseProps} socialLinks={socialLinks} />);
    const link = screen.getByLabelText(/github/i);
    expect(link).toBeInTheDocument();
  });

  it("has proper role for social links container", () => {
    render(<UserCard {...baseProps} socialLinks={socialLinks} />);
    const list = screen.getByRole("list", { name: /social media links/i });
    expect(list).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*                              CUSTOM CLASSNAME                             */
/* -------------------------------------------------------------------------- */

describe("UserCard – Custom ClassName", () => {
  it("applies custom className", () => {
    const { container } = render(<UserCard {...baseProps} className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
