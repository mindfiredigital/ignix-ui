// stats-grid.test.tsx
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import React from "react"
// import userEvent from "@testing-library/user-event"

// Mock framer-motion to handle animations in tests
vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, _initial, _animate, _transition, className, ...props }: any) => (
            <div className={className} data-testid="motion-div" {...props}>
                {children}
            </div>
        ),
    },
    useInView: () => true, // Mock useInView to always be in view
}))

// Mock the cn utility
vi.mock("../../../utils/cn", () => ({
    cn: (...args: any[]) => args.filter(Boolean).join(' ')
}))

// Now import the components after mocking
import {
    StatsGrid,
    StatValue,
    // StatLabel,
    // StatSubtext,
    StatIcon,
    // StatsGridTitle,
    // StatsGridDescription,
    StatsGridCard,
    type StatItem
} from "./"

// Mock icon component for testing
const MockIcon = (props: any) => <svg data-testid="mock-icon" {...props} />

describe("StatsGrid - Core Components", () => {
    describe("Basic StatsGrid", () => {
        const mockStats: StatItem[] = [
            { value: 1000000, label: "Revenue", format: "currency" },
            { value: 75, label: "Growth", format: "percentage", suffix: "%" },
            { value: 5000, label: "Users", format: "compact" },
        ]

        it("renders without crashing", () => {
            render(
                <StatsGrid stats={mockStats} title="Test Stats" description="Test Description" animated={false} />
            )

            expect(screen.getByRole("region")).toBeInTheDocument()
            expect(screen.getByText("Test Stats")).toBeInTheDocument()
            expect(screen.getByText("Test Description")).toBeInTheDocument()
            expect(screen.getByText("Revenue")).toBeInTheDocument()
            expect(screen.getByText("Growth")).toBeInTheDocument()
            expect(screen.getByText("Users")).toBeInTheDocument()
        })

        it("applies dark variant", () => {
            render(
                <StatsGrid variant="dark" stats={mockStats} animated={false} />
            )

            const section = screen.getByRole("region")
            expect(section).toHaveClass("bg-gray-950")
        })

        it("applies light variant", () => {
            render(
                <StatsGrid variant="light" stats={mockStats} animated={false} />
            )

            const section = screen.getByRole("region")
            expect(section).toHaveClass("bg-gray-50")
        })

        it("applies different column layouts", () => {
            const { rerender } = render(
                <StatsGrid columns={2} stats={mockStats.slice(0, 2)} animated={false} />
            )

            let container = screen.getByRole("region").querySelector(".grid")
            expect(container).toHaveClass("grid-cols-1 sm:grid-cols-2")

            rerender(
                <StatsGrid columns={4} stats={mockStats} animated={false} />
            )

            container = screen.getByRole("region").querySelector(".grid")
            expect(container).toHaveClass("grid-cols-1 sm:grid-cols-2 lg:grid-cols-4")
        })

        it("applies accessibility attributes", () => {
            render(
                <StatsGrid
                    stats={mockStats}
                    ariaLabel="Company Statistics"
                    role="region"
                    animated={false}
                />
            )

            const grid = screen.getByRole("region", { name: "Company Statistics" })
            expect(grid).toBeInTheDocument()
        })

        it("returns null when no stats and no children", () => {
            const { container } = render(<StatsGrid stats={[]} animated={false} />)
            expect(container.firstChild).toBeNull()
        })
    })

    describe("Number Formatting", () => {
        it("formats numbers correctly with different formats", async () => {
            const stats: StatItem[] = [
                { value: 1500000, label: "Revenue", format: "currency" },
                { value: 2500, label: "Users", format: "compact" },
                { value: 75.5, label: "Rate", format: "percentage", decimals: 1 },
                { value: 42, label: "Count", format: "raw" },
            ]

            render(<StatsGrid stats={stats} animated={false} />)

            // Use regex to match with or without decimal
            expect(screen.getByText(/\$1\.5M/)).toBeInTheDocument()
            expect(screen.getByText(/2\.5K/)).toBeInTheDocument()
            expect(screen.getByText(/75\.5%/)).toBeInTheDocument()
            expect(screen.getByText("42")).toBeInTheDocument()
        })

        it("applies prefix and suffix correctly", async () => {
            const stats: StatItem[] = [
                { value: 100, label: "Test", prefix: "#", suffix: "x" },
            ]

            render(<StatsGrid stats={stats} animated={false} />)

            // Use regex to match with or without decimal
            expect(screen.getByText(/#100x/)).toBeInTheDocument()
        })

        it("handles negative numbers", async () => {
            const stats: StatItem[] = [
                { value: -5000, label: "Loss", format: "currency" },
            ]

            render(<StatsGrid stats={stats} animated={false} />)

            // Use regex to match with or without decimal
            expect(screen.getByText(/-\$5\.?0?K/)).toBeInTheDocument()
        })
    })

    describe("StatValue Component", () => {

        it("renders without animation when animated=false", () => {
            render(
                <StatsGrid animated={false}>
                    <StatsGrid.Container>
                        <StatValue value={1000} format="compact" animated={false} />
                    </StatsGrid.Container>
                </StatsGrid>
            )

            // Use regex to match with or without decimal
            expect(screen.getByText(/1\.?0?K/)).toBeInTheDocument()
        })

        it("applies custom className and color", async () => {
            render(
                <StatsGrid animated={false}>
                    <StatsGrid.Container>
                        <StatValue
                            value={100}
                            className="custom-class"
                            color="text-red-500"
                        />
                    </StatsGrid.Container>
                </StatsGrid>
            )

            const value = screen.getByText("100")
            expect(value).toHaveClass("custom-class", "text-red-500")
        })
    })

    describe("StatIcon Component", () => {
        it("renders icon with different accents", () => {
            const { rerender } = render(
                <StatsGrid animated={false}>
                    <StatsGrid.Container>
                        <StatIcon icon={MockIcon} accent="blue" />
                    </StatsGrid.Container>
                </StatsGrid>
            )

            let iconContainer = screen.getByTestId("mock-icon").parentElement
            expect(iconContainer).toHaveClass("bg-blue-100")

            rerender(
                <StatsGrid variant="dark" animated={false}>
                    <StatsGrid.Container>
                        <StatIcon icon={MockIcon} accent="blue" />
                    </StatsGrid.Container>
                </StatsGrid>
            )

            iconContainer = screen.getByTestId("mock-icon").parentElement
            expect(iconContainer).toHaveClass("bg-blue-900/40")
        })

        it("applies solid variant", () => {
            render(
                <StatsGrid animated={false}>
                    <StatsGrid.Container>
                        <StatIcon icon={MockIcon} accent="emerald" solid />
                    </StatsGrid.Container>
                </StatsGrid>
            )

            const iconContainer = screen.getByTestId("mock-icon").parentElement
            expect(iconContainer).toHaveClass("bg-emerald-500")
        })

        it("applies different sizes", () => {
            const { rerender } = render(
                <StatsGrid animated={false}>
                    <StatsGrid.Container>
                        <StatIcon icon={MockIcon} size="sm" />
                    </StatsGrid.Container>
                </StatsGrid>
            )

            let iconContainer = screen.getByTestId("mock-icon").parentElement
            expect(iconContainer).toHaveClass("h-8 w-8")

            rerender(
                <StatsGrid animated={false}>
                    <StatsGrid.Container>
                        <StatIcon icon={MockIcon} size="lg" />
                    </StatsGrid.Container>
                </StatsGrid>
            )

            iconContainer = screen.getByTestId("mock-icon").parentElement
            expect(iconContainer).toHaveClass("h-12 w-12")
        })
    })

    describe("StatsGridCard Component", () => {
        const mockStat: StatItem = {
            value: 1234,
            label: "Test Stat",
            subtext: "Additional context",
            icon: MockIcon,
            format: "compact",
            accent: "violet"
        }

        it("renders complete card with all elements", async () => {
            render(
                <StatsGrid animated={false}>
                    <StatsGrid.Container>
                        <StatsGridCard stat={mockStat} />
                    </StatsGrid.Container>
                </StatsGrid>
            )

            expect(screen.getByText("Test Stat")).toBeInTheDocument()
            expect(screen.getByText(/1\.2K/)).toBeInTheDocument() // Regex to match with or without decimal
            expect(screen.getByText("Additional context")).toBeInTheDocument()
            expect(screen.getByTestId("mock-icon")).toBeInTheDocument()
        })

        it("applies accessibility attributes", () => {
            render(
                <StatsGrid animated={false}>
                    <StatsGrid.Container>
                        <StatsGridCard stat={mockStat} />
                    </StatsGrid.Container>
                </StatsGrid>
            )

            const card = screen.getByRole("article")
            expect(card).toHaveAttribute("aria-label", "Test Stat: 1,234")
            expect(card).toHaveAttribute("tabIndex", "0")
        })

        it("applies custom colors to card", () => {
            render(
                <StatsGrid animated={false}>
                    <StatsGrid.Container>
                        <StatsGridCard
                            stat={mockStat}
                            bgColor="bg-custom-bg"
                            borderColor="border-custom"
                            textColor="text-custom"
                        />
                    </StatsGrid.Container>
                </StatsGrid>
            )

            const card = screen.getByRole("article")
            expect(card).toHaveClass("bg-custom-bg", "border-custom")

            const label = screen.getByText("Test Stat")
            expect(label).toHaveClass("text-custom")
        })
    })

    describe("Compound Components Pattern", () => {
        it("renders using compound components", async () => {
            render(
                <StatsGrid animated={false}>
                    <StatsGrid.Header title="Custom Title" description="Custom Description" />
                    <StatsGrid.Container>
                        <StatsGrid.Card
                            stat={{
                                value: 500,
                                label: "Custom Stat",
                                icon: MockIcon
                            }}
                        />
                        <StatsGrid.Card
                            stat={{
                                value: 75,
                                label: "Another Stat",
                                format: "percentage"
                            }}
                        />
                    </StatsGrid.Container>
                </StatsGrid>
            )

            expect(screen.getByText("Custom Title")).toBeInTheDocument()
            expect(screen.getByText("Custom Description")).toBeInTheDocument()
            expect(screen.getByText("Custom Stat")).toBeInTheDocument()

            // Use regex to match with or without decimal
            expect(screen.getByText(/75\.?0?%/)).toBeInTheDocument()
        })

        it("allows custom ordering of subcomponents", () => {
            render(
                <StatsGrid animated={false}>
                    <StatsGrid.Container>
                        <StatsGrid.Card
                            stat={{
                                value: 100,
                                label: "First",
                                icon: MockIcon
                            }}
                        />
                    </StatsGrid.Container>
                    <StatsGrid.Header title="Title After Cards" />
                </StatsGrid>
            )

            expect(screen.getByText("Title After Cards")).toBeInTheDocument()
            expect(screen.getByText("First")).toBeInTheDocument()
        })
    })

    describe("Animation and Interactions", () => {
        it("applies different animation types", () => {
            const { rerender } = render(
                <StatsGrid animationType="fade" animated={true} stats={[{ value: 100, label: "Test" }]}>
                    <StatsGrid.Container>
                        <StatsGrid.Card stat={{ value: 100, label: "Test" }} />
                    </StatsGrid.Container>
                </StatsGrid>
            )

            let motionDiv = screen.getAllByTestId("motion-div")[0]
            expect(motionDiv).toBeInTheDocument()

            rerender(
                <StatsGrid animationType="scale" animated={true} stats={[{ value: 100, label: "Test" }]}>
                    <StatsGrid.Container>
                        <StatsGrid.Card stat={{ value: 100, label: "Test" }} />
                    </StatsGrid.Container>
                </StatsGrid>
            )

            motionDiv = screen.getAllByTestId("motion-div")[0]
            expect(motionDiv).toBeInTheDocument()
        })

        it("disables animations when animated=false", () => {
            render(
                <StatsGrid animated={false} stats={[{ value: 100, label: "Test" }]}>
                    <StatsGrid.Container>
                        <StatsGrid.Card stat={{ value: 100, label: "Test" }} />
                    </StatsGrid.Container>
                </StatsGrid>
            )

            expect(screen.queryByTestId("motion-div")).not.toBeInTheDocument()
        })

        it("applies stagger delay to cards", async () => {
            const stats = [
                { value: 100, label: "First" },
                { value: 200, label: "Second" },
                { value: 300, label: "Third" },
            ]

            render(
                <StatsGrid
                    staggerDelay={0.1}
                    stats={stats}
                    animated={false}
                />
            )

            expect(screen.getByText("First")).toBeInTheDocument()
            expect(screen.getByText("Second")).toBeInTheDocument()
            expect(screen.getByText("Third")).toBeInTheDocument()
        })
    })


    describe("Edge Cases and Error Handling", () => {
        it("handles empty stats array gracefully", () => {
            const { container } = render(<StatsGrid stats={[]} animated={false} />)
            expect(container.firstChild).toBeNull()
        })

        it("limits stats to 6 items", () => {
            const manyStats: StatItem[] = Array.from({ length: 10 }, (_, i) => ({
                value: i,
                label: `Stat ${i}`
            }))

            render(<StatsGrid stats={manyStats} animated={false} />)

            expect(screen.getByText("Stat 0")).toBeInTheDocument()
            expect(screen.getByText("Stat 5")).toBeInTheDocument()
            expect(screen.queryByText("Stat 6")).not.toBeInTheDocument()
        })

        it("handles invalid number formats gracefully", () => {
            const stats: StatItem[] = [
                { value: NaN, label: "Invalid", format: "raw" },
            ]

            expect(() => {
                render(<StatsGrid stats={stats} animated={false} />)
            }).not.toThrow()
        })

        const fun = vi.fn()

        it("throws error when used outside StatsGrid context", () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(fun())

            expect(() => {
                render(<StatValue value={100} />)
            }).toThrow("StatsGrid components must be used within StatsGrid")

            consoleSpy.mockRestore()
        })
    })

    describe("Custom Colors Integration", () => {
        it("applies custom colors via props", () => {
            render(
                <StatsGrid
                    bgColor="bg-custom-bg"
                    textColor="text-custom-text"
                    cardBgColor="bg-custom-card"
                    cardBorderColor="border-custom-border"
                    iconBgColor="bg-custom-icon"
                    iconColor="text-custom-icon"
                    animated={false}
                    stats={[{
                        value: 100,
                        label: "Test",
                        icon: MockIcon
                    }]}
                />
            )

            const section = screen.getByRole("region")
            expect(section).toHaveClass("bg-custom-bg")

            const card = screen.getByRole("article")
            expect(card).toHaveClass("bg-custom-card", "border-custom-border")

            const iconContainer = screen.getByTestId("mock-icon").parentElement
            expect(iconContainer).toHaveClass("bg-custom-icon")
        })
    })

    describe("Performance and Optimization", () => {
        it("memoizes expensive computations", async () => {
            const stats: StatItem[] = [
                { value: 1234567, label: "Large Number", format: "compact" }
            ]

            const { rerender } = render(<StatsGrid stats={stats} animated={false} />)

            // Use regex to match with or without decimal
            expect(screen.getByText(/1\.2M/)).toBeInTheDocument()

            rerender(<StatsGrid stats={stats} animated={false} />)

            expect(screen.getByText(/1\.2M/)).toBeInTheDocument()
        })
    })
})