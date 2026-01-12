import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListBasic } from "./index";

/**
 * Storybook Stories for ListBasic Component
 * 
 * This file contains various story configurations to showcase different
 * states and use cases of the ListBasic component.
 * 
 * Stories include:
 * - Default unordered list with bullet points
 * - Ordered list with numbers
 * - Different spacing variants (sm, md, lg)
 * - Lists with custom content
 * - Lists with children instead of items prop
 * - Real-world examples
 * 
 * @file
 */

/**
 * Storybook metadata configuration
 * 
 * This defines the component's display name, description, and controls
 * available in the Storybook UI.
 */
const meta: Meta<typeof ListBasic> = {
    title: "Components/List-Basic",
    component: ListBasic,
    tags: ["autodocs"],
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: `
The **ListBasic** component is a flexible list component that supports both unordered (bullet points) and ordered (numbered) lists with consistent spacing between items.

### Features
- **Unordered lists**: Display items with bullet points (disc markers)
- **Ordered lists**: Display items with numbers (1, 2, 3...)
- **Consistent spacing**: Three spacing variants (sm, md, lg) for uniform item spacing
- **Flexible content**: Accept items as prop or children
- **Accessible**: Uses semantic HTML (\`<ul>\` and \`<ol>\`) for screen readers
- **Customizable**: Supports custom className for additional styling

### Usage
\`\`\`tsx
// Unordered list with items prop
<ListBasic 
  items={['Item 1', 'Item 2', 'Item 3']} 
  type="unordered" 
  spacing="md" 
/>

// Ordered list with children
<ListBasic type="ordered" spacing="lg">
  <li>First item</li>
  <li>Second item</li>
</ListBasic>
\`\`\`
                `,
            },
        },
    },
    argTypes: {
        items: {
            control: "object",
            description: "Array of items to display in the list. Can be strings or React nodes.",
        },
        type: {
            control: "select",
            options: ["unordered", "ordered"],
            description: "Type of list: 'unordered' for bullet points, 'ordered' for numbers",
            defaultValue: "unordered",
        },
        spacing: {
            control: "select",
            options: ["sm", "md", "lg"],
            description: "Spacing size between list items (sm: 8px, md: 12px, lg: 16px)",
            defaultValue: "md",
        },
        className: {
            control: "text",
            description: "Additional CSS classes to apply to the list container",
        },
        children: {
            table: { disable: true },
            description: "Alternative way to pass list items as children",
        },
    },
};

export default meta;
type Story = StoryObj<typeof ListBasic>;

/**
 * Default unordered list with bullet points
 * 
 * Shows a basic unordered list with default medium spacing.
 * This is the most common use case for displaying a simple list of items.
 */
export const Default: Story = {
    args: {
        items: [
            "First item",
            "Second item",
            "Third item",
            "Fourth item",
        ],
        type: "unordered",
        spacing: "md",
    },
};

/**
 * Ordered list with numbers
 * 
 * Displays a numbered list using the ordered list type.
 * Useful for step-by-step instructions or ranked items.
 */
export const Ordered: Story = {
    args: {
        items: [
            "First step",
            "Second step",
            "Third step",
            "Fourth step",
        ],
        type: "ordered",
        spacing: "md",
    },
};

/**
 * Small spacing variant
 * 
 * Demonstrates the small spacing option (8px between items).
 * Best for compact layouts or when space is limited.
 */
export const SmallSpacing: Story = {
    args: {
        items: [
            "Compact item one",
            "Compact item two",
            "Compact item three",
        ],
        type: "unordered",
        spacing: "sm",
    },
};

/**
 * Large spacing variant
 * 
 * Demonstrates the large spacing option (16px between items).
 * Ideal for better readability and visual separation.
 */
export const LargeSpacing: Story = {
    args: {
        items: [
            "Spacious item one",
            "Spacious item two",
            "Spacious item three",
        ],
        type: "unordered",
        spacing: "lg",
    },
};

/**
 * Ordered list with large spacing
 * 
 * Combines ordered list type with large spacing for better readability.
 */
export const OrderedLargeSpacing: Story = {
    args: {
        items: [
            "Step one: Initialize",
            "Step two: Configure",
            "Step three: Deploy",
            "Step four: Monitor",
        ],
        type: "ordered",
        spacing: "lg",
    },
};

/**
 * List with custom content using children
 * 
 * Demonstrates using children prop instead of items prop.
 * Allows for more complex content including links, bold text, etc.
 */
export const WithChildren: Story = {
    args: {
        type: "unordered",
        spacing: "md",
        children: (
            <>
                <li>
                    <strong>Bold item</strong> with additional text
                </li>
                <li>
                    Item with <a href="#" className="text-primary underline">a link</a>
                </li>
                <li>
                    <em>Italic item</em> for emphasis
                </li>
                <li>
                    Item with <code className="bg-muted px-1 py-0.5 rounded">code</code> inline
                </li>
            </>
        ),
    },
};

/**
 * Ordered list with children
 * 
 * Shows an ordered list using children prop with custom formatting.
 */
export const OrderedWithChildren: Story = {
    args: {
        type: "ordered",
        spacing: "md",
        children: (
            <>
                <li>
                    <strong>First priority:</strong> Complete the main task
                </li>
                <li>
                    <strong>Second priority:</strong> Review and test
                </li>
                <li>
                    <strong>Third priority:</strong> Document changes
                </li>
            </>
        ),
    },
};

/**
 * Real-world example: Feature list
 * 
 * A practical example showing a feature list that might appear
 * on a product page or documentation.
 */
export const FeatureList: Story = {
    args: {
        items: [
            "Responsive design for all devices",
            "Dark mode support",
            "Accessible components",
            "TypeScript support",
            "Customizable themes",
        ],
        type: "unordered",
        spacing: "md",
        className: "max-w-md",
    },
};

/**
 * Real-world example: Instructions
 * 
 * A practical example showing step-by-step instructions
 * using an ordered list.
 */
export const Instructions: Story = {
    args: {
        items: [
            "Open the application",
            "Navigate to Settings",
            "Select your preferences",
            "Click Save to apply changes",
        ],
        type: "ordered",
        spacing: "md",
        className: "max-w-md",
    },
};

/**
 * Mixed content example
 * 
 * Demonstrates a list with varied content types and formatting.
 */
export const MixedContent: Story = {
    args: {
        type: "unordered",
        spacing: "lg",
        children: (
            <>
                <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Completed task with checkmark</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-warning">⚠</span>
                    <span>Warning item with icon</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-destructive">✗</span>
                    <span>Error item with icon</span>
                </li>
                {/* <li className="flex items-start gap-1">
                    <strong>First priority:</strong> Complete the main task
                </li>
                <li>
                    <strong>Second priority:</strong> Review and test
                </li>
                <li>
                    <strong>Third priority:</strong> Document changes
                </li> */}
            </>
        ),
    },
};

/**
 * Compact list example
 * 
 * Shows a compact list suitable for sidebars or tight spaces.
 */
export const Compact: Story = {
    args: {
        items: [
            "Quick link 1",
            "Quick link 2",
            "Quick link 3",
        ],
        type: "unordered",
        spacing: "sm",
        className: "text-sm",
    },
};

/**
 * All spacing variants comparison
 * 
 * Visual comparison of all three spacing variants side by side.
 */
export const SpacingComparison = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
            <h3 className="text-sm font-semibold mb-2">Small Spacing</h3>
            <ListBasic
                items={["Item one", "Item two", "Item three"]}
                type="unordered"
                spacing="sm"
            />
        </div>
        <div>
            <h3 className="text-sm font-semibold mb-2">Medium Spacing</h3>
            <ListBasic
                items={["Item one", "Item two", "Item three"]}
                type="unordered"
                spacing="md"
            />
        </div>
        <div>
            <h3 className="text-sm font-semibold mb-2">Large Spacing</h3>
            <ListBasic
                items={["Item one", "Item two", "Item three"]}
                type="unordered"
                spacing="lg"
            />
        </div>
    </div>
);

/**
 * Unordered vs Ordered comparison
 * 
 * Side-by-side comparison of unordered and ordered list types.
 */
export const TypeComparison = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
            <h3 className="text-sm font-semibold mb-2">Unordered List</h3>
            <ListBasic
                items={["Bullet point one", "Bullet point two", "Bullet point three"]}
                type="unordered"
                spacing="md"
            />
        </div>
        <div>
            <h3 className="text-sm font-semibold mb-2">Ordered List</h3>
            <ListBasic
                items={["Numbered item one", "Numbered item two", "Numbered item three"]}
                type="ordered"
                spacing="md"
            />
        </div>
    </div>
);

