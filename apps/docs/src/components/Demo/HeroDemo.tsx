import React, { useEffect, useState } from 'react';
import { Hero, HeroContent, HeroHeading, HeroSubheading, HeroActions, HeroImage, HeroBadge, HeroFeatures, HeroGlassCard, HeroStats } from '@site/src/components/UI/hero';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Zap, Users, TrendingUp, Shield, CheckCircle2, Rocket, ArrowUpRight } from 'lucide-react';
import { ButtonWithIcon } from '@site/src/components/UI/button-with-icon';

type Animations = typeof animationTypes[number];

const heroVariants = [
  { value: 'default', label: 'Default (Light)' },
  { value: 'dark', label: 'Dark' },
];

const alignOptions = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const animationTypes = [
   'fadeIn', 'fadeInUp' , 'fadeInDown' , 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'scaleIn', 'zoomIn', 'flipIn', 'bounceIn', 'floatIn', 'rotateIn'
] as const;

const HeroDemo = () => {
  const [variant, setVariant] = useState<'default' | 'dark'>('dark');
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
  variant="${variant}" 
  align="${align}" 
  animationType="${animationType}"
>`);
  
  if (showBackgroundImage || showGlassMorph) {
    codeParts.push(`  <HeroImage
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
        variant="glass"
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
      variant="glass"
    />`);
    }
  }
  
  codeParts.push(`  </HeroContent>
</Hero>`);
  
  const codeString = codeParts.join('\n');

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        {!showBackgroundImage && !showGlassMorph && <div className="space-y-2">
          <VariantSelector
            variants={heroVariants.map(v => v.value)}
            selectedVariant={variant}
            onSelectVariant={(value) => setVariant(value as 'default' | 'dark')}
            type="Variant"
          />
        </div>}

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
              variant={variant} 
              align={align} 
              animationType={animationType}
            >
              {(showBackgroundImage || showGlassMorph) && (
                <HeroImage
                  src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                  alt="Hero background"
                  position="background"
                  overlayOpacity={60}
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
                        variant="glass"
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
                        variant="glass"
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

export default HeroDemo;

