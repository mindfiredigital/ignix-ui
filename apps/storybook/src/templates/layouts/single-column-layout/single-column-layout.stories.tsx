
import { SingleColumnLayout } from "./index";
import { Card } from "../../../components/card";
import { Button } from "../../../components/button";
import {
    Home,
    Search,
    Bell,
    User,
    Settings,
    Shield,
    Globe,
    Mail,
    Phone,
    MapPin
} from "lucide-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

// Reusable content component for consistency
const DemoContent = () => (
    <div className="space-y-6 text-center">
        <h2 className="text-2xl font-bold">Welcome to Single Column Layout</h2>
        <p className="text-muted-foreground">
            A responsive full-width layout with constrained content width (1200px max).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Card variant={"outline"} className="p-3">
                <h3 className="font-semibold">Responsive</h3>
                <p className="text-sm text-muted-foreground">Optimized for all screen sizes.</p>
            </Card>
            <Card variant={"outline"} className="p-3">
                <h3 className="font-semibold">Accessible</h3>
                <p className="text-sm text-muted-foreground">Semantic HTML with ARIA roles.</p>
            </Card>
            <Card variant={"outline"} className="p-3">
                <h3 className="font-semibold">Customizable</h3>
                <p className="text-sm text-muted-foreground">Supports theme variants and animations.</p>
            </Card>
        </div>
    </div>
);

const meta: Meta<typeof SingleColumnLayout> = {
    title: "Templates/Layouts/SingleColumnLayout",
    component: SingleColumnLayout,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "A highly customizable single-column layout with full control over header, content, and footer. Supports slots, render functions, and comprehensive configuration options.",
            },
        },
    },
    argTypes: {
        variant: {
            control: { type: "select" },
            options: ["default", "light", "dark", "glass", "gradient", "transparent", "solid", "modern"],
            description: "Visual theme variant for the layout.",
        },
        animation: {
            control: { type: "select" },
            options: ["none", "fade", "slide", "scale"],
            description: "Animation type for content transition.",
        },
        stickyHeader: {
            control: { type: "boolean" },
            description: "Makes the header sticky to the top.",
        },
        stickyFooter: {
            control: { type: "boolean" },
            description: "Makes the footer stick to the bottom.",
        },
        activeNavLink: {
            control: { type: "text" },
            description: "Currently active navigation link href",
        },
    },
};

export default meta;
type Story = StoryObj<typeof SingleColumnLayout>;

// 🌤️ Basic Example
export const Basic: Story = {
    args: {
        variant: "default",
        stickyHeader: true,
        stickyFooter: false,
        children: <DemoContent />,
    },
};

// 🎨 Fully Customized Header Example
export const CustomHeader: Story = {
    args: {
        variant: "modern",
        children: <DemoContent />,
        navLinks: [
            { label: "Dashboard", href: "#", icon: <Home className="w-4 h-4" /> },
            { label: "Discover", href: "#", icon: <Search className="w-4 h-4" /> },
            { label: "Notifications", href: "#", icon: <Bell className="w-4 h-4" /> },
            { label: "Profile", href: "#", icon: <User className="w-4 h-4" /> },
        ],
        logo: (
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                    <div className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        CustomBrand
                    </div>
                    <div className="text-xs text-slate-500">Premium Service</div>
                </div>
            </div>
        ),
        authComponents: {
            signIn: (
                <Button variant="ghost" size="sm" className="text-slate-700">
                    <User className="w-4 h-4 mr-2" />
                    Login
                </Button>
            ),
            signUp: (
                <Button
                    variant="default"
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                    Get Started Free
                </Button>
            ),
        },
        className: {
            header: "shadow-lg",
            main: "pt-12",
        },
    },
};

// 📱 Custom Footer Example
export const CustomFooter: Story = {
    args: {
        variant: "dark",
        children: <DemoContent />,
        footerContent: (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto py-8">
                <div>
                    <h3 className="font-bold text-lg mb-4">Company</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-white">About Us</a></li>
                        <li><a href="#" className="hover:text-white">Careers</a></li>
                        <li><a href="#" className="hover:text-white">Press</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">Support</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-white">Help Center</a></li>
                        <li><a href="#" className="hover:text-white">Community</a></li>
                        <li><a href="#" className="hover:text-white">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">Legal</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">Connect</h3>
                    <div className="flex space-x-4">
                        <Globe className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                        <Mail className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                        <Phone className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                        <MapPin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                    </div>
                </div>
            </div>
        ),
        showFooter: true,
        stickyFooter: true,
    },
};

// 🎭 Using Render Functions
export const RenderFunctionCustomization: Story = {
    args: {
        variant: "glass",
        children: <DemoContent />,
        renderHeader: ({ logo, navLinks, authControls, mobileMenuButton, _variant }) => (
            <div className="flex items-center justify-between w-full h-full px-6">
                {logo}
                <div className="flex-1 flex justify-center">
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks}
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    {authControls}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                    >
                        <Settings className="w-5 h-5" />
                    </Button>
                    {mobileMenuButton}
                </div>
            </div>
        ),
        renderFooter: ({ _variant, content }) => (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
                {content}
                <div className="flex space-x-4">
                    <Button variant="ghost" size="sm">Privacy Policy</Button>
                    <Button variant="ghost" size="sm">Terms of Service</Button>
                    <Button variant="ghost" size="sm">Contact</Button>
                </div>
            </div>
        ),
    },
};

// 🎛️ Complete Control Example
export const CompleteControl: Story = {
    args: {
        variant: "transparent",
        children: <DemoContent />,
        header: (
            <div className="flex items-center justify-between w-full h-full px-8">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500" />
                    <div className="text-2xl font-bold text-blue-900">MyApp</div>
                </div>
                <div className="flex items-center space-x-6">
                    <a href="#" className="text-blue-800 hover:text-blue-600 font-medium">Home</a>
                    <a href="#" className="text-blue-800 hover:text-blue-600 font-medium">Features</a>
                    <a href="#" className="text-blue-800 hover:text-blue-600 font-medium">Pricing</a>
                    <Button className="bg-blue-600 hover:bg-blue-700">Try Free</Button>
                </div>
            </div>
        ),
        footer: (
            <div className="flex items-center justify-between px-8 py-4 bg-blue-800 text-white">
                <div>© 2025 MyApp. All rights reserved.</div>
                <div className="flex space-x-6">
                    <a href="#" className="hover:text-blue-200">Twitter</a>
                    <a href="#" className="hover:text-blue-200">LinkedIn</a>
                    <a href="#" className="hover:text-blue-200">GitHub</a>
                </div>
            </div>
        ),
        contentWrapper: (children) => (
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/50" />
                <div className="relative z-10">{children}</div>
            </div>
        ),
        onNavLinkClick: (href, label) => {
            console.log(`Navigating to ${label}: ${href}`);
        },
        onSignInClick: () => {
            // console.log("Sign in clicked");
        },
        onSignUpClick: () => {
            // console.log("Sign up clicked");
        },
    },
};

// 📊 With Sidebar Content Example
export const WithSidebarContent: Story = {
    args: {
        variant: "light",
        children: (
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 hidden lg:block pr-8">
                    <Card className="p-4">
                        <h3 className="font-bold mb-4">Navigation</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="block p-2 hover:bg-gray-100 rounded">Overview</a></li>
                            <li><a href="#" className="block p-2 hover:bg-gray-100 rounded">Analytics</a></li>
                            <li><a href="#" className="block p-2 hover:bg-gray-100 rounded">Reports</a></li>
                            <li><a href="#" className="block p-2 hover:bg-gray-100 rounded">Settings</a></li>
                        </ul>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <DemoContent />
                </div>
            </div>
        ),
        contentPadding: "px-8 py-12",
        maxWidth: "max-w-[1400px]",
    },
};

// 🎯 Minimal Layout
export const Minimal: Story = {
    args: {
        variant: "light",
        children: <DemoContent />,
        showAuthControls: false,
        navLinks: [],
        logo: <div className="text-xl font-bold">Minimal</div>,
        className: {
            header: "border-none",
            footer: "border-none",
        },
        showFooter: false,
    },
};

// 🎨 Modern Variant with Custom Colors
// 🎨 Modern Variant with Custom Colors - Updated Version
export const ModernCustom: Story = {
    args: {
        variant: "modern",
        stickyHeader: true,
        stickyFooter: false,
        children: <DemoContent />,
        activeNavLink: "#",
        navLinks: [
            { label: "Home", href: "#", icon: <Home className="w-4 h-4" /> },
            { label: "Features", href: "#", icon: <Search className="w-4 h-4" /> },
            { label: "Pricing", href: "#", icon: <Bell className="w-4 h-4" /> },
            { label: "Contact", href: "#", icon: <User className="w-4 h-4" /> },
        ],
        className: {
            root: "bg-gradient-to-br from-slate-50 to-blue-50",
            header: "bg-white/80 backdrop-blur-md border-slate-200",
        },
    },
    parameters: {
        docs: {
            description: {
                story: "Modern variant with custom colors. Hover effects on all nav links with active state highlighting. No bottom borders on nav links.",
            },
        },
    },
};

// 🎯 All Variants with Hover Effects
export const AllVariantsShowcase: Story = {
    render: () => (
        <div className="space-y-8 p-8">
            <div>
                <h3 className="text-lg font-semibold mb-4">Default Variant</h3>
                <SingleColumnLayout
                    variant="default"
                    activeNavLink="#"
                    children={<div className="h-32"></div>}
                    navLinks={[
                        { label: "Home", href: "#" },
                        { label: "About", href: "#" },
                        { label: "Services", href: "#" },
                    ]}
                    showFooter={false}
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Modern Variant (No Bottom Borders)</h3>
                <SingleColumnLayout
                    variant="modern"
                    activeNavLink="#About"
                    children={<div className="h-32"></div>}
                    navLinks={[
                        { label: "Home", href: "#" },
                        { label: "About", href: "#About" },
                        { label: "Services", href: "#" },
                    ]}
                    showFooter={false}
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Dark Variant</h3>
                <SingleColumnLayout
                    variant="dark"
                    activeNavLink="#Services"
                    children={<div className="h-32"></div>}
                    navLinks={[
                        { label: "Home", href: "#" },
                        { label: "About", href: "#" },
                        { label: "Services", href: "#Services" },
                    ]}
                    showFooter={false}
                />
            </div>
        </div>
    ),
};

// 🎭 Interactive Hover Demo
export const InteractiveHoverDemo: Story = {
    args: {
        variant: "modern",
        children: (
            <div className="space-y-8">
                <div className="text-center">
                    <h3 className="text-xl font-bold mb-4">Hover over navigation links to see effects</h3>
                    <p className="text-slate-600">Each variant has distinct hover and active states</p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <Card className="p-4">
                        <h4 className="font-semibold mb-2">Hover Effects</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="text-green-600">✓ Background color change</li>
                            <li className="text-green-600">✓ Text color transition</li>
                            <li className="text-green-600">✓ Smooth animations</li>
                            <li className="text-green-600">✓ Rounded corners</li>
                            <li className="text-red-600">✗ No bottom borders</li>
                        </ul>
                    </Card>

                    <Card className="p-4">
                        <h4 className="font-semibold mb-2">Active States</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="text-green-600">✓ Bold font weight</li>
                            <li className="text-green-600">✓ Distinct background</li>
                            <li className="text-green-600">✓ High contrast colors</li>
                            <li className="text-green-600">✓ Persistent styling</li>
                        </ul>
                    </Card>
                </div>
            </div>
        ),
        activeNavLink: "#Features",
        navLinks: [
            { label: "Home", href: "#", icon: <Home className="w-4 h-4" /> },
            { label: "Features", href: "#Features", icon: <Search className="w-4 h-4" /> },
            { label: "Pricing", href: "#Pricing", icon: <Bell className="w-4 h-4" /> },
        ],
    },
    parameters: {
        docs: {
            description: {
                story: "Interactive demo showing hover effects and active states. Hover over navigation items to see smooth transitions.",
            },
        },
    },
};