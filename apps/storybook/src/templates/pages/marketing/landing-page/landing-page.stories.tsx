import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  LandingPage,
  LandingHeader,
  LandingHero,
  LandingLogoCloud,
  LandingFeatures,
  LandingPricing,
  LandingTestimonials,
  LandingFAQ,
  LandingCTA,
  LandingFooter,
} from "./index";

const meta: Meta<typeof LandingPage> = {
  title: "Templates/Pages/Marketing/Landing Page",
  component: LandingPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A production-ready marketing/SaaS landing page composed of header, hero, logo cloud, features, pricing, testimonials, FAQ, CTA, and footer sections.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LandingPage>;

export const Default: Story = {
  render: () => <LandingPage />,
  name: "Default",
};

export const CustomCopy: Story = {
  name: "Custom copy",
  render: () => (
    <LandingPage
      brandName="Nova"
      heroEyebrow="Now in public beta"
      heroHeadline="The fastest way to launch your SaaS"
      heroSubheadline="Nova gives your team everything needed to go from idea to production in days, not months."
      heroPrimaryCtaLabel="Start building"
      heroSecondaryCtaLabel="Talk to sales"
      ctaTitle="Start shipping today"
      ctaDescription="No credit card required. Cancel anytime."
    />
  ),
};

export const CustomLogoRenderer: Story = {
  name: "Custom logo renderer",
  render: () => (
    <LandingPage
      renderLogo={(logo) => (
        <span key={logo.id} className="text-lg font-bold uppercase tracking-widest text-foreground">
          {logo.name}
        </span>
      )}
    />
  ),
};

export const CustomCTASlot: Story = {
  name: "Custom CTA slot",
  render: () => (
    <LandingPage
      customCTA={
        <section className="py-16 text-center bg-muted">
          <p className="text-2xl font-bold">Fully custom CTA section, replacing LandingCTA entirely.</p>
        </section>
      }
    />
  ),
};

export const Composable: Story = {
  name: "Composable (hand-assembled)",
  render: () => (
    <div className="min-h-screen bg-background">
      <LandingHeader brandName="Composed" />
      <main>
        <LandingHero headline="Hand-assembled from named exports" />
        <LandingLogoCloud />
        <LandingFeatures />
        <LandingPricing />
        <LandingTestimonials />
        <LandingFAQ />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  ),
};
