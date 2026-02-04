import React, { useState } from 'react';
import {
    CTABanner,
    CTABannerHeading,
    CTABannerSubheading,
    CTABannerActions,
    CTABannerButton,
    CTABannerContent,
    CTABannerImage
} from '../UI/call-to-action';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Calendar, Zap } from 'lucide-react';
import VariantSelector from './VariantSelector';
import { useColorMode } from '@docusaurus/theme-common';

type VariantType = 'default' | 'primary' | 'secondary' | 'accent' | 'muted' | 'gradient' | 'glass' | 'dark' | 'light';
// type LayoutType = 'centered' | 'split' | 'compact';
type ContentAlignType = 'left' | 'center' | 'right';
type AnimationType = 'fade' | 'slide' | 'scale';
type ImagePositionType = 'left' | 'right';

// const variantOptions: { value: VariantType; label: string }[] = [
//     { value: 'default', label: 'Default' },
//     { value: 'primary', label: 'Primary' },
//     { value: 'secondary', label: 'Secondary' },
//     { value: 'accent', label: 'Accent' },
//     { value: 'muted', label: 'Muted' },
//     { value: 'gradient', label: 'Gradient' },
//     { value: 'glass', label: 'Glass' },
//     { value: 'dark', label: 'Dark' },
//     { value: 'light', label: 'Light' },
// ];

// const layoutOptions: { value: LayoutType; label: string }[] = [
//     { value: 'centered', label: 'Centered' },
//     { value: 'split', label: 'Split' },
//     { value: 'compact', label: 'Compact' },
// ];

const alignOptions: { value: ContentAlignType; label: string }[] = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' },
];

const animationOptions: { value: AnimationType; label: string }[] = [
    { value: 'fade', label: 'Fade' },
    { value: 'slide', label: 'Slide' },
    { value: 'scale', label: 'Scale' },
];

const paddingOptions: { value: 'sm' | 'md' | 'lg' | 'xl' | '2xl'; label: string }[] = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'XL' },
    { value: '2xl', label: '2XL' },
];

// Gradient Overlay Background Demo
export const GradientOverlayBackgroundDemo = () => {
    const [variant, setVariant] = useState<VariantType>('default');
    const [animate, setAnimate] = useState<boolean>(true);
    const [animationType, setAnimationType] = useState<AnimationType>('fade');
    const [padding, setPadding] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('2xl');
    const [showOverlay, setShowOverlay] = useState<boolean>(true);

    const codeString = `<CTABanner
  variant="${variant}"
  layout="centered"
  contentAlign="center"
  backgroundType="image"
  backgroundImage="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
  padding="${padding}"
  animate={${animate}}
  animationType="${animationType}"
>
  ${showOverlay ? `  {/* Gradient overlay */}` : ''}
  ${showOverlay ? `  <div` : ''}
  ${showOverlay ? `    className="absolute inset-0"` : ''}
  ${showOverlay ? `    style={{` : ''}
  ${showOverlay ? `      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)',` : ''}
  ${showOverlay ? `    }}` : ''}
  ${showOverlay ? `  />` : ''}

  <div className="relative z-10">
    <CTABannerHeading className="text-white">
      Ready to Transform?
    </CTABannerHeading>

    <CTABannerSubheading className="text-gray-100 max-w-xl">
      Take the first step towards innovation. Our team is here to guide you every step of the way.
    </CTABannerSubheading>

    <CTABannerActions>
      <CTABannerButton
        label="Schedule Consultation"
        variant="primary"
        icon={Calendar}
        className="bg-white text-blue-600 hover:bg-gray-100"
      />
      <CTABannerButton
        label="View Case Studies"
        variant="outline"
        className="border-white text-white hover:bg-white/20"
      />
    </CTABannerActions>
  </div>
</CTABanner>`;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
                <div className="space-y-2">
                    <VariantSelector
                        variants={['default', 'primary', 'accent', 'dark']}
                        selectedVariant={variant}
                        onSelectVariant={(value) => setVariant(value as VariantType)}
                        type="Variant"
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={animationOptions.map(a => a.value)}
                        selectedVariant={animationType}
                        onSelectVariant={(value) => setAnimationType(value as AnimationType)}
                        type="Animation"
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={paddingOptions.map(p => p.value)}
                        selectedVariant={padding}
                        onSelectVariant={(value) => setPadding(value as 'sm' | 'md' | 'lg' | 'xl' | '2xl')}
                        type="Padding"
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-start sm:justify-end rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={animate}
                        onChange={(e) => setAnimate(e.target.checked)}
                        className="rounded"
                    />
                    <span className="text-sm">Animate</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showOverlay}
                        onChange={(e) => setShowOverlay(e.target.checked)}
                        className="rounded"
                    />
                    <span className="text-sm">Show Gradient Overlay</span>
                </label>
            </div>

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="border border-gray-300 rounded-lg overflow-hidden mt-4">
                        <CTABanner
                            variant={variant}
                            layout="centered"
                            contentAlign="center"
                            backgroundType="image"
                            backgroundImage="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
                            padding={padding}
                            animate={animate}
                            animationType={animationType}
                        >
                            {showOverlay && (
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)',
                                    }}
                                />
                            )}

                            <div className="relative z-10">
                                <CTABannerHeading className="text-white">
                                    Ready to Transform?
                                </CTABannerHeading>

                                <CTABannerSubheading className="text-gray-100 max-w-xl">
                                    Take the first step towards innovation. Our team is here to guide you every step of the way.
                                </CTABannerSubheading>

                                <CTABannerActions className='mt-5'>
                                    <CTABannerButton
                                        label="Schedule Consultation"
                                        variant="primary"
                                        icon={Calendar}
                                        className="bg-white text-blue-600 hover:bg-gray-100"
                                    />
                                    <CTABannerButton
                                        label="View Case Studies"
                                        variant="outline"
                                        className="border-white text-white hover:bg-white/20"
                                    />
                                </CTABannerActions>
                            </div>
                        </CTABanner>
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

// Centered with Background Image Demo
export const CenteredWithBackgroundImageDemo = () => {
    const [variant, setVariant] = useState<VariantType>('dark');
    const [animate, setAnimate] = useState<boolean>(true);
    const [animationType, setAnimationType] = useState<AnimationType>('slide');
    const [padding, setPadding] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('2xl');
    const [showFeatures, setShowFeatures] = useState<boolean>(true);
    const [showOverlay, setShowOverlay] = useState<boolean>(true);

    const codeString = `<CTABanner
  variant="${variant}"
  layout="centered"
  contentAlign="center"
  backgroundType="image"
  backgroundImage="https://images.unsplash.com/photo-1663427929868-3941f957bb36?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  padding="${padding}"
  animate={${animate}}
  animationType="${animationType}"
>
  ${showOverlay ? `  {/* Optional overlay for background image */}` : ''}
  ${showOverlay ? `  <div className="absolute inset-0 bg-black/40" />` : ''}

  <div className="relative z-10">
    <CTABannerHeading className="text-white">
      Experience Excellence
    </CTABannerHeading>

    <CTABannerSubheading className="text-gray-200 max-w-2xl">
      Join our community of innovators and thought leaders shaping the future of technology.
      Discover how our platform can transform your digital experience.
    </CTABannerSubheading>

    <CTABannerActions>
      <CTABannerButton
        label="Get Started"
        variant="primary"
        icon={Zap}
        className="bg-white text-gray-900 hover:bg-gray-100 border-0"
      />
      <CTABannerButton
        label="Watch Demo"
        variant="outline"
        className="border-white text-white hover:bg-white/10"
      />
    </CTABannerActions>

    ${showFeatures ? `    {/* Optional additional info */}` : ''}
    ${showFeatures ? `    <motion.div` : ''}
    ${showFeatures ? `      initial={{ opacity: 0, y: 20 }}` : ''}
    ${showFeatures ? `      animate={{ opacity: 1, y: 0 }}` : ''}
    ${showFeatures ? `      transition={{ delay: 0.5 }}` : ''}
    ${showFeatures ? `      className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-300"` : ''}
    ${showFeatures ? `    >` : ''}
    ${showFeatures ? `      <div className="flex items-center gap-2">` : ''}
    ${showFeatures ? `        <div className="w-2 h-2 rounded-full bg-green-500" />` : ''}
    ${showFeatures ? `        <span>No credit card required</span>` : ''}
    ${showFeatures ? `      </div>` : ''}
    ${showFeatures ? `      <div className="flex items-center gap-2">` : ''}
    ${showFeatures ? `        <div className="w-2 h-2 rounded-full bg-green-500" />` : ''}
    ${showFeatures ? `        <span>14-day free trial</span>` : ''}
    ${showFeatures ? `      </div>` : ''}
    ${showFeatures ? `      <div className="flex items-center gap-2">` : ''}
    ${showFeatures ? `        <div className="w-2 h-2 rounded-full bg-green-500" />` : ''}
    ${showFeatures ? `        <span>24/7 support</span>` : ''}
    ${showFeatures ? `      </div>` : ''}
    ${showFeatures ? `    </motion.div>` : ''}
  </div>
</CTABanner>`;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
                <div className="space-y-2">
                    <VariantSelector
                        variants={['dark', 'default', 'light', 'glass']}
                        selectedVariant={variant}
                        onSelectVariant={(value) => setVariant(value as VariantType)}
                        type="Variant"
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={animationOptions.map(a => a.value)}
                        selectedVariant={animationType}
                        onSelectVariant={(value) => setAnimationType(value as AnimationType)}
                        type="Animation"
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={paddingOptions.map(p => p.value)}
                        selectedVariant={padding}
                        onSelectVariant={(value) => setPadding(value as 'sm' | 'md' | 'lg' | 'xl' | '2xl')}
                        type="Padding"
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-start sm:justify-end rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={animate}
                        onChange={(e) => setAnimate(e.target.checked)}
                        className="rounded"
                    />
                    <span className="text-sm">Animate</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showOverlay}
                        onChange={(e) => setShowOverlay(e.target.checked)}
                        className="rounded"
                    />
                    <span className="text-sm">Show Dark Overlay</span>
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
            </div>

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="border border-gray-300 rounded-lg overflow-hidden mt-4">
                        <CTABanner
                            variant={variant}
                            layout="centered"
                            contentAlign="center"
                            backgroundType="image"
                            backgroundImage="https://images.unsplash.com/photo-1663427929868-3941f957bb36?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            padding={padding}
                            animate={animate}
                        // animationType={animationType}
                        >
                            {showOverlay && (
                                <div className="absolute inset-0 bg-black/40" />
                            )}

                            <div className="relative z-10">
                                <CTABannerHeading className="text-white">
                                    Experience Excellence
                                </CTABannerHeading>

                                <CTABannerSubheading className="text-gray-200 max-w-2xl">
                                    Join our community of innovators and thought leaders shaping the future of technology.
                                    Discover how our platform can transform your digital experience.
                                </CTABannerSubheading>

                                <CTABannerActions className='mt-8'>
                                    <CTABannerButton
                                        label="Get Started"
                                        variant="primary"
                                        icon={Zap}
                                        className="bg-white text-gray-900 hover:bg-gray-100 border-0"
                                    />
                                    <CTABannerButton
                                        label="Watch Demo"
                                        variant="outline"
                                        className="border-white text-white hover:bg-white/10"
                                    />
                                </CTABannerActions>

                                {showFeatures && (
                                    <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <span>No credit card required</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <span>14-day free trial</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <span>24/7 support</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CTABanner>
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

// Split Layout Demo
export const SplitLayoutDemo = () => {
    const { colorMode } = useColorMode();
    const [variant, setVariant] = useState<VariantType>('light');
    const layout = 'split'
    // const [layout, setLayout] = useState<LayoutType>('split');
    const [contentAlign, setContentAlign] = useState<ContentAlignType>('left');
    const [animate, setAnimate] = useState<boolean>(true);
    const [animationType, setAnimationType] = useState<AnimationType>('fade');
    const [padding, setPadding] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('sm');
    const [imagePosition, setImagePosition] = useState<ImagePositionType>('right');
    const [imageVariant, setImageVariant] = useState<'light' | 'dark' | 'default'>('default');

    const codeString = `<CTABanner
  variant="${variant}"
  layout="${layout}"
  contentAlign="${contentAlign}"
  padding="${padding}"
  animate={${animate}}
  animationType="${animationType}"
  imagePosition="${imagePosition}"
  imageVariant="${imageVariant}"
>
  <CTABannerContent>
    <CTABannerHeading>
      Connect With Our Team
    </CTABannerHeading>
    
    <CTABannerSubheading>
      Our experts are ready to help you achieve your goals. Schedule a personalized
      consultation today to discuss your specific needs and challenges.
    </CTABannerSubheading>
    
    <CTABannerActions>
      <CTABannerButton
        label="Schedule Now"
        variant="primary"
        icon={Calendar}
      />
      <CTABannerButton
        label="Contact Us"
        variant="outline"
      />
    </CTABannerActions>
  </CTABannerContent>
  
  <CTABannerImage
    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    alt="Team collaboration"
    className="h-[420px] lg:h-[480px]"
    variant="${imageVariant}"
  />
</CTABanner>`;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
                <div className="space-y-2">
                    <VariantSelector
                        variants={['light', 'dark', 'default', 'accent']}
                        selectedVariant={variant}
                        onSelectVariant={(value) => setVariant(value as VariantType)}
                        type="Variant"
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={alignOptions.map(a => a.value)}
                        selectedVariant={contentAlign}
                        onSelectVariant={(value) => setContentAlign(value as ContentAlignType)}
                        type="Align"
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={animationOptions.map(a => a.value)}
                        selectedVariant={animationType}
                        onSelectVariant={(value) => setAnimationType(value as AnimationType)}
                        type="Animation"
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={paddingOptions.map(p => p.value)}
                        selectedVariant={padding}
                        onSelectVariant={(value) => setPadding(value as 'sm' | 'md' | 'lg' | 'xl' | '2xl')}
                        type="Padding"
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={['left', 'right']}
                        selectedVariant={imagePosition}
                        onSelectVariant={(value) => setImagePosition(value as ImagePositionType)}
                        type="Image Pos"
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={['light', 'dark', 'default']}
                        selectedVariant={imageVariant}
                        onSelectVariant={(value) => setImageVariant(value as 'light' | 'dark' | 'default')}
                        type="Image Variant"
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-start sm:justify-end rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={animate}
                        onChange={(e) => setAnimate(e.target.checked)}
                        className="rounded"
                    />
                    <span className="text-sm">Animate</span>
                </label>
            </div>

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="border border-gray-300 rounded-lg overflow-hidden mt-4">
                        <CTABanner
                            variant={colorMode as 'light' | 'dark'}
                            layout={layout}
                            contentAlign={contentAlign}
                            padding={padding}
                            animate={animate}
                            animationType={animationType}
                            imagePosition={imagePosition}
                            imageVariant={imageVariant}
                        >
                            <CTABannerContent>
                                <CTABannerHeading>
                                    Connect With Our Team
                                </CTABannerHeading>
                                <CTABannerSubheading>
                                    Our experts are ready to help you achieve your goals. Schedule a personalized
                                    consultation today to discuss your specific needs and challenges.
                                </CTABannerSubheading>
                                <CTABannerActions className='mt-10'>
                                    <CTABannerButton
                                        label="Schedule Now"
                                        variant="primary"
                                        icon={Calendar}
                                    />
                                    <CTABannerButton
                                        label="Contact Us"
                                        variant="outline"
                                    />
                                </CTABannerActions>
                            </CTABannerContent>
                            <CTABannerImage
                                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                alt="Team collaboration"
                                className="h-[420px] lg:h-[480px]"
                                variant={imageVariant}
                            />
                        </CTABanner>
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