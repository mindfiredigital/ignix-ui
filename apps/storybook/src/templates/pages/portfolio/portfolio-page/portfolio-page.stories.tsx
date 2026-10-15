import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  PortfolioPage,
  PortfolioHeader,
  PortfolioHero,
  PortfolioAbout,
  PortfolioSkills,
  PortfolioProjects,
  PortfolioExperience,
  PortfolioTestimonials,
  PortfolioStats,
  PortfolioContactCTA,
  PortfolioFooter,
} from "./index";

const meta: Meta<typeof PortfolioPage> = {
  title: "Templates/Pages/Portfolio/Portfolio Page",
  component: PortfolioPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A production-ready personal portfolio & showcase page composed of header, hero, about, skills, project gallery, experience timeline, testimonials, stats, and contact sections.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PortfolioPage>;

export const Default: Story = {
  render: () => <PortfolioPage />,
  name: "Default",
};

export const CustomCopy: Story = {
  name: "Custom copy",
  render: () => (
    <PortfolioPage
      brandName="Jordan Kim"
      heroEyebrow="Available for freelance"
      heroHeadline="I design and build thoughtful products"
      heroSubheadline="Full-stack product designer with 8 years of experience helping startups ship faster, from first sketch to production."
      heroPrimaryCtaLabel="See my work"
      heroSecondaryCtaLabel="Download resume"
      ctaTitle="Have a project in mind?"
      ctaDescription="I'm available for select freelance engagements starting next month."
    />
  ),
};

export const MasonryGallery: Story = {
  name: "Masonry gallery",
  render: () => <PortfolioPage projectsVariant="masonry" />,
};

export const Bold: Story = {
  name: "Bold (dark hero)",
  render: () => (
    <PortfolioPage
      heroTone="bold"
      heroEyebrow="Available for freelance"
      heroHeadline="Building products that matter"
      heroSubheadline="Product designer & frontend engineer - here's a look at what I've been working on."
      projectsVariant="masonry"
    />
  ),
};

export const CustomCTASlot: Story = {
  name: "Custom CTA slot",
  render: () => (
    <PortfolioPage
      customCTA={
        <section className="py-16 text-center bg-muted">
          <p className="text-2xl font-bold">Fully custom CTA section, replacing PortfolioContactCTA entirely.</p>
        </section>
      }
    />
  ),
};

export const Composable: Story = {
  name: "Composable (hand-assembled)",
  render: () => (
    <div className="min-h-screen bg-background">
      <PortfolioHeader brandName="Composed" />
      <main>
        <PortfolioHero headline="Hand-assembled from named exports" />
        <PortfolioAbout />
        <PortfolioSkills />
        <PortfolioProjects />
        <PortfolioExperience />
        <PortfolioTestimonials />
        <PortfolioStats />
        <PortfolioContactCTA />
      </main>
      <PortfolioFooter />
    </div>
  ),
};
