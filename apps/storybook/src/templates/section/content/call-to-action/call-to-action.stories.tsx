
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
    CTABanner,
    CTABannerHeading,
    CTABannerSubheading,
    CTABannerActions,
    CTABannerButton,
    CTABannerContent,
    CTABannerImage,
    CTABannerNewsletter,
    CTABannerDemoRequest,
    CTABannerContactForm,
    DemoFormHeading,
    DemoFormSubheading,
    ContactFormHeading,
    ContactFormSubheading,
    NewsletterHeading,
    NewsletterSubheading
} from ".";
import { Calendar, Zap, Star, HelpCircle, Send, Mail, Users, Rocket, CheckCircle } from "lucide-react";

const meta: Meta<typeof CTABanner> = {
    title: "Templates/Section/Content/CTA Banner",
    component: CTABanner,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "A full-width Call-to-Action banner component with multiple layout variants, themes, and form types.",
            },
        },
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "primary", "secondary", "accent", "muted", "gradient", "glass", "dark", "light"],
            description: "Visual variant of the banner",
            table: {
                defaultValue: { summary: "default" },
            },
        },
        layout: {
            control: "select",
            options: ["centered", "split", "compact"],
            description: "Layout arrangement",
            table: {
                defaultValue: { summary: "centered" },
            },
        },
        contentAlign: {
            control: "select",
            options: ["left", "center", "right"],
            description: "Content alignment within the banner",
            table: {
                defaultValue: { summary: "center" },
            },
        },
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
type Story = StoryObj<typeof CTABanner>;

/* ============================================
   0. CENTERED WITH WHITE/BLACK BACKGROUND
============================================ */

// Light theme stories
export const CenteredBannerLight: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="centered"
            contentAlign="center"
            padding="lg"
            animate={true}
        >
            <CTABannerContent>
                <CTABannerHeading>Let's Get In Touch</CTABannerHeading>
                <CTABannerSubheading>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                </CTABannerSubheading>
                <CTABannerActions>
                    <CTABannerButton
                        label="Book a Call"
                        variant="primary"
                        icon={Calendar}
                    />
                    <CTABannerButton
                        label="Explore"
                        variant="outline"
                    />
                </CTABannerActions>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "0.1 Centered Banner - Light",
};

export const CenteredNewsletterLight: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="centered"
            contentAlign="center"
            padding="lg"
        >
            <CTABannerContent>
                <CTABannerNewsletter
                    placeholder="you@example.com"
                    submitText="Subscribe Now"
                    privacyNote="We'll never share your email. Unsubscribe at any time."
                >
                    <NewsletterHeading>Stay Updated</NewsletterHeading>
                    <NewsletterSubheading>
                        Subscribe to our newsletter for the latest updates, tips, and exclusive content.
                    </NewsletterSubheading>
                </CTABannerNewsletter>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "0.2 Centered Newsletter - Light (with Children)",
};

export const CenteredDemoRequestLight: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="centered"
            contentAlign="center"
            padding="lg"
        >
            <CTABannerContent>
                <CTABannerDemoRequest
                    submitText="Schedule Demo"
                    requireCompany={true}
                    requirePhone={false}
                    layout="single"
                >
                    <DemoFormHeading>See Our Product in Action</DemoFormHeading>
                    <DemoFormSubheading>
                        Get a personalized demo tailored to your business needs.
                    </DemoFormSubheading>
                </CTABannerDemoRequest>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "0.3 Centered Demo Request - Light (with Children)",
};

export const CenteredContactFormLight: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="centered"
            contentAlign="center"
            padding="lg"
        >
            <CTABannerContent>
                <CTABannerContactForm
                    submitText="Send Message"
                    requireSubject={true}
                    maxMessageLength={500}
                    layout="vertical"
                >
                    <ContactFormHeading>Get In Touch</ContactFormHeading>
                    <ContactFormSubheading>
                        Have questions? We're here to help. Send us a message.
                    </ContactFormSubheading>
                </CTABannerContactForm>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "0.4 Centered Contact Form - Light (with Children)",
};

// Dark theme stories
export const CenteredBannerDark: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="centered"
            contentAlign="center"
            padding="lg"
            animate={true}
        >
            <CTABannerContent>
                <CTABannerHeading>Let's Get In Touch</CTABannerHeading>
                <CTABannerSubheading>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                </CTABannerSubheading>
                <CTABannerActions>
                    <CTABannerButton
                        label="Book a Call"
                        variant="primary"
                        icon={Calendar}
                    />
                    <CTABannerButton
                        label="Explore"
                        variant="outline"
                    />
                </CTABannerActions>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "0.5 Centered Banner - Dark",
};

export const CenteredNewsletterDark: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="centered"
            contentAlign="center"
            padding="lg"
        >
            <CTABannerContent>
                <CTABannerNewsletter
                    placeholder="Enter your email"
                    submitText="Join Now"
                    buttonVariant="outline"
                    privacyNote="By subscribing, you agree to our Privacy Policy."
                >
                    <NewsletterHeading>Join Our Community</NewsletterHeading>
                    <NewsletterSubheading>
                        Get weekly insights, industry news, and special offers delivered to your inbox.
                    </NewsletterSubheading>
                </CTABannerNewsletter>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "0.6 Centered Newsletter - Dark (with Children)",
};

export const CenteredDemoRequestDark: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="centered"
            contentAlign="center"
            padding="lg"
        >
            <CTABannerContent>
                <CTABannerDemoRequest
                    submitText="Request Demo"
                    requireCompany={true}
                    requirePhone={true}
                    layout="two-column"
                >
                    <DemoFormHeading>Experience the Future Today</DemoFormHeading>
                    <DemoFormSubheading>
                        Join thousands of businesses already transforming their operations.
                    </DemoFormSubheading>
                </CTABannerDemoRequest>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "0.7 Centered Demo Request - Dark (with Children)",
};

export const CenteredContactFormDark: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="centered"
            contentAlign="center"
            padding="lg"
        >
            <CTABannerContent>
                <CTABannerContactForm
                    submitText="Submit Inquiry"
                    requireSubject={false}
                    maxMessageLength={1000}
                    layout="compact"
                >
                    <ContactFormHeading>Contact Our Team</ContactFormHeading>
                    <ContactFormSubheading>
                        Our support team is ready to assist you with any questions.
                    </ContactFormSubheading>
                </CTABannerContactForm>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "0.8 Centered Contact Form - Dark (with Children)",
};

/* ============================================
   1. SPLIT WITH IMAGE ON RIGHT/LEFT
============================================ */

// Light theme - Image Right
export const SplitBannerLightImageRight: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="split"
            contentAlign="left"
            imagePosition="right"
            padding="xl"
        >
            <CTABannerContent>
                <CTABannerHeading>Connect With Our Team</CTABannerHeading>
                <CTABannerSubheading>
                    Our experts are ready to help you achieve your goals. Schedule a personalized
                    consultation today.
                </CTABannerSubheading>
                <CTABannerActions>
                    <CTABannerButton
                        label="Schedule Now"
                        variant="primary"
                        icon={Calendar}
                    />
                    <CTABannerButton
                        label="Contact Us"
                        variant="outline"
                    />
                </CTABannerActions>
            </CTABannerContent>
            <CTABannerImage
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Team collaboration"
                className="h-[420px] lg:h-[480px]"
            />
        </CTABanner>
    ),
    name: "1.1 Split Banner - Light Theme - Image Right",
};

export const SplitNewsletterLightImageRight: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="split"
            contentAlign="left"
            imagePosition="right"
            padding="xl"
        >
            <CTABannerContent>
                <CTABannerNewsletter
                    placeholder="Your email address"
                    submitText="Subscribe"
                    privacyNote="No spam, ever. Unsubscribe in one click."
                >
                    <NewsletterHeading>Never Miss an Update</NewsletterHeading>
                    <NewsletterSubheading>
                        Subscribe to our curated newsletter for the latest articles and resources.
                    </NewsletterSubheading>
                </CTABannerNewsletter>
            </CTABannerContent>
            <CTABannerImage
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Newsletter subscription"
                className="h-[420px] lg:h-[480px]"
            />
        </CTABanner>
    ),
    name: "1.2 Split Newsletter - Light Theme - Image Right (with Children)",
};

// Dark theme - Image Left
export const SplitBannerDarkImageLeft: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="split"
            contentAlign="right"
            imagePosition="left"
            padding="xl"
            animate={true}
            imageVariant="dark"
        >
            <CTABannerContent>
                <CTABannerHeading>Connect With Our Team</CTABannerHeading>
                <CTABannerSubheading>
                    Our experts are ready to help you achieve your goals. Schedule a personalized
                    consultation today.
                </CTABannerSubheading>
                <CTABannerActions>
                    <CTABannerButton
                        label="Schedule Now"
                        variant="primary"
                        icon={Calendar}
                    />
                    <CTABannerButton
                        label="Contact Us"
                        variant="outline"
                    />
                </CTABannerActions>
            </CTABannerContent>
            <CTABannerImage
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Team collaboration"
                className="h-[420px] lg:h-[480px]"
            />
        </CTABanner>
    ),
    name: "1.3 Split Banner - Dark Theme - Image Left",
};

export const SplitDemoRequestDarkImageRight: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="split"
            contentAlign="left"
            imagePosition="right"
            padding="xl"
        >
            <CTABannerContent>
                <CTABannerDemoRequest
                    namePlaceholder="John Doe"
                    emailPlaceholder="john@company.com"
                    companyPlaceholder="Acme Inc."
                    phonePlaceholder="(555) 123-4567"
                    submitText="Book My Demo"
                    requireCompany={true}
                    layout="single"
                >
                    <DemoFormHeading>See How It Works</DemoFormHeading>
                    <DemoFormSubheading>
                        Get a hands-on walkthrough from our experts with real use cases.
                    </DemoFormSubheading>
                </CTABannerDemoRequest>
            </CTABannerContent>
            <CTABannerImage
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Product demo"
                className="h-[420px] lg:h-[480px]"
            />
        </CTABanner>
    ),
    name: "1.4 Split Demo Request - Dark Theme - Image Right (with Children)",
};

export const SplitContactFormLightImageLeft: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="split"
            contentAlign="right"
            imagePosition="left"
            padding="xl"
        >
            <CTABannerContent>
                <CTABannerContactForm
                    namePlaceholder="Your name"
                    emailPlaceholder="your.email@example.com"
                    subjectPlaceholder="How can we help?"
                    messagePlaceholder="Please provide details about your inquiry..."
                    submitText="Send Message"
                    maxMessageLength={750}
                    layout="compact"
                >
                    <ContactFormHeading>We're Here to Help</ContactFormHeading>
                    <ContactFormSubheading>
                        Whether you have questions about features, pricing, or implementation.
                    </ContactFormSubheading>
                </CTABannerContactForm>
            </CTABannerContent>
            <CTABannerImage
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Support team"
                className="h-[420px] lg:h-[480px]"
            />
        </CTABanner>
    ),
    name: "1.5 Split Contact Form - Light Theme - Image Left (with Children)",
};

/* ============================================
   2. BACKGROUND IMAGE STORIES
============================================ */

// Light theme with background image
export const CenteredBackgroundImageBannerLight: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1663427929868-3941f957bb36?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            padding="2xl"
            animate={true}
        >
            {/* Light overlay for light theme */}
            <div className="absolute inset-0 bg-white/30" />
            <CTABannerContent className="relative z-10">
                <CTABannerHeading className="text-gray-900">
                    Experience Excellence
                </CTABannerHeading>
                <CTABannerSubheading className="text-gray-800 max-w-2xl">
                    Join our community of innovators and thought leaders shaping the future of technology.
                </CTABannerSubheading>
                <CTABannerActions>
                    <CTABannerButton
                        label="Get Started"
                        variant="primary"
                        icon={Zap}
                        className="bg-gray-900 text-white hover:bg-gray-800"
                    />
                    <CTABannerButton
                        label="Watch Demo"
                        variant="outline"
                        className="border-gray-900 text-gray-900 hover:bg-gray-900/10"
                    />
                </CTABannerActions>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "2.1 Centered Banner - Background Image - Light Theme",
};

export const CenteredBackgroundImageNewsletterLight: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
            padding="xl"
            animate={true}
        >
            <div className="absolute inset-0 bg-white/40" />
            <CTABannerContent className="relative z-10">
                <CTABannerNewsletter
                    placeholder="you@example.com"
                    submitText="Subscribe"
                    buttonVariant="primary"
                    privacyNote=""
                >
                    <NewsletterHeading className="text-gray-900">
                        Stay Connected
                    </NewsletterHeading>
                    <NewsletterSubheading className="text-gray-800">
                        Subscribe for exclusive content and early access to new features.
                    </NewsletterSubheading>
                </CTABannerNewsletter>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "2.2 Centered Newsletter - Background Image - Light Theme",
};

// Dark theme with background image
export const CenteredBackgroundImageBannerDark: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1663427929868-3941f957bb36?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            padding="2xl"
            animate={true}
        >
            {/* Dark overlay for dark theme */}
            <div className="absolute inset-0 bg-black/60" />
            <CTABannerContent className="relative z-10">
                <CTABannerHeading className="text-white">
                    Experience Excellence
                </CTABannerHeading>
                <CTABannerSubheading className="text-gray-200 max-w-2xl">
                    Join our community of innovators and thought leaders shaping the future of technology.
                </CTABannerSubheading>
                <CTABannerActions>
                    <CTABannerButton
                        label="Get Started"
                        variant="primary"
                        icon={Zap}
                        className="bg-white text-gray-900 hover:bg-gray-100"
                    />
                    <CTABannerButton
                        label="Watch Demo"
                        variant="outline"
                        className="border-white text-white hover:bg-white/10"
                    />
                </CTABannerActions>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "2.3 Centered Banner - Background Image - Dark Theme",
};

export const CenteredBackgroundImageNewsletterDark: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
            padding="xl"
            animate={true}
        >
            <div className="absolute inset-0 bg-black/60" />
            <CTABannerContent className="relative z-10">
                <CTABannerNewsletter
                    placeholder="you@example.com"
                    submitText="Subscribe"
                    buttonVariant="outline"
                    privacyNote=""
                >
                    <NewsletterHeading className="text-white">
                        Stay Connected
                    </NewsletterHeading>
                    <NewsletterSubheading className="text-gray-200">
                        Subscribe for exclusive content and early access to new features.
                    </NewsletterSubheading>
                </CTABannerNewsletter>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "2.4 Centered Newsletter - Background Image - Dark Theme",
};

export const CenteredBackgroundImageDemoRequestLight: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            padding="2xl"
        >
            <div className="absolute inset-0 bg-white/40" />
            <CTABannerContent className="relative z-10">
                <CTABannerDemoRequest
                    submitText="Request Live Demo"
                    requireCompany={true}
                    requirePhone={false}
                    layout="two-column"
                >
                    <DemoFormHeading className="text-gray-900">See Our Platform Live</DemoFormHeading>
                    <DemoFormSubheading className="text-gray-800">
                        Watch our product in action with a personalized demo.
                    </DemoFormSubheading>
                </CTABannerDemoRequest>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "2.5 Centered Demo Request - Background Image - Light Theme",
};

export const CenteredBackgroundImageDemoRequestDark: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            padding="2xl"
        >
            <div className="absolute inset-0 bg-black/60" />
            <CTABannerContent className="relative z-10">
                <CTABannerDemoRequest
                    submitText="Request Live Demo"
                    requireCompany={true}
                    requirePhone={false}
                    layout="two-column"
                >
                    <DemoFormHeading className="text-white">See Our Platform Live</DemoFormHeading>
                    <DemoFormSubheading className="text-gray-300">
                        Watch our product in action with a personalized demo.
                    </DemoFormSubheading>
                </CTABannerDemoRequest>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "2.6 Centered Demo Request - Background Image - Dark Theme",
};

export const CenteredBackgroundImageContactFormLight: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            padding="2xl"
        >
            <div className="absolute inset-0 bg-white/40" />
            <CTABannerContent className="relative z-10">
                <CTABannerContactForm
                    submitText="Send Message"
                    requireSubject={true}
                    maxMessageLength={1000}
                    layout="vertical"
                >
                    <ContactFormHeading className="text-gray-900">Contact Our Experts</ContactFormHeading>
                    <ContactFormSubheading className="text-gray-800">
                        Our team is standing by to answer your questions.
                    </ContactFormSubheading>
                </CTABannerContactForm>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "2.7 Centered Contact Form - Background Image - Light Theme",
};

export const CenteredBackgroundImageContactFormDark: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            padding="2xl"
        >
            <div className="absolute inset-0 bg-black/60" />
            <CTABannerContent className="relative z-10">
                <CTABannerContactForm
                    submitText="Send Message"
                    requireSubject={true}
                    maxMessageLength={1000}
                    layout="vertical"
                >
                    <ContactFormHeading className="text-white">Contact Our Experts</ContactFormHeading>
                    <ContactFormSubheading className="text-gray-300">
                        Our team is standing by to answer your questions.
                    </ContactFormSubheading>
                </CTABannerContactForm>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "2.8 Centered Contact Form - Background Image - Dark Theme",
};

/* ============================================
   3. GRADIENT OVERLAY BACKGROUND
============================================ */

// Light theme with gradient overlays
export const GradientBackgroundBannerLight: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
            padding="2xl"
        >
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.6) 0%, rgba(139, 92, 246, 0.6) 100%)',
                }}
            />
            <CTABannerContent className="relative z-10">
                <CTABannerHeading className="text-gray-900">
                    Ready to Transform?
                </CTABannerHeading>
                <CTABannerSubheading className="text-gray-800 max-w-xl">
                    Take the first step towards innovation with our expert guidance.
                </CTABannerSubheading>
                <CTABannerActions>
                    <CTABannerButton
                        label="Schedule Consultation"
                        variant="primary"
                        icon={Calendar}
                        className="bg-gray-900 text-white hover:bg-gray-800"
                    />
                    <CTABannerButton
                        label="View Case Studies"
                        variant="outline"
                        className="border-gray-900 text-gray-900 hover:bg-gray-900/10"
                    />
                </CTABannerActions>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "3.1 Gradient Background - Banner - Light Theme",
};

export const GradientBackgroundNewsletterLight: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
            padding="xl"
        >
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.6) 0%, rgba(249, 115, 22, 0.6) 100%)',
                }}
            />
            <CTABannerContent className="relative z-10">
                <CTABannerNewsletter
                    placeholder="Enter your email"
                    submitText="Join Now"
                    buttonVariant="primary"
                    privacyNote=""
                >
                    <NewsletterHeading className="text-gray-900">
                        Join Our Community
                    </NewsletterHeading>
                    <NewsletterSubheading className="text-gray-800">
                        Get exclusive access to resources, tutorials, and community events.
                    </NewsletterSubheading>
                </CTABannerNewsletter>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "3.2 Gradient Background - Newsletter - Light Theme",
};

// Dark theme with gradient overlays
export const GradientBackgroundBannerDark: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
            padding="2xl"
        >
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)',
                }}
            />
            <CTABannerContent className="relative z-10">
                <CTABannerHeading className="text-white">
                    Ready to Transform?
                </CTABannerHeading>
                <CTABannerSubheading className="text-gray-100 max-w-xl">
                    Take the first step towards innovation with our expert guidance.
                </CTABannerSubheading>
                <CTABannerActions>
                    <CTABannerButton
                        label="Schedule Consultation"
                        variant="primary"
                        icon={Calendar}
                        className="bg-white text-blue-600 hover:bg-gray-100"
                    />
                    <CTABannerButton
                        label="View Case Studies"
                        variant="outline"
                        className="border-white text-white hover:bg-white/20"
                    />
                </CTABannerActions>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "3.3 Gradient Background - Banner - Dark Theme",
};

export const GradientBackgroundNewsletterDark: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
            padding="xl"
        >
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(249, 115, 22, 0.8) 100%)',
                }}
            />
            <CTABannerContent className="relative z-10">
                <CTABannerNewsletter
                    placeholder="Enter your email"
                    submitText="Join Now"
                    buttonVariant="outline"
                    privacyNote=""
                >
                    <NewsletterHeading className="text-white">
                        Join Our Community
                    </NewsletterHeading>
                    <NewsletterSubheading className="text-gray-100">
                        Get exclusive access to resources, tutorials, and community events.
                    </NewsletterSubheading>
                </CTABannerNewsletter>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "3.4 Gradient Background - Newsletter - Dark Theme",
};

export const GradientBackgroundDemoRequestLight: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
            padding="2xl"
        >
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.6) 0%, rgba(6, 182, 212, 0.6) 100%)',
                }}
            />
            <CTABannerContent className="relative z-10">
                <CTABannerDemoRequest
                    submitText="Schedule Demo"
                    requireCompany={false}
                    requirePhone={true}
                    layout="two-column"
                >
                    <DemoFormHeading className="text-gray-900">Book Your Demo Today</DemoFormHeading>
                    <DemoFormSubheading className="text-gray-800">
                        Experience firsthand how our solution can revolutionize your workflow.
                    </DemoFormSubheading>
                </CTABannerDemoRequest>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "3.5 Gradient Background - Demo Request - Light Theme",
};

export const GradientBackgroundDemoRequestDark: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
            padding="2xl"
        >
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.8) 0%, rgba(6, 182, 212, 0.8) 100%)',
                }}
            />
            <CTABannerContent className="relative z-10">
                <CTABannerDemoRequest
                    submitText="Schedule Demo"
                    requireCompany={false}
                    requirePhone={true}
                    layout="two-column"
                >
                    <DemoFormHeading className="text-white">Book Your Demo Today</DemoFormHeading>
                    <DemoFormSubheading className="text-gray-300">
                        Experience firsthand how our solution can revolutionize your workflow.
                    </DemoFormSubheading>
                </CTABannerDemoRequest>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "3.6 Gradient Background - Demo Request - Dark Theme",
};

export const GradientBackgroundContactFormLight: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
            padding="2xl"
        >
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.6) 0%, rgba(236, 72, 153, 0.6) 100%)',
                }}
            />
            <CTABannerContent className="relative z-10">
                <CTABannerContactForm
                    submitText="Contact Us"
                    requireSubject={true}
                    maxMessageLength={1500}
                    layout="vertical"
                >
                    <ContactFormHeading className="text-gray-900">Let's Start a Conversation</ContactFormHeading>
                    <ContactFormSubheading className="text-gray-800">
                        Tell us about your project and we'll help you find the right solution.
                    </ContactFormSubheading>
                </CTABannerContactForm>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "3.7 Gradient Background - Contact Form - Light Theme",
};

export const GradientBackgroundContactFormDark: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
            padding="2xl"
        >
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.8) 0%, rgba(236, 72, 153, 0.8) 100%)',
                }}
            />
            <CTABannerContent className="relative z-10">
                <CTABannerContactForm
                    submitText="Contact Us"
                    requireSubject={true}
                    maxMessageLength={1500}
                    layout="vertical"
                >
                    <ContactFormHeading className="text-white">Let's Start a Conversation</ContactFormHeading>
                    <ContactFormSubheading className="text-gray-300">
                        Tell us about your project and we'll help you find the right solution.
                    </ContactFormSubheading>
                </CTABannerContactForm>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "3.8 Gradient Background - Contact Form - Dark Theme",
};

/* ============================================
   4. COMPLEX EXAMPLES WITH MULTIPLE CHILDREN
============================================ */

export const ComplexNewsletterWithActions: Story = {
    render: () => (
        <CTABanner
            variant="gradient"
            layout="centered"
            contentAlign="center"
            padding="xl"
        >
            <CTABannerContent>
                <CTABannerNewsletter
                    placeholder="Enter your work email"
                    submitText="Get Started"
                    buttonVariant="primary"
                    layout="inline"
                >
                    <NewsletterHeading>Launch Your Success Today</NewsletterHeading>
                    <NewsletterSubheading>
                        Join 10,000+ professionals who transformed their careers with our platform.
                    </NewsletterSubheading>

                    {/* Additional content inside Newsletter */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            <span className="text-sm font-medium">Community Access</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Rocket className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-medium">Accelerated Learning</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span className="text-sm font-medium">Premium Content</span>
                        </div>
                    </div>

                    <CTABannerActions>
                        <CTABannerButton
                            label="View Pricing"
                            variant="ghost"
                            href="/pricing"
                        />
                        <CTABannerButton
                            label="Read Case Studies"
                            variant="outline"
                            href="/case-studies"
                        />
                    </CTABannerActions>
                </CTABannerNewsletter>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "4.1 Complex Newsletter with Actions",
};

export const DemoRequestWithCustomContent: Story = {
    render: () => (
        <CTABanner
            variant="primary"
            layout="centered"
            contentAlign="center"
            padding="2xl"
        >
            <CTABannerContent>
                <CTABannerDemoRequest
                    submitText="Book Your Demo"
                    requireCompany={true}
                    layout="two-column"
                >
                    {/* Custom heading with icon */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                            <HelpCircle className="w-8 h-8 text-white" />
                        </div>
                        <DemoFormHeading className="text-white text-center">
                            Transform Your Business Today
                        </DemoFormHeading>
                    </div>

                    <DemoFormSubheading className="text-white/90 text-center">
                        Our platform has helped companies achieve:
                    </DemoFormSubheading>

                    {/* Stats inside demo form */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">40%</div>
                            <div className="text-sm text-white/80">Cost Reduction</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">3.5x</div>
                            <div className="text-sm text-white/80">Productivity Boost</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">98%</div>
                            <div className="text-sm text-white/80">Satisfaction Rate</div>
                        </div>
                    </div>

                    <CTABannerSubheading className="text-white/80 text-center text-sm">
                        Schedule a demo to see how we can help you achieve similar results.
                    </CTABannerSubheading>
                </CTABannerDemoRequest>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "4.2 Demo Request with Custom Content",
};

export const ContactFormWithMultipleSections: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="centered"
            contentAlign="center"
            padding="xl"
        >
            <CTABannerContent>
                <CTABannerContactForm
                    submitText="Send Your Message"
                    requireSubject={true}
                    maxMessageLength={1000}
                    layout="vertical"
                >
                    {/* Header with multiple elements */}
                    <div className="text-center">
                        <ContactFormHeading>Let's Start a Conversation</ContactFormHeading>
                        <ContactFormSubheading>
                            We're excited to hear about your project and explore how we can help.
                        </ContactFormSubheading>

                        {/* Additional info */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium">Response Time: 2-4 hours</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium">Available: Mon-Fri, 9AM-6PM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Optional additional content */}
                    <div className="mt-6">
                        <CTABannerSubheading className="text-center">
                            Need immediate assistance? Call us at <strong>1-800-123-4567</strong>
                        </CTABannerSubheading>
                    </div>
                </CTABannerContactForm>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "4.3 Contact Form with Multiple Sections",
};

/* ============================================
   5. MIXED COMPONENTS IN ONE BANNER
============================================ */

export const MixedComponentsSideBySide: Story = {
    render: () => (
        <CTABanner
            variant="muted"
            layout="split"
            padding="xl"
        >
            <CTABannerContent>
                <CTABannerDemoRequest
                    submitText="Request Demo"
                    layout="single"
                >
                    <DemoFormHeading>Request a Demo</DemoFormHeading>
                    <DemoFormSubheading>
                        See our platform in action with a personalized walkthrough.
                    </DemoFormSubheading>
                </CTABannerDemoRequest>
            </CTABannerContent>

            <CTABannerContent>
                <CTABannerContactForm
                    submitText="Contact Sales"
                    layout="compact"
                >
                    <ContactFormHeading>Contact Sales</ContactFormHeading>
                    <ContactFormSubheading>
                        Have pricing or enterprise questions?
                    </ContactFormSubheading>
                </CTABannerContactForm>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "5.1 Mixed Components - Demo Request + Contact Form",
    parameters: {
        docs: {
            description: {
                story: "Two different form types side by side in a split layout",
            },
        },
    },
};

export const CompactWithMultipleOptions: Story = {
    render: () => (
        <CTABanner
            variant="glass"
            layout="compact"
            padding="md"
        >
            <CTABannerContent>
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Newsletter Section */}
                    <div className="md:col-span-2">
                        <CTABannerNewsletter
                            placeholder="Stay updated..."
                            submitText="Subscribe"
                            layout="inline"
                        >
                            <NewsletterHeading>Stay in the Loop</NewsletterHeading>
                            <NewsletterSubheading>
                                Weekly insights delivered to your inbox.
                            </NewsletterSubheading>
                        </CTABannerNewsletter>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-col justify-center">
                        <CTABannerActions className="justify-center md:justify-end">
                            <CTABannerButton
                                label="Quick Chat"
                                variant="ghost"
                                size="sm"
                            />
                            <CTABannerButton
                                label="Docs"
                                variant="ghost"
                                size="sm"
                                href="/docs"
                            />
                        </CTABannerActions>
                    </div>
                </div>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "5.2 Compact Layout with Multiple Options",
};

/* ============================================
   6. USING BASIC COMPONENTS WITH FORMS
============================================ */

export const BasicComponentsWithForms: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="centered"
            contentAlign="center"
            padding="lg"
        >
            <CTABannerContent>
                {/* Using basic components inside CTABannerContent */}
                <CTABannerHeading>Choose Your Path</CTABannerHeading>
                <CTABannerSubheading>
                    Select the option that best fits your needs
                </CTABannerSubheading>

                {/* Multiple forms in one banner */}
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                    {/* Demo Request */}
                    <div className="space-y-4">
                        <DemoFormHeading>Get a Demo</DemoFormHeading>
                        <DemoFormSubheading>
                            See the platform in action
                        </DemoFormSubheading>
                        <CTABannerDemoRequest
                            submitText="Book Demo"
                            layout="single"
                        />
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <NewsletterHeading>Get Updates</NewsletterHeading>
                        <NewsletterSubheading>
                            Stay informed about new features
                        </NewsletterSubheading>
                        <CTABannerNewsletter
                            placeholder="Your email"
                            submitText="Subscribe"
                        />
                    </div>
                </div>

                {/* Additional action buttons */}
                <CTABannerActions className="mt-8">
                    <CTABannerButton
                        label="View Documentation"
                        variant="outline"
                    />
                    <CTABannerButton
                        label="Join Community"
                        variant="ghost"
                    />
                </CTABannerActions>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "6.1 Basic Components with Multiple Forms",
};

/* ============================================
   7. BACKGROUND IMAGE WITH CUSTOM OVERLAYS
============================================ */

export const BackgroundImageWithPatternOverlay: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
            padding="2xl"
        >
            {/* Pattern overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(45deg, rgba(255,255,255,0.9) 25%, transparent 25%),
                                 linear-gradient(-45deg, rgba(255,255,255,0.9) 25%, transparent 25%),
                                 linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.9) 75%),
                                 linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.9) 75%)`,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
            />

            <CTABannerContent className="relative z-10">
                <CTABannerNewsletter
                    placeholder="Join our waitlist"
                    submitText="Get Early Access"
                    buttonVariant="primary"
                >
                    <NewsletterHeading className="text-gray-900">
                        Coming Soon
                    </NewsletterHeading>
                    <NewsletterSubheading className="text-gray-800">
                        Be the first to experience our revolutionary new platform.
                    </NewsletterSubheading>
                </CTABannerNewsletter>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "7.1 Background Image with Pattern Overlay",
};

export const BackgroundImageWithTexturedOverlay: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
            padding="2xl"
        >
            {/* Textured overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <CTABannerContent className="relative z-10">
                <CTABannerDemoRequest
                    submitText="Join Beta Program"
                    requireCompany={true}
                    layout="two-column"
                >
                    <DemoFormHeading className="text-white">
                        Join Our Beta Program
                    </DemoFormHeading>
                    <DemoFormSubheading className="text-gray-300">
                        Get exclusive early access and help shape the future of our platform.
                    </DemoFormSubheading>

                    <div className="mt-4 p-4 bg-white/10 rounded-lg border border-white/20">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-sm text-white">Priority support</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-sm text-white">Direct feedback to product team</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-sm text-white">Exclusive beta-only features</span>
                        </div>
                    </div>
                </CTABannerDemoRequest>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "7.2 Background Image with Textured Overlay",
};

/* ============================================
   8. ACCESSIBILITY & ERROR STATES
============================================ */

export const NewsletterWithErrorStates: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="centered"
            contentAlign="center"
            padding="lg"
        >
            <CTABannerContent>
                <CTABannerNewsletter
                    placeholder="test@example.com"
                    submitText="Try Error State"
                    privacyNote="Enter an invalid email to see error handling"
                >
                    <NewsletterHeading>Error State Demo</NewsletterHeading>
                    <NewsletterSubheading>
                        This demonstrates form validation and error handling
                    </NewsletterSubheading>
                </CTABannerNewsletter>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "8.1 Newsletter with Error States",
};

export const DemoRequestWithValidation: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="centered"
            contentAlign="center"
            padding="lg"
        >
            <CTABannerContent>
                <CTABannerDemoRequest
                    submitText="Submit with Errors"
                    requireCompany={true}
                    requirePhone={true}
                    layout="two-column"
                >
                    <DemoFormHeading>Validation Demo</DemoFormHeading>
                    <DemoFormSubheading>
                        Try submitting without filling required fields
                    </DemoFormSubheading>
                </CTABannerDemoRequest>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "8.2 Demo Request with Validation",
};

/* ============================================
   9. ANIMATION VARIANTS
============================================ */

export const AnimatedContactForm: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="centered"
            contentAlign="center"
            padding="xl"
            animate={true}
            animationType="slide"
            animationDelay={0.5}
        >
            <CTABannerContent>
                <CTABannerContactForm
                    submitText="Send Animated Message"
                    layout="vertical"
                >
                    <ContactFormHeading>Animated Contact Form</ContactFormHeading>
                    <ContactFormSubheading>
                        This form uses staggered animations for a smooth experience
                    </ContactFormSubheading>
                </CTABannerContactForm>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "9.1 Animated Contact Form",
};

export const ScaleAnimationDemoRequest: Story = {
    render: () => (
        <CTABanner
            variant="gradient"
            layout="centered"
            contentAlign="center"
            padding="2xl"
            animate={true}
            animationType="scale"
        >
            <CTABannerContent>
                <CTABannerDemoRequest
                    submitText="Scale Animation Demo"
                    layout="single"
                >
                    <DemoFormHeading>Scale Animation</DemoFormHeading>
                    <DemoFormSubheading>
                        Watch the form scale in with smooth animations
                    </DemoFormSubheading>
                </CTABannerDemoRequest>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "9.2 Scale Animation Demo Request",
};

/* ============================================
   10. BACKGROUND IMAGE WITH FORMS
============================================ */

export const BackgroundImageWithContactForm: Story = {
    render: () => (
        <CTABanner
            variant="dark"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            padding="2xl"
            animate={true}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/60 to-pink-900/50" />

            <CTABannerContent className="relative z-10">
                <CTABannerContactForm
                    submitText="Send Message"
                    requireSubject={true}
                    maxMessageLength={500}
                    layout="vertical"
                >
                    <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                            <Send className="w-10 h-10 text-white" />
                        </div>
                        <ContactFormHeading className="text-white">
                            Connect With Our Experts
                        </ContactFormHeading>
                        <ContactFormSubheading className="text-gray-300">
                            Our team specializes in finding the perfect solution for your unique challenges.
                        </ContactFormSubheading>
                    </div>
                </CTABannerContactForm>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "10.1 Background Image with Contact Form",
};

export const BackgroundImageWithDemoForm: Story = {
    render: () => (
        <CTABanner
            variant="light"
            layout="centered"
            contentAlign="center"
            backgroundType="image"
            backgroundImage="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            padding="2xl"
        >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/80 via-white/60 to-white/40 backdrop-blur-sm" />

            <CTABannerContent className="relative z-10">
                <CTABannerDemoRequest
                    submitText="Schedule Your Demo"
                    requireCompany={false}
                    requirePhone={false}
                    layout="two-column"
                >
                    <div className="text-center">
                        <DemoFormHeading className="text-gray-900">
                            See It in Action
                        </DemoFormHeading>
                        <DemoFormSubheading className="text-gray-700">
                            Watch our platform transform real business challenges in a live demo.
                        </DemoFormSubheading>

                        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">30-minute personalized session</span>
                        </div>
                    </div>
                </CTABannerDemoRequest>
            </CTABannerContent>
        </CTABanner>
    ),
    name: "10.2 Background Image with Demo Form",
};