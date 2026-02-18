import type { Meta, StoryObj } from '@storybook/react';
import { PricingGrid } from './index';
import type { PricingTier } from './index';

const meta: Meta<typeof PricingGrid> = {
  title: "Templates/Section/Content/PricingGrid",
  component: PricingGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The **PricingGrid** component displays pricing tiers side by side with features, prices, and call-to-action buttons.

### Features
- Display 2-3 pricing tiers side by side
- Each tier includes price, feature list, and CTA button
- Visually highlight recommended/popular tier
- Optional monthly/annual billing toggle
- Smooth price transitions when toggling billing period
- Fully responsive design
- Accessible and keyboard navigable
- Clean, modern design with purple accents

### Usage
\`\`\`tsx
<PricingGrid
  title="Plans that scale"
  titleHighlight="with your growth"
  description="Start free, upgrade when you're ready. No hidden fees, cancel anytime."
  tiers={[
    {
      name: 'STARTER',
      price: { monthly: '$9 /mo' },
      description: 'Perfect for side projects and experiments.',
      features: [{ label: 'Up to 3 projects' }],
      recommended: false,
      // Simple color customization with cardColor
      cardColor: 'blue',
    }
  ]}
  showToggle={true}
  defaultBilling="monthly"
  accentColor="text-purple-600"
  toggleActiveColor="bg-purple-600"
/>
\`\`\`

### Color Customization

Each pricing tier can have custom colors:
- \`borderColor\`: Tailwind class for card border (e.g., 'border-blue-200/60', 'border-purple-300')
- \`buttonColor\`: Tailwind classes for button background (e.g., 'bg-purple-600 hover:bg-purple-700')
- \`buttonTextColor\`: Tailwind class for button text (e.g., 'text-white', 'text-purple-700')
- \`badgeColor\`: Tailwind classes for "MOST POPULAR" badge (e.g., 'bg-purple-600 text-white')

Global colors:
- \`accentColor\`: Tailwind class for title highlight (e.g., 'text-purple-600', 'text-blue-600')
- \`toggleActiveColor\`: Tailwind class for active toggle button (e.g., 'bg-purple-600', 'bg-blue-600')

Background customization:
- \`sectionBackgroundColor\`: Tailwind class or CSS color for section background (e.g., 'bg-gray-50', 'bg-gradient-to-br from-purple-50 to-blue-50')
- \`sectionBackgroundImage\`: URL string for section background image
- \`sectionBackgroundOverlay\`: Tailwind class for overlay on section background image (e.g., 'bg-white/90', 'bg-black/10')
- \`cardBackgroundColor\`: Tailwind class or CSS color for individual card background (e.g., 'bg-white', 'bg-blue-50')
- \`cardBackgroundImage\`: URL string for individual card background image
- \`cardBackgroundOverlay\`: Tailwind class for overlay on card background image (e.g., 'bg-white/80', 'bg-purple-600/80')
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Main heading for the pricing section',
    },
    titleHighlight: {
      control: 'text',
      description: 'Highlighted portion of the title (shown in purple)',
    },
    description: {
      control: 'text',
      description: 'Subtitle/description text below the title',
    },
    showToggle: {
      control: 'boolean',
      description: 'Show/hide the monthly/annual billing toggle',
    },
    defaultBilling: {
      control: 'select',
      options: ['monthly', 'annual'],
      description: 'Default billing period',
    },
    onCtaClick: {
      action: 'cta clicked',
      description: 'Callback when a CTA button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PricingGrid>;

// Pricing tiers matching the screenshot design
const screenshotTiers: PricingTier[] = [
  {
    name: 'STARTER',
    price: {
      monthly: '$9 /mo',
    },
    description: 'Perfect for side projects and experiments.',
    features: [
      { label: 'Up to 3 projects' },
      { label: '1 GB storage' },
      { label: 'Basic analytics' },
      { label: 'Community support' },
      { label: 'API access' },
    ],
    ctaLabel: 'Get Started',
    recommended: false,
  },
  {
    name: 'PRO',
    price: {
      monthly: '$29 /mo',
    },
    description: 'For growing teams that need more power.',
    features: [
      { label: 'Unlimited projects' },
      { label: '50 GB storage' },
      { label: 'Advanced analytics' },
      { label: 'Priority email support' },
      { label: 'API access' },
      { label: 'Custom integrations' },
      { label: 'Team collaboration' },
    ],
    ctaLabel: 'Start Free Trial',
    recommended: true,
  },
  {
    name: 'ENTERPRISE',
    price: {
      monthly: '$79 /mo',
    },
    description: 'For organizations with advanced needs.',
    features: [
      { label: 'Unlimited everything' },
      { label: '500 GB storage' },
      { label: 'Real-time analytics' },
      { label: '24/7 dedicated support' },
      { label: 'API access' },
      { label: 'Custom integrations' },
      { label: 'SSO & SAML' },
      { label: 'SLA guarantee' },
    ],
    ctaLabel: 'Contact Sales',
    recommended: false,
  },
];

/**
 * Default pricing grid matching the screenshot design
 */
export const Default: Story = {
  args: {
    title: 'Plans that scale',
    titleHighlight: 'with your growth',
    description: 'Start free, upgrade when you\'re ready. No hidden fees, cancel anytime.',
    tiers: screenshotTiers,
    showToggle: false,
    defaultBilling: 'monthly',
    scaleRecommended: false,
  },
};

/**
 * Without toggle
 */
export const WithToggle: Story = {
  args: {
    title: 'Plans that scale',
    titleHighlight: 'with your growth',
    description: 'Start free, upgrade when you\'re ready. No hidden fees, cancel anytime.',
    tiers: screenshotTiers,
    showToggle: true,
    defaultBilling: 'monthly',
  },
};

/**
 * With annual pricing
 */
export const WithAnnualPricing: Story = {
  args: {
    title: 'Plans that scale',
    titleHighlight: 'with your growth',
    description: 'Start free, upgrade when you\'re ready. No hidden fees, cancel anytime.',
    tiers: [
      {
        name: 'STARTER',
        price: {
          monthly: '$9 /mo',
          annual: '$7 /mo',
        },
        description: 'Perfect for side projects and experiments.',
        features: [
          { label: 'Up to 3 projects' },
          { label: '1 GB storage' },
          { label: 'Basic analytics' },
          { label: 'Community support' },
          { label: 'API access' },
        ],
        ctaLabel: 'Get Started',
        recommended: false,
      },
      {
        name: 'PRO',
        price: {
          monthly: '$29 /mo',
          annual: '$23 /mo',
        },
        description: 'For growing teams that need more power.',
        features: [
          { label: 'Unlimited projects' },
          { label: '50 GB storage' },
          { label: 'Advanced analytics' },
          { label: 'Priority email support' },
          { label: 'API access' },
          { label: 'Custom integrations' },
          { label: 'Team collaboration' },
        ],
        ctaLabel: 'Start Free Trial',
        recommended: true,
      },
      {
        name: 'ENTERPRISE',
        price: {
          monthly: '$79 /mo',
          annual: '$63 /mo',
        },
        description: 'For organizations with advanced needs.',
        features: [
          { label: 'Unlimited everything' },
          { label: '500 GB storage' },
          { label: 'Real-time analytics' },
          { label: '24/7 dedicated support' },
          { label: 'API access' },
          { label: 'Custom integrations' },
          { label: 'SSO & SAML' },
          { label: 'SLA guarantee' },
        ],
        ctaLabel: 'Contact Sales',
        recommended: false,
      },
    ],
    showToggle: true,
    defaultBilling: 'annual',
  },
};

/**
 * Two tier pricing
 */
export const TwoTiers: Story = {
  args: {
    title: 'Plans that scale',
    titleHighlight: 'with your growth',
    description: 'Start free, upgrade when you\'re ready. No hidden fees, cancel anytime.',
    horizontalHeader: true,
    tiers: [
      {
        name: 'STARTER',
        price: {
          monthly: '$9 /mo',
        },
        description: 'Perfect for side projects and experiments.',
        features: [
          { label: 'Up to 3 projects' },
          { label: '1 GB storage' },
          { label: 'Basic analytics' },
          { label: 'Community support' },
          { label: 'API access' },
        ],
        ctaLabel: 'Get Started',
        recommended: false,
      },
      {
        name: 'PRO',
        price: {
          monthly: '$29 /mo',
        },
        description: 'For growing teams that need more power.',
        features: [
          { label: 'Unlimited projects' },
          { label: '50 GB storage' },
          { label: 'Advanced analytics' },
          { label: 'Priority email support' },
          { label: 'API access' },
          { label: 'Custom integrations' },
          { label: 'Team collaboration' },
        ],
        ctaLabel: 'Start Free Trial',
        recommended: true,
      },
    ],
    showToggle: true,
    scaleRecommended: true,
    defaultBilling: 'monthly',
  },
};

export const TwoTiersWithBackgroundImage: Story = {
  args: {
    title: 'Plans that scale',
    titleHighlight: 'with your growth',
    description: 'Start free, upgrade when you\'re ready. No hidden fees, cancel anytime.',
    horizontalHeader: true,
    sectionBackgroundImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80',
    tiers: [
      {
        name: 'STARTER',
        price: {
          monthly: '$9 /mo',
        },
        description: 'Perfect for side projects and experiments.',
        features: [
          { label: 'Up to 3 projects' },
          { label: '1 GB storage' },
          { label: 'Basic analytics' },
          { label: 'Community support' },
          { label: 'API access' },
        ],
        ctaLabel: 'Get Started',
        recommended: false,
      },
      {
        name: 'PRO',
        price: {
          monthly: '$29 /mo',
        },
        description: 'For growing teams that need more power.',
        features: [
          { label: 'Unlimited projects' },
          { label: '50 GB storage' },
          { label: 'Advanced analytics' },
          { label: 'Priority email support' },
          { label: 'API access' },
          { label: 'Custom integrations' },
          { label: 'Team collaboration' },
        ],
        ctaLabel: 'Start Free Trial',
        recommended: true,
      },
    ],
    showToggle: true,
    scaleRecommended: true,
    defaultBilling: 'monthly',
  },
};

/**
 * Custom colors for each card
 */
export const CustomCardColors: Story = {
  args: {
    title: 'Plans that scale',
    titleHighlight: 'with your growth',
    description: 'Start free, upgrade when you\'re ready. No hidden fees, cancel anytime.',
    tiers: [
      {
        name: 'STARTER',
        price: {
          monthly: '$9 /mo',
        },
        description: 'Perfect for side projects and experiments.',
        features: [
          { label: 'Up to 3 projects' },
          { label: '1 GB storage' },
          { label: 'Basic analytics' },
          { label: 'Community support' },
          { label: 'API access' },
        ],
        ctaLabel: 'Get Started',
        recommended: false,
        cardColor: 'blue',
      },
      {
        name: 'PRO',
        price: {
          monthly: '$29 /mo',
        },
        description: 'For growing teams that need more power.',
        features: [
          { label: 'Unlimited projects' },
          { label: '50 GB storage' },
          { label: 'Advanced analytics' },
          { label: 'Priority email support' },
          { label: 'API access' },
          { label: 'Custom integrations' },
          { label: 'Team collaboration' },
        ],
        ctaLabel: 'Start Free Trial',
        recommended: true,
        cardColor: 'purple',
      },
      {
        name: 'ENTERPRISE',
        price: {
          monthly: '$79 /mo',
        },
        description: 'For organizations with advanced needs.',
        features: [
          { label: 'Unlimited everything' },
          { label: '500 GB storage' },
          { label: 'Real-time analytics' },
          { label: '24/7 dedicated support' },
          { label: 'API access' },
          { label: 'Custom integrations' },
          { label: 'SSO & SAML' },
          { label: 'SLA guarantee' },
        ],
        ctaLabel: 'Contact Sales',
        recommended: false,
        cardColor: 'green',
      },
    ],
    showToggle: true,
    defaultBilling: 'monthly',
    accentColor: 'text-purple-600',
    toggleActiveColor: 'bg-purple-600',
  },
};

/**
 * Custom global accent color
 */
export const CustomAccentColor: Story = {
  args: {
    title: 'Plans that scale',
    titleHighlight: 'with your growth',
    description: 'Start free, upgrade when you\'re ready. No hidden fees, cancel anytime.',
    tiers: [
      {
        name: 'STARTER',
        price: {
          monthly: '$9 /mo',
        },
        description: 'Perfect for side projects and experiments.',
        features: [
          { label: 'Up to 3 projects' },
          { label: '1 GB storage' },
          { label: 'Basic analytics' },
          { label: 'Community support' },
          { label: 'API access' },
        ],
        ctaLabel: 'Get Started',
        recommended: false,
        cardColor: 'purple',
      },
      {
        name: 'PRO',
        price: {
          monthly: '$29 /mo',
        },
        description: 'For growing teams that need more power.',
        features: [
          { label: 'Unlimited projects' },
          { label: '50 GB storage' },
          { label: 'Advanced analytics' },
          { label: 'Priority email support' },
          { label: 'API access' },
          { label: 'Custom integrations' },
          { label: 'Team collaboration' },
        ],
        ctaLabel: 'Start Free Trial',
        recommended: true,
        cardColor: 'blue',
      },
      {
        name: 'ENTERPRISE',
        price: {
          monthly: '$79 /mo',
        },
        description: 'For organizations with advanced needs.',
        features: [
          { label: 'Unlimited everything' },
          { label: '500 GB storage' },
          { label: 'Real-time analytics' },
          { label: '24/7 dedicated support' },
          { label: 'API access' },
          { label: 'Custom integrations' },
          { label: 'SSO & SAML' },
          { label: 'SLA guarantee' },
        ],
        ctaLabel: 'Contact Sales',
        recommended: true,
        cardColor: 'green',
      },
    ],
    showToggle: true,
    defaultBilling: 'monthly',
    accentColor: 'text-blue-600',
    toggleActiveColor: 'bg-blue-600',
  },
};

/**
 * Section with background color
 */
export const WithSectionBackground: Story = {
  args: {
    title: 'Plans that scale',
    titleHighlight: 'with your growth',
    description: 'Start free, upgrade when you\'re ready. No hidden fees, cancel anytime.',
    tiers: screenshotTiers,
    showToggle: true,
    defaultBilling: 'monthly',
    sectionBackgroundColor: 'bg-purple-100',
    scaleRecommended: true,
  },
};

/**
 * Section with background image
 */
export const WithSectionBackgroundImage: Story = {
  args: {
    title: 'Plans that scale',
    titleHighlight: 'with your growth',
    description: 'Start free, upgrade when you\'re ready. No hidden fees, cancel anytime.',
    tiers: [
      {
        name: 'STARTER',
        price: {
          monthly: '$9 /mo',
        },
        description: 'Perfect for side projects and experiments.',
        features: [
          { label: 'Up to 3 projects' },
          { label: '1 GB storage' },
          { label: 'Basic analytics' },
          { label: 'Community support' },
          { label: 'API access' },
        ],
        ctaLabel: 'Get Started',
        recommended: false,
        cardColor: 'blue',
      },
      {
        name: 'PRO',
        price: {
          monthly: '$29 /mo',
        },
        description: 'For growing teams that need more power.',
        features: [
          { label: 'Unlimited projects' },
          { label: '50 GB storage' },
          { label: 'Advanced analytics' },
          { label: 'Priority email support' },
          { label: 'API access' },
          { label: 'Custom integrations' },
          { label: 'Team collaboration' },
        ],
        ctaLabel: 'Start Free Trial',
        recommended: true,
        cardColor: 'purple',
      },
      {
        name: 'ENTERPRISE',
        price: {
          monthly: '$79 /mo',
        },
        description: 'For organizations with advanced needs.',
        features: [
          { label: 'Unlimited everything' },
          { label: '500 GB storage' },
          { label: 'Real-time analytics' },
          { label: '24/7 dedicated support' },
          { label: 'API access' },
          { label: 'Custom integrations' },
          { label: 'SSO & SAML' },
          { label: 'SLA guarantee' },
        ],
        ctaLabel: 'Contact Sales',
        recommended: false,
        cardColor: 'green',
      },
    ],
    showToggle: true,
    defaultBilling: 'monthly',
    sectionBackgroundImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80',
    scaleRecommended: true,
  },
};

/**
 * Cards with background images
 */
export const CardsWithBackgroundImages: Story = {
  args: {
    title: 'Plans that scale',
    titleHighlight: 'with your growth',
    description: 'Start free, upgrade when you\'re ready. No hidden fees, cancel anytime.',
    scaleRecommended: true,
    horizontalHeader: true,
    tiers: [
      {
        name: 'STARTER',
        price: {
          monthly: '$9 /mo',
        },
        description: 'Perfect for side projects and experiments.',
        features: [
          { label: 'Up to 3 projects' },
          { label: '1 GB storage' },
          { label: 'Basic analytics' },
          { label: 'Community support' },
          { label: 'API access' },
        ],
        ctaLabel: 'Get Started',
        recommended: false,
        cardBackgroundImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
        cardBackgroundOverlay: 'bg-black/50',
      },
      {
        name: 'PRO',
        price: {
          monthly: '$29 /mo',
        },
        description: 'For growing teams that need more power.',
        features: [
          { label: 'Unlimited projects' },
          { label: '50 GB storage' },
          { label: 'Advanced analytics' },
          { label: 'Priority email support' },
          { label: 'API access' },
          { label: 'Custom integrations' },
          { label: 'Team collaboration' },
        ],
        ctaLabel: 'Start Free Trial',
        recommended: true,
        cardBackgroundImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        cardBackgroundOverlay: 'bg-black/50',
        badgeColor: 'bg-white text-gray-900',
      },
    ],
    sectionBackgroundColor: "bg-purple-100",
    showToggle: true,
    defaultBilling: 'monthly',
  },
};

/**
 * Dark background theme
 */
export const DarkBackground: Story = {
  args: {
    title: 'Plans that scale',
    titleHighlight: 'with your growth',
    description: 'Start free, upgrade when you\'re ready. No hidden fees, cancel anytime.',
    scaleRecommended: true,
    tiers: [
      {
        name: 'STARTER',
        price: {
          monthly: '$9 /mo',
        },
        description: 'Perfect for side projects and experiments.',
        features: [
          { label: 'Up to 3 projects' },
          { label: '1 GB storage' },
          { label: 'Basic analytics' },
          { label: 'Community support' },
          { label: 'API access' },
        ],
        ctaLabel: 'Get Started',
        recommended: false,
        cardBackgroundColor: 'bg-blue-100',
        cardColor: 'blue',
      },
      {
        name: 'PRO',
        price: {
          monthly: '$29 /mo',
        },
        description: 'For growing teams that need more power.',
        features: [
          { label: 'Unlimited projects' },
          { label: '50 GB storage' },
          { label: 'Advanced analytics' },
          { label: 'Priority email support' },
          { label: 'API access' },
          { label: 'Custom integrations' },
          { label: 'Team collaboration' },
        ],
        ctaLabel: 'Start Free Trial',
        recommended: true,
        cardBackgroundColor: 'bg-purple-100',
        cardColor: 'purple',
      },
      {
        name: 'ENTERPRISE',
        price: {
          monthly: '$79 /mo',
        },
        description: 'For organizations with advanced needs.',
        features: [
          { label: 'Unlimited everything' },
          { label: '500 GB storage' },
          { label: 'Real-time analytics' },
          { label: '24/7 dedicated support' },
          { label: 'API access' },
          { label: 'Custom integrations' },
          { label: 'SSO & SAML' },
          { label: 'SLA guarantee' },
        ],
        ctaLabel: 'Contact Sales',
        recommended: false,
        cardBackgroundColor: 'bg-green-100',
        cardColor: 'green',
      },
    ],
    showToggle: true,
    defaultBilling: 'monthly',
    sectionBackgroundColor: 'bg-gray-900',
    accentColor: 'text-purple-400',
    toggleActiveColor: 'bg-purple-600',
    titleColor: 'text-white',
    descriptionColor: 'text-gray-300',
    labelColor: 'text-gray-400',
  },
};

/**
 * All animations showcase - displays all animation types at once
 */
export const AllAnimationsShowcase: Story = {
  render: () => {
    const animationTypes = [
      { name: 'Fade', value: 'fade' },
      { name: 'Slide', value: 'slide' },
      { name: 'Scale', value: 'scale' },
      { name: 'Slide Up', value: 'slide-up' },
      { name: 'Slide Down', value: 'slide-down' },
    ];

    return (
      <div className="space-y-16">
        {animationTypes.map((anim) => (
          <div key={anim.value} className="space-y-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {anim.name} Animation
              </h3>
              <p className="text-sm text-gray-600">
                animation: '{anim.value}'
              </p>
            </div>
            <PricingGrid
              title="Plans that scale"
              titleHighlight="with your growth"
              description="Start free, upgrade when you're ready. No hidden fees, cancel anytime."
              tiers={screenshotTiers}
              showToggle={true}
              defaultBilling="monthly"
              animation={anim.value as any}
            />
          </div>
        ))}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Animation
            </h3>
            <p className="text-sm text-gray-600">
              animation: false
            </p>
          </div>
          <PricingGrid
            title="Plans that scale"
            titleHighlight="with your growth"
            description="Start free, upgrade when you're ready. No hidden fees, cancel anytime."
            tiers={screenshotTiers}
            showToggle={true}
            defaultBilling="monthly"
            animation={false}
          />
        </div>
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Custom Animation Config
            </h3>
            <p className="text-sm text-gray-600">
              animation: {'{'} type: 'scale', duration: 0.8, staggerDelay: 0.2 {'}'}
            </p>
          </div>
          <PricingGrid
            title="Plans that scale"
            titleHighlight="with your growth"
            description="Start free, upgrade when you're ready. No hidden fees, cancel anytime."
            tiers={screenshotTiers}
            showToggle={true}
            defaultBilling="monthly"
            animation={{
              enabled: true,
              type: 'scale',
              duration: 0.8,
              staggerDelay: 0.2,
              headerDelay: 0.1,
              toggleDelay: 0.3,
            }}
          />
        </div>
      </div>
    );
  },
};
