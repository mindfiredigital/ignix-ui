import { Section } from ".";

export default {
  title: "Components/Section",
  component: Section,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    spacing: {
      control: { type: "select" },
      options: ["none", "small", "normal", "large", "xl"],
    },
    maxWidth: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "xl", "full", "readable"],
    },
    background: {
      control: { type: "select" },
      options: ["none", "white", "gray", "slate", "zinc", "stone"],
    },
    padding: {
      control: { type: "select" },
      options: ["none", "small", "normal", "large", "comfortable", "generous"],
    },
    animation: {
      control: { type: "select" },
      options: ["none", "fade", "slide-up", "zoom", "stagger"],
    },
    animationDelay: {
      control: "number",
    },
  },
};

export const Default = {
  args: {
    spacing: "normal",
    maxWidth: "readable",
    background: "none",
    padding: "normal",
    children: (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Default Section</h2>
        <p className="text-gray-600">
          This is a default section with normal spacing, readable max width, no background, and normal padding.
        </p>
      </div>
    ),
  },
};

export const WithBackground = {
  args: {
    spacing: "large",
    background: "gray",
    padding: "comfortable",
    children: (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Section with Background</h2>
        <p className="text-gray-600">
          This section has a gray background, large spacing, and comfortable padding.
        </p>
      </div>
    ),
  },
};

export const DifferentSpacings = {
  args: {
    background: "slate",
    padding: "normal",
    children: (
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Small Spacing</h3>
          <Section spacing="small" background="none">
            <p className="text-sm">Section with small vertical spacing</p>
          </Section>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Normal Spacing</h3>
          <Section spacing="normal" background="none">
            <p className="text-sm">Section with normal vertical spacing</p>
          </Section>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Large Spacing</h3>
          <Section spacing="large" background="none">
            <p className="text-sm">Section with large vertical spacing</p>
          </Section>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Extra Large Spacing</h3>
          <Section spacing="xl" background="none">
            <p className="text-sm">Section with extra large vertical spacing</p>
          </Section>
        </div>
      </div>
    ),
  },
};

export const DifferentBackgrounds = {
  args: {
    spacing: "normal",
    padding: "normal",
    children: (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">White Background</h3>
          <Section background="white">
            <p className="text-sm">Section with white background</p>
          </Section>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Gray Background</h3>
          <Section background="gray">
            <p className="text-sm">Section with gray background</p>
          </Section>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Slate Background</h3>
          <Section background="slate">
            <p className="text-sm">Section with slate background</p>
          </Section>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Zinc Background</h3>
          <Section background="zinc">
            <p className="text-sm">Section with zinc background</p>
          </Section>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Stone Background</h3>
          <Section background="stone">
            <p className="text-sm">Section with stone background</p>
          </Section>
        </div>
      </div>
    ),
  },
};

export const DifferentMaxWidths = {
  args: {
    spacing: "normal",
    background: "none",
    padding: "normal",
    children: (
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Small Max Width</h3>
          <Section maxWidth="sm">
            <p className="text-sm">Section with small max width</p>
          </Section>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Medium Max Width</h3>
          <Section maxWidth="md">
            <p className="text-sm">Section with medium max width</p>
          </Section>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Large Max Width</h3>
          <Section maxWidth="lg">
            <p className="text-sm">Section with large max width</p>
          </Section>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Extra Large Max Width</h3>
          <Section maxWidth="xl">
            <p className="text-sm">Section with extra large max width</p>
          </Section>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Readable Max Width</h3>
          <Section maxWidth="readable">
            <p className="text-sm">
              Section with readable max width, perfect for long-form content. This width is optimized for comfortable reading.
            </p>
          </Section>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Full Width</h3>
          <Section maxWidth="full">
            <p className="text-sm">Section with full width</p>
          </Section>
        </div>
      </div>
    ),
  },
};

export const DifferentPaddings = {
  args: {
    spacing: "normal",
    background: "gray",
    children: (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No Padding</h3>
          <Section padding="none">
            <p className="text-sm">Section with no padding</p>
          </Section>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Small Padding</h3>
          <Section padding="small">
            <p className="text-sm">Section with small padding</p>
          </Section>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Normal Padding</h3>
          <Section padding="normal">
            <p className="text-sm">Section with normal padding</p>
          </Section>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Large Padding</h3>
          <Section padding="large">
            <p className="text-sm">Section with large padding</p>
          </Section>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Comfortable Padding</h3>
          <Section padding="comfortable">
            <p className="text-sm">Section with comfortable padding</p>
          </Section>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Generous Padding</h3>
          <Section padding="generous">
            <p className="text-sm">Section with generous padding</p>
          </Section>
        </div>
      </div>
    ),
  },
};

export const LandingPageExample = {
  args: {
    children: (
      <div className="space-y-12">
        <Section spacing="xl" background="white" padding="generous" maxWidth="readable">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover amazing features and create beautiful experiences
            </p>
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Get Started
            </button>
          </div>
        </Section>
        
        <Section spacing="large" background="gray" padding="comfortable" maxWidth="readable">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-lg text-gray-600 mb-8">
              Everything you need to build amazing applications
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Fast Performance</h3>
                <p className="text-gray-600">Optimized for speed and efficiency</p>
              </div>
              <div className="p-6 bg-white rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Beautiful Design</h3>
                <p className="text-gray-600">Modern and elegant components</p>
              </div>
              <div className="p-6 bg-white rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
                <p className="text-gray-600">Intuitive and developer-friendly</p>
              </div>
            </div>
          </div>
        </Section>
        
        <Section spacing="xl" background="white" padding="generous" maxWidth="readable">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of developers already using our platform
            </p>
            <button className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 text-lg">
              Start Building Today
            </button>
          </div>
        </Section>
      </div>
    ),
  },
};