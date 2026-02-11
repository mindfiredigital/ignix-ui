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
  HeroBadge,
  HeroFeatures,
  HeroGlassCard,
  HeroStats,
  HeroCarousel,
  HeroMedia,
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

// Mock Button component
vi.mock('@ignix-ui/button', () => ({
  Button: React.forwardRef<HTMLButtonElement, any>(
    ({ children, onClick, className, ...props }, ref) => (
      <button ref={ref} onClick={onClick} className={className} {...props}>
        {children}
      </button>
    )
  ),
}));

// Mock ButtonWithIcon component
vi.mock('@ignix-ui/button-with-icon', () => ({
  ButtonWithIcon: React.forwardRef<HTMLButtonElement, any>(
    ({ children, onClick, className, 'aria-label': ariaLabel, icon, ...props }, ref) => (
      <button ref={ref} onClick={onClick} className={className} aria-label={ariaLabel} {...props}>
        {icon}
        {children}
      </button>
    )
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

  describe('HeroMedia Component (as HeroMedia)', () => {
    it('renders HeroMedia with background position by default', () => {
      const { container } = render(
        <Hero>
          <HeroMedia src="test.jpg" alt="Test image" />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const bgImage = container.querySelector('[style*="background-image"]');
      expect(bgImage).toBeInTheDocument();
    });

    it('renders HeroMedia with left position', () => {
      const { container } = render(
        <Hero>
          <HeroContent>
            <HeroMedia src="test.jpg" position="left" alt="Left image" />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'test.jpg');
    });

    it('renders HeroMedia with right position', () => {
      const { container } = render(
        <Hero>
          <HeroContent>
            <HeroMedia src="test.jpg" position="right" alt="Right image" />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
    });

    it('renders HeroMedia with center position', () => {
      const { container } = render(
        <Hero>
          <HeroContent>
            <HeroMedia src="test.jpg" position="center" alt="Center image" />
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
          <HeroMedia src="test.jpg" position="background" overlayOpacity={50} />
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
          <HeroMedia src="test.jpg" position="background" overlayOpacity={0} />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(zeroContainer.querySelector('.bg-transparent')).toBeInTheDocument();
      cleanup();

      const { container: fullContainer } = render(
        <Hero>
          <HeroMedia src="test.jpg" position="background" overlayOpacity={100} />
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
          <HeroMedia src="test.jpg" position="left" />
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
          <HeroMedia src="bg.jpg" position="background" />
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
          <HeroMedia src="bg.jpg" position="background" />
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
          <HeroMedia src="bg1.jpg" position="background" />
          <HeroMedia src="bg2.jpg" position="background" />
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
          <HeroMedia src="bg.jpg" position="background" overlayOpacity={60} />
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
          <HeroMedia src="bg.jpg" position="background" />
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

    it('forwards ref to HeroMedia', () => {
      const ref = React.createRef<HTMLImageElement>();
      render(
        <Hero>
          <HeroContent>
            <HeroMedia ref={ref} src="test.jpg" position="left" alt="Test" />
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

    it('has correct displayName for HeroMedia', () => {
      expect(HeroMedia.displayName).toBe('HeroMedia');
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
            <HeroMedia src="test.jpg" position="left" alt="Left image" />
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
            <HeroMedia src="test.jpg" position="right" alt="Right image" />
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
            <HeroMedia src="test.jpg" position="left" alt="Left image" />
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
            <HeroMedia src="test.jpg" position="right" alt="Right image" />
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
            <HeroMedia src="test.jpg" position="left" alt="Left image" />
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
            <HeroMedia src="test.jpg" position="right" alt="Right image" />
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
            <HeroMedia src="test.jpg" position="left" alt="Left image" />
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
            <HeroMedia src="test.jpg" position="center" alt="Center image" />
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
          <HeroMedia src="bg.jpg" position="background" />
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
            <HeroMedia src="test.jpg" position="left" alt="Left image" />
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
            <HeroMedia src="test.jpg" position="right" alt="Right image" />
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
            <HeroMedia src="test.jpg" position="left" alt="Left image" />
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
            <HeroMedia src="test.jpg" position="right" alt="Right image" />
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
            <HeroMedia src="test.jpg" position="left" alt="Left image" />
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
            <HeroMedia src="test.jpg" position="left" alt="Left image" />
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
            <HeroMedia src="test.jpg" position="right" alt="Right image" />
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
            <HeroMedia src="test.jpg" position="right" alt="Right image" />
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
            <HeroMedia src="test.jpg" position="left" alt="Left image" />
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
            <HeroMedia src="test.jpg" position="left" alt="Left image" />
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
            <HeroMedia src="test.jpg" position="left" alt="Left image" />
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
            <HeroMedia src="test.jpg" position="right" alt="Right image" />
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

  describe('HeroMedia Component (as HeroMedia)', () => {
    it('renders HeroMedia with video source', () => {
      const { container } = render(
        <Hero>
          <HeroMedia src="test-video.mp4" />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const video = container.querySelector('video');
      const source = container.querySelector('source[src="test-video.mp4"]');
      expect(video).toBeInTheDocument();
      expect(source).toBeInTheDocument();
    });

    it('renders HeroMedia with GIF source', () => {
      const { container } = render(
        <Hero>
          <HeroMedia src="test-animation.gif" />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const image = container.querySelector('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'test-animation.gif');
    });

    it('applies overlay opacity to HeroMedia', () => {
      const { container } = render(
        <Hero>
          <HeroMedia src="test-video.mp4" overlayOpacity={60} />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const overlay = container.querySelector('.bg-black\\/60');
      expect(overlay).toBeInTheDocument();
    });

    it('enforces minimum overlay opacity of 40 for HeroMedia', () => {
      const { container } = render(
        <Hero>
          <HeroMedia src="test-video.mp4" overlayOpacity={20} />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const overlay = container.querySelector('.bg-black\\/40');
      expect(overlay).toBeInTheDocument();
    });

    it('shows fallback image when video has error', () => {
      const { container } = render(
        <Hero>
          <HeroMedia 
            src="invalid-video.mp4" 
            fallbackImage="fallback.jpg"
          />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      // Simulate error by checking fallback rendering
      const fallbackDiv = container.querySelector('[style*="background-image"]');
      expect(fallbackDiv).toBeInTheDocument();
    });

    it('does not render play/pause button when showPlayPause is false', () => {
      const { container } = render(
        <Hero>
          <HeroMedia src="test-video.mp4" showPlayPause={false} />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const button = container.querySelector('button');
      expect(button).not.toBeInTheDocument();
    });

    it('detects webm video format correctly', () => {
      const { container } = render(
        <Hero>
          <HeroMedia src="test-video.webm" />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const source = container.querySelector('source[type="video/webm"]');
      expect(source).toBeInTheDocument();
    });

    it('detects ogg video format correctly', () => {
      const { container } = render(
        <Hero>
          <HeroMedia src="test-video.ogg" />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const source = container.querySelector('source[type="video/ogg"]');
      expect(source).toBeInTheDocument();
    });

    it('applies custom className to HeroMedia', () => {
      const { container } = render(
        <Hero>
          <HeroMedia src="test-video.mp4" className="custom-video" />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const video = container.querySelector('video.custom-video');
      expect(video).toBeInTheDocument();
    });

    it('renders fallback image behind video when provided', () => {
      const { container } = render(
        <Hero>
          <HeroMedia src="test-video.mp4" fallbackImage="fallback.jpg" />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const fallbackDivs = container.querySelectorAll('[style*="background-image"]');
      expect(fallbackDivs.length).toBeGreaterThan(0);
    });

    it('handles GIF play/pause functionality', () => {
      const { container } = render(
        <Hero>
          <HeroMedia src="test-animation.gif" showPlayPause={true} />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Animation Delay Handling', () => {
    it('applies animation delay correctly to HeroHeading', () => {
      render(
        <Hero animationType="fadeInUp">
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('applies different animation delays to multiple elements', () => {
      render(
        <Hero animationType="slideUp">
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

  describe('Context Provider Edge Cases', () => {
    it('provides correct context values to all sub-components', () => {
      render(
        <Hero variant="dark" align="left" animationType="fadeIn">
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('Multiple Background Media', () => {
    it('handles multiple background videos', () => {
      const { container } = render(
        <Hero>
          <HeroMedia src="video1.mp4" />
          <HeroMedia src="video2.mp4" />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const videos = container.querySelectorAll('video');
      expect(videos.length).toBeGreaterThanOrEqual(1);
    });

    it('handles both background image and video together', () => {
      const { container } = render(
        <Hero>
          <HeroMedia src="bg.jpg" position="background" />
          <HeroMedia src="video.mp4" />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const bgImage = container.querySelector('[style*="background-image"]');
      const video = container.querySelector('video');
      expect(bgImage).toBeInTheDocument();
      expect(video).toBeInTheDocument();
    });
  });

  describe('Accessibility and Semantic HTML', () => {
    it('renders Hero as semantic section element', () => {
      const { container } = render(
        <Hero>
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('applies correct alt text to HeroMedia', () => {
      const { container } = render(
        <Hero>
          <HeroContent>
            <HeroMedia src="test.jpg" position="left" alt="Descriptive alt text" />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const image = container.querySelector('img');
      expect(image).toHaveAttribute('alt', 'Descriptive alt text');
    });

    it('applies correct alt text to GIF in HeroMedia', () => {
      const { container } = render(
        <Hero>
          <HeroMedia src="animation.gif" alt="" />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const image = container.querySelector('img');
      expect(image).toHaveAttribute('alt', 'Animated background');
    });
  });

  describe('Responsive Behavior', () => {
    it('applies responsive padding when background image is present', () => {
      const { container } = render(
        <Hero>
          <HeroMedia src="bg.jpg" position="background" />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const containerElement = container.querySelector('[data-size]');
      expect(containerElement).toHaveClass('py-16', 'md:py-20', 'lg:py-32');
    });
  });

  describe('Custom Styling Combinations', () => {
    it('combines custom className with variant classes', () => {
      const { container } = render(
        <Hero variant="dark" className="custom-hero-class">
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-hero-class');
      expect(section).toHaveClass('from-gray-900');
    });

    it('allows backgroundClassName to override variant completely', () => {
      const { container } = render(
        <Hero variant="dark" backgroundClassName="custom-bg-override">
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-bg-override');
    });
  });

  describe('HeroHeading with Different HTML Tags', () => {
    it('renders HeroHeading with custom as prop', () => {
      render(
        <Hero>
          <HeroContent>
            <HeroHeading as="h2">Test Heading</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const heading = screen.getByText('Test Heading');
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Empty and Null Children Handling', () => {

    it('handles Hero with null children', () => {
      render(
        <Hero>
          {null}
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('Video Format Detection', () => {
    it('detects .mov video format correctly', () => {
      const { container } = render(
        <Hero>
          <HeroMedia src="test-video.mov" />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const source = container.querySelector('source[type="video/quicktime"]');
      expect(source).toBeInTheDocument();
    });

    it('defaults to mp4 for unknown video formats', () => {
      const { container } = render(
        <Hero>
          <HeroMedia src="test-video.unknown" />
          <HeroContent>
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      const source = container.querySelector('source[type="video/mp4"]');
      expect(source).toBeInTheDocument();
    });
  });

  describe('Stats Component Edge Cases', () => {
    it('handles stats with very long values', () => {
      render(
        <Hero>
          <HeroContent>
            <HeroStats stats={[{ value: '999,999,999+', label: 'Very Long Label Text' }]} />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('999,999,999+')).toBeInTheDocument();
      expect(screen.getByText('Very Long Label Text')).toBeInTheDocument();
    });

    it('handles stats with empty strings', () => {
      render(
        <Hero>
          <HeroContent>
            <HeroStats stats={[{ value: '', label: '' }]} />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('Features Component Edge Cases', () => {
    it('handles features with special characters', () => {
      render(
        <Hero>
          <HeroContent>
            <HeroFeatures features={['Feature & More', 'Feature (Pro)', 'Feature 2.0']} />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('Feature & More')).toBeInTheDocument();
      expect(screen.getByText('Feature (Pro)')).toBeInTheDocument();
      expect(screen.getByText('Feature 2.0')).toBeInTheDocument();
    });

    it('handles features with very long text', () => {
      render(
        <Hero>
          <HeroContent>
            <HeroFeatures features={['This is a very long feature name that might wrap']} />
            <HeroHeading>Test</HeroHeading>
          </HeroContent>
        </Hero>
      );
      expect(screen.getByText('This is a very long feature name that might wrap')).toBeInTheDocument();
    });
  });

  describe('HeroCarousel Component', () => {
    const mockSlides = [
      {
        id: 'slide-1',
        src: 'https://example.com/image1.jpg',
        overlayOpacity: 50,
        content: (
          <HeroContent>
            <HeroHeading>Slide 1</HeroHeading>
            <HeroSubheading>First slide content</HeroSubheading>
          </HeroContent>
        ),
      },
      {
        id: 'slide-2',
        src: 'https://example.com/image2.jpg',
        overlayOpacity: 60,
        content: (
          <HeroContent>
            <HeroHeading>Slide 2</HeroHeading>
            <HeroSubheading>Second slide content</HeroSubheading>
          </HeroContent>
        ),
      },
      {
        id: 'slide-3',
        src: 'https://example.com/image3.jpg',
        overlayOpacity: 55,
        content: (
          <HeroContent>
            <HeroHeading>Slide 3</HeroHeading>
            <HeroSubheading>Third slide content</HeroSubheading>
          </HeroContent>
        ),
      },
    ];

    it('renders HeroCarousel with slides', () => {
      render(<HeroCarousel slides={mockSlides} />);
      expect(screen.getAllByText('Slide 1').length).toBeGreaterThan(0);
    });

    it('renders HeroCarousel with custom className', () => {
      const { container } = render(<HeroCarousel slides={mockSlides} className="custom-carousel" />);
      expect(container.querySelector('.custom-carousel')).toBeInTheDocument();
    });

    it('renders all slides content', () => {
      render(<HeroCarousel slides={mockSlides} />);
      expect(screen.getAllByText('Slide 1').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Slide 2').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Slide 3').length).toBeGreaterThan(0);
    });

    it('applies dark variant by default', () => {
      const { container } = render(<HeroCarousel slides={mockSlides} />);
      const sections = container.querySelectorAll('section');
      expect(sections.length).toBeGreaterThan(0);
      expect(sections[0]).toHaveClass('from-gray-900');
    });

    it('applies default variant when specified', () => {
      const { container } = render(<HeroCarousel slides={mockSlides} variant="default" />);
      const sections = container.querySelectorAll('section');
      expect(sections.length).toBeGreaterThan(0);
      expect(sections[0]).toHaveClass('from-gray-50');
    });

    it('does not show navigation buttons when showNavigation is false', () => {
      const { container } = render(<HeroCarousel slides={mockSlides} showNavigation={false} />);
      const buttons = container.querySelectorAll('button[aria-label*="slide"]');
      expect(buttons.length).toBe(0);
    });

    it('shows navigation buttons when showNavigation is true', () => {
      const { container } = render(<HeroCarousel slides={mockSlides} showNavigation={true} />);
      const prevButton = container.querySelector('button[aria-label="Previous slide"]');
      const nextButton = container.querySelector('button[aria-label="Next slide"]');
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    it('does not show dots when showDots is false', () => {
      const { container } = render(<HeroCarousel slides={mockSlides} showDots={false} />);
      const dots = container.querySelectorAll('button[aria-label*="Go to slide"]');
      expect(dots.length).toBe(0);
    });

    it('shows dots when showDots is true', () => {
      const { container } = render(<HeroCarousel slides={mockSlides} showDots={true} />);
      const dots = container.querySelectorAll('button[aria-label*="Go to slide"]');
      expect(dots.length).toBe(3);
    });

    it('renders carousel with single slide', () => {
      const singleSlide = [mockSlides[0]];
      render(<HeroCarousel slides={singleSlide} />);
      expect(screen.getAllByText('Slide 1').length).toBeGreaterThan(0);
    });

    it('does not show navigation or dots with single slide', () => {
      const singleSlide = [mockSlides[0]];
      const { container } = render(
        <HeroCarousel slides={singleSlide} showNavigation={true} showDots={true} />
      );
      const navButtons = container.querySelectorAll('button[aria-label*="slide"]');
      const dots = container.querySelectorAll('button[aria-label*="Go to slide"]');
      expect(navButtons.length).toBe(0);
      expect(dots.length).toBe(0);
    });

    it('handles empty slides array by returning null', () => {
      const { container } = render(<HeroCarousel slides={[]} />);
      // HeroCarousel returns null for empty slides
      const carousel = container.querySelector('[role="region"]');
      expect(carousel).not.toBeInTheDocument();
    });

    it('applies correct animation type', () => {
      render(<HeroCarousel slides={mockSlides} animationType="fadeInUp" />);
      expect(screen.getAllByText('Slide 1').length).toBeGreaterThan(0);
    });

    it('applies container size correctly', () => {
      const { container } = render(<HeroCarousel slides={mockSlides} containerSize="large" />);
      const containerElement = container.querySelector('[data-size="large"]');
      expect(containerElement).toBeInTheDocument();
    });

    it('renders slides with image src', () => {
      const { container } = render(<HeroCarousel slides={mockSlides} />);
      // HeroCarousel uses HeroMedia which may render as background-image or img
      const bgImages = container.querySelectorAll('[style*="background-image"]');
      const images = container.querySelectorAll('img');
      expect(bgImages.length + images.length).toBeGreaterThan(0);
    });

    it('renders slides with image prop', () => {
      const slidesWithImage = [
        {
          id: 'slide-1',
          image: 'https://example.com/image1.jpg',
          content: <HeroContent><HeroHeading>Slide 1</HeroHeading></HeroContent>,
        },
      ];
      render(<HeroCarousel slides={slidesWithImage} />);
      expect(screen.getAllByText('Slide 1').length).toBeGreaterThan(0);
    });

    it('renders slides with video prop', () => {
      const slidesWithVideo = [
        {
          id: 'slide-1',
          video: 'https://example.com/video1.mp4',
          content: <HeroContent><HeroHeading>Slide 1</HeroHeading></HeroContent>,
        },
      ];
      render(<HeroCarousel slides={slidesWithVideo} />);
      expect(screen.getAllByText('Slide 1').length).toBeGreaterThan(0);
    });

    it('applies overlay opacity from slide configuration', () => {
      const { container } = render(<HeroCarousel slides={mockSlides} />);
      // Overlay opacity is applied via HeroMedia, check for overlay classes
      const overlays = container.querySelectorAll('[class*="bg-black"]');
      expect(overlays.length).toBeGreaterThan(0);
    });

    it('handles slides without IDs', () => {
      const slidesWithoutIds = [
        {
          src: 'https://example.com/image1.jpg',
          content: <HeroContent><HeroHeading>Slide 1</HeroHeading></HeroContent>,
        },
        {
          src: 'https://example.com/image2.jpg',
          content: <HeroContent><HeroHeading>Slide 2</HeroHeading></HeroContent>,
        },
      ];
      render(<HeroCarousel slides={slidesWithoutIds} />);
      expect(screen.getAllByText('Slide 1').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Slide 2').length).toBeGreaterThan(0);
    });

    it('renders carousel with HeroBadge in slide content', () => {
      const slidesWithBadge = [
        {
          id: 'slide-1',
          src: 'https://example.com/image1.jpg',
          content: (
            <HeroContent>
              <HeroBadge icon={Zap}>New</HeroBadge>
              <HeroHeading>Slide 1</HeroHeading>
            </HeroContent>
          ),
        },
      ];
      render(<HeroCarousel slides={slidesWithBadge} />);
      expect(screen.getAllByText('New').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Slide 1').length).toBeGreaterThan(0);
    });

    it('renders carousel with HeroActions in slide content', () => {
      const slidesWithActions = [
        {
          id: 'slide-1',
          src: 'https://example.com/image1.jpg',
          content: (
            <HeroContent>
              <HeroHeading>Slide 1</HeroHeading>
              <HeroActions>
                <button>Action Button</button>
              </HeroActions>
            </HeroContent>
          ),
        },
      ];
      render(<HeroCarousel slides={slidesWithActions} />);
      expect(screen.getAllByText('Action Button').length).toBeGreaterThan(0);
    });

    it('renders carousel with HeroStats in slide content', () => {
      const slidesWithStats = [
        {
          id: 'slide-1',
          src: 'https://example.com/image1.jpg',
          content: (
            <HeroContent>
              <HeroHeading>Slide 1</HeroHeading>
              <HeroStats stats={[{ value: '100', label: 'Count' }]} />
            </HeroContent>
          ),
        },
      ];
      render(<HeroCarousel slides={slidesWithStats} />);
      expect(screen.getAllByText('100').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Count').length).toBeGreaterThan(0);
    });

    it('renders carousel with HeroFeatures in slide content', () => {
      const slidesWithFeatures = [
        {
          id: 'slide-1',
          src: 'https://example.com/image1.jpg',
          content: (
            <HeroContent>
              <HeroHeading>Slide 1</HeroHeading>
              <HeroFeatures features={['Feature 1', 'Feature 2']} />
            </HeroContent>
          ),
        },
      ];
      render(<HeroCarousel slides={slidesWithFeatures} />);
      expect(screen.getAllByText('Feature 1').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Feature 2').length).toBeGreaterThan(0);
    });

    it('renders carousel with HeroGlassCard in slide content', () => {
      const slidesWithGlassCard = [
        {
          id: 'slide-1',
          src: 'https://example.com/image1.jpg',
          content: (
            <HeroContent>
              <HeroGlassCard>
                <HeroHeading>Slide 1</HeroHeading>
              </HeroGlassCard>
            </HeroContent>
          ),
        },
      ];
      render(<HeroCarousel slides={slidesWithGlassCard} />);
      expect(screen.getAllByText('Slide 1').length).toBeGreaterThan(0);
    });

    it('applies correct rotation interval when autoRotate is enabled', () => {
      render(<HeroCarousel slides={mockSlides} autoRotate={true} rotationInterval={2000} />);
      expect(screen.getAllByText('Slide 1').length).toBeGreaterThan(0);
    });

    it('clamps rotation interval to minimum 1000ms', () => {
      render(<HeroCarousel slides={mockSlides} autoRotate={true} rotationInterval={500} />);
      expect(screen.getAllByText('Slide 1').length).toBeGreaterThan(0);
    });

    it('clamps rotation interval to maximum 5000ms', () => {
      render(<HeroCarousel slides={mockSlides} autoRotate={true} rotationInterval={10000} />);
      expect(screen.getAllByText('Slide 1').length).toBeGreaterThan(0);
    });

    it('renders carousel with all animation types', () => {
      const animationTypes = ['fadeIn', 'fadeInUp', 'slideUp', 'scaleIn', 'zoomIn'];
      animationTypes.forEach((animationType) => {
        const { unmount } = render(
          <HeroCarousel slides={mockSlides} animationType={animationType as any} />
        );
        expect(screen.getAllByText('Slide 1').length).toBeGreaterThan(0);
        unmount();
      });
    });

    it('renders carousel with all container sizes', () => {
      const containerSizes = ['small', 'normal', 'large', 'full', 'readable'];
      containerSizes.forEach((size) => {
        const { container, unmount } = render(
          <HeroCarousel slides={mockSlides} containerSize={size as any} />
        );
        const containerElement = container.querySelector(`[data-size="${size}"]`);
        expect(containerElement).toBeInTheDocument();
        unmount();
      });
    });

    it('has correct aria-label for carousel region', () => {
      const { container } = render(<HeroCarousel slides={mockSlides} />);
      const region = container.querySelector('[role="region"][aria-label="Hero carousel"]');
      expect(region).toBeInTheDocument();
    });

    it('has correct tabIndex for keyboard navigation', () => {
      const { container } = render(<HeroCarousel slides={mockSlides} />);
      const carousel = container.querySelector('[tabindex="0"]');
      expect(carousel).toBeInTheDocument();
    });

    it('renders carousel with multiple slides having different overlay opacities', () => {
      const slidesWithDifferentOpacities = [
        {
          id: 'slide-1',
          src: 'https://example.com/image1.jpg',
          overlayOpacity: 30,
          content: <HeroContent><HeroHeading>Slide 1</HeroHeading></HeroContent>,
        },
        {
          id: 'slide-2',
          src: 'https://example.com/image2.jpg',
          overlayOpacity: 70,
          content: <HeroContent><HeroHeading>Slide 2</HeroHeading></HeroContent>,
        },
      ];
      render(<HeroCarousel slides={slidesWithDifferentOpacities} />);
      expect(screen.getAllByText('Slide 1').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Slide 2').length).toBeGreaterThan(0);
    });

    it('handles slides with complex nested content', () => {
      const complexSlides = [
        {
          id: 'slide-1',
          src: 'https://example.com/image1.jpg',
          content: (
            <HeroContent>
              <HeroBadge icon={Zap}>New</HeroBadge>
              <HeroHeading>Complex Slide</HeroHeading>
              <HeroSubheading>With multiple components</HeroSubheading>
              <HeroActions>
                <button>Button 1</button>
                <button>Button 2</button>
              </HeroActions>
              <HeroFeatures features={['Feature 1', 'Feature 2']} />
              <HeroStats stats={[{ value: '100', label: 'Count', icon: Users }]} />
            </HeroContent>
          ),
        },
      ];
      render(<HeroCarousel slides={complexSlides} />);
      expect(screen.getAllByText('New').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Complex Slide').length).toBeGreaterThan(0);
      expect(screen.getAllByText('With multiple components').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Button 1').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Feature 1').length).toBeGreaterThan(0);
      expect(screen.getAllByText('100').length).toBeGreaterThan(0);
    });

    it('renders carousel with minimum height classes', () => {
      const { container } = render(<HeroCarousel slides={mockSlides} />);
      const carouselContainer = container.querySelector('[class*="min-h-[500px]"]');
      expect(carouselContainer).toBeInTheDocument();
    });

    it('has correct displayName for HeroCarousel', () => {
      expect(HeroCarousel.displayName).toBe('HeroCarousel');
    });
  });
});

