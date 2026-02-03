/**
 * Hero Component Unit Tests
 * 
 * Comprehensive test suite for the Hero component covering:
 * - Basic rendering and variants
 * - Alignment options
 * - Animation types
 * - Container sizes
 * - Sub-components (Content, Heading, Subheading, Actions, Image, Badge, Features, GlassCard, Stats)
 * - Background images and overlays
 * - Edge cases and error handling
 * 
 * @file hero.test.tsx
 */

import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import {
  Hero,
  HeroContent,
  HeroHeading,
  HeroSubheading,
  HeroActions,
  HeroImage,
  HeroBadge,
  HeroFeatures,
  HeroGlassCard,
  HeroStats,
} from './index';
import { Zap, Users, Shield } from 'lucide-react';

// Mock framer-motion to avoid animation-related issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock Typography component
vi.mock('@ignix-ui/typography', () => ({
  Typography: React.forwardRef<HTMLElement, any>(
    ({ children, variant, className, align, ...props }, ref) => {
      const Tag = variant?.startsWith('h') ? variant.toUpperCase() : 'p';
      return React.createElement(
        Tag,
        { ref, className, 'data-variant': variant, 'data-align': align, ...props },
        children
      );
    }
  ),
}));

// Mock Container component
vi.mock('@ignix-ui/container', () => ({
  Container: ({ children, size, className, ...props }: any) => (
    <div data-size={size} className={className} {...props}>
      {children}
    </div>
  ),
}));

describe('Hero Component', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Basic Rendering', () => {
    it('renders Hero component with default props', () => {
      render(
        <Hero>
          <HeroContent>
            <HeroHeading>Test Heading</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('Test Heading')).toBeInTheDocument();
    });

    it('renders Hero with custom className', () => {
      const { container } = render(
        <Hero className="custom-class">
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('renders Hero with children correctly', () => {
      render(
        <Hero>
          <HeroContent>
            <HeroHeading>Heading</HeroHeading>
            <HeroSubheading>Subheading</HeroSubheading>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('Heading')).toBeInTheDocument();
      expect(screen.getByText('Subheading')).toBeInTheDocument();
    });
  });

  describe('Variant Props', () => {
    it('applies dark variant by default', () => {
      const { container } = render(
        <Hero>
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-gradient-to-br', 'from-gray-900');
    });

    it('applies default variant when specified', () => {
      const { container } = render(
        <Hero variant="default">
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-gradient-to-br', 'from-gray-50');
    });

    it('applies dark variant when specified', () => {
      const { container } = render(
        <Hero variant="dark">
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const section = container.querySelector('section');
      expect(section).toHaveClass('from-gray-900', 'via-gray-800', 'to-black');
    });

    it('uses backgroundClassName to override variant styles', () => {
      const { container } = render(
        <Hero backgroundClassName="custom-bg" variant="dark">
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-bg');
    });
  });

  describe('Alignment Props', () => {
    it('applies center alignment by default', () => {
      render(
        <Hero align="center">
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const content = screen.getByText('Test').closest('[class*="text-center"]');
      expect(content).toBeInTheDocument();
    });

    it('applies left alignment when specified', () => {
      render(
        <Hero align="left">
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const content = screen.getByText('Test').closest('[class*="text-left"]');
      expect(content).toBeInTheDocument();
    });

    it('applies right alignment when specified', () => {
      render(
        <Hero align="right">
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const content = screen.getByText('Test').closest('[class*="text-right"]');
      expect(content).toBeInTheDocument();
    });
  });

  describe('Animation Types', () => {
    const animationTypes = [
      'none',
      'fadeIn',
      'fadeInUp',
      'fadeInDown',
      'slideUp',
      'slideDown',
      'slideLeft',
      'slideRight',
      'scaleIn',
      'zoomIn',
      'flipIn',
      'bounceIn',
      'floatIn',
      'rotateIn',
    ];

    animationTypes.forEach((animationType) => {
      it(`renders with ${animationType} animation type`, () => {
        render(
          <Hero animationType={animationType as any}>
            <HeroContent>
              <HeroHeading>Test</HeroHeading>
            </HeroContent>
          </Hero>
        );
        expect(screen.getByText('Test')).toBeInTheDocument();
      });
    });
  });

  describe('Container Sizes', () => {
    const containerSizes = ['small', 'normal', 'large', 'full', 'readable'];

    containerSizes.forEach((size) => {
      it(`renders with container size ${size}`, () => {
        const { container } = render(
          <Hero containerSize={size as any}>
            <HeroContent>
              <HeroHeading>Test</HeroHeading>
            </HeroContent>
          </Hero>
        );
        const containerElement = container.querySelector('[data-size]');
        expect(containerElement).toHaveAttribute('data-size', size);
      });
    });
  });

  describe('HeroContent Component', () => {
    it('renders HeroContent with children', () => {
      render(
        <Hero>
          <HeroContent>
            <div>Content Test</div>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('Content Test')).toBeInTheDocument();
    });

    it('applies custom className to HeroContent', () => {
      const { container } = render(
        <Hero>
          <HeroContent className="custom-content">
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(container.querySelector('.custom-content')).toBeInTheDocument();
    });

    it('respects alignment from Hero context', () => {
      render(
        <Hero align="left">
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const content = screen.getByText('Test').closest('[class*="text-left"]');
      expect(content).toBeInTheDocument();
    });
  });

  describe('HeroHeading Component', () => {
    it('renders HeroHeading with text', () => {
      render(
        <Hero>
          <HeroContent>
            <HeroHeading>Main Heading</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('Main Heading')).toBeInTheDocument();
    });

    it('applies custom className to HeroHeading', () => {
      const { container } = render(
        <Hero>
          <HeroContent>
            <HeroHeading className="custom-heading">Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(container.querySelector('.custom-heading')).toBeInTheDocument();
    });

    it('handles gradient text pattern correctly', () => {
      render(
        <Hero>
          <HeroContent>
            <HeroHeading>Text with bg-gradient class</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('Text with bg-gradient class')).toBeInTheDocument();
    });

    it('uses correct text color based on variant', () => {
      const { container: darkContainer } = render(
        <Hero variant="dark">
          <HeroContent>
            <HeroHeading>Dark Heading</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(darkContainer.querySelector('[data-variant="h1"]')).toHaveClass('text-white');

      cleanup();

      const { container: lightContainer } = render(
        <Hero variant="default">
          <HeroContent>
            <HeroHeading>Light Heading</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(lightContainer.querySelector('[data-variant="h1"]')).toHaveClass('text-gray-900');
    });
  });

  describe('HeroSubheading Component', () => {
    it('renders HeroSubheading with text', () => {
      render(
        <Hero>
          <HeroContent>
            <HeroSubheading>Subheading text</HeroSubheading>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('Subheading text')).toBeInTheDocument();
    });

    it('applies custom className to HeroSubheading', () => {
      const { container } = render(
        <Hero>
          <HeroContent>
            <HeroSubheading className="custom-subheading">Test</HeroSubheading>
          </HeroContent>
        </Hero>
      );
      expect(container.querySelector('.custom-subheading')).toBeInTheDocument();
    });

    it('applies correct alignment classes based on context', () => {
      render(
        <Hero align="center">
          <HeroContent>
            <HeroSubheading>Test</HeroSubheading>
          </HeroContent>
        </Hero>
      );
      const subheading = screen.getByText('Test');
      expect(subheading.closest('[class*="max-w-2xl"]')).toBeInTheDocument();
    });
  });

  describe('HeroActions Component', () => {
    it('renders HeroActions with children', () => {
      render(
        <Hero>
          <HeroContent>
            <HeroActions>
              <button>Action Button</button>
            </HeroActions>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('Action Button')).toBeInTheDocument();
    });

    it('applies center alignment classes when align is center', () => {
      const { container } = render(
        <Hero align="center">
          <HeroContent>
            <HeroActions>
              <button>Button</button>
            </HeroActions>
          </HeroContent>
        </Hero>
      );
      const actions = container.querySelector('[class*="justify-center"]');
      expect(actions).toBeInTheDocument();
    });

    it('applies left alignment classes when align is left', () => {
      const { container } = render(
        <Hero align="left">
          <HeroContent>
            <HeroActions>
              <button>Button</button>
            </HeroActions>
          </HeroContent>
        </Hero>
      );
      const actions = container.querySelector('[class*="justify-start"]');
      expect(actions).toBeInTheDocument();
    });

    it('applies right alignment classes when align is right', () => {
      const { container } = render(
        <Hero align="right">
          <HeroContent>
            <HeroActions>
              <button>Button</button>
            </HeroActions>
          </HeroContent>
        </Hero>
      );
      const actions = container.querySelector('[class*="justify-end"]');
      expect(actions).toBeInTheDocument();
    });

    it('wraps multiple action children correctly', () => {
      render(
        <Hero>
          <HeroContent>
            <HeroActions>
              <button>Button 1</button>
              <button>Button 2</button>
              <button>Button 3</button>
            </HeroActions>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('Button 1')).toBeInTheDocument();
      expect(screen.getByText('Button 2')).toBeInTheDocument();
      expect(screen.getByText('Button 3')).toBeInTheDocument();
    });
  });

  describe('HeroImage Component', () => {
    it('renders HeroImage with background position by default', () => {
      const { container } = render(
        <Hero>
          <HeroImage src="test.jpg" alt="Test image" />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const bgImage = container.querySelector('[style*="background-image"]');
      expect(bgImage).toBeInTheDocument();
    });

    it('renders HeroImage with left position', () => {
      const { container } = render(
        <Hero>
          <HeroContent>
            <HeroImage src="test.jpg" position="left" alt="Left image" />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'test.jpg');
    });

    it('renders HeroImage with right position', () => {
      const { container } = render(
        <Hero>
          <HeroContent>
            <HeroImage src="test.jpg" position="right" alt="Right image" />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
    });

    it('renders HeroImage with center position', () => {
      const { container } = render(
        <Hero>
          <HeroContent>
            <HeroImage src="test.jpg" position="center" alt="Center image" />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
    });

    it('applies custom overlay opacity', () => {
      const { container } = render(
        <Hero>
          <HeroImage src="test.jpg" position="background" overlayOpacity={50} />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const overlay = container.querySelector('.bg-black\\/50');
      expect(overlay).toBeInTheDocument();
    });

    it('handles overlay opacity edge cases (0, 100)', () => {
      const { container: zeroContainer } = render(
        <Hero>
          <HeroImage src="test.jpg" position="background" overlayOpacity={0} />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(zeroContainer.querySelector('.bg-transparent')).toBeInTheDocument();
      cleanup();

      const { container: fullContainer } = render(
        <Hero>
          <HeroImage src="test.jpg" position="background" overlayOpacity={100} />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(fullContainer.querySelector('.bg-black')).toBeInTheDocument();
    });

    it('uses default alt text when not provided', () => {
      const { container } = render(
        <Hero>
          <HeroImage src="test.jpg" position="left" />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const image = container.querySelector('img');
      expect(image).toHaveAttribute('alt', 'background Image');
    });
  });

  describe('HeroBadge Component', () => {
    it('renders HeroBadge with text', () => {
      render(
        <Hero>
          <HeroContent>
            <HeroBadge>New Release</HeroBadge>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('New Release')).toBeInTheDocument();
    });

    it('renders HeroBadge with icon', () => {
      const { container } = render(
        <Hero>
          <HeroContent>
            <HeroBadge icon={Zap}>Badge with icon</HeroBadge>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('applies default variant styles', () => {
      const { container } = render(
        <Hero variant="dark">
          <HeroContent>
            <HeroBadge variant="default">Badge</HeroBadge>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const badge = container.querySelector('[class*="bg-white\\/10"]');
      expect(badge).toBeInTheDocument();
    });

    it('applies glass variant styles', () => {
      const { container } = render(
        <Hero variant="dark">
          <HeroContent>
            <HeroBadge variant="glass">Badge</HeroBadge>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const badge = container.querySelector('[class*="backdrop-blur-md"]');
      expect(badge).toBeInTheDocument();
    });

    it('applies solid variant styles', () => {
      const { container } = render(
        <Hero variant="dark">
          <HeroContent>
            <HeroBadge variant="solid">Badge</HeroBadge>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const badge = container.querySelector('[class*="bg-white\\/20"]');
      expect(badge).toBeInTheDocument();
    });

    it('applies outline variant styles', () => {
      const { container } = render(
        <Hero variant="dark">
          <HeroContent>
            <HeroBadge variant="outline">Badge</HeroBadge>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const badge = container.querySelector('[class*="border-white\\/30"]');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('HeroFeatures Component', () => {
    it('renders HeroFeatures with feature list', () => {
      const features = ['Feature 1', 'Feature 2', 'Feature 3'];
      render(
        <Hero>
          <HeroContent>
            <HeroFeatures features={features} />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('Feature 1')).toBeInTheDocument();
      expect(screen.getByText('Feature 2')).toBeInTheDocument();
      expect(screen.getByText('Feature 3')).toBeInTheDocument();
    });

    it('applies default variant styles', () => {
      const { container } = render(
        <Hero variant="dark">
          <HeroContent>
            <HeroFeatures features={['Feature']} variant="default" />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const feature = container.querySelector('[class*="bg-white\\/10"]');
      expect(feature).toBeInTheDocument();
    });

    it('applies glass variant styles', () => {
      const { container } = render(
        <Hero variant="dark">
          <HeroContent>
            <HeroFeatures features={['Feature']} variant="glass" />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const feature = container.querySelector('[class*="backdrop-blur-sm"]');
      expect(feature).toBeInTheDocument();
    });

    it('handles empty features array', () => {
      render(
        <Hero>
          <HeroContent>
            <HeroFeatures features={[]} />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('HeroGlassCard Component', () => {
    it('renders HeroGlassCard with children', () => {
      render(
        <Hero>
          <HeroContent>
            <HeroGlassCard>
              <HeroHeading>Glass Card Content</HeroHeading>
            </HeroGlassCard>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('Glass Card Content')).toBeInTheDocument();
    });

    it('applies glass morphism styles', () => {
      const { container } = render(
        <Hero>
          <HeroContent>
            <HeroGlassCard>
              <HeroHeading>Test</HeroHeading>
            </HeroGlassCard>
          </HeroContent>
        </Hero>
      );
      const card = container.querySelector('[class*="backdrop-blur-xl"]');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('bg-white/10', 'rounded-3xl');
    });

    it('applies custom className to HeroGlassCard', () => {
      const { container } = render(
        <Hero>
          <HeroContent>
            <HeroGlassCard className="custom-glass">
              <HeroHeading>Test</HeroHeading>
            </HeroGlassCard>
          </HeroContent>
        </Hero>
      );
      expect(container.querySelector('.custom-glass')).toBeInTheDocument();
    });
  });

  describe('HeroStats Component', () => {
    const mockStats = [
      { value: '10K+', label: 'Users', icon: Users },
      { value: '99%', label: 'Uptime', icon: Shield },
    ];

    it('renders HeroStats with stats array', () => {
      render(
        <Hero>
          <HeroContent>
            <HeroStats stats={mockStats} />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('10K+')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText('99%')).toBeInTheDocument();
      expect(screen.getByText('Uptime')).toBeInTheDocument();
    });

    it('renders stats with icons when variant is cards', () => {
      const { container } = render(
        <Hero>
          <HeroContent>
            <HeroStats stats={mockStats} variant="cards" />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('applies default variant (no special styling)', () => {
      const { container } = render(
        <Hero>
          <HeroContent>
            <HeroStats stats={mockStats} variant="default" />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const statsContainer = container.querySelector('[class*="grid"]');
      expect(statsContainer).toBeInTheDocument();
    });

    it('applies cards variant styles', () => {
      const { container } = render(
        <Hero variant="dark">
          <HeroContent>
            <HeroStats stats={mockStats} variant="cards" />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const card = container.querySelector('[class*="bg-white\\/5"]');
      expect(card).toBeInTheDocument();
    });

    it('applies minimal variant (no special styling)', () => {
      const { container } = render(
        <Hero>
          <HeroContent>
            <HeroStats stats={mockStats} variant="minimal" />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const statsContainer = container.querySelector('[class*="grid"]');
      expect(statsContainer).toBeInTheDocument();
    });

    it('renders with 2 columns', () => {
      const { container } = render(
        <Hero>
          <HeroContent>
            <HeroStats stats={mockStats} columns={2} />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const grid = container.querySelector('.grid-cols-2');
      expect(grid).toBeInTheDocument();
    });

    it('renders with 3 columns', () => {
      const { container } = render(
        <Hero>
          <HeroContent>
            <HeroStats stats={mockStats} columns={3} />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const grid = container.querySelector('.grid-cols-3');
      expect(grid).toBeInTheDocument();
    });

    it('renders with 4 columns (default)', () => {
      const { container } = render(
        <Hero>
          <HeroContent>
            <HeroStats stats={mockStats} columns={4} />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const grid = container.querySelector('[class*="grid-cols-2"][class*="md:grid-cols-4"]');
      expect(grid).toBeInTheDocument();
    });

    it('handles stats without icons', () => {
      const statsWithoutIcons = [
        { value: '100', label: 'Count' },
        { value: '200', label: 'Total' },
      ];
      render(
        <Hero>
          <HeroContent>
            <HeroStats stats={statsWithoutIcons} />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Count')).toBeInTheDocument();
    });
  });

  describe('Background Image Handling', () => {
    it('separates background images from other children', () => {
      const { container } = render(
        <Hero>
          <HeroImage src="bg.jpg" position="background" />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const bgImage = container.querySelector('[style*="background-image"]');
      expect(bgImage).toBeInTheDocument();
    });

    it('applies extra padding when background image is present', () => {
      const { container } = render(
        <Hero>
          <HeroImage src="bg.jpg" position="background" />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const containerElement = container.querySelector('[data-size]');
      expect(containerElement).toHaveClass('py-16', 'md:py-20', 'lg:py-32');
    });

    it('handles multiple background images', () => {
      const { container } = render(
        <Hero>
          <HeroImage src="bg1.jpg" position="background" />
          <HeroImage src="bg2.jpg" position="background" />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const bgImages = container.querySelectorAll('[style*="background-image"]');
      expect(bgImages.length).toBe(2);
    });
  });

  describe('Complex Compositions', () => {
    it('renders complete hero with all sub-components', () => {
      render(
        <Hero variant="dark" align="center" animationType="fadeInUp">
          <HeroImage src="bg.jpg" position="background" overlayOpacity={60} />
          <HeroContent>
            <HeroBadge icon={Zap} variant="solid">New</HeroBadge>
            <HeroHeading>Main Title</HeroHeading>
            <HeroSubheading>Subtitle text</HeroSubheading>
            <HeroActions>
              <button>Action 1</button>
              <button>Action 2</button>
            </HeroActions>
            <HeroFeatures features={['Feature 1', 'Feature 2']} />
            <HeroStats stats={[{ value: '100', label: 'Count' }]} />
          </HeroContent>
        </Hero>
      );
      
      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.getByText('Main Title')).toBeInTheDocument();
      expect(screen.getByText('Subtitle text')).toBeInTheDocument();
      expect(screen.getByText('Action 1')).toBeInTheDocument();
      expect(screen.getByText('Feature 1')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('renders hero with glass card composition', () => {
      render(
        <Hero variant="dark">
          <HeroImage src="bg.jpg" position="background" />
          <HeroContent>
            <HeroGlassCard>
              <HeroBadge icon={Zap}>Badge</HeroBadge>
              <HeroHeading>Title</HeroHeading>
              <HeroSubheading>Subtitle</HeroSubheading>
              <HeroActions>
                <button>Button</button>
              </HeroActions>
            </HeroGlassCard>
          </HeroContent>
        </Hero>
      );
      
      expect(screen.getByText('Badge')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Subtitle')).toBeInTheDocument();
      expect(screen.getByText('Button')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to HeroContent', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Hero>
          <HeroContent ref={ref}>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards ref to HeroImage', () => {
      const ref = React.createRef<HTMLImageElement>();
      render(
        <Hero>
          <HeroContent>
            <HeroImage ref={ref} src="test.jpg" position="left" alt="Test" />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(ref.current).toBeInstanceOf(HTMLImageElement);
    });
  });

  describe('Display Names', () => {
    it('has correct displayName for Hero', () => {
      expect(Hero.displayName).toBe('Hero');
    });

    it('has correct displayName for HeroContent', () => {
      expect(HeroContent.displayName).toBe('HeroContent');
    });

    it('has correct displayName for HeroHeading', () => {
      expect(HeroHeading.displayName).toBe('HeroHeading');
    });

    it('has correct displayName for HeroSubheading', () => {
      expect(HeroSubheading.displayName).toBe('HeroSubheading');
    });

    it('has correct displayName for HeroActions', () => {
      expect(HeroActions.displayName).toBe('HeroActions');
    });

    it('has correct displayName for HeroImage', () => {
      expect(HeroImage.displayName).toBe('HeroImage');
    });

    it('has correct displayName for HeroBadge', () => {
      expect(HeroBadge.displayName).toBe('HeroBadge');
    });

    it('has correct displayName for HeroFeatures', () => {
      expect(HeroFeatures.displayName).toBe('HeroFeatures');
    });

    it('has correct displayName for HeroGlassCard', () => {
      expect(HeroGlassCard.displayName).toBe('HeroGlassCard');
    });

    it('has correct displayName for HeroStats', () => {
      expect(HeroStats.displayName).toBe('HeroStats');
    });
  });

  describe('Split Layout', () => {
    it('renders split layout with left image position', () => {
      const { container } = render(
        <Hero split>
          <HeroContent>
            <HeroImage src="test.jpg" position="left" alt="Left image" />
            <HeroHeading>Test Heading</HeroHeading>
            <HeroSubheading>Test Subheading</HeroSubheading>
          </HeroContent>
        </Hero>
      );
      const splitContainer = container.querySelector('.flex.flex-col.lg\\:flex-row');
      expect(splitContainer).toBeInTheDocument();
    });

    it('renders split layout with right image position', () => {
      const { container } = render(
        <Hero split>
          <HeroContent>
            <HeroImage src="test.jpg" position="right" alt="Right image" />
            <HeroHeading>Test Heading</HeroHeading>
            <HeroSubheading>Test Subheading</HeroSubheading>
          </HeroContent>
        </Hero>
      );
      const splitContainer = container.querySelector('.flex.flex-col.lg\\:flex-row');
      expect(splitContainer).toBeInTheDocument();
    });

    it('applies correct order classes for left image in split layout', () => {
      const { container } = render(
        <Hero split>
          <HeroContent>
            <HeroImage src="test.jpg" position="left" alt="Left image" />
            <HeroHeading>Test Heading</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const imageContainer = container.querySelector('[class*="order-1"]');
      expect(imageContainer).toBeInTheDocument();
    });

    it('applies correct order classes for right image in split layout', () => {
      const { container } = render(
        <Hero split>
          <HeroContent>
            <HeroImage src="test.jpg" position="right" alt="Right image" />
            <HeroHeading>Test Heading</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const imageContainer = container.querySelector('[class*="order-2"]');
      expect(imageContainer).toBeInTheDocument();
    });

    it('applies lg:w-1/2 class to image container in split layout', () => {
      const { container } = render(
        <Hero split>
          <HeroContent>
            <HeroImage src="test.jpg" position="left" alt="Left image" />
            <HeroHeading>Test Heading</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const imageContainer = container.querySelector('.lg\\:w-1\\/2');
      expect(imageContainer).toBeInTheDocument();
    });

    it('applies lg:w-1/2 class to text container in split layout', () => {
      const { container } = render(
        <Hero split>
          <HeroContent>
            <HeroImage src="test.jpg" position="right" alt="Right image" />
            <HeroHeading>Test Heading</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const textContainer = container.querySelector('.lg\\:w-1\\/2');
      expect(textContainer).toBeInTheDocument();
    });

    it('does not activate split layout when split is false', () => {
      const { container } = render(
        <Hero split={false}>
          <HeroContent>
            <HeroImage src="test.jpg" position="left" alt="Left image" />
            <HeroHeading>Test Heading</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const splitContainer = container.querySelector('.flex.flex-col.lg\\:flex-row');
      expect(splitContainer).not.toBeInTheDocument();
    });

    it('does not activate split layout when no image with left/right position', () => {
      const { container } = render(
        <Hero split>
          <HeroContent>
            <HeroImage src="test.jpg" position="center" alt="Center image" />
            <HeroHeading>Test Heading</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const splitContainer = container.querySelector('.flex.flex-col.lg\\:flex-row');
      expect(splitContainer).not.toBeInTheDocument();
    });

    it('does not activate split layout with background image only', () => {
      const { container } = render(
        <Hero split>
          <HeroImage src="bg.jpg" position="background" />
          <HeroContent>
            <HeroHeading>Test Heading</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const splitContainer = container.querySelector('.flex.flex-col.lg\\:flex-row');
      expect(splitContainer).not.toBeInTheDocument();
    });

    it('renders split layout with left image and all sub-components', () => {
      render(
        <Hero split>
          <HeroContent>
            <HeroImage src="test.jpg" position="left" alt="Left image" />
            <HeroBadge>New</HeroBadge>
            <HeroHeading>Test Heading</HeroHeading>
            <HeroSubheading>Test Subheading</HeroSubheading>
            <HeroActions>
              <button>Action</button>
            </HeroActions>
            <HeroFeatures features={['Feature 1']} />
            <HeroStats stats={[{ value: '100', label: 'Count' }]} />
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.getByText('Test Heading')).toBeInTheDocument();
      expect(screen.getByText('Test Subheading')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Feature 1')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('renders split layout with right image and all sub-components', () => {
      render(
        <Hero split>
          <HeroContent>
            <HeroImage src="test.jpg" position="right" alt="Right image" />
            <HeroBadge>New</HeroBadge>
            <HeroHeading>Test Heading</HeroHeading>
            <HeroSubheading>Test Subheading</HeroSubheading>
            <HeroActions>
              <button>Action</button>
            </HeroActions>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.getByText('Test Heading')).toBeInTheDocument();
      expect(screen.getByText('Test Subheading')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('applies gap-8 lg:gap-12 classes in split layout', () => {
      const { container } = render(
        <Hero split>
          <HeroContent>
            <HeroImage src="test.jpg" position="left" alt="Left image" />
            <HeroHeading>Test Heading</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const splitContainer = container.querySelector('[class*="gap-8"][class*="lg:gap-12"]');
      expect(splitContainer).toBeInTheDocument();
    });

    it('applies gap-6 lg:gap-8 classes to text container in split layout', () => {
      const { container } = render(
        <Hero split>
          <HeroContent>
            <HeroImage src="test.jpg" position="right" alt="Right image" />
            <HeroHeading>Test Heading</HeroHeading>
            <HeroSubheading>Test Subheading</HeroSubheading>
          </HeroContent>
        </Hero>
      );
      const textContainer = container.querySelector('[class*="gap-6"][class*="lg:gap-8"]');
      expect(textContainer).toBeInTheDocument();
    });

    it('applies justify-center class to text container in split layout', () => {
      const { container } = render(
        <Hero split>
          <HeroContent>
            <HeroImage src="test.jpg" position="left" alt="Left image" />
            <HeroHeading>Test Heading</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const textContainer = container.querySelector('[class*="justify-center"]');
      expect(textContainer).toBeInTheDocument();
    });

    it('renders split layout with dark variant', () => {
      const { container } = render(
        <Hero split variant="dark">
          <HeroContent>
            <HeroImage src="test.jpg" position="left" alt="Left image" />
            <HeroHeading>Test Heading</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const splitContainer = container.querySelector('.flex.flex-col.lg\\:flex-row');
      expect(splitContainer).toBeInTheDocument();
      const section = container.querySelector('section');
      expect(section).toHaveClass('from-gray-900');
    });

    it('renders split layout with default variant', () => {
      const { container } = render(
        <Hero split variant="default">
          <HeroContent>
            <HeroImage src="test.jpg" position="right" alt="Right image" />
            <HeroHeading>Test Heading</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const splitContainer = container.querySelector('.flex.flex-col.lg\\:flex-row');
      expect(splitContainer).toBeInTheDocument();
      const section = container.querySelector('section');
      expect(section).toHaveClass('from-gray-50');
    });

    it('renders split layout with left alignment', () => {
      const { container } = render(
        <Hero split align="left">
          <HeroContent>
            <HeroImage src="test.jpg" position="right" alt="Right image" />
            <HeroHeading>Test Heading</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const splitContainer = container.querySelector('.flex.flex-col.lg\\:flex-row');
      expect(splitContainer).toBeInTheDocument();
    });

    it('renders split layout with center alignment', () => {
      const { container } = render(
        <Hero split align="center">
          <HeroContent>
            <HeroImage src="test.jpg" position="left" alt="Left image" />
            <HeroHeading>Test Heading</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const splitContainer = container.querySelector('.flex.flex-col.lg\\:flex-row');
      expect(splitContainer).toBeInTheDocument();
    });

    it('renders split layout with right alignment', () => {
      const { container } = render(
        <Hero split align="right">
          <HeroContent>
            <HeroImage src="test.jpg" position="left" alt="Left image" />
            <HeroHeading>Test Heading</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const splitContainer = container.querySelector('.flex.flex-col.lg\\:flex-row');
      expect(splitContainer).toBeInTheDocument();
    });

    it('applies w-full h-full object-cover classes to image in split layout', () => {
      const { container } = render(
        <Hero split>
          <HeroContent>
            <HeroImage src="test.jpg" position="left" alt="Left image" />
            <HeroHeading>Test Heading</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const image = container.querySelector('img');
      expect(image).toHaveClass('w-full', 'h-full', 'object-cover');
    });

    it('handles split layout with multiple text children correctly', () => {
      render(
        <Hero split>
          <HeroContent>
            <HeroImage src="test.jpg" position="right" alt="Right image" />
            <HeroHeading>Heading 1</HeroHeading>
            <HeroSubheading>Subheading 1</HeroSubheading>
            <HeroSubheading>Subheading 2</HeroSubheading>
            <HeroActions>
              <button>Button 1</button>
              <button>Button 2</button>
            </HeroActions>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('Heading 1')).toBeInTheDocument();
      expect(screen.getByText('Subheading 1')).toBeInTheDocument();
      expect(screen.getByText('Subheading 2')).toBeInTheDocument();
      expect(screen.getByText('Button 1')).toBeInTheDocument();
      expect(screen.getByText('Button 2')).toBeInTheDocument();
    });
  });
});

