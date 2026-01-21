import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserCard } from ".";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";
import { Users, MessageCircle, Heart, Share2, TrendingUp } from "lucide-react";

const meta: Meta<typeof UserCard> = {
  title: "Templates/Patterns/UserCard",
  component: UserCard,
  parameters: {
    layout: "centered",
  },
  args: {
    name: "Alex Thompson",
    role: "Senior Frontend Developer",
    bio: "Passionate about building beautiful and accessible user interfaces. Love working with React, TypeScript, and modern web technologies.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    socialLinks: [
      {
        platform: "github",
        url: "https://github.com/alexthompson",
        label: "GitHub",
        icon: FaGithub,
      },
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/alexthompson",
        label: "LinkedIn",
        icon: FaLinkedin,
      },
      {
        platform: "twitter",
        url: "https://twitter.com/alexthompson",
        label: "Twitter",
        icon: FaTwitter,
      },
    ],
    variant: "default",
    size: "md",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "elevated", "glass", "outline", "minimal"],
      description: "Card variant style",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "Card size",
    },
    orientation: {
      control: "radio",
      options: ["vertical", "horizontal"],
      description: "Card layout orientation",
    },
    headerImage: {
      control: "text",
      description: "Header/banner image URL (for horizontal layout)",
    },
    avatarSize: {
      control: "select",
      options: [
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
        "6xl",
      ],
      description: "Avatar size (overrides size-based default)",
    },
    avatarShape: {
      control: "select",
      options: [
        "circle",
        "square",
        "rounded",
        "hexagon",
        "pentagon",
        "star",
        "diamond",
      ],
      description: "Avatar shape",
    },
    avatarBordered: {
      control: "boolean",
      description: "Show avatar border",
    },
    avatarStatus: {
      control: "select",
      options: ["online", "offline", "away", "busy", undefined],
      description: "Avatar status indicator",
    },
    name: {
      control: "text",
      description: "User's full name",
    },
    role: {
      control: "text",
      description: "User's role or job title",
    },
    bio: {
      control: "text",
      description: "User's bio or description",
    },
    avatar: {
      control: "text",
      description: "Avatar image URL",
    },
  },
};

export default meta;

type Story = StoryObj<typeof UserCard>;

export const Default: Story = {
  args: {},
};

export const WithoutSocialLinks: Story = {
  args: {
    socialLinks: [],
  },
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex flex-row gap-3 items-center w-full max-w-4xl">
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="w-full max-w-3xl">
          <UserCard
            name="Alex Thompson"
            role="Senior Frontend Developer"
            bio="Passionate about building beautiful and accessible user interfaces."
            avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
            socialLinks={[
              { platform: "github", url: "https://github.com", label: "GitHub", icon: FaGithub },
              { platform: "linkedin", url: "https://linkedin.com", label: "LinkedIn", icon: FaLinkedin },
              { platform: "twitter", url: "https://twitter.com", label: "Twitter", icon: FaTwitter },
            ]}
            size={size}
            className="w-full"
          />
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const DifferentVariants: Story = {
  render: () => {
    const variants = [
      {
        variant: "default" as const,
        bio: "Short bio.",
      },
      {
        variant: "elevated" as const,
        bio: "This is a medium length bio that describes the user's background and expertise in their field.",
      },
      {
        variant: "glass" as const,
        bio: "Building beautiful interfaces.",
      },
      {
        variant: "outline" as const,
        bio: "This is a very long bio that contains a lot of information about the user's professional background, their skills, experience, and achievements. It goes on and on to demonstrate how the card handles longer text content without breaking the layout.",
      },
      {
        variant: "minimal" as const,
        bio: "Minimal design approach.",
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl items-stretch">
        {variants.map(({ variant, bio }) => (
          <UserCard
            key={variant}
            name="Alex Thompson"
            role="Senior Frontend Developer"
            bio={bio}
            avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
            socialLinks={[
              { platform: "github", url: "https://github.com", label: "GitHub", icon: FaGithub },
              { platform: "linkedin", url: "https://linkedin.com", label: "LinkedIn", icon: FaLinkedin },
            ]}
            variant={variant}
            className="w-full h-full"
          />
        ))}
      </div>
    );
  },
  parameters: {
    layout: "padded",
  },
};

export const WithAvatarShapes: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
      {(
        [
          "circle",
          "square",
          "rounded",
          "hexagon",
          "star",
          "diamond",
        ] as const
      ).map((shape) => (
        <UserCard
          key={shape}
          name="Alex Thompson"
          role="Developer"
          avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
          avatarShape={shape}
          socialLinks={[
            { platform: "github", url: "https://github.com", label: "GitHub", icon: FaGithub },
          ]}
          className="w-full"
        />
      ))}
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const WithStatusIndicators: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
      {(["online", "away", "busy", "offline"] as const).map((status) => (
        <UserCard
          key={status}
          name="Alex Thompson"
          role="Developer"
          avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
          avatarStatus={status}
          socialLinks={[
            { platform: "github", url: "https://github.com", label: "GitHub", icon: FaGithub },
            { platform: "linkedin", url: "https://linkedin.com", label: "LinkedIn", icon: FaLinkedin },
          ]}
          className="w-full"
        />
      ))}
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const WithoutAvatarImage: Story = {
  args: {
    avatar: undefined,
  },
};

export const ResponsiveGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
      {[
        {
          name: "Alex Thompson",
          role: "Frontend Developer",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        },
        {
          name: "Sarah Johnson",
          role: "UI/UX Designer",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        },
        {
          name: "Michael Chen",
          role: "Backend Engineer",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        },
        {
          name: "Emily Davis",
          role: "Product Manager",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
        },
        {
          name: "David Wilson",
          role: "DevOps Engineer",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        },
        {
          name: "Lisa Anderson",
          role: "Full Stack Developer",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
        },
      ].map((user, index) => (
        <UserCard
          key={index}
          name={user.name}
          role={user.role}
          avatar={user.avatar}
          bio="Building amazing products with passion and dedication."
          socialLinks={[
            { platform: "github", url: "https://github.com", label: "GitHub", icon: FaGithub },
            { platform: "linkedin", url: "https://linkedin.com", label: "LinkedIn", icon: FaLinkedin },
            { platform: "twitter", url: "https://twitter.com", label: "Twitter", icon: FaTwitter },
          ]}
          className="w-full"
        />
      ))}
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

export const DarkMode: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="dark bg-background min-h-screen p-8">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "centered",
  },
};

export const HorizontalLayout: Story = {
  args: {
    orientation: "horizontal",
    name: "CHRISTIAN SØGAARD MOEN",
    username: "christiansmoen",
    bio: "Brand and communication strategy, graphic design, illustration, art direction and portrait photography.",
    role: "Creative at Superblaise",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    className: "max-w-2xl",
    socialLinks: [
      {
        platform: "website",
        url: "https://example.com",
        label: "Website",
        icon: FaGithub,
      },
      {
        platform: "facebook",
        url: "https://facebook.com",
        label: "Facebook",
        icon: FaFacebook,
      },
      {
        platform: "instagram",
        url: "https://instagram.com",
        label: "Instagram",
        icon: FaInstagram,
      },
      {
        platform: "twitter",
        url: "https://twitter.com",
        label: "Twitter",
        icon: FaTwitter,
      },
    ],
  },
  parameters: {
    layout: "centered",
  },
};

export const AdvancedDesign: Story = {
  args: {
    advanced: true,
    name: "Sarah Johnson",
    username: "sarahj",
    role: "Senior UI/UX Designer",
    bio: "Creating beautiful and intuitive user experiences. Passionate about design systems, accessibility, and user-centered design.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    verified: true,
    stats: [
      { label: "Projects", value: 124, icon: TrendingUp },
      { label: "Followers", value: "12.5K", icon: Users },
      { label: "Likes", value: "8.9K", icon: Heart },
    ],
    actions: [
      { label: "Follow", variant: "default", icon: Users },
      { label: "Message", variant: "outline", icon: MessageCircle },
    ],
    socialLinks: [
      {
        platform: "twitter",
        url: "https://twitter.com/sarahj",
        label: "Twitter",
        icon: FaTwitter,
      },
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/sarahj",
        label: "LinkedIn",
        icon: FaLinkedin,
      },
      {
        platform: "github",
        url: "https://github.com/sarahj",
        label: "GitHub",
        icon: FaGithub,
      },
    ],
  },
  parameters: {
    layout: "centered",
  },
};

export const PremiumUser: Story = {
  args: {
    advanced: true,
    name: "Alex Chen",
    username: "alexchen",
    role: "Full Stack Developer",
    bio: "Building the future of web applications with React, TypeScript, and modern technologies.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    premium: true,
    stats: [
      { label: "Repositories", value: 89 },
      { label: "Contributions", value: "2.1K" },
      { label: "Stars", value: "15.3K" },
    ],
    actions: [
      { label: "Follow", variant: "default" },
      { label: "Sponsor", variant: "outline" },
    ],
    backgroundPattern: "dots",
    socialLinks: [
      {
        platform: "github",
        url: "https://github.com/alexchen",
        label: "GitHub",
        icon: FaGithub,
      },
      {
        platform: "twitter",
        url: "https://twitter.com/alexchen",
        label: "Twitter",
        icon: FaTwitter,
      },
    ],
  },
  parameters: {
    layout: "centered",
  },
};

export const AdvancedBackgroundDesign: Story = {
  args: {
    advanced: true,
    name: "Emma Davis",
    username: "emmadavis",
    role: "Product Manager",
    size: "md",
    bio: "Leading product strategy and innovation. Passionate about creating products that users love.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    headerImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    verified: true,
      stats: [
      { label: "Projects", value: 124, icon: TrendingUp },
      { label: "Followers", value: "12.5K", icon: Users },
      { label: "Likes", value: "8.9K", icon: Heart },
    ],
    actions: [
      { label: "Connect", variant: "default", icon: MessageCircle },
      { label: "Share", variant: "ghost", icon: Share2 },
    ],
    backgroundPattern: "waves",
    socialLinks: [
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/emmadavis",
        label: "LinkedIn",
        icon: FaLinkedin,
      },
      {
        platform: "twitter",
        url: "https://twitter.com/emmadavis",
        label: "Twitter",
        icon: FaTwitter,
      },
    ],
    className: "max-w-2xl",
  },
  parameters: {
    layout: "centered",
  },
};
