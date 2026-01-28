import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback } from "react";
import { ListWithStatus, type ListItemWithStatus } from "./index";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

/**
 * Storybook Stories for ListWithStatus Component
 *
 * This file showcases different usage patterns of the `ListWithStatus` component,
 * including items with status badges, icons, titles, and descriptions.
 *
 * Stories include:
 * - Default list with status badges
 * - Different status types (success, error, warning, info, pending)
 * - Ordered and unordered list variants
 * - Different spacing options
 * - Custom status labels and icons
 * - Click handlers
 *
 * @file list-with-status.stories.tsx
 */

/**
 * Storybook metadata configuration for ListWithStatus.
 *
 * Defines the component's title, description, and control options in Storybook UI.
 */
const meta: Meta<typeof ListWithStatus> = {
  title: "Components/List With Status",
  component: ListWithStatus,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The **ListWithStatus** component renders a list where each item displays a status badge
with appropriate colors and icons, along with a title and optional description.

### Features
- **Status badges**: Color-coded badges for different status types (success, error, warning, info, pending)
- **Status icons**: Visual icons for each status type
- **Title and description**: Clear text hierarchy with readable typography
- **Consistent spacing**: Inherits spacing options from ListBasic (sm, md, lg)
- **List markers**: Supports both ordered and unordered list styles

### Use cases
- Transaction lists with status indicators
- Order tracking with status updates
- Notification lists with status badges
- Task lists with completion status
        `,
      },
    },
  },
  argTypes: {
    items: {
      control: "object",
      description: "Array of items, each with title, description, and status.",
    },
    type: {
      control: "select",
      options: ["unordered", "ordered"],
      description: "List marker style inherited from ListBasic.",
      defaultValue: "unordered",
    },
    spacing: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Vertical spacing between list items.",
      defaultValue: "md",
    },
    className: {
      control: "text",
      description: "Additional classes for the list container.",
    },
    itemClassName: {
      control: "text",
      description: "Additional classes for each list row.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ListWithStatus>;

/**
 * Sample data for stories - items with different statuses.
 * This data is used across multiple stories to demonstrate different configurations.
 */
const sampleItems: ListItemWithStatus[] = [
  {
    id: "1",
    title: "Payment Processed",
    description: "Your payment has been successfully processed",
    status: "success",
  },
  {
    id: "2",
    title: "Order Failed",
    description: "Unable to process your order. Please try again.",
    status: "error",
  },
  {
    id: "3",
    title: "Shipping Delayed",
    description: "Your shipment may arrive later than expected",
    status: "warning",
  },
  {
    id: "4",
    title: "Account Updated",
    description: "Your account information has been updated",
    status: "info",
  },
];

/**
 * Default configuration: list with status badges, titles, and descriptions.
 *
 * Validates:
 * - Status badges are visible with appropriate colors
 * - Text (title and description) is readable
 * - Icons are displayed correctly
 */
export const Default: Story = {
  args: {
    items: sampleItems,
    spacing: "md",
  },
};

/**
 * List with success status items.
 *
 * Demonstrates items with success status badges (green).
 */
export const SuccessStatus: Story = {
  args: {
    items: [
      {
        id: "1",
        title: "Payment Completed",
        description: "Transaction completed successfully",
        status: "success",
      },
      {
        id: "2",
        title: "Order Shipped",
        description: "Your order has been shipped",
        status: "success",
      },
      {
        id: "3",
        title: "Account Verified",
        description: "Email verification completed",
        status: "success",
      },
    ],
    spacing: "md",
  },
};

/**
 * List with error status items.
 *
 * Demonstrates items with error status badges (red).
 */
export const ErrorStatus: Story = {
  args: {
    items: [
      {
        id: "1",
        title: "Payment Failed",
        description: "Your payment could not be processed",
        status: "error",
      },
      {
        id: "2",
        title: "Connection Error",
        description: "Unable to connect to the server",
        status: "error",
      },
      {
        id: "3",
        title: "Validation Failed",
        description: "Please check your input and try again",
        status: "error",
      },
    ],
    spacing: "md",
  },
};

/**
 * List with warning status items.
 *
 * Demonstrates items with warning status badges (yellow/orange).
 */
export const WarningStatus: Story = {
  args: {
    items: [
      {
        id: "1",
        title: "Low Stock",
        description: "Only 3 items remaining in stock",
        status: "warning",
      },
      {
        id: "2",
        title: "Payment Pending",
        description: "Your payment is being processed",
        status: "warning",
      },
      {
        id: "3",
        title: "Action Required",
        description: "Please complete your profile to continue",
        status: "warning",
      },
    ],
    spacing: "md",
  },
};

/**
 * List with info status items.
 *
 * Demonstrates items with info status badges (blue).
 */
export const InfoStatus: Story = {
  args: {
    items: [
      {
        id: "1",
        title: "New Feature Available",
        description: "Check out our latest updates",
        status: "info",
      },
      {
        id: "2",
        title: "System Maintenance",
        description: "Scheduled maintenance on March 15th",
        status: "info",
      },
      {
        id: "3",
        title: "Documentation Updated",
        description: "New guides have been added",
        status: "info",
      },
    ],
    spacing: "md",
  },
};

/**
 * List with pending status items.
 *
 * Demonstrates items with pending status badges (gray).
 */
export const PendingStatus: Story = {
  args: {
    items: [
      {
        id: "1",
        title: "Order Processing",
        description: "Your order is being prepared",
        status: "pending",
      },
      {
        id: "2",
        title: "Review Pending",
        description: "Waiting for admin approval",
        status: "pending",
      },
      {
        id: "3",
        title: "Verification In Progress",
        description: "Your documents are being reviewed",
        status: "pending",
      },
    ],
    spacing: "md",
  },
};

/**
 * Ordered list variant with numeric markers.
 *
 * Demonstrates the component with ordered list markers (1, 2, 3...).
 */
export const Ordered: Story = {
  args: {
    items: sampleItems,
    type: "ordered",
    spacing: "md",
  },
};

/**
 * Unordered list variant with bullet markers.
 *
 * Demonstrates the component with unordered list markers (•).
 */
export const Unordered: Story = {
  args: {
    items: sampleItems,
    type: "unordered",
    spacing: "md",
  },
};


/**
 * List with small spacing.
 *
 * Useful for dense layouts or when space is limited.
 */
export const SmallSpacing: Story = {
  args: {
    items: sampleItems,
    spacing: "sm",
  },
};

/**
 * List with large spacing.
 *
 * Ideal for better readability and visual separation.
 */
export const LargeSpacing: Story = {
  args: {
    items: sampleItems,
    spacing: "lg",
  },
};

/**
 * List with custom status labels.
 *
 * Demonstrates how individual items can override the default status label.
 */
export const CustomStatusLabels: Story = {
  args: {
    items: [
      {
        id: "1",
        title: "Transaction Complete",
        description: "Payment processed successfully",
        status: "success",
        statusLabel: "Completed",
      },
      {
        id: "2",
        title: "Issue Detected",
        description: "An error occurred during processing",
        status: "error",
        statusLabel: "Failed",
      },
      {
        id: "3",
        title: "Attention Needed",
        description: "Please review the following items",
        status: "warning",
        statusLabel: "Review Required",
      },
    ],
    spacing: "md",
  },
};

/**
 * List with custom status icons.
 *
 * Demonstrates how individual items can override the default status icon.
 */
export const CustomStatusIcons: Story = {
  args: {
    items: [
      {
        id: "1",
        title: "Task Completed",
        description: "All tasks have been finished",
        status: "success",
        statusIcon: <CheckCircle2 className="h-3 w-3" />,
      },
      {
        id: "2",
        title: "Critical Issue",
        description: "Immediate action required",
        status: "error",
        statusIcon: <XCircle className="h-3 w-3" />,
      },
      {
        id: "3",
        title: "Reminder",
        description: "Don't forget to complete this",
        status: "warning",
        statusIcon: <AlertCircle className="h-3 w-3" />,
      },
    ],
    spacing: "md",
  },
};

/**
 * List with custom click handler.
 *
 * Demonstrates using a custom onClick handler for items.
 */
export const WithCustomClickHandler: Story = {
  render: (args) => {
    const handleItemClick = useCallback((item: ListItemWithStatus, index: number) => {
      console.log("Clicked item:", item.title, "at index:", index);
      // In a real app, you might navigate or perform other actions
      alert(`Clicked on ${item.title} (status: ${item.status})`);
    }, []);

    return (
      <ListWithStatus
        {...args}
        items={sampleItems}
        onItemClick={handleItemClick}
      />
    );
  },
  args: {
    spacing: "md",
  },
};

/**
 * Mixed status types.
 *
 * Demonstrates a list with various status types together.
 */
export const MixedStatuses: Story = {
  args: {
    items: [
      {
        id: "1",
        title: "Payment Successful",
        description: "Your payment of $99.99 was processed",
        status: "success",
      },
      {
        id: "2",
        title: "Order Processing",
        description: "Your order is being prepared for shipment",
        status: "pending",
      },
      {
        id: "3",
        title: "Low Inventory Alert",
        description: "Stock levels are running low",
        status: "warning",
      },
      {
        id: "4",
        title: "System Update",
        description: "New features are now available",
        status: "info",
      },
      {
        id: "5",
        title: "Transaction Failed",
        description: "Unable to process your request",
        status: "error",
      },
    ],
    spacing: "md",
  },
};

/**
 * Long titles and descriptions.
 *
 * Tests text truncation and readability with longer content.
 */
export const LongContent: Story = {
  args: {
    items: [
      {
        id: "1",
        title: "Payment Processing Completed Successfully",
        description: "Your payment of $1,234.56 has been successfully processed and your order will be shipped within 2-3 business days",
        status: "success",
      },
      {
        id: "2",
        title: "Critical System Error Detected",
        description: "An unexpected error occurred while processing your request. Our team has been notified and is working to resolve this issue",
        status: "error",
      },
      {
        id: "3",
        title: "Important Security Update Required",
        description: "Please update your account security settings to ensure the safety of your personal information and prevent unauthorized access",
        status: "warning",
      },
    ],
    spacing: "md",
  },
};

/**
 * Real-world example: Transaction history.
 *
 * A practical example showing a transaction list with status indicators.
 */
export const TransactionHistory: Story = {
  args: {
    items: [
      {
        id: "1",
        title: "Payment Received",
        description: "From: John Doe • Amount: $500.00",
        status: "success",
      },
      {
        id: "2",
        title: "Payment Pending",
        description: "From: Jane Smith • Amount: $250.00",
        status: "pending",
      },
      {
        id: "3",
        title: "Payment Failed",
        description: "From: Bob Johnson • Amount: $100.00",
        status: "error",
      },
      {
        id: "4",
        title: "Refund Processed",
        description: "To: Alice Williams • Amount: $75.00",
        status: "success",
      },
    ],
    spacing: "md",
  },
};

/**
 * Real-world example: Order tracking.
 *
 * A practical example showing order status tracking.
 */
export const OrderTracking: Story = {
  args: {
    items: [
      {
        id: "1",
        title: "Order Confirmed",
        description: "Order #12345 has been confirmed",
        status: "success",
      },
      {
        id: "2",
        title: "Processing",
        description: "Your order is being prepared",
        status: "pending",
      },
      {
        id: "3",
        title: "Shipped",
        description: "Your order has been shipped via FedEx",
        status: "success",
      },
      {
        id: "4",
        title: "Delivery Delayed",
        description: "Expected delivery: March 20th (was March 18th)",
        status: "warning",
      },
    ],
    spacing: "md",
  },
};

/**
 * All spacing variants comparison.
 *
 * Visual comparison of all three spacing variants side by side.
 */
export const SpacingComparison = () => {
  const items: ListItemWithStatus[] = [
    {
      id: "1",
      title: "Item One",
      description: "Description",
      status: "success",
    },
    {
      id: "2",
      title: "Item Two",
      description: "Description",
      status: "info",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="text-sm font-semibold mb-2">Small Spacing</h3>
        <ListWithStatus items={items} spacing="sm" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Medium Spacing</h3>
        <ListWithStatus items={items} spacing="md" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Large Spacing</h3>
        <ListWithStatus items={items} spacing="lg" />
      </div>
    </div>
  );
};

/**
 * Status type comparison.
 *
 * Visual comparison of all status types.
 */
export const StatusTypeComparison = () => {
  const items: ListItemWithStatus[] = [
    {
      id: "1",
      title: "Success Status",
      description: "Operation completed successfully",
      status: "success",
    },
    {
      id: "2",
      title: "Error Status",
      description: "An error occurred",
      status: "error",
    },
    {
      id: "3",
      title: "Warning Status",
      description: "Attention required",
      status: "warning",
    },
    {
      id: "4",
      title: "Info Status",
      description: "Informational message",
      status: "info",
    },
    {
      id: "5",
      title: "Pending Status",
      description: "Operation in progress",
      status: "pending",
    },
  ];

  return (
    <div className="space-y-4">
      <ListWithStatus items={items} spacing="md" />
    </div>
  );
};

