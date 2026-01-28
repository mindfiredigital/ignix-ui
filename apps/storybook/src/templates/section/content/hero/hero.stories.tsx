import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hero, HeroContent, HeroHeading, HeroSubheading, HeroImage, HeroActions, HeroBadge, HeroFeatures, HeroGlassCard, HeroStats } from '.';
import { Button } from '../../../../components/button';
import { ArrowRight, ArrowUpRight, Zap, Users, TrendingUp, Shield, Sparkles, Rocket, CheckCircle2 } from 'lucide-react';
import { ButtonWithIcon } from '../../../../components/button-with-icon';

const meta: Meta<typeof Hero> = {
  title: 'Templates/Section/Content/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'dark'],
      description: 'Background gradient variant',
    },
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
      description: 'Content alignment',
    },
    containerSize: {
      control: { type: 'select' },
      options: ['small', 'normal', 'large', 'full', 'readable'],
      description: 'Container max width',
    },
    animationType: {
      control: { type: 'select' },
      options: ['none', 'fadeIn', 'fadeInUp', 'fadeInDown', 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'scaleIn', 'zoomIn', 'flipIn', 'bounceIn', 'floatIn', 'rotateIn'],
      description: 'Animation type for content elements',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  render: () => (
    <Hero variant="dark" align="center" animationType="fadeInUp">
      <HeroContent>
        <HeroHeading>Build Amazing Experiences</HeroHeading>
        <HeroSubheading>
          Create beautiful, responsive user interfaces with our powerful component library. 
          Start building today and bring your ideas to life.
        </HeroSubheading>
        <HeroActions>
          <Button variant="default" size="lg">Get Started</Button>
          <Button variant="default" size="lg">Learn More</Button>
        </HeroActions>
      </HeroContent>
    </Hero>
  ),
};

export const BounceAnimation: Story = {
  render: () => (
    <Hero variant="dark" align="center" animationType="bounceIn">
      <HeroContent>
        <HeroHeading>Ignite Your Creativity</HeroHeading>
        <HeroSubheading>
          Unleash your potential with tools that inspire and empower you to create 
          something extraordinary every single day.
        </HeroSubheading>
        <HeroActions>
          <Button variant="default" size="lg">Start Creating</Button>
          <Button variant="default" size="lg">View Portfolio</Button>
        </HeroActions>
      </HeroContent>
    </Hero>
  ),
};

export const LeftAligned: Story = {
  render: () => (
    <Hero variant="dark" align="left" animationType="slideLeft">
      <HeroContent>
        <HeroHeading>Your Journey Starts Here</HeroHeading>
        <HeroSubheading>
          Take the first step towards achieving your goals with our comprehensive 
          platform designed to empower your success.
        </HeroSubheading>
        <HeroActions>
          <Button variant="default" size="lg">Begin Journey</Button>
          <Button variant="default" size="lg">Explore Features</Button>
        </HeroActions>
      </HeroContent>
    </Hero>
  ),
};

export const WithBackgroundImage: Story = {
  render: () => (
    <Hero variant="dark" align="center" animationType="fadeInUp">
      <HeroImage src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"/>
      <HeroContent>

        <HeroHeading>
          Build the Future of Your Business
        </HeroHeading>

        <HeroSubheading>
          Transform your ideas into reality with our cutting-edge platform. 
          Join thousands of teams already building amazing products.
        </HeroSubheading>

        <HeroActions>
          <ButtonWithIcon 
            variant="primary" 
            size="lg" 
            iconPosition="right"
            icon={<Rocket />}
          >
            Start Building
          </ButtonWithIcon>
          <ButtonWithIcon 
            variant="primary" 
            size="lg" 
            iconPosition="right"
            icon={<ArrowUpRight />}
          >
            Watch Demo
          </ButtonWithIcon>
        </HeroActions>

      </HeroContent>
    </Hero>
  ),
};

export const GlassMorphismHero: Story = {
  render: () => (
    <Hero 
      variant="dark" 
      align="center" 
      animationType="fadeInUp"
    >
      <HeroImage
        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
        alt="Abstract background"
        position="background"
        overlayOpacity={60}
      />
      
      <HeroContent>
        <HeroGlassCard className="p-10 md:p-16 lg:p-20">
          <HeroBadge icon={Zap} variant="solid">
            Next Gen Platform
          </HeroBadge>

          <HeroHeading>
            Elevate Your Digital Presence
          </HeroHeading>

          <HeroSubheading className="text-gray-200 text-xl md:text-2xl max-w-3xl mx-auto mb-10">
            Experience the perfect fusion of design and technology. Our platform 
            empowers you to create stunning digital experiences effortlessly.
          </HeroSubheading>

          <HeroActions className="gap-6 mb-10">
            <ButtonWithIcon 
              variant="primary" 
              size="md" 
              iconPosition="right"
              icon={<ArrowRight />}
            >
              Button Text
            </ButtonWithIcon>
            <ButtonWithIcon 
              variant="primary" 
              size="md" 
              iconPosition="right"
              icon={<ArrowUpRight />}
            >
              Button Text
            </ButtonWithIcon>
          </HeroActions>

          <HeroStats
            stats={[
              { value: '10K+', label: 'Active Users', icon: Users },
              { value: '99.9%', label: 'Uptime', icon: Shield },
              { value: '50%', label: 'Faster', icon: TrendingUp },
              { value: '24/7', label: 'Support', icon: CheckCircle2 }
            ]}
            variant="cards"
            columns={4}
          />

          <HeroFeatures 
            features={['AI Powered', 'Fully Responsive', 'Lightning Fast', 'Secure']}
          />
        </HeroGlassCard>
      </HeroContent>
    </Hero>
  ),
};

export const AdvancedHeroWithStats: Story = {
  render: () => (
    <Hero variant="dark" align="center" animationType="fadeInUp">
      <HeroImage src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"/>
      <HeroContent>
        <HeroBadge icon={Sparkles} variant="solid">
          Trusted by 10,000+ Companies
        </HeroBadge>

        <HeroHeading>
          Build the Future of Your Business
        </HeroHeading>

        <HeroSubheading>
          Transform your ideas into reality with our cutting-edge platform. 
          Join thousands of teams already building amazing products.
        </HeroSubheading>

        <HeroActions>
          <ButtonWithIcon 
            variant="primary" 
            size="lg" 
            iconPosition="right"
            icon={<Rocket />}
          >
            Start Building
          </ButtonWithIcon>
          <ButtonWithIcon 
            variant="primary" 
            size="lg" 
            iconPosition="right"
            icon={<ArrowUpRight />}
          >
            Watch Demo
          </ButtonWithIcon>
        </HeroActions>

        <HeroStats
          stats={[
            { value: '10K+', label: 'Active Users', icon: Users },
            { value: '99.9%', label: 'Uptime', icon: Shield },
            { value: '50%', label: 'Faster', icon: TrendingUp },
            { value: '24/7', label: 'Support', icon: CheckCircle2 }
          ]}
          variant="cards"
          columns={4}
        />

        <HeroFeatures 
          features={['Enterprise Ready', 'GDPR Compliant', 'API First', 'Open Source', 'Developer Friendly']}
          variant="glass"
        />
      </HeroContent>
    </Hero>
  ),
};
