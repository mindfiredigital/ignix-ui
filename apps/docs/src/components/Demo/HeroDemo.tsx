import React, { useEffect, useState } from 'react';
import { Hero, HeroContent, HeroHeading, HeroSubheading, HeroActions, HeroMedia, HeroBadge, HeroFeatures, HeroGlassCard, HeroStats, HeroCarousel } from '@site/src/components/UI/hero';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Zap, Users, TrendingUp, Shield, CheckCircle2, Rocket, ArrowUpRight } from 'lucide-react';
import { ButtonWithIcon } from '@site/src/components/UI/button-with-icon';

type Animations = typeof animationTypes[number];

const alignOptions = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const animationTypes = [
   'fadeIn', 'fadeInUp' , 'fadeInDown' , 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'scaleIn', 'zoomIn', 'flipIn', 'bounceIn', 'floatIn', 'rotateIn'
] as const;

const HeroDemo = () => {
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('center');
  const [animationType, setAnimationType] = useState<Animations>('fadeInUp');
  const [showBadge, setShowBadge] = useState<boolean>(false);
  const [showGlassMorph, setShowGlassMorph] = useState<boolean>(false);
  const [showFeatures, setShowFeatures] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showBackgroundImage, setShowBackgroundImage] = useState<boolean>(false);
  const [animationKey, setAnimationKey] = useState<number>(0);

  // Force remount and reset value when animation type changes to show initial animation
  useEffect(() => {
    setAnimationKey((k) => k + 1);
  }, [animationType]);

  // Build code string parts to avoid extra whitespace
  const codeParts: string[] = [];
  
  codeParts.push(`<Hero 
  align="${align}" 
  animationType="${animationType}"
>`);
  
  if (showBackgroundImage || showGlassMorph) {
    codeParts.push(`  <HeroMedia
    src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
    alt="Hero background"
    position="background"
    overlayOpacity={60}
  />`);
  }
  
  codeParts.push(`  <HeroContent>`);
  
  if (showGlassMorph) {
    codeParts.push(`    <HeroGlassCard className="p-10 md:p-16 lg:p-20">`);
    if (showBadge) {
      codeParts.push(`      <HeroBadge icon={Zap} variant="solid">
        New Release
      </HeroBadge>`);
    }
    codeParts.push(`      <HeroHeading>Build Amazing Experiences</HeroHeading>
      <HeroSubheading>
        Create beautiful, responsive user interfaces with our powerful component library.
        Start building today and bring your ideas to life.
      </HeroSubheading>
      <HeroActions>
        <ButtonWithIcon variant="primary"  size="lg"  iconPosition="right"  icon={<Rocket />} > Start Now </ButtonWithIcon>
        <ButtonWithIcon variant="primary"  size="lg"  iconPosition="right"  icon={<ArrowUpRight />} > Contact Us </ButtonWithIcon>
      </HeroActions>`);
    if (showStats) {
      codeParts.push(`      <HeroStats
        stats={[
          { value: '10K+', label: 'Active Users', icon: Users },
          { value: '99.9%', label: 'Uptime', icon: Shield },
          { value: '50%', label: 'Faster', icon: TrendingUp },
          { value: '24/7', label: 'Support', icon: CheckCircle2 },
        ]}
        variant="cards"
        columns={4}
      />`);
    }
    if (showFeatures) {
      codeParts.push(`      <HeroFeatures 
        features={['AI Powered', 'Fully Responsive', 'Lightning Fast', 'Developer Friendly']}
      />`);
    }
    codeParts.push(`    </HeroGlassCard>`);
  } else {
    if (showBadge) {
      codeParts.push(`    <HeroBadge icon={Zap} variant="solid">
      New Release
    </HeroBadge>`);
    }
    codeParts.push(`    <HeroHeading>Build Amazing Experiences</HeroHeading>
    <HeroSubheading>
      Create beautiful, responsive user interfaces with our powerful component library.
      Start building today and bring your ideas to life.
    </HeroSubheading>
    <HeroActions>
      <ButtonWithIcon variant="primary"  size="lg"  iconPosition="right"  icon={<Rocket />} > Start Now </ButtonWithIcon>
      <ButtonWithIcon variant="primary"  size="lg"  iconPosition="right"  icon={<ArrowUpRight />} > Contact Us </ButtonWithIcon>
    </HeroActions>`);
    if (showStats) {
      codeParts.push(`    <HeroStats
      stats={[
        { value: '10K+', label: 'Active Users', icon: Users },
        { value: '99.9%', label: 'Uptime', icon: Shield },
        { value: '50%', label: 'Faster', icon: TrendingUp },
        { value: '24/7', label: 'Support', icon: CheckCircle2 },
      ]}
      variant="cards"
      columns={4}
    />`);
    }
    if (showFeatures) {
      codeParts.push(`    <HeroFeatures 
      features={['AI Powered', 'Fully Responsive', 'Lightning Fast', 'Developer Friendly']}
    />`);
    }
  }
  
  codeParts.push(`  </HeroContent>
</Hero>`);
  
  const codeString = codeParts.join('\n');

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <div className="space-y-2">
          <VariantSelector
            variants={alignOptions.map(a => a.value)}
            selectedVariant={align}
            onSelectVariant={(value) => setAlign(value as 'left' | 'center' | 'right')}
            type="Align"
          />
        </div>

        <div className="space-y-2">
          <VariantSelector
            variants={[...animationTypes]}
            selectedVariant={animationType}
            onSelectVariant={(v) => setAnimationType(v as 'fadeIn'| 'fadeInUp' | 'fadeInDown' | 'slideUp'| 'slideDown'| 'slideLeft'| 'slideRight'| 'scaleIn'| 'zoomIn'| 'flipIn'| 'bounceIn'| 'floatIn'| 'rotateIn')}
            type="Animation"
          />
        </div>

      </div>

      <div className="flex flex-wrap gap-4 justify-start sm:justify-end rounded-lg">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showBadge}
            onChange={(e) => setShowBadge(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show Badge</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showFeatures}
            onChange={(e) => setShowFeatures(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show Features</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showStats}
            onChange={(e) => setShowStats(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show Stats</span>
        </label>
        {!showGlassMorph && <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showBackgroundImage}
            onChange={(e) => setShowBackgroundImage(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Background Image</span>
        </label>}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showGlassMorph}
            onChange={(e) => {
              setShowGlassMorph(e.target.checked);
            }}
            className="rounded"
          />
          <span className="text-sm">Glass Morph</span>
        </label>
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border border-gray-300 p-4 rounded-lg overflow-hidden mt-4">
            <Hero 
              key={`hero-${animationType}-${animationKey}`}
              align={align} 
              animationType={animationType}
            >
              {(showBackgroundImage || showGlassMorph) && (
                <HeroMedia
                  src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                  alt="Hero background"
                  position="background"
                  overlayOpacity={40}
                />
              )}
              <HeroContent>
                {showGlassMorph ? (
                  <HeroGlassCard className="p-10 md:p-16 lg:p-15">
                    {showBadge && (
                      <HeroBadge icon={Zap} variant="solid">
                        Trusted by 10000 companies
                      </HeroBadge>
                    )}
                    <HeroHeading>Mindfire Digital</HeroHeading>
                    <HeroSubheading>
                      Create beautiful, responsive user interfaces with our powerful component library.
                      Start building today and bring your ideas to life.
                    </HeroSubheading>
                    <HeroActions>
                      <ButtonWithIcon variant="primary"  size="lg"  iconPosition="right"  icon={<Rocket />} > Start Now </ButtonWithIcon>
                      <ButtonWithIcon variant="primary"  size="lg"  iconPosition="right"  icon={<ArrowUpRight />} > Contact Us </ButtonWithIcon>
                    </HeroActions>
                    {showStats && (
                      <HeroStats
                        stats={[
                          { value: '10K+', label: 'Active Users', icon: Users },
                          { value: '99.9%', label: 'Uptime', icon: Shield },
                          { value: '50%', label: 'Faster', icon: TrendingUp },
                          { value: '24/7', label: 'Support', icon: CheckCircle2 },
                        ]}
                        variant="cards"
                        columns={4}
                      />
                    )}
                    {showFeatures && (
                      <HeroFeatures 
                        features={['AI Powered', 'Fully Responsive', 'Lightning Fast', 'Developer Friendly']}
                      />
                    )}
                  </HeroGlassCard>
                ) : (
                  <>
                    {showBadge && (
                      <HeroBadge icon={Zap} variant="solid">
                        Trusted by 10000 companies
                      </HeroBadge>
                    )}
                    <HeroHeading>Build Amazing Experiences</HeroHeading>
                    <HeroSubheading>
                      Create beautiful, responsive user interfaces with our powerful component library.
                      Start building today and bring your ideas to life.
                    </HeroSubheading>
                    <HeroActions>
                      <ButtonWithIcon variant="primary"  size="lg"  iconPosition="right"  icon={<Rocket />} > Start Now </ButtonWithIcon>
                      <ButtonWithIcon variant="primary"  size="lg"  iconPosition="right"  icon={<ArrowUpRight />} > Contact Us </ButtonWithIcon>
                    </HeroActions>
                    {showStats && (
                      <HeroStats
                        stats={[
                          { value: '10K+', label: 'Active Users', icon: Users },
                          { value: '99.9%', label: 'Uptime', icon: Shield },
                          { value: '50%', label: 'Faster', icon: TrendingUp },
                          { value: '24/7', label: 'Support', icon: CheckCircle2 },
                        ]}
                        variant="cards"
                        columns={4}
                      />
                    )}
                    {showFeatures && (
                      <HeroFeatures 
                        features={['AI Powered', 'Fully Responsive', 'Lightning Fast', 'Developer Friendly']}
                      />
                    )}
                  </>
                )}
              </HeroContent>
            </Hero>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <div className="mt-4">
            <CodeBlock language="tsx" className="text-sm">
              {codeString}
            </CodeBlock>
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
};

const HeroSplitDemo = () => {
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('center');
  const [showBackgroundImage, setShowBackgroundImage] = useState<boolean>(false);
  
  // Build code string parts to avoid extra whitespace
  const codeParts: string[] = [];
  
  codeParts.push(`<Hero 
  split
  align="${align}" 
>`);
  
  if (showBackgroundImage) {
    codeParts.push(`  <HeroMedia
    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&h=900&fit=crop&q=90"
    alt="Hero background"
    position="background"
    overlayOpacity={60}
  />`);
  }
  
  codeParts.push(`  <HeroContent>`);
    codeParts.push(`      <HeroHeading>Build Amazing Experiences</HeroHeading>
      <HeroSubheading>
        Create beautiful, responsive user interfaces with our powerful component library.
        Start building today and bring your ideas to life.
      </HeroSubheading>
      <HeroActions>
        <ButtonWithIcon 
          variant="outline" 
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
      </HeroActions>`);
    codeParts.push(`   <HeroMedia position="right" src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&h=800&fit=crop&q=90" alt="Modern workspace interior"/>`)
  codeParts.push(`  </HeroContent>
</Hero>`);
  
  const codeString = codeParts.join('\n');

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">

        <div className="space-y-2">
          <VariantSelector
            variants={alignOptions.map(a => a.value)}
            selectedVariant={align}
            onSelectVariant={(value) => setAlign(value as 'left' | 'center' | 'right')}
            type="Align"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showBackgroundImage}
            onChange={(e) => setShowBackgroundImage(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Background Image</span>
        </label>
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border border-gray-300 p-4 rounded-lg overflow-hidden mt-4">
            <Hero 
              align={align} 
              split 
            >
            {showBackgroundImage && <HeroMedia 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&h=900&fit=crop&q=90"
            position="background"
            overlayOpacity={40}
            />}
              <HeroContent>
                <HeroHeading>
                  Build the Future of Your Business
                </HeroHeading>

                <HeroSubheading>
                  Transform your ideas into reality with our cutting-edge platform. 
                  Join thousands of teams already building amazing products.
                </HeroSubheading>

                <HeroActions className="mt-8">
                  <ButtonWithIcon 
                    variant="outline" 
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

                <HeroMedia 
                  position="right" 
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&h=800&fit=crop&q=90"
                  alt="Modern workspace interior"
                />
              </HeroContent>
            </Hero>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <div className="mt-4">
            <CodeBlock language="tsx" className="text-sm">
              {codeString}
            </CodeBlock>
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
};

const HeroVideoDemo = () => {
  const codeParts: string[] = [];
  
  codeParts.push(`<Hero 
  align="center" 
  animationType="fadeInUp"
>`);
    codeParts.push(`  <HeroMedia
    src="https://assets.mixkit.co/videos/513/513-720.mp4"
    overlayOpacity={50}
    showPlayPause
    fallbackImage="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&h=900&fit=crop&q=90"
  />`);  
  codeParts.push(`  <HeroContent>`);
    codeParts.push(`    <HeroHeading>Experience the Future in Motion</HeroHeading>
    <HeroSubheading>
      Watch your ideas come to life with stunning video backgrounds. 
      Create immersive experiences that captivate and inspire your audience.
    </HeroSubheading>
    <HeroActions>
      <ButtonWithIcon 
        variant="outline" 
        size="lg" 
        iconPosition="right"
        icon={<Rocket />}
        className="px-8 py-6 rounded-lg border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
      >
        Get Started
      </ButtonWithIcon>
      <ButtonWithIcon 
        variant="outline" 
        size="lg" 
        iconPosition="right"
        icon={<ArrowUpRight />}
        className="px-8 py-6 rounded-lg border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
      >
        Learn More
      </ButtonWithIcon>
    </HeroActions>`);
  codeParts.push(`  </HeroContent>
</Hero>`);
  
  const codeString = codeParts.join('\n');

  return (
    <div className="space-y-1">
      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border border-gray-300 p-4 rounded-lg overflow-hidden mt-4">
            <Hero 
              align="center" 
              animationType="fadeInUp"
            >
              <HeroMedia 
                src="https://assets.mixkit.co/videos/513/513-720.mp4"
                overlayOpacity={50}
                showPlayPause
                fallbackImage="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&h=900&fit=crop&q=90"
              />
              <HeroContent>
                <HeroHeading>
                  Experience the Future in Motion
                </HeroHeading>

                <HeroSubheading>
                  Watch your ideas come to life with stunning video backgrounds. 
                  Create immersive experiences that captivate and inspire your audience.
                </HeroSubheading>

                <HeroActions className="mt-8">
                  <ButtonWithIcon 
                    variant="outline" 
                    size="lg" 
                    iconPosition="right"
                    icon={<Rocket />}
                    className="px-8 py-6 rounded-lg border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  >
                    Get Started
                  </ButtonWithIcon>
                  <ButtonWithIcon 
                    variant="outline" 
                    size="lg" 
                    iconPosition="right"
                    icon={<ArrowUpRight />}
                    className="px-8 py-6 rounded-lg border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  >
                    Learn More
                  </ButtonWithIcon>
                </HeroActions>
              </HeroContent>
            </Hero>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <div className="mt-4">
            <CodeBlock language="tsx" className="text-sm">
              {codeString}
            </CodeBlock>
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
};

const HeroCarouselDemo = () => {
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showNavigation, setShowNavigation] = useState<boolean>(true);
  const [showDots, setShowDots] = useState<boolean>(true);
  const [rotationInterval, setRotationInterval] = useState<number>(1000);

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
            <ButtonWithIcon variant="primary" size="lg" iconPosition="right" icon={<Rocket />}>
              Get Started
            </ButtonWithIcon>
            <ButtonWithIcon variant="primary" size="lg" iconPosition="right" icon={<ArrowUpRight />}>
              Learn More
            </ButtonWithIcon>
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
          <HeroHeading>Innovation at Your Fingertips</HeroHeading>
          <HeroSubheading>
            Experience cutting-edge technology designed to help you achieve your goals faster.
          </HeroSubheading>
          <HeroActions>
            <ButtonWithIcon variant="primary" size="lg" iconPosition="right" icon={<Rocket />}>
              Explore Features
            </ButtonWithIcon>
          </HeroActions>
        </HeroContent>
      ),
    },
    {
      id: 'slide-3',
      src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&h=1080&fit=crop',
      overlayOpacity: 55,
      content: (
        <HeroContent>
          <HeroHeading>Join Thousands of Happy Users</HeroHeading>
          <HeroSubheading>
            Be part of a growing community that's transforming the way we work and create.
          </HeroSubheading>
          <HeroActions>
            <ButtonWithIcon variant="primary" size="lg" iconPosition="right" icon={<Rocket />}>
              Join Now
            </ButtonWithIcon>
          </HeroActions>
        </HeroContent>
      ),
    },
  ];

  // Build code string
  const codeParts: string[] = [];
  
  codeParts.push(`<HeroCarousel
  slides={[
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
      src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&h=1080&fit=crop',
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
  ]}
${(() => {
    const props = [
      autoRotate ? `  autoRotate` : null,
      autoRotate ? `  rotationInterval={${rotationInterval}}` : null,
      showNavigation ? `  showNavigation` : null,
      showDots ? `  showDots` : null,
    ].filter(Boolean);
    return props.length > 0 ? '\n' + props.join('\n') : '';
  })()}
/>`);
  
  const codeString = codeParts.join('\n');

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end rounded-lg">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={autoRotate}
            onChange={(e) => setAutoRotate(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Auto Rotate</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showNavigation}
            onChange={(e) => setShowNavigation(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show Navigation</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showDots}
            onChange={(e) => setShowDots(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show Dots</span>
        </label>
        {autoRotate && <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm">Rotation Interval (ms):</span>
          <input
            type="number"
            min="1000"
            max="5000"
            step="500"
            value={rotationInterval}
            onChange={(e) => setRotationInterval(Number(e.target.value))}
            className="w-24 px-2 py-1 rounded border border-gray-300"
          />
        </label>}
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border border-gray-300 p-4 rounded-lg overflow-hidden mt-4">
            <HeroCarousel
              slides={slides}
              autoRotate={autoRotate}
              rotationInterval={rotationInterval}
              showNavigation={showNavigation}
              showDots={showDots}
            />
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <div className="mt-4">
            <CodeBlock language="tsx" className="text-sm">
              {codeString}
            </CodeBlock>
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
};

export { HeroDemo, HeroSplitDemo, HeroVideoDemo, HeroCarouselDemo };

