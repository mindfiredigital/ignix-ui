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
    split: {
      control: { type: 'boolean' },
      description: 'Layout type - default for centered content, split for side-by-side layout',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  render: () => (
    <Hero variant="default" align="center" animationType="fadeInUp">
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
      </HeroContent>
      <HeroFeatures 
        features={['Enterprise Ready', 'GDPR Compliant', 'API First', 'Open Source', 'Developer Friendly']}      
      />
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
        <HeroStats
          stats={[
            { value: '10K+', label: 'Active Users', icon: Users },
            { value: '99.9%', label: 'Uptime', icon: Shield },
            { value: '50%', label: 'Faster', icon: TrendingUp },
            { value: '24/7', label: 'Support', icon: CheckCircle2 }
          ]}
          variant="minimal"
          columns={4}
        />
      </HeroContent>
    </Hero>
  ),
};

export const WithBackgroundImage: Story = {
  render: () => (
    <Hero align="center" animationType="fadeInUp">
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

          <HeroSubheading>
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
    <Hero align="center" animationType="fadeInUp">
      <HeroImage src="https://images.unsplash.com/photo-1501785888041-af3ef285b470" overlayOpacity={60}/>
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
        />
      </HeroContent>
    </Hero>
  ),
};

export const SplitLayout: Story = {
  render: () => (
    <Hero 
      align="left" 
      animationType="fadeInUp" 
      split
      className="bg-gradient-to-br from-[#020617] via-slate-900 to-slate-950"
      >
      <HeroContent>
        <HeroBadge icon={Sparkles} variant="solid">
          Trusted by 10,000+ Companies
        </HeroBadge>
        <HeroHeading>
          SCALE YOUR IDEAS FASTER
        </HeroHeading>
        <HeroSubheading>
          Unlock your team's potential with a unified platform for innovation and growth.
        </HeroSubheading>
        <HeroActions className="mt-8 gap-4">
          <ButtonWithIcon 
              variant="primary" 
              size="lg" 
              iconPosition="right"
              icon={<Rocket />}
            >
              Start Demo
            </ButtonWithIcon>
            <ButtonWithIcon 
              variant="primary" 
              size="lg" 
              iconPosition="left"
              icon={<ArrowUpRight />}
            >
              Contact Us
            </ButtonWithIcon>
        </HeroActions>
        <HeroImage 
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=700&fit=crop&q=90" 
          alt="Business analytics dashboard"
          position="left"
        />
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
        />
      </HeroContent>
    </Hero>
  ),
};

export const CustomiseHeroContent: Story = {
  render: () => (
    <Hero 
      variant="default"
      align="left" 
      animationType="fadeInUp" 
      split
      >
      <HeroContent className="bg-gradient-to-br from-orange-800/85 via-red-800/85 to-rose-800/85 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 lg:p-16 border border-orange-400/30">
        <HeroHeading className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight bg-gradient-to-r from-orange-200 via-red-200 to-rose-200 bg-clip-text text-transparent">
          SCALE YOUR IDEAS FASTER
        </HeroHeading>
        <HeroSubheading className="text-gray-100 text-lg sm:text-xl md:text-2xl mt-6 max-w-2xl leading-relaxed">
          Unlock your team's potential with a unified platform for innovation and growth.
        </HeroSubheading>
        <HeroActions className="mt-8 gap-4">
          <ButtonWithIcon 
              variant="primary" 
              size="lg" 
              iconPosition="right"
              icon={<ArrowRight />}
              className="px-8 py-6 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Get Started
            </ButtonWithIcon>
            <ButtonWithIcon 
              variant="outline" 
              size="lg" 
              iconPosition="right"
              icon={<ArrowUpRight />}
              className="px-8 py-6 rounded-lg border-2 border-orange-300 text-orange-200 hover:bg-orange-500/30 hover:border-orange-200 transition-all duration-300 hover:scale-105"
            >
              Learn More
            </ButtonWithIcon>
        </HeroActions>
        <HeroFeatures 
          features={['Enterprise Ready', 'GDPR Compliant', 'API First', 'Open Source', 'Developer Friendly']}
        />
        <HeroImage 
          src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=900&h=700&fit=crop&q=90" 
          alt="Modern workspace"
          position="right"
          className="rounded-xl shadow-xl object-contain lg:object-cover w-full h-auto"
        />
      </HeroContent>
    </Hero>
  ),
};

export const SplitBackgroundImage: Story = {
  render: () => (
    <Hero 
      align="center" 
      animationType="fadeInUp"
      split 
    >
    <HeroImage 
    src="https://unsplash.com/photos/split-background-of-light-and-dark-textured-surfaces-HOTAvTkG2NU"
    position="background"
    overlayOpacity={50}
    />
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

        <HeroActions className="mt-8">
          <ButtonWithIcon 
            variant="primary" 
            size="lg" 
            iconPosition="right"
            icon={<Rocket />}
            className="px-8 py-6 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
          >
            Start Building
          </ButtonWithIcon>
          <ButtonWithIcon 
            variant="outline" 
            size="lg" 
            iconPosition="right"
            icon={<ArrowUpRight />}
            className="px-8 py-6 rounded-lg border-2 border-fuchsia-300 text-fuchsia-200 hover:bg-fuchsia-500/30 hover:border-fuchsia-200 transition-all duration-300 hover:scale-105"
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
        />
         
        <HeroImage 
          position="left" 
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&h=800&fit=crop&q=90"
          alt="Colorful gradient abstract"
          className="rounded-xl shadow-xl object-contain lg:object-cover w-full h-auto"
        />
      </HeroContent>
    </Hero>
  ),
};
