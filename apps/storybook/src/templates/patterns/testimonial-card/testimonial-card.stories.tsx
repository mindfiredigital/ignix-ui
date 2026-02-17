import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  TestimonialCard,
  TestimonialCardQuote,
  TestimonialCardAuthor,
  TestimonialCardRating,
  TestimonialCardSocialLinks,
} from ".";
import { ButtonWithIcon } from "../../../components/button-with-icon";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const meta: Meta<typeof TestimonialCard> = {
  title: "Templates/Patterns/TestimonialCard",
  component: TestimonialCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant of the testimonial card",
    },
    variant: {
      control: "select",
      options: ["default", "minimal", "outline", "premium"],
    },
    animation: {
        control: "select",
        options: ["none", "fadeIn", "slideUp", "scaleIn", "flipIn", "bounceIn", "floatIn"],
    },
    avatarPosition: {
      control: "select",
      options: ["top", "bottom"],
      description: "Avatar Position"
    },
    fullImage: {
      control: "text",
      description: "Full width image URL to display at the top of the card"
    },
    fullImageAlt: {
      control: "text",
      description: "Alt text for the full image"
    },
    backgroundImage: {
      control: "text",
      description: "Background image URL - content will be overlaid on the image"
    },
    backgroundImageAlt: {
      control: "text",
      description: "Alt text for the background image"
    }
  },
};

export default meta;
type Story = StoryObj<typeof TestimonialCard>;

/**
 * Default testimonial card with quote, author name, and title.
 * This is the most basic usage of the component.
 */
export const Default: Story = {
  render: () => (
    <TestimonialCard>
      <TestimonialCardQuote>
        This product has completely transformed how we work. The ease of use and powerful features make it indispensable for our team.
      </TestimonialCardQuote>
      <TestimonialCardAuthor
        name="Sarah Johnson"
        title="Product Manager"
        company="TechCorp"
      />
      <TestimonialCardSocialLinks>
        <ButtonWithIcon variant="ghost" size="lg" iconPosition="left" icon={<FaFacebook />} className="text-gray-600">
        </ButtonWithIcon>
        <ButtonWithIcon variant="ghost" size="lg" iconPosition="left" icon={<FaInstagram />} className="text-gray-600">
        </ButtonWithIcon>
        <ButtonWithIcon variant="ghost" size="lg" iconPosition="left" icon={<FaLinkedin />} className="text-gray-600">
        </ButtonWithIcon>
      </TestimonialCardSocialLinks>
    </TestimonialCard>
  ),
};

/**
 * TopCenter testimonial card with quote, author name, and title.
 * This is the most basic usage of the component.
 */
export const TopCenterAvatar: Story = {
  render: () => (
    <TestimonialCard avatarPosition="top">
      <TestimonialCardAuthor
        name="Sarah Johnson"
        title="Product Manager"
        company="TechCorp"
        avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
        avatarAlt="Emily Rodriguez"
      />
      <TestimonialCardSocialLinks>
        <ButtonWithIcon variant="ghost" size="lg" iconPosition="left" icon={<FaFacebook />} className="text-gray-600">
        </ButtonWithIcon>
        <ButtonWithIcon variant="ghost" size="lg" iconPosition="left" icon={<FaInstagram />} className="text-gray-600">
        </ButtonWithIcon>
        <ButtonWithIcon variant="ghost" size="lg" iconPosition="left" icon={<FaLinkedin />} className="text-gray-600">
        </ButtonWithIcon>
      </TestimonialCardSocialLinks>
      <TestimonialCardRating value={5} />
      <TestimonialCardQuote>
        This product has completely transformed how we work. The ease of use and powerful features make it indispensable for our team.
      </TestimonialCardQuote>
    </TestimonialCard>
  ),
};

/**
 * Testimonial card with author avatar for a more personal touch.
 * Avatars help build trust and make testimonials more relatable.
 */
export const bottomAvatar: Story = {
  render: () => (
    <TestimonialCard size="sm" avatarPosition="bottom">
      <TestimonialCardRating value={4.5} />
      <TestimonialCardQuote>
        The best investment we've made this year. The ROI was evident within the first month, and our productivity has increased significantly.
      </TestimonialCardQuote>
      <TestimonialCardAuthor
        name="Emily Rodriguez"
        title="Operations Director"
        company="Global Solutions Inc."
        avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
        avatarAlt="Emily Rodriguez"
      />
    </TestimonialCard>
  ),
};

/**
 * Full image at top with quote at bottom.
 * Perfect for showcasing testimonials with visual context.
 */
export const ImageTop: Story = {
  render: () => (
    <TestimonialCard 
      avatarPosition="bottom"
      variant="premium"
    >
      <TestimonialCardQuote>
        Exceptional quality and attention to detail. The team's expertise is evident in every aspect of the product. This has been a game-changer for our organization, helping us achieve results we never thought possible.
      </TestimonialCardQuote>
      <TestimonialCardAuthor
        name="Michael Chen"
        title="CEO"
        company="InnovateLabs"
        fullImage="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
        fullImageAlt="Professional workspace"
        avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
        avatarAlt="Ryan P."
      />
    </TestimonialCard>
  ),
};

/**
 * Background image with content overlay - modern design with quote and author overlaid on image.
 * Perfect for showcasing testimonials with visual context where content appears on a dark overlay.
 */
export const BackgroundImage: Story = {
  render: () => (
    <TestimonialCard 
      size="lg"
      variant="premium"
      backgroundImage="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
      backgroundImageAlt="Modern interior design"
    >
      <TestimonialCardQuote>
        From concept to execution, the team nailed my vision. My home finally feels like me.
      </TestimonialCardQuote>
      <TestimonialCardAuthor
        name="Ryan P."
        company="USA California"
        avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
        avatarAlt="Ryan P."
      />
      <TestimonialCardSocialLinks>
        <ButtonWithIcon variant="ghost" size="lg" iconPosition="left" icon={<FaFacebook />} className="text-gray-600">
        </ButtonWithIcon>
        <ButtonWithIcon variant="ghost" size="lg" iconPosition="left" icon={<FaInstagram />} className="text-gray-600">
        </ButtonWithIcon>
        <ButtonWithIcon variant="ghost" size="lg" iconPosition="left" icon={<FaLinkedin />} className="text-gray-600">
        </ButtonWithIcon>
      </TestimonialCardSocialLinks>
      <TestimonialCardRating value={3.7} />
    </TestimonialCard>
  ),
}
    
/**
 * Split layout – inner white card on coloured background with avatar on the left
 * and testimonial content on the right.
 */
export const SplitCard: Story = {
  render: () => (
    <TestimonialCard 
      split
      size="lg"
      avatarPosition="top"
    >
      <TestimonialCardAuthor
        name="Martin Guptill"
        title="UI/UX Designer"
        avatar="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face"
        avatarAlt="Martin Guptill"
      />
      <TestimonialCardQuote>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel a eius excepturi commodi aliquam error magnam.
      </TestimonialCardQuote>
      <TestimonialCardRating value={4.8} />
      <TestimonialCardSocialLinks>
        <ButtonWithIcon variant="none" size="wide" iconPosition="right" icon={<FaFacebook />} className="text-gray-600">
        </ButtonWithIcon>
        <ButtonWithIcon variant="none" size="wide" iconPosition="left" icon={<FaInstagram />} className="text-gray-600">
        </ButtonWithIcon>
        <ButtonWithIcon variant="none" size="wide" iconPosition="left" icon={<FaLinkedin />} className="text-gray-600">
        </ButtonWithIcon>
      </TestimonialCardSocialLinks>
    </TestimonialCard>
  ),
};

/**
 * Size comparison - shows all three sizes side by side.
 */
export const SizeComparison: Story = {
  render: () => (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <TestimonialCard  size="sm">
        <TestimonialCardRating value={5} />
        <TestimonialCardQuote>
          Great product with excellent support!
        </TestimonialCardQuote>
        <TestimonialCardAuthor
          name="Alex Turner"
          title="Developer"
          company="CodeWorks"
          avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
          avatarAlt="Alex Turner"
        />
      </TestimonialCard>

      <TestimonialCard  size="md">
        <TestimonialCardRating value={5} />
        <TestimonialCardQuote>
          Outstanding service and a product that truly delivers on its promises. Highly recommended!
        </TestimonialCardQuote>
        <TestimonialCardAuthor
          name="Sarah Johnson"
          title="Product Manager"
          company="TechCorp"
          avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
          avatarAlt="Sarah Johnson"
        />
      </TestimonialCard>

      <TestimonialCard  size="lg">
        <TestimonialCardRating value={5} />
        <TestimonialCardQuote>
          This platform has revolutionized our entire operation. The comprehensive features, intuitive design, and exceptional customer support have made it an invaluable asset to our organization.
        </TestimonialCardQuote>
        <TestimonialCardAuthor
          name="Robert Thompson"
          title="Chief Technology Officer"
          company="Enterprise Solutions Group"
          avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
          avatarAlt="Robert Thompson"
        />
      </TestimonialCard>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

/**
 * Animation comparison - showcases all available animation types.
 * Refresh the page to see animations replay.
 */
export const AnimationComparison: Story = {
  render: () => {
    const animations: Array<"none" | "fadeIn" | "slideUp" | "scaleIn" | "flipIn" | "bounceIn" | "floatIn"> = [
      "none",
      "fadeIn",
      "slideUp",
      "scaleIn",
      "flipIn",
      "bounceIn",
      "floatIn"
    ];

    const animationLabels: Record<string, string> = {
      none: "None",
      fadeIn: "Fade In",
      slideUp: "Slide Up",
      scaleIn: "Scale In",
      flipIn: "Flip In",
      bounceIn: "Bounce In",
      floatIn: "Float In"
    };

    return (
      <div className="space-y-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Animation Types</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Each card demonstrates a different animation type. Refresh the page to replay animations.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animations.map((animation) => (
            <div key={animation} className="space-y-2">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-2">
                {animationLabels[animation]}
              </div>
              <TestimonialCard 
                size="sm" 
                animation={animation}
              >
                <TestimonialCardRating value={5} />
                <TestimonialCardQuote>
                  Excellent service! This product exceeded all our expectations.
                </TestimonialCardQuote>
                <TestimonialCardAuthor
                  name="Alex Turner"
                  title="Developer"
                  company="CodeWorks"
                  avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                  avatarAlt="Alex Turner"
                />
              </TestimonialCard>
            </div>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    layout: "padded",
  },
};

export const VariantComparison: Story = {
  render: () => {
    const variants: Array<"default" | "minimal" | "outline" | "premium"> = ["default", "minimal", "outline", "premium"];

    const variantLabels: Record<string, string> = {
      default: "Default",
      minimal: "Minimal",
      outline: "Outline",
      premium: "Premium"
    };

    return (
      <div className="space-y-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Variant Types</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Each card demonstrates a different variant type.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {variants.map((variant) => (
            <div key={variant} className="space-y-2">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-2 capitalize">
                {variantLabels[variant]}
              </div>
              <TestimonialCard 
                size="sm" 
                variant={variant}
              >
                <TestimonialCardRating value={5} />
                <TestimonialCardQuote>
                  Excellent service! This product exceeded all our expectations.
                </TestimonialCardQuote>
                <TestimonialCardAuthor
                  name="Alex Turner"
                  title="Developer"
                  company="CodeWorks"
                  avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                  avatarAlt="Alex Turner"
                />
              </TestimonialCard>
            </div>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    layout: "padded",
  },
};