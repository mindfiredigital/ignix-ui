// signin/signin-form.stories.tsx

import { SignIn } from "./";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

// Mock onSubmit handler
// const handleSubmit = (data: any) => {
//     console.log("SignIn form submitted:", data);
//     return new Promise((resolve) => setTimeout(resolve, 2000));
// };

const meta: Meta<typeof SignIn> = {
    title: "Forms/SignIn",
    component: SignIn,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "A unified login form component supporting both centered and split layouts. Features multiple variants, animations, validation, and responsive design.",
            },
        },
    },
    argTypes: {
        type: {
            control: { type: "radio" },
            options: ["centered", "split"],
            description: "Layout type - centered or split layout.",
            defaultValue: "centered",
        },
        variant: {
            control: { type: "select" },
            options: ["default", "modern", "glass", "dark", "gradient"],
            description: "Visual theme variant for the form.",
            defaultValue: "default",
        },
        companyName: {
            control: { type: "text" },
            description: "Company/brand name displayed in split layout info panel.",
            if: { arg: 'type', eq: 'split' },
        },
        loading: {
            control: { type: "boolean" },
            description: "Loading state for form submission.",
        },
        error: {
            control: { type: "text" },
            description: "Error message to display above the form.",
        },
        showSocialLogin: {
            control: { type: "boolean" },
            description: "Show/hide social login buttons.",
            defaultValue: false,
        },
        showForgotPassword: {
            control: { type: "boolean" },
            description: "Show/hide forgot password link.",
            defaultValue: true,
        },
        showSignUpLink: {
            control: { type: "boolean" },
            description: "Show/hide sign up link.",
            defaultValue: true,
        },
        onSubmit: {
            action: "submitted",
            description: "Callback function when form is submitted.",
        },
        onSignUp: {
            action: "sign-up-clicked",
            description: "Callback function when user clicks sign-up link.",
        },
    },
};

export default meta;
type Story = StoryObj<typeof SignIn>;

// 🎯 Default Centered Form
export const DefaultCentered: Story = {
    name: "Default (Centered)",
    args: {
        type: "centered",
        variant: "default",
        loading: false,
        error: "",
        showSocialLogin: true,
        showForgotPassword: true,
        showSignUpLink: true,
    },
};

// 🎯 Default Split Form
export const DefaultSplit: Story = {
    name: "Default (Split)",
    args: {
        type: "split",
        variant: "default",
        companyName: "YourBrand",
        loading: false,
        error: "",
        showSocialLogin: true,
        showForgotPassword: true,
        showSignUpLink: true,
    },
};

// 🎨 Modern Variant - Centered
// export const ModernCentered: Story = {
//     name: "Modern (Centered)",
//     args: {
//         ...DefaultCentered.args,
//         variant: "modern",
//     },
// };

// 🎨 Modern Variant - Split
// export const ModernSplit: Story = {
//     name: "Modern (Split)",
//     args: {
//         ...DefaultSplit.args,
//         variant: "modern",
//         companyName: "TechCorp",
//     },
// };

// 🎭 Glass Variant - Centered
// export const GlassCentered: Story = {
//     name: "Glass (Centered)",
//     args: {
//         ...DefaultCentered.args,
//         variant: "glass",
//     },
// };

// 🌈 Gradient Variant - Split
// export const GradientSplit: Story = {
//     name: "Gradient (Split)",
//     args: {
//         ...DefaultSplit.args,
//         variant: "gradient",
//         companyName: "InnovateLabs",
//     },
// };

// 🌙 Dark Variant - Centered
export const DarkCentered: Story = {
    name: "Dark (Centered)",
    args: {
        ...DefaultCentered.args,
        variant: "dark",
    },
};

// 🌙 Dark Variant - Split
export const DarkSplit: Story = {
    name: "Dark (Split)",
    args: {
        ...DefaultSplit.args,
        variant: "dark",
        companyName: "DarkMode Inc",
    },
};

// Add this story to demonstrate the sign-up functionality
export const WithSignUpNavigation: Story = {
    name: "With Sign Up Navigation",
    args: {
        ...DefaultCentered.args,
        onSignUp: () => {
            alert("Navigating to sign-up page...");
            // In real app: router.push('/signup')
        },
    },
};

// ⏳ Loading State - Centered
// export const LoadingCentered: Story = {
//     name: "Loading (Centered)",
//     args: {
//         ...DefaultCentered.args,
//         loading: true,
//     },
// };

// ⏳ Loading State - Split
// export const LoadingSplit: Story = {
//     name: "Loading (Split)",
//     args: {
//         ...DefaultSplit.args,
//         loading: true,
//     },
// };

// ❌ Error State - Centered
// export const WithErrorCentered: Story = {
//     name: "With Error (Centered)",
//     args: {
//         ...DefaultCentered.args,
//         error: "Invalid email or password. Please try again.",
//     },
// };

// ❌ Error State - Split
// export const WithErrorSplit: Story = {
//     name: "With Error (Split)",
//     args: {
//         ...DefaultSplit.args,
//         error: "Your account has been temporarily locked. Please try again in 15 minutes.",
//     },
// };

// 🔗 No Forgot Password - Centered
// export const NoForgotPasswordCentered: Story = {
//     name: "No Forgot Password (Centered)",
//     args: {
//         ...DefaultCentered.args,
//         showForgotPassword: false,
//     },
// };

// 🔗 No Sign Up Link - Split
// export const NoSignUpLinkSplit: Story = {
//     name: "No Sign Up Link (Split)",
//     args: {
//         ...DefaultSplit.args,
//         showSignUpLink: false,
//     },
// };

// 🔐 With Social Login - Centered
// export const WithSocialLoginCentered: Story = {
//     name: "With Social Login (Centered)",
//     args: {
//         ...DefaultCentered.args,
//         showSocialLogin: true,
//     },
// };

// 🔐 With Social Login - Split
// export const WithSocialLoginSplit: Story = {
//     name: "With Social Login (Split)",
//     args: {
//         ...DefaultSplit.args,
//         showSocialLogin: true,
//     },
// };

// 🏢 Custom Company Name - Split
// export const CustomBrandSplit: Story = {
//     name: "Custom Brand (Split)",
//     args: {
//         ...DefaultSplit.args,
//         companyName: "Acme Corporation",
//     },
// };

// Interactive Example with State Management
// export const InteractiveCentered: Story = {
//     name: "Interactive (Centered)",
//     render: function Render(args) {
//         const [loading, setLoading] = useState(false);
//         const [error, setError] = useState("");

//         const handleSubmit = async (data: any) => {
//             setLoading(true);
//             setError("");
//             // Simulate API call
//             await new Promise(resolve => setTimeout(resolve, 2000));

//             // Randomly simulate success or error
//             const isSuccess = Math.random() > 0.5;
//             if (!isSuccess) {
//                 setError("Invalid credentials. Please check your email and password.");
//             }

//             setLoading(false);
//             console.log("SignIn form submitted:", data);

//             if (isSuccess) {
//                 alert("Login successful!");
//             }
//         };

//         return (
//             <SignIn
//                 {...args}
//                 loading={loading}
//                 error={error}
//                 onSubmit={handleSubmit}
//             />
//         );
//     },
//     args: {
//         ...DefaultCentered.args,
//     },
// };

// Interactive Example with State Management - Split
// export const InteractiveSplit: Story = {
//     name: "Interactive (Split)",
//     render: function Render(args) {
//         const [loading, setLoading] = useState(false);
//         const [error, setError] = useState("");

//         const handleSubmit = async (data: any) => {
//             setLoading(true);
//             setError("");
//             // Simulate API call
//             await new Promise(resolve => setTimeout(resolve, 2000));

//             // Randomly simulate success or error
//             const isSuccess = Math.random() > 0.5;
//             if (!isSuccess) {
//                 setError("Login failed. Please check your credentials.");
//             }

//             setLoading(false);
//             console.log("SignIn form submitted:", data);

//             if (isSuccess) {
//                 alert("Welcome back!");
//             }
//         };

//         return (
//             <SignIn
//                 {...args}
//                 loading={loading}
//                 error={error}
//                 onSubmit={handleSubmit}
//             />
//         );
//     },
//     args: {
//         ...DefaultSplit.args,
//         companyName: "Interactive Corp",
//     },
// };

// Mobile View - Centered
// export const MobileViewCentered: Story = {
//     name: "Mobile View (Centered)",
//     args: {
//         ...DefaultCentered.args,
//     },
//     parameters: {
//         viewport: {
//             defaultViewport: "iphone12",
//         },
//         layout: "fullscreen",
//     },
// };

// Mobile View - Split (shows mobile responsive behavior)
// export const MobileViewSplit: Story = {
//     name: "Mobile View (Split)",
//     args: {
//         ...DefaultSplit.args,
//     },
//     parameters: {
//         viewport: {
//             defaultViewport: "iphone12",
//         },
//         layout: "fullscreen",
//     },
// };

// Tablet View - Centered
// export const TabletViewCentered: Story = {
//     name: "Tablet View (Centered)",
//     args: {
//         ...DefaultCentered.args,
//     },
//     parameters: {
//         viewport: {
//             defaultViewport: "ipad",
//         },
//         layout: "fullscreen",
//     },
// };

// Tablet View - Split
// export const TabletViewSplit: Story = {
//     name: "Tablet View (Split)",
//     args: {
//         ...DefaultSplit.args,
//     },
//     parameters: {
//         viewport: {
//             defaultViewport: "ipad",
//         },
//         layout: "fullscreen",
//     },
// };

// Desktop Large View - Split
// export const DesktopLargeSplit: Story = {
//     name: "Desktop Large (Split)",
//     args: {
//         ...DefaultSplit.args,
//     },
//     parameters: {
//         viewport: {
//             defaultViewport: "desktop",
//         },
//         layout: "fullscreen",
//     },
// };

// Form with All Features Enabled
// export const FullFeaturedCentered: Story = {
//     name: "Full Featured (Centered)",
//     args: {
//         ...DefaultCentered.args,
//         showSocialLogin: true,
//         showForgotPassword: true,
//         showSignUpLink: true,
//         variant: "modern",
//     },
// };

// Form with All Features Enabled - Split
// export const FullFeaturedSplit: Story = {
//     name: "Full Featured (Split)",
//     args: {
//         ...DefaultSplit.args,
//         companyName: "Enterprise Suite",
//         showSocialLogin: true,
//         showForgotPassword: true,
//         showSignUpLink: true,
//         variant: "gradient",
//     },
// };

// Minimalist Form
// export const MinimalistCentered: Story = {
//     name: "Minimalist (Centered)",
//     args: {
//         ...DefaultCentered.args,
//         showSocialLogin: false,
//         showForgotPassword: false,
//         showSignUpLink: false,
//         variant: "default",
//     },
// };

// All Variants Showcase
// export const VariantsShowcase: Story = {
//     name: "Variants Showcase",
//     render: function Render() {
//         const variants = ["default", "modern", "glass", "dark", "gradient"] as const;

//         return (
//             <div className="space-y-8 p-4">
//                 {variants.map(variant => (
//                     <div key={variant} className="space-y-4">
//                         <h3 className="text-lg font-semibold capitalize">{variant} Variant</h3>
//                         <div className="flex flex-col lg:flex-row gap-4">
//                             <div className="flex-1">
//                                 <h4 className="text-sm font-medium mb-2">Centered Layout</h4>
//                                 <div className="h-[500px] border rounded-lg overflow-hidden">
//                                     <SignIn
//                                         type="centered"
//                                         variant={variant}
//                                         companyName="YourBrand"
//                                     />
//                                 </div>
//                             </div>
//                             <div className="flex-1">
//                                 <h4 className="text-sm font-medium mb-2">Split Layout</h4>
//                                 <div className="h-[500px] border rounded-lg overflow-hidden">
//                                     <SignIn
//                                         type="split"
//                                         variant={variant}
//                                         companyName="YourBrand"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         );
//     },
//     parameters: {
//         layout: "fullscreen",
//     },
// };