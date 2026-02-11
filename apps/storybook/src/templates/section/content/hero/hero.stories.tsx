import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hero, HeroContent, HeroHeading, HeroSubheading, HeroMedia, HeroActions, HeroBadge, HeroFeatures, HeroGlassCard, HeroStats, HeroCarousel } from '.';
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
    <Hero variant="dark" align="right" animationType="slideLeft">
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
      <HeroMedia src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"/>
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
      <HeroMedia
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
      <HeroMedia src="https://images.unsplash.com/photo-1501785888041-af3ef285b470" overlayOpacity={60}/>
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
        <HeroMedia 
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
        <HeroMedia 
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
    <HeroMedia 
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
         
        <HeroMedia 
          position="left" 
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&h=800&fit=crop&q=90"
          alt="Colorful gradient abstract"
          className="rounded-xl shadow-xl object-contain lg:object-cover w-full h-auto"
        />
      </HeroContent>
    </Hero>
  ),
};

export const VideoHero: Story = {
  render: () => (
    <Hero 
      align="center" 
      animationType="fadeInUp"
    >
      <HeroMedia 
        src="https://assets.mixkit.co/videos/513/513-720.mp4"
        overlayOpacity={60}
        fallbackImage="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop"
      />
      <HeroContent>
        <HeroHeading className="text-white drop-shadow-2xl">
          Create Extraordinary Experiences
        </HeroHeading>

        <HeroSubheading className="text-gray-100 max-w-3xl mx-auto text-xl md:text-2xl">
          Transform your vision into reality with cutting-edge technology. 
          Join thousands of innovators building the future today.
        </HeroSubheading>

        <HeroActions className="mt-10 gap-6">
          <ButtonWithIcon 
            variant="primary" 
            size="lg" 
            iconPosition="right"
            icon={<Rocket />}
            className="px-8 py-6 rounded-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white font-semibold"
          >
            Get Started Free
          </ButtonWithIcon>
          <ButtonWithIcon 
            variant="outline" 
            size="lg" 
            iconPosition="right"
            icon={<ArrowUpRight />}
            className="px-8 py-6 rounded-xl border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 backdrop-blur-sm transition-all duration-300 hover:scale-105 font-semibold"
          >
            Watch Demo
          </ButtonWithIcon>
        </HeroActions>

      </HeroContent>
    </Hero>
  ),
};

export const VideoHeroWithPlayPause: Story = {
  render: () => (
    <Hero 
      align="center" 
      animationType="fadeInUp"
    >
      <HeroMedia 
        src="https://assets.mixkit.co/videos/513/513-720.mp4"
        overlayOpacity={55}
        showPlayPause
        fallbackImage="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop"
      />
      <HeroContent>
        <HeroHeading className="text-white drop-shadow-2xl">
          Experience the Power of Video
        </HeroHeading>

        <HeroSubheading className="text-gray-100 max-w-2xl mx-auto text-lg md:text-xl">
          Control your video experience with our intuitive play/pause controls. 
          Watch, pause, and explore at your own pace.
        </HeroSubheading>

        <HeroActions className="mt-10 gap-6">
          <ButtonWithIcon 
            variant="primary" 
            size="lg" 
            iconPosition="right"
            icon={<Rocket />}
            className="px-8 py-6 rounded-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold"
          >
            Start Your Journey
          </ButtonWithIcon>
          <ButtonWithIcon 
            variant="outline" 
            size="lg" 
            iconPosition="right"
            icon={<ArrowUpRight />}
            className="px-8 py-6 rounded-xl border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 backdrop-blur-sm transition-all duration-300 hover:scale-105 font-semibold"
          >
            Learn More
          </ButtonWithIcon>
        </HeroActions>

      </HeroContent>
    </Hero>
  ),
};

export const VideoHeroAllConditions: Story = {
  render: () => (
    <div className="space-y-20">
      {/* Condition 1: Video with Play/Pause Controls */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">1. Video with Play/Pause Controls</h2>
        <Hero align="center" animationType="fadeInUp">
          <HeroMedia 
            src="https://assets.mixkit.co/videos/513/513-720.mp4"
            overlayOpacity={50}
            showPlayPause
            fallbackImage="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop"
          />
          <HeroContent>
            <HeroHeading className="text-white drop-shadow-2xl">
              Interactive Video Experience
            </HeroHeading>
            <HeroSubheading className="text-gray-100 max-w-2xl mx-auto">
              Click the play/pause button at the bottom to control video playback.
            </HeroSubheading>
          </HeroContent>
        </Hero>
      </div>

      {/* Condition 3: Video with Low Overlay Opacity (40%) */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">3. Video with Low Overlay Opacity (40%)</h2>
        <Hero align="center" animationType="fadeInUp">
          <HeroMedia 
            src="https://assets.mixkit.co/videos/513/513-720.mp4"
            overlayOpacity={40}
            showPlayPause
            fallbackImage="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop"
          />
          <HeroContent>
            <HeroHeading className="text-white drop-shadow-2xl">
              Lighter Overlay for More Video Visibility
            </HeroHeading>
            <HeroSubheading className="text-gray-100 max-w-2xl mx-auto">
              Lower overlay opacity allows more video to show through. Text readability maintained with drop shadows.
            </HeroSubheading>
          </HeroContent>
        </Hero>
      </div>

      {/* Condition 4: Video with High Overlay Opacity (70%) */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">4. Video with High Overlay Opacity (70%)</h2>
        <Hero align="center" animationType="fadeInUp">
          <HeroMedia 
            src="https://assets.mixkit.co/videos/513/513-720.mp4"
            overlayOpacity={70}
            showPlayPause
            fallbackImage="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop"
          />
          <HeroContent>
            <HeroHeading className="text-white drop-shadow-2xl">
              Maximum Text Readability
            </HeroHeading>
            <HeroSubheading className="text-gray-100 max-w-2xl mx-auto">
              Higher overlay opacity ensures excellent text contrast and readability over any video content.
            </HeroSubheading>
          </HeroContent>
        </Hero>
      </div>

      {/* Condition 6: Video with Left Alignment */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">6. Video with Left Alignment</h2>
        <Hero align="left" animationType="fadeInUp">
          <HeroMedia 
            src="https://assets.mixkit.co/videos/513/513-720.mp4"
            overlayOpacity={55}
            showPlayPause
            fallbackImage="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop"
          />
          <HeroContent>
            <HeroHeading className="text-white drop-shadow-2xl">
              Left-Aligned Content
            </HeroHeading>
            <HeroSubheading className="text-gray-100 max-w-2xl">
              Content aligned to the left for a different visual layout.
            </HeroSubheading>
            <HeroActions className="mt-6">
              <Button variant="primary" size="lg">Get Started</Button>
            </HeroActions>
          </HeroContent>
        </Hero>
      </div>

      {/* Condition 7: Video with Stats and Features */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">7. Video with Stats and Features</h2>
        <Hero align="center" animationType="fadeInUp">
          <HeroMedia 
            src="https://assets.mixkit.co/videos/513/513-720.mp4"
            overlayOpacity={60}
            showPlayPause
            fallbackImage="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop"
          />
          <HeroContent>
            <HeroHeading className="text-white drop-shadow-2xl">
              Complete Hero Section
            </HeroHeading>
            <HeroSubheading className="text-gray-100 max-w-2xl mx-auto">
              Video hero with stats, features, and call-to-action buttons.
            </HeroSubheading>
            <HeroStats
              stats={[
                { value: '50K+', label: 'Active Users', icon: Users },
                { value: '99.9%', label: 'Uptime', icon: Shield },
                { value: '3x', label: 'Faster', icon: TrendingUp },
                { value: '24/7', label: 'Support', icon: CheckCircle2 }
              ]}
              variant="cards"
              columns={4}
            />
            <HeroFeatures 
              features={['HD Quality', 'Smooth Playback', 'Interactive Controls', 'Responsive Design']}
              variant="glass"
            />
            <HeroActions className="mt-8">
              <ButtonWithIcon 
                variant="primary" 
                size="lg" 
                iconPosition="right"
                icon={<Rocket />}
              >
                Start Now
              </ButtonWithIcon>
            </HeroActions>
          </HeroContent>
        </Hero>
      </div>

      {/* Condition 8: Video with Glass Morphism Card */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">8. Video with Glass Morphism Card</h2>
        <Hero align="center" animationType="fadeInUp">
          <HeroMedia 
            src="https://assets.mixkit.co/videos/513/513-720.mp4"
            overlayOpacity={40}
            showPlayPause
            fallbackImage="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop"
          />
          <HeroContent>
            <HeroGlassCard className="p-10 md:p-16 lg:p-20">
              <HeroBadge icon={Zap} variant="solid">
                Premium Experience
              </HeroBadge>
              <HeroHeading className="text-white drop-shadow-2xl">
                Glass Morphism Design
              </HeroHeading>
              <HeroSubheading className="text-gray-100 max-w-2xl mx-auto">
                Content in a glass morphism card creates a modern, elegant look over video background.
              </HeroSubheading>
              <HeroActions className="mt-8">
                <ButtonWithIcon 
                  variant="primary" 
                  size="lg" 
                  iconPosition="right"
                  icon={<ArrowRight />}
                >
                  Explore
                </ButtonWithIcon>
              </HeroActions>
            </HeroGlassCard>
          </HeroContent>
        </Hero>
      </div>

      {/* Condition 9: Video Error State (Invalid URL) */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">9. Video Error State with Fallback</h2>
        <Hero align="center" animationType="fadeInUp">
          <HeroMedia 
            src="https://invalid-video-url-that-does-not-exist.mp4"
            overlayOpacity={50}
            showPlayPause
            fallbackImage="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop"
          />
          <HeroContent>
            <HeroHeading className="text-white drop-shadow-2xl">
              Fallback Image Displayed
            </HeroHeading>
            <HeroSubheading className="text-gray-100 max-w-2xl mx-auto">
              When video fails to load, the fallback image is automatically displayed. This ensures your hero section always looks great.
            </HeroSubheading>
          </HeroContent>
        </Hero>
      </div>

      {/* Condition 10: GIF Support */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">10. GIF Support</h2>
        <Hero align="center" animationType="fadeInUp">
          <HeroMedia 
            src="https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif"
            overlayOpacity={50}
            showPlayPause
            fallbackImage="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop"
          />
          <HeroContent>
            <HeroHeading className="text-white drop-shadow-2xl">
              Animated GIF Support
            </HeroHeading>
            <HeroSubheading className="text-gray-100 max-w-2xl mx-auto">
              HeroMedia supports GIF files! Small animated GIFs work perfectly as background videos. Use play/pause to control GIF animation.
            </HeroSubheading>
            <HeroActions className="mt-8">
              <ButtonWithIcon 
                variant="primary" 
                size="lg" 
                iconPosition="right"
                icon={<ArrowRight />}
              >
                Explore GIFs
              </ButtonWithIcon>
            </HeroActions>
          </HeroContent>
        </Hero>
      </div>

      {/* Condition 11: GIF without Controls */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">11. GIF without Play/Pause Controls</h2>
        <Hero align="center" animationType="fadeInUp">
          <HeroMedia 
            src="https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif"
            overlayOpacity={55}
            fallbackImage="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop"
          />
          <HeroContent>
            <HeroHeading className="text-white drop-shadow-2xl">
              Auto-Playing GIF
            </HeroHeading>
            <HeroSubheading className="text-gray-100 max-w-2xl mx-auto">
              GIFs can also play automatically without controls, perfect for subtle background animations.
            </HeroSubheading>
          </HeroContent>
        </Hero>
      </div>
    </div>
  ),
};

// HeroCarousel Stories
export const CarouselBasic: Story = {
  render: () => {
    const slides = [
      {
        id: 'slide-1',
        src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop',
        overlayOpacity: 50,
        content: (
          <HeroContent>
            <HeroHeading>Welcome to Our Platform</HeroHeading>
            <HeroSubheading>
              Discover amazing features and build something extraordinary with our powerful tools.
            </HeroSubheading>
            <HeroActions>
              <Button variant="default" size="lg">Get Started</Button>
              <Button variant="default" size="lg">Learn More</Button>
            </HeroActions>
          </HeroContent>
        ),
      },
      {
        id: 'slide-2',
        src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&h=1080&fit=crop',
        overlayOpacity: 60,
        content: (
          <HeroContent>
            <HeroBadge icon={Zap} variant="solid">New Release</HeroBadge>
            <HeroHeading>Innovation at Your Fingertips</HeroHeading>
            <HeroSubheading>
              Experience cutting-edge technology designed to help you achieve your goals faster.
            </HeroSubheading>
            <HeroActions>
              <Button variant="default" size="lg">Explore Features</Button>
            </HeroActions>
          </HeroContent>
        ),
      },
      {
        id: 'slide-3',
        src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1800&h=1080&fit=crop',
        overlayOpacity: 55,
        content: (
          <HeroContent>
            <HeroHeading>Join Thousands of Happy Users</HeroHeading>
            <HeroSubheading>
              Be part of a growing community that's transforming the way we work and create.
            </HeroSubheading>
            <HeroActions>
              <Button variant="default" size="lg">Join Now</Button>
            </HeroActions>
          </HeroContent>
        ),
      },
    ];

    return (
      <HeroCarousel
        slides={slides}
        autoRotate
        rotationInterval={3000}
        showNavigation
        showDots
        variant="dark"
        align="center"
        animationType="fadeInUp"
      />
    );
  },
};

export const CarouselWithGlassCard: Story = {
  render: () => {
    const slides = [
      {
        id: 'slide-1',
        src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop',
        overlayOpacity: 70,
        content: (
          <HeroContent>
            <HeroGlassCard className="p-12">
              <HeroBadge icon={Sparkles} variant="solid">Premium</HeroBadge>
              <HeroHeading>Elevate Your Experience</HeroHeading>
              <HeroSubheading>
                Discover premium features wrapped in beautiful glass morphism design.
              </HeroSubheading>
              <HeroActions>
                <Button variant="default" size="lg">Upgrade Now</Button>
              </HeroActions>
            </HeroGlassCard>
          </HeroContent>
        ),
      },
      {
        id: 'slide-2',
        src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&h=1080&fit=crop',
        overlayOpacity: 70,
        content: (
          <HeroContent>
            <HeroGlassCard className="p-12">
              <HeroBadge icon={Rocket} variant="solid">Launch</HeroBadge>
              <HeroHeading>Launch Your Project</HeroHeading>
              <HeroSubheading>
                Get started with our comprehensive toolkit and launch your project in days, not months.
              </HeroSubheading>
              <HeroActions>
                <Button variant="default" size="lg">Start Building</Button>
              </HeroActions>
            </HeroGlassCard>
          </HeroContent>
        ),
      },
      {
        id: 'slide-3',
        src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&h=1080&fit=crop',
        overlayOpacity: 70,
        content: (
          <HeroContent>
            <HeroGlassCard className="p-12">
              <HeroBadge icon={Zap} variant="outline">Fast</HeroBadge>
              <HeroHeading>Lightning Fast Performance</HeroHeading>
              <HeroSubheading>
                Experience blazing-fast speeds with our optimized platform built for scale.
              </HeroSubheading>
              <HeroActions>
                <Button variant="default" size="lg">See Performance</Button>
              </HeroActions>
            </HeroGlassCard>
          </HeroContent>
        ),
      },
    ];

    return (
      <HeroCarousel
        slides={slides}
        autoRotate
        rotationInterval={1000}
        showNavigation
        showDots
        variant="dark"
        align="center"
        animationType="fadeInUp"
      />
    );
  },
};

export const CarouselLeftAligned: Story = {
  render: () => {
    const slides = [
      {
        id: 'slide-1',
        src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop',
        overlayOpacity: 50,
        content: (
          <HeroContent>
            <HeroHeading>Left Aligned Content</HeroHeading>
            <HeroSubheading>
              Content aligned to the left creates a different visual hierarchy and reading flow.
            </HeroSubheading>
            <HeroActions>
              <Button variant="default" size="lg">Get Started</Button>
            </HeroActions>
          </HeroContent>
        ),
      },
      {
        id: 'slide-2',
        src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&h=1080&fit=crop',
        overlayOpacity: 50,
        content: (
          <HeroContent>
            <HeroHeading>Perfect for Reading</HeroHeading>
            <HeroSubheading>
              Left alignment follows natural reading patterns and works great for longer content.
            </HeroSubheading>
            <HeroActions>
              <Button variant="default" size="lg">Learn More</Button>
            </HeroActions>
          </HeroContent>
        ),
      },
    ];

    return (
      <HeroCarousel
        slides={slides}
        autoRotate
        rotationInterval={100}
        showNavigation
        showDots
        variant="dark"
        align="right"
        animationType="slideLeft"
      />
    );
  },
};
