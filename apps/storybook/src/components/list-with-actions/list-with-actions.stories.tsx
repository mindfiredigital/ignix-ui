import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback } from "react";
import { ListWithActions, type ListWithActionsProps } from "./index";

/**
 * Storybook Stories for ListWithActions Component
 *
 * This file showcases different usage patterns of the `ListWithActions` component,
 * including hover/focus based actions and mobile-friendly always-visible actions.
 *
 * @file list-with-actions.stories.tsx
 */

/**
 * Storybook metadata configuration for ListWithActions.
 *
 * Defines the component's title, description, and control options in Storybook UI.
 */
const meta: Meta<typeof ListWithActions> = {
  title: "Components/List With Actions",
  component: ListWithActions,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The **ListWithActions** component renders a list where each item has contextual actions
such as **Edit**, **Delete**, or **View**.

### Behavior
- **Desktop**: Actions are shown when the row is hovered or focused.
- **Keyboard**: Focusing a row (tab) reveals its actions.
- **Mobile**: Actions are always visible for each item.

### Use cases
- Managing entities (users, projects, tasks) with inline actions.
- Showing contextual operations without cluttering the UI.
        `,
      },
    },
  },
  argTypes: {
    items: {
      control: "object",
      description: "Array of items rendered in the list.",
    },
    type: {
      control: "select",
      options: ["unordered", "ordered"],
      description: "List marker style inherited from ListBasic.",
      defaultValue: "unordered",
    },
    actions: {
      control: "object",
      description: "Array of action definitions applied to every item.",
    },
    spacing: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Vertical spacing between list rows.",
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

type Story = StoryObj<typeof ListWithActions>;

/**
 * Utility hook used in multiple stories to create stable action callbacks.
 *
 * Demonstrates how consumers can memoize callbacks to avoid unnecessary re-renders
 * in parent components when passing actions.
 */
const useDemoActions = (): ListWithActionsProps["actions"] => {
  const handleEdit = useCallback((index: number) => {
    // In a real app, replace console.log with edit logic.
    console.log("Edit item at index", index);
  }, []);

  const handleView = useCallback((index: number) => {
    console.log("View item at index", index);
  }, []);

  const handleDelete = useCallback((index: number) => {
    console.log("Delete item at index", index);
  }, []);

  return [
    { id: "view", label: "View", ariaLabel: "View item", onClick: handleView },
    { id: "edit", label: "Edit", ariaLabel: "Edit item", onClick: handleEdit },
    { id: "delete", label: "Delete", ariaLabel: "Delete item", onClick: handleDelete },
  ];
};

/**
 * Default configuration: simple text items with three actions.
 *
 * Validates:
 * - Actions appear when hovering or focusing rows on desktop.
 * - Buttons are clickable and log to the console.
 * - On smaller screens, actions are always visible.
 */
export const Default: Story = {
  render: (args) => {
    const actions = useDemoActions();

    return (
      <ListWithActions
        {...args}
        items={[
          "Design landing page",
          "Implement authentication flow",
          "Review pull requests",
          "Prepare release notes",
        ]}
        actions={actions}
      />
    );
  },
  args: {
    spacing: "md",
  },
};

/**
 * Dense list example using small spacing.
 *
 * Useful for compact layouts like sidebars or condensed tables.
 */
export const DenseList: Story = {

  render: (args) => {
    const actions = useDemoActions();

    return (
      <ListWithActions
        {...args}
        spacing="sm"
        items={[
          "User A",
          "User B",
          "User C",
          "User D",
          "User E",
        ]}
        actions={actions}
      />
    );
  }
};

/**
 * List with custom item content (titles, descriptions, badges).
 *
 * Demonstrates more complex JSX content per row with the same actions.
 */
export const WithRichContent: Story = {
  render: (args) => {
    const actions = useDemoActions();

    const items = [
      (
        <div className="flex flex-col">
          <span className="font-medium">Analytics Dashboard</span>
          <span className="text-xs text-muted-foreground">
            Last updated 2 hours ago
          </span>
        </div>
      ),
      (
        <div className="flex flex-col">
          <span className="font-medium">Marketing Campaign</span>
          <span className="text-xs text-muted-foreground">
            Running · Ends in 3 days
          </span>
        </div>
      ),
      (
        <div className="flex flex-col">
          <span className="font-medium">Billing Integration</span>
          <span className="text-xs text-muted-foreground">
            In review · 4 comments
          </span>
        </div>
      ),
    ];

    return (
      <ListWithActions
        {...args}
        spacing="lg"
        items={items}
        actions={actions}
      />
    );
  },
};

/**
 * Ordered list example using numeric markers.
 *
 * Demonstrates `ListWithActions` with `type="ordered"` showing ordered steps.
 */
export const Ordered: Story = {
  render: (args) => {
    const actions = useDemoActions();

    return (
      <ListWithActions
        {...args}
        type="ordered"
        items={[
          "Gather requirements",
          "Design the solution",
          "Implement features",
          "Test and deploy",
        ]}
        actions={actions}
      />
    );
  },
};

/**
 * UnOrdered list example using numeric markers.
 *
 * Demonstrates `ListWithActions` with `type="unordered"` showing UnOrdered steps.
 */
export const UnOrdered: Story = {
  render: (args) => {
    const actions = useDemoActions();

    return (
      <ListWithActions
        {...args}
        type="unordered"
        items={[
          "Item 1",
          "Item 2",
          "Item 3",
          "Item 4",
        ]}
        actions={actions}
      />
    );
  },
};





