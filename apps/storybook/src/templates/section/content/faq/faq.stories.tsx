import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  FAQSection,
  Accordion,
  AccordionItem,
  AccordionTitle,
  AccordionSummary,
  AccordionDetails,
  AccordionLink,
} from ".";
import {
  Shield,
  Users,
  Settings,
  Globe,
  Lock,
  Mail,
  Calendar,
  Briefcase,
  Rocket,
  Award,
  Cpu,
  TrendingUp,
  Zap,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { Typography } from '../../../../components/typography';
import { Button } from "../../../../components/button";

const meta: Meta<typeof FAQSection> = {
  title: "Templates/Sections/FAQ/FAQ Section",
  component: FAQSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "A comprehensive FAQ Accordion section with 8 layout variants, 6 dark themes, and full accessibility support. Includes compound component pattern for flexible composition.",
      },
    },
  },
  argTypes: {
    layoutVariant: {
      control: "select",
      options: ["standard", "split-left", "split-right", "grid", "minimal-list", "contact-sidebar", "category-tabs", "featured"],
      description: "Layout variant for the FAQ section",
    },
    themeVariant: {
      control: "select",
      options: ["light", "dark", "midnight", "charcoal", "ocean", "forest", "sunset"],
      description: "Theme variant for the FAQ section",
    },
    variant: {
      control: "select",
      options: ["default", "card", "bordered", "minimal", "glass", "gradient"],
      description: "Visual style variant for accordion items",
    },
    animationVariant: {
      control: "select",
      options: ["fade", "slide", "scale", "flip", "reveal"],
      description: "Animation style for expand/collapse",
    },
    iconStyle: {
      control: "select",
      options: ["chevron", "plus-minus", "arrow", "checkmark"],
      description: "Icon style for expand/collapse indicators",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FAQSection>;

// ============================================
// SAMPLE DATA
// ============================================

const sampleFAQItems = [
  {
    id: "1",
    question: "What is Web3 Africa?",
    answer: "Web3 Africa is a community-driven initiative focused on educating and empowering African developers, entrepreneurs, and creators to build and participate in the decentralized web. We offer training programs, hackathons, and networking events across the continent.",
    category: "general",
    icon: <Globe className="w-5 h-5" />,
  },
  {
    id: "2",
    question: "Who can join the SkillChain Program?",
    answer: "The SkillChain Program is open to anyone with a passion for blockchain technology and Web3 development. Whether you're a complete beginner or an experienced developer, we have tracks tailored to your skill level. Basic programming knowledge is recommended but not required.",
    category: "programs",
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: "3",
    question: "How can I become a partner?",
    answer: "We are always open to collaborating with organizations that share our vision for a decentralized Africa. If you're interested in partnering with us on events, education, or ecosystem development, please reach out to us via email at web3africa2024@gmail.com.",
    category: "partnership",
    icon: <Handshake className="w-5 h-5" />,
    link: {
      text: "Contact partnership team",
      url: "mailto:web3africa2024@gmail.com",
    },
  },
  {
    id: "4",
    question: "How does blockchain work?",
    answer: "Think of blockchain as a digital ledger that records every transaction across a network — transparent, decentralized, and tamper-proof. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data. This creates an immutable chain that everyone can verify but no single entity controls.",
    category: "technology",
    icon: <Cpu className="w-5 h-5" />,
  },
  {
    id: "5",
    question: "How do I start investing in crypto?",
    answer: "To start investing in cryptocurrency: 1) Choose a reputable exchange (Coinbase, Binance, Kraken), 2) Complete identity verification, 3) Fund your account with fiat currency, 4) Start with small amounts of established coins like Bitcoin or Ethereum, 5) Store your assets in a secure wallet - hardware wallets recommended for larger amounts.",
    category: "investing",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    id: "6",
    question: "Is investing in crypto safe?",
    answer: "Cryptocurrency investments carry significant risk due to market volatility, regulatory uncertainty, and security concerns. However, you can mitigate risks by: diversifying your portfolio, using reputable exchanges, enabling 2FA, storing assets in cold wallets, and never investing more than you can afford to lose.",
    category: "investing",
    icon: <Shield className="w-5 h-5" />,
  },
  {
    id: "7",
    question: "How do I keep my crypto safe?",
    answer: "To keep your crypto secure: Use hardware wallets for long-term storage, enable two-factor authentication on all accounts, never share your private keys, use unique strong passwords, beware of phishing scams, keep software updated, and consider using a multi-signature wallet for large amounts.",
    category: "security",
    icon: <Lock className="w-5 h-5" />,
  },
  {
    id: "8",
    question: "What services does Altra offer?",
    answer: "Altra offers comprehensive design services including brand identity, UI/UX design, web development, mobile app design, and product strategy. We specialize in creating bespoke digital experiences that are both visually stunning and strategically aligned with your business goals.",
    category: "services",
    icon: <Rocket className="w-5 h-5" />,
  },
  {
    id: "9",
    question: "How does the design process work at Altra?",
    answer: "Our design process follows four key phases: 1) Discovery - understanding your business, users, and goals, 2) Strategy - defining the solution architecture, 3) Design - creating visual concepts and prototypes, 4) Delivery - providing final assets and development support. We maintain close collaboration throughout.",
    category: "process",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    id: "10",
    question: "What makes Altra different from other design agencies?",
    answer: "At Altra, we focus on creating bespoke designs that are not only visually stunning but also strategically aligned with your business goals. Our collaborative approach ensures that each project is personalized and effective. We don't do templates - every solution is custom-built for your specific needs.",
    category: "about",
    icon: <Award className="w-5 h-5" />,
  },
];

const categoryList = [
  { id: "general", name: "General", icon: <Globe className="w-4 h-4" />, description: "General questions about Web3" },
  { id: "programs", name: "Programs", icon: <Users className="w-4 h-4" />, description: "SkillChain and training programs" },
  { id: "partnership", name: "Partnership", icon: <Handshake className="w-4 h-4" />, description: "Collaboration opportunities" },
  { id: "technology", name: "Technology", icon: <Cpu className="w-4 h-4" />, description: "Blockchain and Web3 tech" },
  { id: "investing", name: "Investing", icon: <TrendingUp className="w-4 h-4" />, description: "Crypto investment guides" },
  { id: "security", name: "Security", icon: <Shield className="w-4 h-4" />, description: "Asset protection" },
  { id: "services", name: "Services", icon: <Briefcase className="w-4 h-4" />, description: "Design services" },
  { id: "process", name: "Process", icon: <Settings className="w-4 h-4" />, description: "How we work" },
  { id: "about", name: "About", icon: <Award className="w-4 h-4" />, description: "About Altra" },
];

// ============================================
// HELPER COMPONENTS
// ============================================

function Handshake(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 15L6 10" />
      <path d="M18 8L13 13" />
      <path d="M2 11L6 15" />
      <path d="M22 11L18 15" />
      <path d="M6 15L11 20" />
      <path d="M18 15L13 20" />
      <path d="M9 7L12 4L15 7" />
      <path d="M12 4V8" />
    </svg>
  );
}

function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function Coffee(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" x2="6" y1="2" y2="4" />
      <line x1="10" x2="10" y1="2" y2="4" />
      <line x1="14" x2="14" y1="2" y2="4" />
    </svg>
  );
}

// ============================================
// COMPOUND COMPONENT EXAMPLES
// ============================================

export const CompoundComponentExample: Story = {
  render: () => {
    const [openItems, setOpenItems] = useState<string[]>(['1']);

    return (
      <div className="p-8 max-w-3xl mx-auto">
        <Typography variant="h2" weight="bold" className="text-3xl mb-6">
          Compound Component Pattern
        </Typography>
        <Typography variant="body" color="muted" className="mb-8">
          Build custom FAQ sections using the flexible compound component API
        </Typography>

        <Accordion
          value={openItems}
          onValueChange={setOpenItems}
          variant="default"
          animationVariant="slide"
          iconStyle="chevron"
          theme="light"
        >
          <AccordionItem id="1">
            <AccordionSummary id="1">
              <AccordionTitle icon={<Globe className="w-5 h-5" />} category="General">
                What is Web3 Africa?
              </AccordionTitle>
            </AccordionSummary>
            <AccordionDetails id="1">
              <Typography variant="body-small" className="leading-relaxed">
                Web3 Africa is a community-driven initiative focused on educating and empowering
                African developers, entrepreneurs, and creators to build and participate in the
                decentralized web.
              </Typography>
              <AccordionLink href="/learn-more">
                Learn more about Web3 Africa
              </AccordionLink>
            </AccordionDetails>
          </AccordionItem>

          <AccordionItem id="2">
            <AccordionSummary id="2">
              <AccordionTitle icon={<Users className="w-5 h-5" />} category="Programs">
                Who can join the SkillChain Program?
              </AccordionTitle>
            </AccordionSummary>
            <AccordionDetails id="2">
              <Typography variant="body-small" className="leading-relaxed">
                The SkillChain Program is open to anyone with a passion for blockchain technology
                and Web3 development. Whether you're a complete beginner or an experienced developer,
                we have tracks tailored to your skill level.
              </Typography>
            </AccordionDetails>
          </AccordionItem>

          <AccordionItem id="3">
            <AccordionSummary id="3">
              <AccordionTitle icon={<Handshake className="w-5 h-5" />} category="Partnership">
                How can I become a partner?
              </AccordionTitle>
            </AccordionSummary>
            <AccordionDetails id="3">
              <Typography variant="body-small" className="leading-relaxed">
                We are always open to collaborating with organizations that share our vision for a
                decentralized Africa. Reach out to our partnership team to explore opportunities.
              </Typography>
              <AccordionLink href="mailto:partners@web3africa.com">
                Contact partnership team
              </AccordionLink>
            </AccordionDetails>
          </AccordionItem>
        </Accordion>
      </div>
    );
  },
  name: "🎯 Compound Component Pattern",
};

export const CustomAccordionWithIcons: Story = {
  render: () => {
    const [openItems, setOpenItems] = useState<string[]>([]);

    return (
      <div className="p-8 max-w-3xl mx-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">CUSTOM COMPOSITION</span>
          </div>
          <Typography variant="h2" weight="bold" className="text-4xl mb-3 text-white/90">
            Build Your Own FAQ
          </Typography>
        </div>

        <Accordion
          value={openItems}
          onValueChange={setOpenItems}
          variant="bordered"
          animationVariant="scale"
          iconStyle="plus-minus"
          theme="light"
        >
          <AccordionItem id="custom1">
            <AccordionSummary id="custom1">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <Typography variant="body-small" color="muted" className="mb-0.5 text-white/90">
                    Getting Started
                  </Typography>
                  <Typography variant="body" weight="medium" className="text-white/80">
                    How do I create an account?
                  </Typography>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails id="custom1">
              <div className="pl-14">
                <Typography variant="body-small" className="leading-relaxed text-white/80">
                  Creating an account is free and takes less than 2 minutes. Click the "Sign Up" button
                  in the top right corner, enter your email address, create a password, and you're ready to go!
                </Typography>
              </div>
            </AccordionDetails>
          </AccordionItem>

          <AccordionItem id="custom2">
            <AccordionSummary id="custom2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <Typography variant="body-small" color="muted" className="mb-0.5 text-white/90">
                    Security
                  </Typography>
                  <Typography variant="body" weight="medium" className="text-white/80">
                    Is my data secure?
                  </Typography>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails id="custom2">
              <div className="pl-14">
                <Typography variant="body-small" className="leading-relaxed text-white/80">
                  Yes, we take security seriously. All data is encrypted using AES-256, we're GDPR compliant,
                  and we perform regular security audits. Your privacy is our priority.
                </Typography>
              </div>
            </AccordionDetails>
          </AccordionItem>
        </Accordion>
      </div>
    );
  },
  name: "🎨 Custom Composition with Icons",
};

export const SingleOpenModeCompound: Story = {
  render: () => {
    const [openItems, setOpenItems] = useState<string[]>([]);

    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
          <Typography variant="h5" weight="semibold" className="mb-2">
            Single Open Mode
          </Typography>
          <Typography variant="body-small" color="muted" className="mb-6">
            Only one accordion can be open at a time
          </Typography>

          <Accordion
            value={openItems}
            onValueChange={setOpenItems}
            enableSingleOpen
            variant="minimal"
            animationVariant="slide"
            iconStyle="arrow"
            theme="light"
          >
            <AccordionItem id="single1">
              <AccordionSummary id="single1">
                <AccordionTitle>
                  What payment methods do you accept?
                </AccordionTitle>
              </AccordionSummary>
              <AccordionDetails id="single1">
                <Typography variant="body-small">
                  We accept all major credit cards (Visa, Mastercard, American Express), PayPal,
                  and bank transfers for enterprise customers.
                </Typography>
              </AccordionDetails>
            </AccordionItem>

            <AccordionItem id="single2">
              <AccordionSummary id="single2">
                <AccordionTitle>
                  Can I change my plan later?
                </AccordionTitle>
              </AccordionSummary>
              <AccordionDetails id="single2">
                <Typography variant="body-small">
                  Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes take
                  effect immediately and we prorate the billing accordingly.
                </Typography>
              </AccordionDetails>
            </AccordionItem>

            <AccordionItem id="single3">
              <AccordionSummary id="single3">
                <AccordionTitle>
                  Do you offer refunds?
                </AccordionTitle>
              </AccordionSummary>
              <AccordionDetails id="single3">
                <Typography variant="body-small">
                  We offer a 30-day money-back guarantee for all annual plans. Monthly plans can be
                  canceled anytime with no refund for the current billing period.
                </Typography>
              </AccordionDetails>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    );
  },
  name: "🔒 Single Open Mode - Compound",
};

// ============================================
// BASE LAYOUT STORIES
// ============================================

export const Standard: Story = {
  args: {
    items: sampleFAQItems.slice(0, 5),
    title: "Frequently Asked Questions",
    description: "Our platform is built to help you work smarter, not harder. It adapts to your needs and supports your goals.",
    layoutVariant: "standard",
    themeVariant: "light",
    variant: "minimal",
    iconStyle: "plus-minus",
    enableSearch: false,
    enableCategories: true,
    categories: categoryList.slice(0, 3),
  },
};

export const SplitLeftWithContact: Story = {
  args: {
    items: sampleFAQItems,
    title: "Frequently asked questions",
    description: "Have more questions? Reach out to our sales team or schedule a call directly with our founder.",
    layoutVariant: "split-left",
    themeVariant: "light",
    variant: "default",
    iconStyle: "plus-minus",
    enableContactSection: true,
    enableCategories: true,
    categories: categoryList,
    contactEmail: "sales@altra.com",
    contactPhone: "+1 (555) 123-4567",
    contactChat: true,
  },
  name: "Split Left with Contact Sidebar",
};

export const SplitRightWithFeatures: Story = {
  args: {
    items: sampleFAQItems.slice(0, 6),
    title: "Got Questions?",
    description: "We've Got Answers",
    layoutVariant: "split-right",
    themeVariant: "light",
    variant: "bordered",
    iconStyle: "plus-minus",
    enableContactSection: true,
    enableSearch: true,
  },
  name: "Split Right with Search",
};

export const GridLayout: Story = {
  args: {
    items: sampleFAQItems,
    title: "Frequently Asked Question",
    description: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum orci justo facilisis tortor.",
    layoutVariant: "grid",
    themeVariant: "dark",
    variant: "glass",
    iconStyle: "checkmark",
    enableSearch: true,
  },
  name: "Grid Layout with Checkmarks",
};

export const MinimalList: Story = {
  args: {
    items: sampleFAQItems.slice(0, 4),
    title: "Frequently asked questions",
    description: "We're happy to answer your questions",
    layoutVariant: "minimal-list",
    themeVariant: "light",
    variant: "minimal",
    iconStyle: "plus-minus",
    enableContactSection: true,
  },
  name: "Minimal List with Contact",
};

export const ContactSidebar: Story = {
  args: {
    items: sampleFAQItems.slice(0, 3),
    title: "FAQ",
    description: "Here are answers to the most commonly asked ones",
    layoutVariant: "contact-sidebar",
    themeVariant: "light",
    variant: "bordered",
    iconStyle: "chevron",
    enableContactSection: true,
    enableCategories: false,
    contactEmail: "support@web3africa.com",
    contactPhone: "+1 (555) 987-6543",
    contactChat: true,
  },
  name: "Contact Sidebar Layout",
};

export const CategoryTabs: Story = {
  args: {
    items: sampleFAQItems,
    title: "Frequently Asked Questions",
    description: "Browse by category to find exactly what you're looking for.",
    layoutVariant: "category-tabs",
    themeVariant: "light",
    variant: "default",
    iconStyle: "chevron",
    enableCategories: true,
    categories: categoryList,
    enableSearch: true,
  },
  name: "Category Tabs Layout",
};

export const FeaturedWithStats: Story = {
  args: {
    items: sampleFAQItems.slice(0, 5),
    title: "Frequently Asked Questions",
    description: "Everything you need to know about our platform.",
    layoutVariant: "featured",
    themeVariant: "ocean",
    variant: "glass",
    iconStyle: "chevron",
    enableSearch: true,
    enableContactSection: true,
    enableStats: true,
    enableSingleOpen: true,
    darkMode: true,

  },
  name: "Featured Layout with Stats",
};

// ============================================
// DARK THEME STORIES
// ============================================

export const DarkStandard: Story = {
  args: {
    ...Standard.args,
    themeVariant: "dark",
    darkMode: true,
  },
  decorators: [
    (Story) => (
      <div className="dark bg-gray-950 min-h-screen">
        <Story />
      </div>
    ),
  ],
  name: "Dark Theme - Standard",
};

export const MidnightSplitLeft: Story = {
  args: {
    ...SplitLeftWithContact.args,
    themeVariant: "midnight",
    darkMode: true,
    variant: "glass",
  },
  decorators: [
    (Story) => (
      <div className="bg-[#0B1120] min-h-screen">
        <Story />
      </div>
    ),
  ],
  name: "Midnight Theme - Split Left",
};

export const OceanFeatured: Story = {
  args: {
    ...FeaturedWithStats.args,
    themeVariant: "ocean",
    darkMode: true,
    title: "Frequently Asked Question",
    description: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
  },
  decorators: [
    (Story) => (
      <div className="bg-[#0A1929] min-h-screen">
        <Story />
      </div>
    ),
  ],
  name: "Ocean Theme - Featured",
};

export const CharcoalContactSidebar: Story = {
  args: {
    ...ContactSidebar.args,
    themeVariant: "charcoal",
    darkMode: true,
    variant: "glass",
    items: sampleFAQItems.slice(0, 4),
  },
  decorators: [
    (Story) => (
      <div className="bg-[#1A1D24] min-h-screen">
        <Story />
      </div>
    ),
  ],
  name: "Charcoal Theme - Contact Sidebar",
};

export const ForestGrid: Story = {
  args: {
    ...GridLayout.args,
    themeVariant: "forest",
    darkMode: true,
    variant: "card",
    iconStyle: "checkmark",
  },
  decorators: [
    (Story) => (
      <div className="bg-[#0A1F1A] min-h-screen">
        <Story />
      </div>
    ),
  ],
  name: "Forest Theme - Grid Layout",
};

export const SunsetMinimal: Story = {
  args: {
    ...MinimalList.args,
    themeVariant: "sunset",
    darkMode: true,
    variant: "minimal",
    iconStyle: "plus-minus",
  },
  decorators: [
    (Story) => (
      <div className="bg-[#1A0F1F] min-h-screen">
        <Story />
      </div>
    ),
  ],
  name: "Sunset Theme - Minimal List",
};

// ============================================
// VIBRANT COLOR STORIES
// ============================================

export const VibrantElectricBlue: Story = {
  args: {
    items: sampleFAQItems.slice(0, 3).map((item, index) => ({
      ...item,
      question: index === 0 ? "⚡ Experience lightning-fast performance" : item.question,
    })),
    title: "Electric Blue Theme",
    description: "Bold, energetic blue that commands attention",
    layoutVariant: "standard",
    variant: "card",
    themeVariant: "dark",
    darkMode: true,
    enableCategories: false,
    customHeader: (
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-4">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">POWERED BY BLUE</span>
        </div>
      </div>
    ),
    customFooter: (
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl text-white">
        <Typography variant="h6" weight="semibold" className="text-white mb-2">
          Need more power? 🚀
        </Typography>
        <Typography variant="body-small" className="text-white/90">
          Contact our blue team for enterprise solutions
        </Typography>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-950 min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 p-8">
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
  name: "🎨 Vibrant - Electric Blue",
};

export const VibrantEmeraldGreen: Story = {
  args: {
    ...VibrantElectricBlue.args,
    items: sampleFAQItems.slice(3, 6).map((item, index) => ({
      ...item,
      question: index === 0 ? "🌱 Sustainable blockchain solutions" : item.question,
    })),
    title: "Emerald Green Theme",
    description: "Fresh, growth-oriented green for eco-conscious brands",
    themeVariant: "forest",
    darkMode: true,
    customHeader: (
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-4">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">ECO CERTIFIED</span>
        </div>
      </div>
    ),
    customFooter: (
      <div className="mt-8 p-6 bg-gradient-to-r from-emerald-600 to-green-500 rounded-2xl text-white">
        <Typography variant="h6" weight="semibold" className="text-white mb-2">
          Go green with Web3 🌿
        </Typography>
        <Typography variant="body-small" className="text-white/90">
          Join our sustainable blockchain initiative
        </Typography>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="bg-[#0A1F1A] min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 via-transparent to-green-500/10 p-8">
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
  name: "🎨 Vibrant - Emerald Green",
};

export const VibrantRoyalPurple: Story = {
  args: {
    ...VibrantElectricBlue.args,
    items: sampleFAQItems.slice(6, 9).map((item, index) => ({
      ...item,
      question: index === 0 ? "👑 Enterprise-grade security" : item.question,
    })),
    title: "Royal Purple Theme",
    description: "Luxurious, premium purple for high-end brands",
    themeVariant: "midnight",
    darkMode: true,
    customHeader: (
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 mb-4">
          <Award className="w-4 h-4" />
          <span className="text-sm font-medium">PREMIUM TIER</span>
        </div>
      </div>
    ),
    customFooter: (
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-600 to-purple-500 rounded-2xl text-white">
        <Typography variant="h6" weight="semibold" className="text-white mb-2">
          Experience luxury 💜
        </Typography>
        <Typography variant="body-small" className="text-white/90">
          Upgrade to our premium enterprise plan
        </Typography>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="bg-[#0B1120] min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 p-8">
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
  name: "🎨 Vibrant - Royal Purple",
};

export const VibrantSunsetOrange: Story = {
  args: {
    ...VibrantElectricBlue.args,
    items: sampleFAQItems.slice(0, 4).map((item, index) => ({
      ...item,
      question: index === 0 ? "🌅 Transform your business today" : item.question,
    })),
    title: "Sunset Orange Theme",
    description: "Warm, energetic orange for creative agencies",
    themeVariant: "sunset",
    darkMode: true,
    customHeader: (
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-4">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">GROWTH DRIVEN</span>
        </div>
      </div>
    ),
    customFooter: (
      <div className="mt-8 p-6 bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl text-white">
        <Typography variant="h6" weight="semibold" className="text-white mb-2">
          Start your journey 🎯
        </Typography>
        <Typography variant="body-small" className="text-white/90">
          Book a free consultation today
        </Typography>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="bg-[#1A0F1F] min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-orange-500/10 via-transparent to-red-500/10 p-8">
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
  name: "🎨 Vibrant - Sunset Orange",
};

// ============================================
// PASTEL COLOR STORIES
// ============================================

export const PastelLavender: Story = {
  args: {
    items: sampleFAQItems.slice(0, 3),
    title: "Lavender Dream",
    description: "Soft, calming purple pastels for wellness brands",
    layoutVariant: "standard",
    themeVariant: "light",
    variant: "gradient",
    enableCategories: false,
    customHeader: (
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 border border-purple-200 mb-4">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">SOFT & GENTLE</span>
        </div>
      </div>
    ),
    customFooter: (
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-200 via-purple-100 to-pink-100 rounded-2xl text-purple-900 border border-purple-200">
        <Typography variant="h6" weight="semibold" className="text-purple-900 mb-2">
          Peaceful support 🌸
        </Typography>
        <Typography variant="body-small" className="text-purple-700">
          We're here to help with kindness
        </Typography>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
  name: "🎨 Pastel - Lavender Dream",
};

export const PastelMint: Story = {
  args: {
    ...PastelLavender.args,
    items: sampleFAQItems.slice(3, 6),
    title: "Mint Fresh",
    description: "Cool, refreshing green pastels for eco-brands",
    customHeader: (
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-emerald-700 border border-green-200 mb-4">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">FRESH & CLEAN</span>
        </div>
      </div>
    ),
    customFooter: (
      <div className="mt-8 p-6 bg-gradient-to-r from-green-200 via-emerald-100 to-teal-100 rounded-2xl text-emerald-900 border border-green-200">
        <Typography variant="h6" weight="semibold" className="text-emerald-900 mb-2">
          Naturally fresh 🌿
        </Typography>
        <Typography variant="body-small" className="text-emerald-700">
          Sustainable solutions for tomorrow
        </Typography>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
  name: "🎨 Pastel - Mint Fresh",
};

export const PastelPeach: Story = {
  args: {
    ...PastelLavender.args,
    items: sampleFAQItems.slice(6, 9),
    title: "Peach Blush",
    description: "Warm, friendly peach pastels for creative agencies",
    customHeader: (
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 border border-orange-200 mb-4">
          <Sun className="w-4 h-4" />
          <span className="text-sm font-medium">WARM & FRIENDLY</span>
        </div>
      </div>
    ),
    customFooter: (
      <div className="mt-8 p-6 bg-gradient-to-r from-orange-200 via-amber-100 to-yellow-100 rounded-2xl text-orange-900 border border-orange-200">
        <Typography variant="h6" weight="semibold" className="text-orange-900 mb-2">
          Let's create together 🎨
        </Typography>
        <Typography variant="body-small" className="text-orange-700">
          Your vision, our expertise
        </Typography>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
  name: "🎨 Pastel - Peach Blush",
};

// ============================================
// GLASS MORPHISM STORIES
// ============================================

export const GlassBlueDream: Story = {
  args: {
    items: sampleFAQItems.slice(0, 4),
    title: "Glass Blue",
    description: "Modern glass morphism with blue accents",
    layoutVariant: "standard",
    themeVariant: "dark",
    darkMode: true,
    variant: "glass",
    enableCategories: false,
    customHeader: (
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-sm text-blue-300 border border-blue-400/30 mb-4">
          <Cpu className="w-4 h-4" />
          <span className="text-sm font-medium">GLASS MORPHISM</span>
        </div>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="relative min-h-screen p-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900"></div>
        <div className="absolute inset-0 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
  name: "🎨 Glass - Blue Dream",
};

export const GlassPurpleHaze: Story = {
  args: {
    ...GlassBlueDream.args,
    items: sampleFAQItems.slice(4, 8),
    title: "Glass Purple",
    description: "Elegant glass morphism with purple tones",
    customHeader: (
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 backdrop-blur-sm text-purple-300 border border-purple-400/30 mb-4">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">PURPLE HAZE</span>
        </div>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="relative min-h-screen p-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900"></div>
        <div className="absolute inset-0 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
  name: "🎨 Glass - Purple Haze",
};

// ============================================
// GRADIENT STORIES
// ============================================

export const GradientAurora: Story = {
  args: {
    items: sampleFAQItems.slice(0, 5),
    title: "Northern Lights",
    description: "Mesmerizing aurora borealis gradient",
    layoutVariant: "featured",
    themeVariant: "dark",
    darkMode: true,
    enableStats: true,
    enableSearch: true,
    customHeader: (
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 mb-4">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">AURORA BOREALIS</span>
        </div>
      </div>
    ),
    stats: [
      { label: "Northern Lights", value: "1000+", icon: <Sparkles className="w-5 h-5" /> },
      { label: "Magic Moments", value: "500+", icon: <Star className="w-5 h-5" /> },
      { label: "Happy Travelers", value: "10K+", icon: <Users className="w-5 h-5" /> },
      { label: "Arctic Nights", value: "365", icon: <Moon className="w-5 h-5" /> },
    ],
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-6xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
  name: "🎨 Gradient - Aurora",
};

export const GradientSunrise: Story = {
  args: {
    ...GradientAurora.args,
    items: sampleFAQItems.slice(5, 10),
    title: "Morning Sunrise",
    description: "Warm sunrise gradient for morning energy",
    customHeader: (
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 mb-4">
          <Sun className="w-4 h-4" />
          <span className="text-sm font-medium">SUNRISE ENERGY</span>
        </div>
      </div>
    ),
    stats: [
      { label: "Sunrises", value: "365+", icon: <Sun className="w-5 h-5" /> },
      { label: "Coffee Cups", value: "1000+", icon: <Coffee className="w-5 h-5" /> },
      { label: "Early Birds", value: "5K+", icon: <Users className="w-5 h-5" /> },
      { label: "Productivity", value: "+47%", icon: <TrendingUp className="w-5 h-5" /> },
    ],
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen p-8 bg-gradient-to-br from-orange-900 via-red-900 to-pink-900">
        <div className="max-w-6xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
  name: "🎨 Gradient - Sunrise",
};

// ============================================
// RAINBOW COLLECTION
// ============================================

export const RainbowAccordions: Story = {
  args: {
    items: [
      {
        id: "rainbow1",
        question: "🌈 Red - Passion & Energy",
        answer: "Our red-themed FAQs cover high-priority topics that need immediate attention. From emergency procedures to urgent updates, we've got you covered with instant support.",
        icon: <Zap className="w-5 h-5" />,
      },
      {
        id: "rainbow2",
        question: "🧡 Orange - Creativity & Growth",
        answer: "Orange represents innovation and creative solutions. Find answers about our design process, creative workshops, and how we help brands stand out with unique visual identities.",
        icon: <Sparkles className="w-5 h-5" />,
      },
      {
        id: "rainbow3",
        question: "💛 Yellow - Optimism & Clarity",
        answer: "Yellow brings clarity and positive energy. Explore our educational resources, beginner guides, and easy-to-follow tutorials that make complex topics simple and enjoyable.",
        icon: <Sun className="w-5 h-5" />,
      },
      {
        id: "rainbow4",
        question: "💚 Green - Growth & Harmony",
        answer: "Green represents sustainable growth and balanced solutions. Learn about our eco-friendly initiatives, green hosting options, and commitment to carbon-neutral operations.",
        icon: <Shield className="w-5 h-5" />,
      },
      {
        id: "rainbow5",
        question: "💙 Blue - Trust & Reliability",
        answer: "Blue is the color of trust and dependability. Discover our security protocols, data protection measures, and why thousands of companies trust us with their critical infrastructure.",
        icon: <Lock className="w-5 h-5" />,
      },
      {
        id: "rainbow6",
        question: "💜 Purple - Luxury & Wisdom",
        answer: "Purple combines the stability of blue with the energy of red. Access our premium resources, advanced strategies, and exclusive insights for enterprise-level clients.",
        icon: <Award className="w-5 h-5" />,
      },
    ],
    title: "Rainbow Collection",
    description: "Each color tells a different story. Choose your vibe.",
    layoutVariant: "grid",
    themeVariant: "dark",
    darkMode: true,
    variant: "card",
    enableCategories: false,
    enableSearch: false,
    customHeader: (
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 text-white mb-6">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium">FULL SPECTRUM</span>
        </div>
        <Typography variant="h2" weight="bold" className="text-5xl mb-4 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          Rainbow Collection
        </Typography>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen p-8 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="max-w-6xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
  name: "🎨 Rainbow Collection",
};

// ============================================
// SEASONAL STORIES
// ============================================

export const ChristmasSpecial: Story = {
  args: {
    items: sampleFAQItems.slice(0, 4),
    title: "🎄 Holiday FAQ",
    description: "All you need to know for the festive season",
    layoutVariant: "standard",
    themeVariant: "dark",
    darkMode: true,
    variant: "card",
    enableCategories: false,
    customHeader: (
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-500 to-green-500 text-white mb-6">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">MERRY CHRISTMAS</span>
        </div>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen p-8 bg-gradient-to-br from-red-900 via-green-900 to-red-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-red-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
  name: "🎨 Seasonal - Christmas",
};

export const HalloweenSpecial: Story = {
  args: {
    ...ChristmasSpecial.args,
    title: "🎃 Halloween FAQ",
    description: "Spooky answers to your questions",
    customHeader: (
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-purple-600 text-white mb-6">
          <Moon className="w-4 h-4" />
          <span className="text-sm font-medium">TRICK OR TREAT</span>
        </div>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen p-8 bg-gradient-to-br from-orange-900 via-purple-900 to-orange-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
  name: "🎨 Seasonal - Halloween",
};

// ============================================
// USE CASE STORIES
// ============================================

export const Web3AfricaFAQ: Story = {
  args: {
    items: [
      {
        id: "w1",
        question: "What is Web3 Africa?",
        answer: "Web3 Africa is a community-driven initiative focused on educating and empowering African developers, entrepreneurs, and creators to build and participate in the decentralized web.",
        category: "general",
      },
      {
        id: "w2",
        question: "Who can join the SkillChain Program?",
        answer: "The SkillChain Program is open to anyone with a passion for blockchain technology and Web3 development. Whether you're a complete beginner or an experienced developer, we have tracks tailored to your skill level.",
        category: "programs",
      },
      {
        id: "w3",
        question: "How can I become a partner?",
        answer: "We are always open to collaborating with organizations that share our vision for a decentralized Africa. If you're interested in partnering with us, please reach out to us via email at web3africa2024@gmail.com.",
        category: "partnership",
      },
    ],
    title: "Frequently asked questions",
    description: "We're happy to answer your questions",
    layoutVariant: "minimal-list",
    themeVariant: "light",
    variant: "minimal",
    iconStyle: "plus-minus",
    enableContactSection: true,
    customContactSection: (
      <div className="mt-8 p-6 bg-primary/5 rounded-xl">
        <Typography variant="h6" weight="semibold" className="mb-2">
          Can't find what you're looking for?
        </Typography>
        <Typography variant="body-small" color="muted" className="mb-4">
          Contact our partnership team directly
        </Typography>
        <Button variant="default" className="cursor-pointer">
          <Mail className="w-4 h-4 mr-2" />
          web3africa2024@gmail.com
        </Button>
      </div>
    ),
  },
  name: "Web3 Africa FAQ",
};

export const AltraDesignFAQ: Story = {
  args: {
    items: sampleFAQItems.filter(item =>
      ["services", "process", "about"].includes(item.category || '')
    ),
    title: "Frequently asked questions",
    description: "Have more questions? Reach out to our sales team or schedule a call directly with our founder.",
    layoutVariant: "split-left",
    themeVariant: "light",
    variant: "glass",
    iconStyle: "plus-minus",
    enableContactSection: true,
    enableCategories: true,
    categories: categoryList.filter(cat =>
      ["services", "process", "about"].includes(cat.id)
    ),
    customContactSection: (
      <div className="bg-primary text-white rounded-2xl p-8">
        <Typography variant="h5" weight="semibold" className="mb-2 text-white">
          Contact sales
        </Typography>
        <Typography variant="body-small" className="text-white/80 mb-6">
          Schedule a call with James
        </Typography>
        <Button variant="secondary" className="w-full cursor-pointer bg-white text-primary hover:bg-white/90">
          <Calendar className="w-4 h-4 mr-2" />
          Schedule a call
        </Button>
      </div>
    ),
  },
  name: "Altra Design Agency FAQ",
};

export const CryptoInvestmentFAQ: Story = {
  args: {
    items: sampleFAQItems.filter(item =>
      ["technology", "investing", "security"].includes(item.category || '')
    ),
    title: "FAQ",
    description: "Here are answers to the most commonly asked ones",
    layoutVariant: "contact-sidebar",
    themeVariant: "dark",
    darkMode: true,
    variant: "glass",
    iconStyle: "chevron",
    enableContactSection: true,
    enableCategories: true,
    categories: categoryList.filter(cat =>
      ["technology", "investing", "security"].includes(cat.id)
    ),
  },
  decorators: [
    (Story) => (
      <div className="dark bg-gray-950 min-h-screen">
        <Story />
      </div>
    ),
  ],
  name: "Crypto Investment FAQ",
};

// ============================================
// ANIMATION & STATE STORIES
// ============================================

export const AnimationVariants: Story = {
  args: {
    items: sampleFAQItems.slice(0, 3),
    title: "Animation Styles",
    description: "Choose from 5 smooth expand/collapse animations",
    layoutVariant: "grid",
    themeVariant: "light",
    variant: "glass",
    enableSearch: false,
    enableCategories: false,
  },
  render: (args) => (
    <div className="space-y-12 p-8">
      <div>
        <Typography variant="h6" weight="semibold" className="mb-4 px-4">
          Fade Animation
        </Typography>
        <FAQSection {...args} animationVariant="fade" />
      </div>
      <div>
        <Typography variant="h6" weight="semibold" className="mb-4 px-4">
          Slide Animation
        </Typography>
        <FAQSection {...args} animationVariant="slide" />
      </div>
      <div>
        <Typography variant="h6" weight="semibold" className="mb-4 px-4">
          Scale Animation
        </Typography>
        <FAQSection {...args} animationVariant="scale" />
      </div>
      <div>
        <Typography variant="h6" weight="semibold" className="mb-4 px-4">
          Flip Animation
        </Typography>
        <FAQSection {...args} animationVariant="flip" />
      </div>
      <div>
        <Typography variant="h6" weight="semibold" className="mb-4 px-4">
          Reveal Animation
        </Typography>
        <FAQSection {...args} animationVariant="reveal" />
      </div>
    </div>
  ),
  name: "Animation Variants",
};

export const IconStyles: Story = {
  args: {
    items: sampleFAQItems.slice(0, 2),
    title: "Icon Styles",
    description: "Four different icon styles for accordion indicators",
    layoutVariant: "grid",
    themeVariant: "light",
    variant: "card",
  },
  render: (args) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      <div>
        <Typography variant="h6" weight="semibold" className="mb-4">
          Chevron Icons
        </Typography>
        <FAQSection {...args} iconStyle="chevron" />
      </div>
      <div>
        <Typography variant="h6" weight="semibold" className="mb-4">
          Plus/Minus Icons
        </Typography>
        <FAQSection {...args} iconStyle="plus-minus" />
      </div>
      <div>
        <Typography variant="h6" weight="semibold" className="mb-4">
          Arrow Icons
        </Typography>
        <FAQSection {...args} iconStyle="arrow" />
      </div>
      <div>
        <Typography variant="h6" weight="semibold" className="mb-4">
          Checkmark Icons
        </Typography>
        <FAQSection {...args} iconStyle="checkmark" />
      </div>
    </div>
  ),
  name: "Icon Styles",
};

export const LoadingState: Story = {
  args: {
    ...Standard.args,
    // variant: "dark",
    themeVariant: "dark",
    darkMode: true,
    isLoading: true,
  },
  name: "Loading State",
};

export const EmptyState: Story = {
  args: {
    ...Standard.args,
    items: [],
    title: "Frequently Asked Questions",
    description: "No FAQs available at the moment.",
  },
  name: "Empty State",
};

export const SingleOpenMode: Story = {
  args: {
    ...Standard.args,
    enableSingleOpen: true,
    description: "Only one FAQ item can be open at a time.",
  },
  name: "Single Open Mode",
};

// ============================================
// RESPONSIVE STORIES
// ============================================

export const MobileView: Story = {
  args: {
    ...SplitLeftWithContact.args,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  name: "Mobile View",
};

export const TabletView: Story = {
  args: {
    ...GridLayout.args,
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
  name: "Tablet View",
};

// ============================================
// ALL VARIANTS SHOWCASE
// ============================================

export const AllVariantsShowcase: Story = {
  render: () => (
    <div className="space-y-16 p-8">
      <div>
        <Typography variant="h4" weight="bold" className="mb-6">
          Accordion Variants
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Typography variant="h6" weight="semibold" className="mb-3">
              Default
            </Typography>
            <FAQSection
              items={sampleFAQItems.slice(0, 2)}
              title=""
              variant="default"
              enableSearch={false}
              enableCategories={false}
            />
          </div>
          <div>
            <Typography variant="h6" weight="semibold" className="mb-3">
              Card
            </Typography>
            <FAQSection
              items={sampleFAQItems.slice(0, 2)}
              title=""
              variant="card"
              enableSearch={false}
              enableCategories={false}
            />
          </div>
          <div>
            <Typography variant="h6" weight="semibold" className="mb-3">
              Bordered
            </Typography>
            <FAQSection
              items={sampleFAQItems.slice(0, 2)}
              title=""
              variant="bordered"
              enableSearch={false}
              enableCategories={false}
            />
          </div>
          <div>
            <Typography variant="h6" weight="semibold" className="mb-3">
              Minimal
            </Typography>
            <FAQSection
              items={sampleFAQItems.slice(0, 2)}
              title=""
              variant="minimal"
              enableSearch={false}
              enableCategories={false}
            />
          </div>
          <div>
            <Typography variant="h6" weight="semibold" className="mb-3">
              Glass
            </Typography>
            <FAQSection
              items={sampleFAQItems.slice(0, 2)}
              title=""
              variant="glass"
              themeVariant="dark"
              darkMode
              enableSearch={false}
              enableCategories={false}
            />
          </div>
          <div>
            <Typography variant="h6" weight="semibold" className="mb-3">
              Gradient
            </Typography>
            <FAQSection
              items={sampleFAQItems.slice(0, 2)}
              title=""
              variant="gradient"
              enableSearch={false}
              enableCategories={false}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  name: "📊 All Variants Showcase",
};