// maintenance-page.stories.tsx

import {
  MaintenancePage,
  MaintenancePageHeading,
  MaintenancePageDesc,
  MaintenancePageCountdown,
  MaintenancePageEmailSubscription,
  MaintenancePageSocialIcons,
  MaintenancePageFooter,
  MaintenancePageLogo,
} from "./";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Settings, Facebook, Twitter, Linkedin, Mail, Wrench } from "lucide-react";

const meta: Meta<typeof MaintenancePage> = {
  title: "Templates/Pages/MaintenancePage",
  component: MaintenancePage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A composable maintenance page component with sub-components. Use `<MaintenancePage>`, `<MaintenancePageLogo>`, `<MaintenancePageHeading>`, `<MaintenancePageDesc>`, `<MaintenancePageCountdown>`, `<MaintenancePageEmailSubscription>`, `<MaintenancePageSocialIcons>`, and `<MaintenancePageFooter>` to build custom maintenance pages.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MaintenancePage>;

// ============================================================================
// SHARED CONSTANTS
// ============================================================================

// Default social media icons
const defaultIcons = [
  { icon: Facebook, link: "#" },
  { icon: Twitter, link: "#" },
  { icon: Linkedin, link: "#" },
  { icon: Mail, link: "#" },
];

/**
 * Basic maintenance page matching the screenshot design.
 * Features a blue gradient background, countdown timer, email subscription, and social icons.
 */
export const Basic: Story = {
  render: () => {
    // Set target date to 30 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const handleEmailSubmit = (email: string) => {
      alert(`Email submitted: ${email}`);
    };

    const icons = [
      { icon: Facebook, link: "https://www.facebook.com" },
      { icon: Twitter, link: "https://www.twitter.com" },
      { icon: Linkedin, link: "https://www.linkedin.com" },
      { icon: Mail, link: "mailto:support@example.com" },
    ];
    return (  
      <MaintenancePage>
        <MaintenancePageLogo logo={Wrench} companyName="Mindfire Digital" />
        <MaintenancePageHeading>SITE UNDER MAINTENANCE</MaintenancePageHeading>
        <MaintenancePageDesc>Sorry for the inconvenience. To improve our services, we have momentarily shutdown our site.</MaintenancePageDesc>
        <MaintenancePageCountdown targetDate={targetDate} />
        <MaintenancePageEmailSubscription onSubmit={handleEmailSubmit} />
        <MaintenancePageSocialIcons icons={icons} />
        <MaintenancePageFooter>copyright{`© ${new Date().getFullYear()} Site Under Maintenance. All rights reserved`}. Design by W3layouts</MaintenancePageFooter>
      </MaintenancePage>
    );
  },
};

/**
 * Gradient variant with light background.
 */
export const GradientWithIcon: Story = {
  render: () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);

    return (
      <MaintenancePage variant="gradient" icon={Settings}>
        <MaintenancePageLogo>Mindfire Digital</MaintenancePageLogo>
        <MaintenancePageHeading>We'll Be Back Soon!</MaintenancePageHeading>
        <MaintenancePageDesc>We're currently performing scheduled maintenance to improve your experience. We'll be back online shortly.</MaintenancePageDesc>
        <MaintenancePageCountdown targetDate={targetDate} />
        <MaintenancePageEmailSubscription
          placeholder="Enter your email"
          buttonText="Notify Me"
        />
        <MaintenancePageSocialIcons icons={defaultIcons} />
        <MaintenancePageFooter />
      </MaintenancePage>
    );
  },
};

/**
 * Default variant with light background.
 */
export const DarkWithLogo: Story = {
  render: () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);

    return (
      <MaintenancePage variant="dark" icon={Settings} iconColor="text-white">
        <MaintenancePageLogo logo="logo.png" companyName="Mindfire Digital"/>
        <MaintenancePageHeading>We'll Be Back Soon!</MaintenancePageHeading>
        <MaintenancePageDesc>We're currently performing scheduled maintenance to improve your experience. We'll be back online shortly.</MaintenancePageDesc>
        <MaintenancePageCountdown targetDate={targetDate} />
        <MaintenancePageEmailSubscription
          placeholder="Enter your email"
          buttonText="Notify Me"
        />
        <MaintenancePageSocialIcons icons={defaultIcons} />
        <MaintenancePageFooter />
      </MaintenancePage>
    );
  },
};

/**
 * Maintenance page with background image and animated icons.
 */
export const WithBackgroundImage: Story = {
  render: () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 45);

    const handleEmailSubmit = (email: string) => {
      alert(`We'll notify ${email} when we're back online!`);
    };

    return (
      <MaintenancePage
        variant="default"
        backgroundImage="https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&h=900&fit=crop&q=90"
        icon={Settings}
        iconColor="text-white"
      >
        <MaintenancePageHeading>SITE UNDER MAINTENANCE</MaintenancePageHeading>
        <MaintenancePageLogo logo="vite.svg" companyName="COMPANY NAME" />
        <MaintenancePageDesc>Sorry for the inconvenience. To improve our services, we have momentarily shutdown our site.</MaintenancePageDesc>
        <MaintenancePageCountdown targetDate={targetDate} />
        <MaintenancePageEmailSubscription onSubmit={handleEmailSubmit} />
        <MaintenancePageSocialIcons icons={defaultIcons} />
        <MaintenancePageFooter />
      </MaintenancePage>
    );
  },
};

/**
 * Split layout with dark variant and custom logo.
 */
export const SplitLayout: Story = {
  render: () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 15);

    return (
      <MaintenancePage variant="gradient" split icon={Settings}>
        {/* Left Section */}
        <MaintenancePageLogo 
          logo="logo.png"
          companyName="ACME CORP"
        />
        <MaintenancePageHeading>We're Upgrading!</MaintenancePageHeading>
        <MaintenancePageDesc>
          We're making our platform faster, more secure, and easier to use. 
          Thank you for your patience during this upgrade.
        </MaintenancePageDesc>

        {/* Right Section */}
        <div className="w-full">
          <p className="text-white text-sm mb-4 text-center lg:text-left opacity-80">
            Expected completion time
          </p>
          <MaintenancePageCountdown targetDate={targetDate} />
        </div>

        {/* Bottom Section */}
        <div className="w-full max-w-2xl space-y-4">
          <MaintenancePageEmailSubscription
            placeholder="Enter your email"
            buttonText="Get Updates"
          />
          <MaintenancePageSocialIcons icons={defaultIcons} />
        </div>

        <MaintenancePageFooter>© 2024 ACME Corp. All rights reserved.</MaintenancePageFooter>
      </MaintenancePage>
    );
  },
};

/**
 * Split layout: Left side (logo, heading, icon, description) and Right side (countdown).
 * Email subscription, social icons, and footer appear below both sections.
 * Matches the "Coming Soon" design with background image.
 */
export const SplitLayoutBackgroundImage: Story = {
  render: () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 37);
    targetDate.setHours(2, 57, 19);

    const handleEmailSubmit = (email: string) => {
      alert(`Thank you! We'll notify ${email} when we're back online.`);
    };

    return (
      <MaintenancePage
        variant="default"
        split
        backgroundImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=900&fit=crop&q=90"
      >
        {/* Left Section - Logo, Heading, Description (no icon) */}
        <MaintenancePageLogo logo="logo.png" companyName="MEETANSHI" />
        <MaintenancePageHeading>COMING SOON!</MaintenancePageHeading>
        <MaintenancePageDesc>
          Our Website is under Maintenance. We'll be here soon with our new awesome site.
        </MaintenancePageDesc>

        {/* Right Section - Countdown */}
        <div className="w-full">
          <p className="text-white text-sm mb-4 text-center lg:text-left">
            The maintance will ends on
          </p>
          <MaintenancePageCountdown targetDate={targetDate} />
        </div>

        {/* Bottom Section - Email Subscription */}
        <div className="w-full max-w-2xl space-y-4">
          <p className="text-white text-center mb-2">
            Get mail for exclusive offers in your inbox
          </p>
          <MaintenancePageEmailSubscription
            placeholder="Your email address"
            buttonText="Notify me"
            onSubmit={handleEmailSubmit}
          />
        </div>

        {/* Social Icons Section */}
        <div className="w-full max-w-2xl space-y-2">
          <p className="text-white text-center">Connect with us</p>
          <MaintenancePageSocialIcons icons={defaultIcons} />
        </div>

        {/* Footer */}
        <MaintenancePageFooter>
          This store is maintained by meetanshi.com
        </MaintenancePageFooter>
      </MaintenancePage>
    );
  },
};

// ============================================================================
// COUNTDOWN ANIMATION VARIANTS DEMO
// ============================================================================

/**
 * Demo showcasing all countdown animation types with just the countdown timer.
 * Watch how each animation type behaves when the countdown updates.
 */
export const CountdownAnimationVariants: Story = {
  name: "Countdown Animation Variants Demo",
  render: () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const animationTypes: Array<{ type: "fade" | "slide" | "scale" | "bounce" | "flip" | "none"; label: string; description: string }> = [
      { type: "fade", label: "Fade", description: "Numbers fade in and out smoothly when they change" },
      { type: "slide", label: "Slide", description: "Numbers slide up when appearing and slide down when disappearing" },
      { type: "scale", label: "Scale", description: "Numbers scale in and out when they change" },
      { type: "bounce", label: "Bounce", description: "Numbers bounce in with a spring effect when they change" },
      { type: "flip", label: "Flip", description: "Numbers flip in 3D rotation when they change" },
      { type: "none", label: "None", description: "Numbers change instantly without any animation effect" },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Countdown Animation Variants</h1>
            <p className="text-muted-foreground text-lg">
              Watch how each animation type behaves when the countdown updates every second
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {animationTypes.map(({ type, label, description }) => (
              <div key={type} className="bg-background/90 backdrop-blur-sm rounded-lg border p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">{label} Animation</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <MaintenancePageCountdown targetDate={targetDate} animationType={type} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};


