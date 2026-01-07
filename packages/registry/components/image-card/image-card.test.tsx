import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"

import { ImageCard } from "."
import { Play } from "lucide-react"

/* -------------------------------------------------------------------------- */
/*                                TEST DATA                                   */
/* -------------------------------------------------------------------------- */

const IMAGE_URL =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470"

const baseProps = {
  title: "Ocean Adventure",
  description: "Dive into the deep blue sea",
  image: IMAGE_URL,
}

vi.mock("@ignix-ui/aspect-ratio", () => ({
  AspectRatio: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
}))

vi.mock("@ignix-ui/lazyload", () => ({
  LazyLoad: ({ children }: any) => <>{children}</>,
}))

/* -------------------------------------------------------------------------- */
/*                              BASIC RENDERING                               */
/* -------------------------------------------------------------------------- */

describe("ImageCard – basic rendering", () => {
  it("renders title and description", () => {
    render(<ImageCard {...baseProps} />)

    expect(screen.getByText("Ocean Adventure")).toBeInTheDocument()
    expect(screen.getByText("Dive into the deep blue sea")).toBeInTheDocument()
  })

  it("renders image with alt text", () => {
    render(<ImageCard {...baseProps} />)

    const img = screen.getByAltText("Ocean Adventure")
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute("src", IMAGE_URL)
  })
})

/* -------------------------------------------------------------------------- */
/*                              IMAGE STATES                                  */
/* -------------------------------------------------------------------------- */

describe("ImageCard – image states", () => {
  it("shows fallback when image fails to load", () => {
    render(<ImageCard {...baseProps} />)

    const img = screen.getByAltText("Ocean Adventure")
    fireEvent.error(img)

    expect(screen.getByText("No image")).toBeInTheDocument()
  })
})

/* -------------------------------------------------------------------------- */
/*                              CATEGORY                                      */
/* -------------------------------------------------------------------------- */

describe("ImageCard – category", () => {
  it("renders category label", () => {
    render(
      <ImageCard
        {...baseProps}
        category="Travel"
      />
    )

    expect(screen.getByText("Travel")).toBeInTheDocument()
  })
})

/* -------------------------------------------------------------------------- */
/*                              BUTTON / LINKS                                */
/* -------------------------------------------------------------------------- */

describe("ImageCard – button behavior", () => {
  it("renders string button and triggers onAction", () => {
    const onAction = vi.fn()

    render(
      <ImageCard
        {...baseProps}
        button="Explore"
        onAction={onAction}
      />
    )

    const btn = screen.getByText("Explore")
    fireEvent.click(btn)

    expect(onAction).toHaveBeenCalledOnce()
  })

  it("renders icon-only buttons", () => {
    render(
      <ImageCard
        {...baseProps}
        mode="media"
        button={[
          {
            icon: Play,
            ariaLabel: "Play video",
          },
        ]}
      />
    )

    expect(screen.getByLabelText("Play video")).toBeInTheDocument()
  })
})

/* -------------------------------------------------------------------------- */
/*                              LAYOUT MODES                                  */
/* -------------------------------------------------------------------------- */

describe("ImageCard – layout modes", () => {
  it("renders below layout", () => {
    render(
      <ImageCard
        {...baseProps}
        layout="below"
      />
    )

    expect(screen.getByText("Ocean Adventure")).toBeInTheDocument()
  })

  it("renders media mode (top)", () => {
    render(
      <ImageCard
        {...baseProps}
        mode="media"
        mediaPosition="top"
      />
    )

    expect(screen.getByText("Ocean Adventure")).toBeInTheDocument()
    expect(screen.getByAltText("Ocean Adventure")).toBeInTheDocument()
  })

  it("renders media mode (left)", () => {
    render(
      <ImageCard
        {...baseProps}
        mode="media"
        mediaPosition="left"
      />
    )

    expect(screen.getByText("Ocean Adventure")).toBeInTheDocument()
  })
})

/* -------------------------------------------------------------------------- */
/*                        SIDE-BY-SIDE BELOW LAYOUT                            */
/* -------------------------------------------------------------------------- */

describe("ImageCard – side-by-side below layout", () => {
  it("renders image left when mediaPosition is left", () => {
    render(
      <ImageCard
        {...baseProps}
        layout="below"
        mediaPosition="left"
      />
    )

    expect(screen.getByAltText("Ocean Adventure")).toBeInTheDocument()
  })

  it("renders image right when mediaPosition is right", () => {
    render(
      <ImageCard
        {...baseProps}
        layout="below"
        mediaPosition="right"
      />
    )

    expect(screen.getByAltText("Ocean Adventure")).toBeInTheDocument()
  })
})

/* -------------------------------------------------------------------------- */
/*                           VARIANT & SIZE                                   */
/* -------------------------------------------------------------------------- */

describe("ImageCard – variant & size", () => {
  it("applies dark variant without crashing", () => {
    render(<ImageCard {...baseProps} variant="dark" />)
    expect(screen.getByText("Ocean Adventure")).toBeInTheDocument()
  })

  it("applies minimal variant", () => {
    render(<ImageCard {...baseProps} variant="minimal" />)
    expect(screen.getByText("Ocean Adventure")).toBeInTheDocument()
  })

  it("renders small size", () => {
    render(<ImageCard {...baseProps} size="sm" />)
    expect(screen.getByText("Ocean Adventure")).toBeInTheDocument()
  })

  it("renders extra large size", () => {
    render(<ImageCard {...baseProps} size="xl" />)
    expect(screen.getByText("Ocean Adventure")).toBeInTheDocument()
  })
})

/* -------------------------------------------------------------------------- */
/*                              CATEGORY ICON                                 */
/* -------------------------------------------------------------------------- */

describe("ImageCard – category icon", () => {
  it("renders custom category icon", () => {
    render(
      <ImageCard
        {...baseProps}
        category="Music"
        categoryIcon={<span data-testid="category-icon" />}
      />
    )

    expect(screen.getByTestId("category-icon")).toBeInTheDocument()
  })
})

/* -------------------------------------------------------------------------- */
/*                              MULTIPLE BUTTONS                              */
/* -------------------------------------------------------------------------- */

describe("ImageCard – multiple buttons", () => {
  it("renders multiple text buttons", () => {
    render(
      <ImageCard
        {...baseProps}
        button={[
          { label: "Play" },
          { label: "Share" },
        ]}
      />
    )

    expect(screen.getByText("Play")).toBeInTheDocument()
    expect(screen.getByText("Share")).toBeInTheDocument()
  })

  it("handles mixed icon and label buttons", () => {
    render(
      <ImageCard
        {...baseProps}
        button={[
          { label: "Watch" },
          { icon: Play, ariaLabel: "Play icon" },
        ]}
      />
    )

    expect(screen.getByText("Watch")).toBeInTheDocument()
    expect(screen.getByLabelText("Play icon")).toBeInTheDocument()
  })
})

/* -------------------------------------------------------------------------- */
/*                              LINK PROPS                                    */
/* -------------------------------------------------------------------------- */

describe("ImageCard – link props", () => {
  it("supports aria-label without visible text", () => {
    render(
      <ImageCard
        {...baseProps}
        button={{
          icon: Play,
          ariaLabel: "Play trailer",
        }}
      />
    )

    expect(screen.getByLabelText("Play trailer")).toBeInTheDocument()
  })
})

/* -------------------------------------------------------------------------- */
/*                              ERROR STATES                                  */
/* -------------------------------------------------------------------------- */

describe("ImageCard – error handling", () => {
  it("renders fallback when image prop is missing", () => {
    render(
      <ImageCard
        title="No Image Card"
        description="Missing image"
      />
    )

    expect(screen.getByText("No image")).toBeInTheDocument()
  })

  it("renders content even if description is undefined", () => {
    render(
      <ImageCard
        title="Title Only"
        image={IMAGE_URL}
      />
    )

    expect(screen.getByText("Title Only")).toBeInTheDocument()
  })
})

/* -------------------------------------------------------------------------- */
/*                              MEDIA MODE                                    */
/* -------------------------------------------------------------------------- */

describe("ImageCard – media mode behaviors", () => {
  it("renders media mode without buttons", () => {
    render(
      <ImageCard
        {...baseProps}
        mode="media"
      />
    )

    expect(screen.getByText("Ocean Adventure")).toBeInTheDocument()
  })

  it("renders media image even without description", () => {
    render(
      <ImageCard
        title="Media Only"
        image={IMAGE_URL}
        mode="media"
      />
    )

    expect(screen.getByAltText("Media Only")).toBeInTheDocument()
  })
})

/* -------------------------------------------------------------------------- */
/*                              LAYOUT EDGE CASES                             */
/* -------------------------------------------------------------------------- */

describe("ImageCard – layout edge cases", () => {
  it("defaults mediaPosition to top", () => {
    render(
      <ImageCard
        {...baseProps}
        mode="media"
      />
    )

    expect(screen.getByAltText("Ocean Adventure")).toBeInTheDocument()
  })

  it("handles below layout without image gracefully", () => {
    render(
      <ImageCard
        title="Below No Image"
        layout="below"
      />
    )

    expect(screen.getByText("Below No Image")).toBeInTheDocument()
  })
})

/* -------------------------------------------------------------------------- */
/*                              CLASSNAME PROP                                */
/* -------------------------------------------------------------------------- */

describe("ImageCard – className prop", () => {
  it("applies custom className", () => {
    const { container } = render(
      <ImageCard
        {...baseProps}
        className="custom-card"
      />
    )

    expect(container.querySelector(".custom-card")).toBeInTheDocument()
  })
})

/* -------------------------------------------------------------------------- */
/*                              INTERACTION SAFETY                            */
/* -------------------------------------------------------------------------- */

describe("ImageCard – interaction safety", () => {
  it("does not throw when clicking button without onAction", () => {
    render(
      <ImageCard
        {...baseProps}
        button="Click me"
      />
    )

    fireEvent.click(screen.getByText("Click me"))
    expect(true).toBe(true)
  })

  it("does not render buttons when button prop is empty", () => {
    render(<ImageCard {...baseProps} />)

    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("renders category and button together", () => {
    render(
      <ImageCard
        {...baseProps}
        category="Adventure"
        button="Explore"
      />
    )

    expect(screen.getByText("Adventure")).toBeInTheDocument()
    expect(screen.getByText("Explore")).toBeInTheDocument()
  })

})

