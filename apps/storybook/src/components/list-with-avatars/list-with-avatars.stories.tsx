import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback } from "react";
import { ListWithAvatars, type ListItemWithAvatar } from "./index";

/**
 * Storybook Stories for ListWithAvatars Component
 *
 * This file showcases different usage patterns of the `ListWithAvatars` component,
 * including items with avatars, names, descriptions, and profile links.
 *
 * Stories include:
 * - Default list with avatars, names, and descriptions
 * - Items with profile links
 * - Different avatar sizes and shapes
 * - Ordered and unordered list variants
 * - Different spacing options
 * - Custom content examples
 *
 * @file list-with-avatars.stories.tsx
 */

/**
 * Storybook metadata configuration for ListWithAvatars.
 *
 * Defines the component's title, description, and control options in Storybook UI.
 */
const meta: Meta<typeof ListWithAvatars> = {
  title: "Components/List With Avatars",
  component: ListWithAvatars,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
The **ListWithAvatars** component renders a list where each item displays an avatar on the left
and text content (name and description) on the right. Items can optionally link to profile pages.

### Features
- **Avatar alignment**: Avatars are consistently aligned on the left side
- **Text readability**: Name and description are clearly readable with proper typography
- **Profile links**: Optional clickable links to user profiles
- **Flexible avatars**: Support for images, initials, or icons
- **Consistent spacing**: Inherits spacing options from ListBasic (sm, md, lg)
- **List markers**: Supports both ordered and unordered list styles

### Use cases
- User directories and team listings
- Contact lists with profile navigation
- Member directories
- Staff or contributor listings
        `,
      },
    },
  },
  argTypes: {
    items: {
      control: "object",
      description: "Array of items, each with avatar, name, and description.",
    },
    type: {
      control: "select",
      options: ["unordered", "ordered", undefined],
      description: "List marker style inherited from ListBasic.",
      defaultValue: undefined,
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
    avatarSize: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"],
      description: "Default size for all avatars. Can be overridden per item.",
      defaultValue: "md",
    },
    avatarShape: {
      control: "select",
      options: ["circle", "square", "rounded"],
      description: "Default shape for all avatars. Can be overridden per item.",
      defaultValue: "circle",
    },
    showProfileLinks: {
      control: "boolean",
      description: "Whether to make items clickable via profileLink.",
      defaultValue: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof ListWithAvatars>;

/**
 * Sample data for stories - users with avatars, names, and descriptions.
 * This data is used across multiple stories to demonstrate different configurations.
 */
const sampleUsers: ListItemWithAvatar[] = [
  {
    id: "1",
    name: "John Doe",
    description: "Software Engineer",
    profileLink: "/profile/john-doe",
    avatarSrc: "https://i.pravatar.cc/150?img=1",
    avatarAlt: "John Doe",
  },
  {
    id: "2",
    name: "Jane Smith",
    description: "Product Designer",
    profileLink: "/profile/jane-smith",
    avatarSrc: "https://i.pravatar.cc/150?img=2",
    avatarAlt: "Jane Smith",
  },
  {
    id: "3",
    name: "Bob Johnson",
    description: "UX Researcher",
    profileLink: "/profile/bob-johnson",
    avatarLetters: "BJ",
  },
  {
    id: "4",
    name: "Alice Williams",
    description: "Frontend Developer",
    profileLink: "/profile/alice-williams",
    avatarSrc: "https://i.pravatar.cc/150?img=4",
    avatarAlt: "Alice Williams",
  },
];

/**
 * Default configuration: list with avatars, names, descriptions, and profile links.
 *
 * Validates:
 * - Avatars are aligned on the left
 * - Text (name and description) is readable
 * - Profile links are functional and clickable
 * - Proper spacing between items
 */
export const Default: Story = {
  args: {
    items: sampleUsers,
    spacing: "md",
    avatarSize: "md",
    avatarShape: "circle",
    showProfileLinks: true,
  },
};

/**
 * List with small avatars and compact spacing.
 *
 * Useful for dense layouts or when space is limited.
 */
export const SmallAvatars: Story = {
  args: {
    items: sampleUsers,
    spacing: "sm",
    avatarSize: "sm",
    avatarShape: "circle",
    showProfileLinks: true,
  },
};

/**
 * List with large avatars and generous spacing.
 *
 * Ideal for prominent displays or when avatars are a key visual element.
 */
export const LargeAvatars: Story = {
  args: {
    items: sampleUsers,
    spacing: "lg",
    avatarSize: "lg",
    avatarShape: "circle",
    showProfileLinks: true,
  },
};

/**
 * Ordered list variant with numeric markers.
 *
 * Demonstrates the component with ordered list markers (1, 2, 3...).
 */
export const Ordered: Story = {
  args: {
    items: sampleUsers,
    type: "ordered",
    spacing: "md",
    avatarSize: "md",
    avatarShape: "circle",
    showProfileLinks: true,
  },
};

/**
 * Unordered list variant with bullet markers.
 *
 * Demonstrates the component with unordered list markers (•).
 */
export const Unordered: Story = {
  args: {
    items: sampleUsers,
    type: "unordered",
    spacing: "md",
    avatarSize: "md",
    avatarShape: "circle",
    showProfileLinks: true,
  },
};

/**
 * List without markers (clean look).
 *
 * Shows items without list markers for a cleaner appearance.
 */
export const NoMarkers: Story = {
  args: {
    items: sampleUsers,
    spacing: "md",
    avatarSize: "md",
    avatarShape: "circle",
    showProfileLinks: true,
  },
};

/**
 * List with square avatars.
 *
 * Demonstrates different avatar shapes (square instead of circle).
 */
export const SquareAvatars: Story = {
  args: {
    items: sampleUsers,
    spacing: "md",
    avatarSize: "md",
    avatarShape: "square",
    showProfileLinks: true,
  },
};

/**
 * List with rounded avatars.
 *
 * Demonstrates rounded square avatar shape.
 */
export const RoundedAvatars: Story = {
  args: {
    items: sampleUsers,
    spacing: "md",
    avatarSize: "md",
    avatarShape: "rounded",
    showProfileLinks: true,
  },
};

/**
 * List with avatars using initials (no images).
 *
 * Shows how the component handles avatars with letter initials when images are not available.
 */
export const WithInitials: Story = {
  args: {
    items: [
      {
        id: "1",
        name: "John Doe",
        description: "Software Engineer",
        profileLink: "/profile/john-doe",
        avatarLetters: "JD",
      },
      {
        id: "2",
        name: "Jane Smith",
        description: "Product Designer",
        profileLink: "/profile/jane-smith",
        avatarLetters: "JS",
      },
      {
        id: "3",
        name: "Bob Johnson",
        description: "UX Researcher",
        profileLink: "/profile/bob-johnson",
        avatarLetters: "BJ",
      },
      {
        id: "4",
        name: "Alice Williams",
        description: "Frontend Developer",
        profileLink: "/profile/alice-williams",
        avatarLetters: "AW",
      },
    ],
    spacing: "md",
    avatarSize: "md",
    avatarShape: "circle",
    showProfileLinks: true,
  },
};

/**
 * List without profile links (non-clickable).
 *
 * Demonstrates the component when profile links are disabled.
 */
export const WithoutProfileLinks: Story = {
  args: {
    items: sampleUsers.map(({ ...item }) => item),
    spacing: "md",
    avatarSize: "md",
    avatarShape: "circle",
    showProfileLinks: false,
  },
};

/**
 * List with custom click handler.
 *
 * Demonstrates using a custom onClick handler instead of profile links.
 */
export const WithCustomClickHandler: Story = {
  render: (args) => {
    const handleItemClick = useCallback((item: ListItemWithAvatar, index: number) => {
      console.log("Clicked item:", item.name, "at index:", index);
      // In a real app, you might navigate programmatically or perform other actions
      alert(`Clicked on ${item.name} (index: ${index})`);
    }, []);

    return (
      <ListWithAvatars
        {...args}
        items={sampleUsers}
        onItemClick={handleItemClick}
        showProfileLinks={false}
      />
    );
  },
  args: {
    spacing: "md",
    avatarSize: "md",
    avatarShape: "circle",
  },
};

/**
 * Mixed avatar sizes per item.
 *
 * Demonstrates how individual items can override the default avatar size.
 */
export const MixedAvatarSizes: Story = {
  args: {
    items: [
      {
        id: "1",
        name: "John Doe",
        description: "Software Engineer",
        profileLink: "/profile/john-doe",
        avatarSrc: "https://i.pravatar.cc/150?img=1",
        avatarAlt: "John Doe",
        avatarSize: "sm",
      },
      {
        id: "2",
        name: "Jane Smith",
        description: "Product Designer",
        profileLink: "/profile/jane-smith",
        avatarSrc: "https://i.pravatar.cc/150?img=2",
        avatarAlt: "Jane Smith",
        avatarSize: "md",
      },
      {
        id: "3",
        name: "Bob Johnson",
        description: "UX Researcher",
        profileLink: "/profile/bob-johnson",
        avatarLetters: "BJ",
        avatarSize: "lg",
      },
      {
        id: "4",
        name: "Alice Williams",
        description: "Frontend Developer",
        profileLink: "/profile/alice-williams",
        avatarSrc: "https://i.pravatar.cc/150?img=4",
        avatarAlt: "Alice Williams",
        avatarSize: "xl",
      },
    ],
    spacing: "md",
    avatarSize: "md", // Default, but overridden per item
    avatarShape: "circle",
    showProfileLinks: true,
  },
};

/**
 * Long names and descriptions.
 *
 * Tests text truncation and readability with longer content.
 */
export const LongContent: Story = {
  args: {
    items: [
      {
        id: "1",
        name: "Dr. John Michael Doe",
        description: "Senior Software Engineer - Full Stack Development",
        profileLink: "/profile/john-doe",
        avatarSrc: "https://i.pravatar.cc/150?img=1",
        avatarAlt: "John Doe",
      },
      {
        id: "2",
        name: "Jane Elizabeth Smith",
        description: "Lead Product Designer - User Experience & Interface Design",
        profileLink: "/profile/jane-smith",
        avatarSrc: "https://i.pravatar.cc/150?img=2",
        avatarAlt: "Jane Smith",
      },
      {
        id: "3",
        name: "Robert James Johnson",
        description: "Principal UX Researcher - Human-Computer Interaction",
        profileLink: "/profile/bob-johnson",
        avatarLetters: "RJ",
      },
    ],
    spacing: "md",
    avatarSize: "md",
    avatarShape: "circle",
    showProfileLinks: true,
  },
};

/**
 * Real-world example: Team directory.
 *
 * A practical example showing a team directory with profile links.
 */
export const TeamDirectory: Story = {
  args: {
    items: [
      {
        id: "1",
        name: "Sarah Chen",
        description: "Engineering Manager",
        profileLink: "/team/sarah-chen",
        avatarSrc: "https://i.pravatar.cc/150?img=5",
        avatarAlt: "Sarah Chen",
      },
      {
        id: "2",
        name: "Michael Torres",
        description: "Senior Frontend Developer",
        profileLink: "/team/michael-torres",
        avatarSrc: "https://i.pravatar.cc/150?img=6",
        avatarAlt: "Michael Torres",
      },
      {
        id: "3",
        name: "Emily Davis",
        description: "Product Manager",
        profileLink: "/team/emily-davis",
        avatarLetters: "ED",
      },
      {
        id: "4",
        name: "David Kim",
        description: "Backend Developer",
        profileLink: "/team/david-kim",
        avatarSrc: "https://i.pravatar.cc/150?img=8",
        avatarAlt: "David Kim",
      },
    ],
    spacing: "md",
    avatarSize: "md",
    avatarShape: "circle",
    showProfileLinks: true,
  },
};

/**
 * All spacing variants comparison.
 *
 * Visual comparison of all three spacing variants side by side.
 */
export const SpacingComparison = () => {
  const items: ListItemWithAvatar[] = [
    {
      id: "1",
      name: "User One",
      description: "Description",
      profileLink: "/profile/1",
      avatarLetters: "U1",
    },
    {
      id: "2",
      name: "User Two",
      description: "Description",
      profileLink: "/profile/2",
      avatarLetters: "U2",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="text-sm font-semibold mb-2">Small Spacing</h3>
        <ListWithAvatars items={items} spacing="sm" avatarSize="md" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Medium Spacing</h3>
        <ListWithAvatars items={items} spacing="md" avatarSize="md" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Large Spacing</h3>
        <ListWithAvatars items={items} spacing="lg" avatarSize="md" />
      </div>
    </div>
  );
};

/**
 * Avatar size comparison.
 *
 * Visual comparison of different avatar sizes.
 */
export const AvatarSizeComparison = () => {
  const items: ListItemWithAvatar[] = [
    {
      id: "1",
      name: "Small Avatar",
      description: "Size: sm",
      profileLink: "/profile/1",
      avatarLetters: "SA",
    },
    {
      id: "2",
      name: "Medium Avatar",
      description: "Size: md",
      profileLink: "/profile/2",
      avatarLetters: "MA",
    },
    {
      id: "3",
      name: "Large Avatar",
      description: "Size: lg",
      profileLink: "/profile/3",
      avatarLetters: "LA",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold mb-2">Small (sm)</h3>
        <ListWithAvatars items={items} spacing="md" avatarSize="sm" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Medium (md)</h3>
        <ListWithAvatars items={items} spacing="md" avatarSize="md" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Large (lg)</h3>
        <ListWithAvatars items={items} spacing="md" avatarSize="lg" />
      </div>
    </div>
  );
};

