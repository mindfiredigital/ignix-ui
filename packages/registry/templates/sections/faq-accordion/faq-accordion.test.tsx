import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
    FAQSection,
    Accordion,
    AccordionItem,
    AccordionSummary,
    AccordionDetails,
    AccordionTitle,
    // AccordionLink,
    type FAQItem,
    type FAQCategory,
} from "."

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock the Button component from @ignix-ui/button
vi.mock('@ignix-ui/button', () => ({
    Button: ({ children, ...props }: any) => (
        <button {...props} data-testid="mock-button">
            {children}
        </button>
    ),
}))

/* -------------------------------------------------------------------------- */
/*                              TEST DATA                                     */
/* -------------------------------------------------------------------------- */

const mockItems: FAQItem[] = [
    {
        id: '1',
        question: 'What is your return policy?',
        answer: 'You can return items within 30 days of purchase.',
        category: 'shipping',
        icon: <span>📦</span>,
        link: {
            text: 'Learn more about returns',
            url: '/returns',
        },
    },
    {
        id: '2',
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 3-5 business days.',
        category: 'shipping',
        icon: <span>🚚</span>,
    },
    {
        id: '3',
        question: 'Do you offer international shipping?',
        answer: 'Yes, we ship to over 50 countries worldwide.',
        category: 'shipping',
    },
    {
        id: '4',
        question: 'How do I contact support?',
        answer: 'You can reach us via email, chat, or phone.',
        category: 'support',
        icon: <span>💬</span>,
    },
    {
        id: '5',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, PayPal, and Apple Pay.',
        category: 'billing',
    },
]

const mockCategories: FAQCategory[] = [
    { id: 'shipping', name: 'Shipping', count: 3, icon: <span>🚚</span> },
    { id: 'support', name: 'Support', count: 1, icon: <span>💬</span> },
    { id: 'billing', name: 'Billing', count: 1, icon: <span>💰</span> },
]

/* -------------------------------------------------------------------------- */
/*                              ACCORDION TESTS                               */
/* -------------------------------------------------------------------------- */

describe("Accordion Components", () => {
    describe("Accordion", () => {
        it("renders children correctly", () => {
            render(
                <Accordion>
                    <div>Test Content</div>
                </Accordion>
            )
            expect(screen.getByText("Test Content")).toBeInTheDocument()
        })

        it("handles controlled open items", async () => {
            const user = userEvent.setup()
            const handleChange = vi.fn()
            
            render(
                <Accordion
                    value={['1']}
                    onValueChange={handleChange}
                >
                    <AccordionItem id="1">
                        <AccordionSummary id="1">Question</AccordionSummary>
                    </AccordionItem>
                </Accordion>
            )

            const button = screen.getByRole('button')
            await user.click(button)
            expect(handleChange).toHaveBeenCalled()
        })

        it("supports single open mode", () => {
            render(
                <Accordion enableSingleOpen defaultValue={['1']}>
                    <AccordionItem id="1">
                        <AccordionSummary id="1">Item 1</AccordionSummary>
                    </AccordionItem>
                    <AccordionItem id="2">
                        <AccordionSummary id="2">Item 2</AccordionSummary>
                    </AccordionItem>
                </Accordion>
            )

            const buttons = screen.getAllByRole('button')
            expect(buttons).toHaveLength(2)
        })

        it("applies different themes", () => {
            const { rerender } = render(
                <Accordion theme="dark">
                    <AccordionItem id="1">
                        <AccordionSummary id="1">Test</AccordionSummary>
                    </AccordionItem>
                </Accordion>
            )

            const button = screen.getByRole('button')
            expect(button).toHaveClass('hover:bg-gray-800')

            rerender(
                <Accordion theme="ocean">
                    <AccordionItem id="1">
                        <AccordionSummary id="1">Test</AccordionSummary>
                    </AccordionItem>
                </Accordion>
            )

            expect(button).toHaveClass('hover:bg-[#1A2A3F]')
        })
    })

    describe("AccordionItem", () => {
        it("renders with correct id", () => {
            render(
                <Accordion>
                    <AccordionItem id="test-id">
                        <div>Item Content</div>
                    </AccordionItem>
                </Accordion>
            )
            expect(screen.getByText("Item Content")).toBeInTheDocument()
        })

        it("applies disabled state", () => {
            render(
                <Accordion>
                    <AccordionItem id="1" disabled>
                        <AccordionSummary id="1">Disabled Item</AccordionSummary>
                    </AccordionItem>
                </Accordion>
            )

            const button = screen.getByRole('button', { name: /disabled item/i })
            // The disabled state might be applied to the parent div, not the button
            const item = button.closest('.opacity-50')
            expect(item).toHaveClass('opacity-50')
            expect(item).toHaveClass('pointer-events-none')
        })
    })

    describe("AccordionSummary", () => {
        it("renders children and responds to clicks", async () => {
            const user = userEvent.setup()

            render(
                <Accordion defaultValue={[]}>
                    <AccordionItem id="1">
                        <AccordionSummary id="1">Click me</AccordionSummary>
                        <AccordionDetails id="1">Content</AccordionDetails>
                    </AccordionItem>
                </Accordion>
            )

            const button = screen.getByRole('button', { name: /click me/i })
            expect(button).toBeInTheDocument()
            expect(button).toHaveAttribute('aria-expanded', 'false')

            await user.click(button)
            expect(button).toHaveAttribute('aria-expanded', 'true')
            
            await user.click(button)
            expect(button).toHaveAttribute('aria-expanded', 'false')
        })

        it("handles keyboard navigation", async () => {
            const user = userEvent.setup()

            render(
                <Accordion defaultValue={[]}>
                    <AccordionItem id="1">
                        <AccordionSummary id="1">Keyboard item</AccordionSummary>
                        <AccordionDetails id="1">Content</AccordionDetails>
                    </AccordionItem>
                </Accordion>
            )

            const button = screen.getByRole('button')
            button.focus()

            expect(button).toHaveAttribute('aria-expanded', 'false')
            
            await user.keyboard('{Enter}')
            expect(button).toHaveAttribute('aria-expanded', 'true')

            await user.keyboard(' ')
            expect(button).toHaveAttribute('aria-expanded', 'false')
        })

        it("renders different icon styles", () => {
            const { rerender } = render(
                <Accordion iconStyle="chevron">
                    <AccordionItem id="1">
                        <AccordionSummary id="1">Chevron</AccordionSummary>
                    </AccordionItem>
                </Accordion>
            )

            let icon = document.querySelector('.lucide-chevron-down')
            expect(icon).toBeInTheDocument()

            rerender(
                <Accordion iconStyle="plus-minus">
                    <AccordionItem id="1">
                        <AccordionSummary id="1">Plus/Minus</AccordionSummary>
                    </AccordionItem>
                </Accordion>
            )

            icon = document.querySelector('.lucide-plus')
            expect(icon).toBeInTheDocument()
        })
    })

    describe("AccordionTitle", () => {
        it("renders with icon and category", () => {
            render(
                <Accordion>
                    <AccordionItem id="1">
                        <AccordionSummary id="1">
                            <AccordionTitle icon={<span>🔍</span>} category="test">
                                Title with extras
                            </AccordionTitle>
                        </AccordionSummary>
                    </AccordionItem>
                </Accordion>
            )

            expect(screen.getByText('🔍')).toBeInTheDocument()
            expect(screen.getByText('test')).toBeInTheDocument()
            expect(screen.getByText('Title with extras')).toBeInTheDocument()
        })
    })

    describe("AccordionDetails", () => {
        it("shows content when open", () => {
            render(
                <Accordion defaultValue={['1']}>
                    <AccordionItem id="1">
                        <AccordionSummary id="1">Summary</AccordionSummary>
                        <AccordionDetails id="1">
                            <div>Hidden content</div>
                        </AccordionDetails>
                    </AccordionItem>
                </Accordion>
            )

            expect(screen.getByText('Hidden content')).toBeInTheDocument()
        })

        it("hides content when closed", () => {
            render(
                <Accordion>
                    <AccordionItem id="1">
                        <AccordionSummary id="1">Summary</AccordionSummary>
                        <AccordionDetails id="1">
                            <div>Hidden content</div>
                        </AccordionDetails>
                    </AccordionItem>
                </Accordion>
            )

            expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
        })
    })

})

/* -------------------------------------------------------------------------- */
/*                              FAQ SECTION TESTS                             */
/* -------------------------------------------------------------------------- */

describe("FAQSection", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders title and description", () => {
        render(
            <FAQSection
                items={mockItems}
                title="FAQ Title"
                description="FAQ Description"
            />
        )

        expect(screen.getByText("FAQ Title")).toBeInTheDocument()
        expect(screen.getByText("FAQ Description")).toBeInTheDocument()
    })

    it("renders all FAQ items", () => {
        render(<FAQSection items={mockItems} />)

        expect(screen.getByText("What is your return policy?")).toBeInTheDocument()
        expect(screen.getByText("How long does shipping take?")).toBeInTheDocument()
        expect(screen.getByText("Do you offer international shipping?")).toBeInTheDocument()
    })

    it("handles search functionality", async () => {
        const user = userEvent.setup()
        const onSearch = vi.fn()

        render(
            <FAQSection
                items={mockItems}
                enableSearch
                onSearch={onSearch}
            />
        )

        const searchInput = screen.getByRole('textbox')
        await user.type(searchInput, 'shipping')

        expect(onSearch).toHaveBeenCalledWith('shipping')
        expect(screen.getByText("How long does shipping take?")).toBeInTheDocument()
        expect(screen.queryByText("How do I contact support?")).not.toBeInTheDocument()
    })

    it("clears search when X button is clicked", async () => {
        const user = userEvent.setup()

        render(
            <FAQSection
                items={mockItems}
                enableSearch
            />
        )

        const searchInput = screen.getByRole('textbox')
        await user.type(searchInput, 'shipping')

        const clearButton = screen.getByRole('button', { name: /clear search/i })
        await user.click(clearButton)

        expect(searchInput).toHaveValue('')
        expect(screen.getByText("How do I contact support?")).toBeInTheDocument()
    })

    it("filters by category", async () => {
        const user = userEvent.setup()

        render(
            <FAQSection
                items={mockItems}
                categories={mockCategories}
                enableCategories
            />
        )

        // Wait for categories to render and use getAllByRole since there are multiple buttons with "support" text
        await waitFor(() => {
            const supportButtons = screen.getAllByRole('button', { name: /support/i })
            expect(supportButtons.length).toBeGreaterThan(0)
        })

        const supportButtons = screen.getAllByRole('button', { name: /support/i })
        // Click the category tab (first button with support text)
        await user.click(supportButtons[0])

        expect(screen.getByText("How do I contact support?")).toBeInTheDocument()
        expect(screen.queryByText("What is your return policy?")).not.toBeInTheDocument()
    })

    it("shows empty state when no results found", async () => {
        const user = userEvent.setup()

        render(
            <FAQSection
                items={mockItems}
                enableSearch
            />
        )

        const searchInput = screen.getByRole('textbox')
        await user.type(searchInput, 'nonexistentquestion')

        expect(screen.getByText(/no questions found/i)).toBeInTheDocument()
        expect(screen.getByText(/no results for/i)).toBeInTheDocument()
    })

    it("shows loading state", () => {
        render(
            <FAQSection
                items={mockItems}
                isLoading
            />
        )

        expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
    })

    it("handles custom empty state", () => {
        render(
            <FAQSection
                items={[]}
                customEmptyState={<div>Custom Empty Message</div>}
            />
        )

        expect(screen.getByText("Custom Empty Message")).toBeInTheDocument()
    })

    it("handles custom header", () => {
        render(
            <FAQSection
                items={mockItems}
                customHeader={<div>Custom Header</div>}
            />
        )

        expect(screen.getByText("Custom Header")).toBeInTheDocument()
        expect(screen.queryByText("Frequently asked questions")).not.toBeInTheDocument()
    })

    describe("layout variants", () => {
        it("renders split-left layout", () => {
            const { container } = render(
                <FAQSection
                    items={mockItems}
                    layoutVariant="split-left"
                />
            )

            expect(container.querySelector('.lg\\:grid-cols-2')).toBeInTheDocument()
        })

        it("renders split-right layout", () => {
            const { container } = render(
                <FAQSection
                    items={mockItems}
                    layoutVariant="split-right"
                />
            )

            expect(container.querySelector('.lg\\:grid-cols-2')).toBeInTheDocument()
        })

        it("renders contact-sidebar layout", () => {
            const { container } = render(
                <FAQSection
                    items={mockItems}
                    layoutVariant="contact-sidebar"
                />
            )

            expect(container.querySelector('.lg\\:grid-cols-3')).toBeInTheDocument()
        })

        it("renders grid layout", () => {
            const { container } = render(
                <FAQSection
                    items={mockItems}
                    layoutVariant="grid"
                />
            )

            expect(container.querySelector('.md\\:grid-cols-2')).toBeInTheDocument()
        })

        it("renders minimal-list layout", () => {
            const { container } = render(
                <FAQSection
                    items={mockItems}
                    layoutVariant="minimal-list"
                />
            )

            expect(container.querySelector('.max-w-2xl')).toBeInTheDocument()
        })

        it("renders category-tabs layout", () => {
            const { container } = render(
                <FAQSection
                    items={mockItems}
                    layoutVariant="category-tabs"
                    categories={mockCategories}
                    enableCategories
                />
            )

            expect(container.querySelector('.max-w-4xl')).toBeInTheDocument()
        })

        it("renders featured layout", () => {
            const { container } = render(
                <FAQSection
                    items={mockItems}
                    layoutVariant="featured"
                />
            )

            expect(container.querySelector('.relative.overflow-hidden')).toBeInTheDocument()
        })
    })

    describe("theme variants", () => {
        it("applies dark theme", () => {
            const { container } = render(
                <FAQSection
                    items={mockItems}
                    themeVariant="dark"
                />
            )

            const section = container.querySelector('section')
            expect(section).toHaveClass('bg-gray-950')
        })

        it("applies midnight theme", () => {
            const { container } = render(
                <FAQSection
                    items={mockItems}
                    themeVariant="midnight"
                />
            )

            const section = container.querySelector('section')
            expect(section).toHaveClass('bg-[#0B1120]')
        })

        it("applies ocean theme", () => {
            const { container } = render(
                <FAQSection
                    items={mockItems}
                    themeVariant="ocean"
                />
            )

            const section = container.querySelector('section')
            expect(section).toHaveClass('bg-gradient-to-br')
        })
    })

    describe("interactions", () => {
        it("opens and closes accordion items", async () => {
            const user = userEvent.setup()

            render(<FAQSection items={mockItems} />)

            const question = screen.getByRole('button', { name: /what is your return policy/i })
            
            // Initially closed
            expect(screen.queryByText(/you can return items/i)).not.toBeInTheDocument()

            // Open
            await user.click(question)
            
            // Wait for content to appear
            await waitFor(() => {
                expect(screen.getByText(/you can return items/i)).toBeInTheDocument()
            })

            // Close
            await user.click(question)
            
            // Wait for content to disappear
            await waitFor(() => {
                expect(screen.queryByText(/you can return items/i)).not.toBeInTheDocument()
            })
        })

        it("supports single open mode", async () => {
            const user = userEvent.setup()

            render(
                <FAQSection
                    items={mockItems}
                    enableSingleOpen
                />
            )

            const question1 = screen.getByRole('button', { name: /what is your return policy/i })
            const question2 = screen.getByRole('button', { name: /how long does shipping take/i })

            // Open first
            await user.click(question1)
            await waitFor(() => {
                expect(screen.getByText(/you can return items/i)).toBeInTheDocument()
            })

            // Open second - first should close
            await user.click(question2)
            await waitFor(() => {
                expect(screen.queryByText(/you can return items/i)).not.toBeInTheDocument()
                expect(screen.getByText(/standard shipping takes/i)).toBeInTheDocument()
            })
        })
    })

    describe("accessibility", () => {
        it("has correct ARIA attributes on accordion buttons", () => {
            render(<FAQSection items={mockItems} />)

            const button = screen.getByRole('button', { name: /what is your return policy/i })
            expect(button).toHaveAttribute('aria-expanded', 'false')
            expect(button).toHaveAttribute('aria-controls')
            expect(button).toHaveAttribute('id')
        })

        it("has correct ARIA attributes on expanded content", async () => {
            const user = userEvent.setup()

            render(<FAQSection items={mockItems} />)

            const button = screen.getByRole('button', { name: /what is your return policy/i })
            await user.click(button)

            await waitFor(() => {
                const content = document.querySelector('[role="region"]')
                expect(content).toHaveAttribute('aria-labelledby', button.id)
            })
        })

        it("search input has accessible label", () => {
            render(
                <FAQSection
                    items={mockItems}
                    enableSearch
                />
            )

            expect(screen.getByLabelText(/search faqs/i)).toBeInTheDocument()
        })
    })
})