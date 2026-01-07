import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProfilePage } from ".";
import { Shield, Crown, Briefcase, } from "lucide-react";
import { Avatar } from "../../../../components/avatar";

const meta: Meta<typeof ProfilePage> = {
    title: "Templates/Pages/Account Management/Profile",
    component: ProfilePage,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "Enhanced User Profile page with avatar upload, animated inputs, social links, and theme variants using the design system components.",
            },
        },
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "gradient", "card", "glass", "dark"],
            description: "Visual theme for Profile page",
            table: {
                defaultValue: { summary: "default" },
            },
        },
        animationVariant: {
            control: "select",
            options: ["fadeUp", "scaleIn", "slideUp", "slideLeft", "slideRight"],
            description: "Animation variant for content entrance",
            table: {
                defaultValue: { summary: "fadeUp" },
            },
        },
        avatarShape: {
            control: "select",
            options: ["circle", "square", "rounded", "hexagon", "star", "diamond", "pentagon", "octagon"],
            description: "Shape of the avatar",
            table: {
                defaultValue: { summary: "circle" },
            },
        },
        avatarSize: {
            control: "select",
            options: ["md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl"],
            description: "Size of the avatar",
            table: {
                defaultValue: { summary: "3xl" },
            },
        },
        inputVariant: {
            control: "select",
            options: [
                "clean", "underline", "floating", "borderGlow", "shimmer", "particles",
                "slide", "scale", "rotate", "bounce", "elastic", "glow", "shake", "wave",
                "typewriter", "magnetic", "pulse", "borderBeam", "ripple", "particleField",
                "tilt3D", "materialFloat", "neonPulse", "glassmorphism"
            ],
            description: "Input animation variant",
            table: {
                defaultValue: { summary: "clean" },
            },
        },
        buttonVariant: {
            control: "select",
            options: [
                "default", "primary", "secondary", "success", "warning", "danger",
                "outline", "ghost", "link", "subtle", "elevated", "glass", "neon", "pill"
            ],
            description: "Button variant",
            table: {
                defaultValue: { summary: "default" },
            },
        },
        buttonAnimationVariant: {
            control: "select",
            options: [
                "bounce", "bounceSlow", "bounceFast", "bounceSmooth", "bounceJelly",
                "rotateClockwiseSlow", "rotateClockwiseFast", "rotateAntiClockwiseSlow",
                "rotateAntiClockwiseFast", "rotatePingPong", "scaleUp", "scaleDown",
                "scaleHeartBeat", "press3D", "press3DSoft", "press3DHard", "press3DPop",
                "press3DDepth", "spinSlow", "nina"
            ],
            description: "Button animation variant",
        },
        isLoading: {
            control: "boolean",
            description: "Show loading state",
            table: {
                defaultValue: { summary: "false" },
            },
        },
        showStatus: {
            control: "boolean",
            description: "Show status indicator",
            table: {
                defaultValue: { summary: "true" },
            },
        },
        status: {
            control: "select",
            options: ["online", "offline", "away", "busy"],
            description: "User status",
            table: {
                defaultValue: { summary: "online" },
            },
        },
        headerTitle: {
            control: "text",
            description: "Custom header title",
            table: {
                defaultValue: { summary: "Profile Settings" },
            },
        },
        editButtonLabel: {
            control: "text",
            description: "Label for edit button",
            table: {
                defaultValue: { summary: "Edit Profile" },
            },
        },
        // saveButtonLabel: {
        //     control: "text",
        //     description: "Label for save button",
        //     table: {
        //         defaultValue: { summary: "Save Changes" },
        //     },
        // },
        // cancelButtonLabel: {
        //     control: "text",
        //     description: "Label for cancel button",
        //     table: {
        //         defaultValue: { summary: "Cancel" },
        //     },
        // },
    },
    decorators: [
        (Story) => (
            <div className="min-h-screen">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof ProfilePage>;

// Sample profile data for stories
const sampleProfileData = {
    displayName: "Alex Thompson",
    email: "alex.thompson@example.com",
    bio: "Product designer with 8+ years of experience creating digital experiences. Passionate about user-centered design and building products that make a difference.",
    avatarUrl: null,
    socialLinks: [
        { id: "1", platform: "Twitter", url: "https://twitter.com/alexthompson" },
        { id: "2", platform: "GitHub", url: "https://github.com/alexthompson" },
        { id: "3", platform: "LinkedIn", url: "https://linkedin.com/in/alexthompson" },
    ],
    jobTitle: "Senior Product Designer",
    location: "San Francisco, CA",
    website: "https://alexthompson.design",
    phone: "+1 (555) 123-4567",
};

const minimalProfileData = {
    displayName: "Jamie Smith",
    email: "jamie.smith@work.com",
    bio: "",
    avatarUrl: null,
    socialLinks: [],
    jobTitle: "",
    location: "",
    website: "",
    phone: "",
};

const fullProfileData = {
    displayName: "Dr. Sarah Chen",
    email: "sarah.chen@university.edu",
    bio: "Professor of Computer Science specializing in Human-Computer Interaction. Author of 'Designing for Humans' and lead researcher at the Interactive Systems Lab. Currently exploring the intersection of AI and accessibility.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    socialLinks: [
        { id: "1", platform: "Website", url: "https://sarahchen.dev" },
        { id: "2", platform: "Twitter", url: "https://twitter.com/drsarahchen" },
        { id: "3", platform: "GitHub", url: "https://github.com/sarahchen" },
        { id: "4", platform: "LinkedIn", url: "https://linkedin.com/in/sarahchen" },
        { id: "5", platform: "Medium", url: "https://medium.com/@sarahchen" },
    ],
    jobTitle: "Professor of Computer Science",
    location: "Stanford, CA",
    website: "https://cs.stanford.edu/~schen",
    phone: "+1 (650) 123-7890",
};

// -------------------------------------
// STORIES
// -------------------------------------

// Default Profile
export const Default: Story = {
    args: {
        initialProfileData: sampleProfileData,
        variant: "default",
        animationVariant: "fadeUp",
        avatarShape: "circle",
        avatarSize: "3xl",
        inputVariant: "clean",
        buttonVariant: "primary",
        showStatus: true,
        // status: "online",
    },
};

// Gradient Theme with Animated Inputs
export const GradientWithAnimations: Story = {
    args: {
        ...Default.args,
        variant: "gradient",
        inputVariant: "borderGlow",
        buttonVariant: "primary",
        buttonAnimationVariant: "scaleHeartBeat",
        avatarShape: "circle",
    },
    name: "Gradient with Animations",
};

// Glass Theme with Premium Inputs
export const GlassThemePremium: Story = {
    args: {
        ...Default.args,
        variant: "glass",
        inputVariant: "glassmorphism",
        buttonVariant: "glass",
        buttonAnimationVariant: "press3DSoft",
        avatarShape: "rounded",
        avatarSize: "3xl",
        initialProfileData: fullProfileData,
    },
    name: "Glass Theme Premium",
};

// Dark Mode with Neon Effects
export const DarkModeNeon: Story = {
    args: {
        ...Default.args,
        variant: "dark",
        inputVariant: "neonPulse",
        buttonVariant: "neon",
        buttonAnimationVariant: "glow",
        avatarShape: "hexagon",
        showStatus: true,
        status: "away",
    },
    decorators: [
        (Story) => (
            <div className="dark min-h-screen bg-gray-950">
                <div className="dark">
                    <Story />
                </div>
            </div>
        ),
    ],
    name: "Dark Mode Neon",
};

// Minimal Profile
export const MinimalProfile: Story = {
    args: {
        initialProfileData: minimalProfileData,
        variant: "card",
        inputVariant: "underline",
        buttonVariant: "outline",
        showStatus: false,
    },
    name: "Minimal Profile",
};

// Complete Profile with All Features
export const CompleteProfile: Story = {
    args: {
        initialProfileData: fullProfileData,
        variant: "gradient",
        animationVariant: "slideLeft",
        inputVariant: "shimmer",
        buttonVariant: "primary",
        buttonAnimationVariant: "bounceSlow",
        avatarShape: "circle",
        showStatus: true,
        status: "online",
    },
    name: "Complete Profile",
};

// Loading State
export const Loading: Story = {
    args: {
        ...Default.args,
        isLoading: true,
    },
    name: "Loading State",
};

// Custom Header and Shapes
export const CustomHeaderShapes: Story = {
    args: {
        ...CompleteProfile.args,
        headerTitle: "My Professional Profile",
        headerIcon: <Briefcase className="w-4 h-4" />,
        avatarShape: "star",
        avatarSize: "3xl",
    },
    name: "Custom Header & Shapes",
};

// Premium User with Special Effects
export const PremiumUser: Story = {
    args: {
        ...CompleteProfile.args,
        headerTitle: "Premium Account",
        headerIcon: <Crown className="w-4 h-4 text-yellow-500" />,
        variant: "glass",
        inputVariant: "borderBeam",
        buttonVariant: "glass",
        buttonAnimationVariant: "nina",
        avatarShape: "circle",
        customHeader: (
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                    <Crown className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h1 className="font-semibold text-lg">Premium Account</h1>
                    <p className="text-xs text-muted-foreground">Pro plan • Active until Dec 2024</p>
                </div>
            </div>
        ),
    },
    name: "Premium User",
};

// Security Focused Profile
export const SecurityProfile: Story = {
    args: {
        ...Default.args,
        headerTitle: "Security Settings",
        headerIcon: <Shield className="w-4 h-4" />,
        inputVariant: "borderGlow",
        buttonVariant: "danger",
        showStatus: true,
        status: "busy",
        customAvatarSection: (
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-6">
                <div className="relative">
                    <div className="relative">
                        <Avatar
                            src="https://api.dicebear.com/7.x/shapes/svg?seed=Security"
                            alt="Security Profile"
                            shape="circle"
                            size="3xl"
                            bordered
                            status="online"
                            backgroundColor="#1e40af"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg border-2 border-background">
                        <span className="text-xs font-bold">✓</span>
                    </div>
                </div>
                <div className="text-center sm:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        Security Profile
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Two-factor authentication enabled
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                            Verified
                        </span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                            Encrypted
                        </span>
                    </div>
                </div>
            </div>
        ),
    },
    name: "Security Profile",
};


// Mobile View Simulation
export const MobileView: Story = {
    args: {
        ...Default.args,
    },
    parameters: {
        viewport: {
            defaultViewport: "mobile1",
        },
        layout: "fullscreen",
    },
    name: "Mobile View",
};

// Tablet View Simulation
export const TabletView: Story = {
    args: {
        ...CompleteProfile.args,
    },
    parameters: {
        viewport: {
            defaultViewport: "tablet",
        },
        layout: "fullscreen",
    },
    name: "Tablet View",
};

export const NewDefault: Story = {
    args: {
        initialProfileData: sampleProfileData,
        variant: "default",
        animationVariant: "fadeUp",
        avatarShape: "circle",
        avatarSize: "3xl",
        inputVariant: "clean",
        buttonVariant: "primary",
        showStatus: true,
        // status: "online",
    },
};

// Light theme story
export const LightTheme: Story = {
    args: {
        headerTitle: "My Profile",
        initialProfileData: {
            displayName: "John Doe",
            email: "john.doe@example.com",
            bio: "Software engineer with 5+ years of experience.",
            jobTitle: "Senior Software Engineer",
            location: "New York, NY",
            website: "https://johndoe.dev",
            phone: "+1 (555) 123-4567",
        },
        status: 'away'
    },
    parameters: {
        themes: {
            themeOverride: 'light', // This depends on your Storybook setup
        },
    },
    name: "Light Mode New",
};


export const DarkTheme: Story = {
    args: {
        ...Default.args,
        variant: "dark",
        inputVariant: "clean",
        buttonVariant: "primary",
        // buttonAnimationVariant: "glow",
        avatarShape: "circle",
        // showStatus: true,
        status: undefined,
        avatarSize: "3xl",
    },
    decorators: [
        (Story) => (
            <div className="dark">
                <Story />
            </div>
        ),
    ],
    name: "Dark Mode New",
};