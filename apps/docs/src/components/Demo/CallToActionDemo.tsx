

import React, { useState } from 'react';
import {
    CTABanner,
    CTABannerHeading,
    CTABannerSubheading,
    CTABannerActions,
    CTABannerButton,
    CTABannerContent,
    CTABannerImage,
    CTABannerContactForm,
    CTABannerNewsletter,
    CTABannerDemoRequest,
    ContactFormHeading,
    ContactFormSubheading,
    NewsletterHeading,
    NewsletterSubheading,
    DemoFormHeading,
    DemoFormSubheading
} from '../UI/call-to-action';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Zap } from 'lucide-react';
import VariantSelector from './VariantSelector';
import { useColorMode } from '@docusaurus/theme-common';

type VariantType = 'default' | 'primary' | 'secondary' | 'accent' | 'muted' | 'gradient' | 'glass' | 'dark' | 'light';
type ImagePositionType = 'left' | 'right';
type FormType = 'banner' | 'newsletter' | 'contact-form' | 'demo-request';


// Helper function to get theme-aware variant based on color mode
const getThemeAwareVariant = (demoType: string, colorMode: 'light' | 'dark'): VariantType => {
    if (demoType === 'background-image') {
        return colorMode === 'dark' ? 'dark' : 'light';
    }
    if (demoType === 'gradient-background') {
        return colorMode === 'dark' ? 'dark' : 'light';
    }
    if (demoType === 'split') {
        return colorMode === 'dark' ? 'dark' : 'light';
    }
    // For centered demo
    return colorMode === 'dark' ? 'dark' : 'default';
};

// Helper function to render form content based on type
const renderFormContent = (formType: FormType, theme: 'light' | 'dark' = 'light') => {
    switch (formType) {
        case 'banner':
            return (
                <>
                    <CTABannerHeading className={theme === 'dark' ? 'text-gray-100 text-3xl' : 'text-gray-900 text-4xl'}>
                        Let's Build Something Amazing
                    </CTABannerHeading>
                    <CTABannerSubheading className="dark:text-gray-300 text-gray-900 text-lg">
                        Join thousands of satisfied customers who have transformed their business with our platform.
                        Get started today and see the difference.
                    </CTABannerSubheading>
                    <CTABannerActions>
                        <CTABannerButton
                            label="Get Started"
                            variant="primary"
                            icon={Zap}
                        />
                        <CTABannerButton
                            label="Learn More"
                            variant="outline"
                        />
                    </CTABannerActions>
                    <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className={theme === 'dark' ? 'text-gray-300 text-lg' : 'text-gray-900 text-lg'}>
                                30-day free trial
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className={theme === 'dark' ? 'text-gray-300 text-lg' : 'text-gray-900 text-lg'}>
                                No credit card required
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className={theme === 'dark' ? 'text-gray-300 text-lg' : 'text-gray-900 text-lg'}>
                                24/7 support
                            </span>
                        </div>
                    </div>
                </>
            );
        
        case 'newsletter':
            return (
                <CTABannerNewsletter
                    placeholder="Enter your email"
                    submitText="Subscribe"
                    privacyNote="We'll never share your email. Unsubscribe at any time."
                    buttonVariant="primary"
                    layout="inline"
                    onSubmit={async (email) => {
                        console.log('Newsletter subscription:', email);
                    }}
                >
                    <NewsletterHeading>Stay in the Loop</NewsletterHeading>
                    <NewsletterSubheading>
                        Subscribe to our newsletter for the latest updates, tips, and exclusive content.
                        Join 10,000+ professionals already subscribed.
                    </NewsletterSubheading>
                </CTABannerNewsletter>
            );
        
        case 'contact-form':
            return (
                <CTABannerContactForm
                    namePlaceholder="Your name"
                    emailPlaceholder="you@example.com"
                    subjectPlaceholder="How can we help you?"
                    messagePlaceholder="Tell us about your inquiry..."
                    submitText="Send Message"
                    successMessage="Thank you! We'll get back to you within 24 hours."
                    requireSubject={true}
                    maxMessageLength={1000}
                    layout="vertical"
                    onSubmit={async (data) => {
                        console.log('Contact form submitted:', data);
                    }}
                >
                    <ContactFormHeading>Get In Touch</ContactFormHeading>
                    <ContactFormSubheading>
                        Have questions or need assistance? Our team is here to help you succeed.
                    </ContactFormSubheading>
                </CTABannerContactForm>
            );
        
        case 'demo-request':
            return (
                <CTABannerDemoRequest
                    namePlaceholder="John Doe"
                    emailPlaceholder="john@company.com"
                    companyPlaceholder="Acme Inc."
                    phonePlaceholder="(555) 123-4567"
                    submitText="Request Demo"
                    successMessage="Thank you! We'll contact you within 24 hours to schedule your demo."
                    requireCompany={true}
                    requirePhone={false}
                    layout="two-column"
                    onSubmit={async (data) => {
                        console.log('Demo request submitted:', data);
                    }}
                >
                    <DemoFormHeading>See Our Platform Live</DemoFormHeading>
                    <DemoFormSubheading>
                        Get a personalized demo tailored to your business needs.
                        See firsthand how we can help you achieve your goals.
                    </DemoFormSubheading>
                </CTABannerDemoRequest>
            );
    }
};

// Helper function to get code snippet
// const getCodeSnippet = (formType: FormType, demoType: string, variant: VariantType, additionalProps: any = {}) => {
//     // Determine if we should show overlay based on variant and demo type
//     const shouldShowOverlay = 
//         (demoType === 'gradient-background') || 
//         (demoType === 'background-image' && (variant === 'dark' || variant === 'light'));

//     const baseCode = `import { CTABanner, CTABannerContent${formType !== 'banner' ? `, ${formType === 'newsletter' ? 'CTABannerNewsletter, NewsletterHeading, NewsletterSubheading' : formType === 'contact-form' ? 'CTABannerContactForm, ContactFormHeading, ContactFormSubheading' : 'CTABannerDemoRequest, DemoFormHeading, DemoFormSubheading'}` : ''} } from '../UI/call-to-action';

// <CTABanner
//   variant="${variant}"
//   layout="${demoType === 'centered' ? 'centered' : demoType === 'split' ? 'split' : 'centered'}"
//   contentAlign="${demoType === 'split' ? 'left' : 'center'}"
//   ${demoType === 'background-image' ? 'backgroundType="image"' : ''}
//   ${demoType === 'background-image' ? 'backgroundImage="https://images.unsplash.com/photo-1663427929868-3941f957bb36?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"' : ''}
//   ${demoType === 'gradient-background' ? 'backgroundType="image"' : ''}
//   ${demoType === 'gradient-background' ? 'backgroundImage="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"' : ''}
//   ${demoType === 'split' ? `imagePosition="${additionalProps.imagePosition || 'right'}"` : ''}
//   ${demoType === 'split' ? 'imageVariant="default"' : ''}
// >
//   ${demoType === 'gradient-background' ? '  {/* Gradient overlay */}' : ''}
//   ${demoType === 'gradient-background' ? '  <div' : ''}
//   ${demoType === 'gradient-background' ? '    className="absolute inset-0"' : ''}
//   ${demoType === 'gradient-background' ? '    style={{' : ''}
//   ${demoType === 'gradient-background' ? `      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)',` : ''}
//   ${demoType === 'gradient-background' ? '    }}' : ''}
//   ${demoType === 'gradient-background' ? '  />' : ''}
  
//   ${demoType === 'background-image' && shouldShowOverlay ? '  {/* Optional overlay for better contrast */}' : ''}
//   ${demoType === 'background-image' && variant === 'dark' ? '  <div className="absolute inset-0 bg-black/40" />' : ''}
//   ${demoType === 'background-image' && variant === 'light' ? '  <div className="absolute inset-0 bg-white/30" />' : ''}

//   <CTABannerContent${demoType === 'background-image' || demoType === 'gradient-background' ? ' className="relative z-10"' : ''}>
//     ${getFormCode(formType)}
//   </CTABannerContent>
  
//   ${demoType === 'split' ? `  <CTABannerImage
//     src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
//     alt="Team collaboration"
//     className="h-[420px] lg:h-[480px]"
//   />` : ''}
// </CTABanner>`;

//     return baseCode;
// };

// Helper function to get code snippet
const getCodeSnippet = (formType: FormType, demoType: string, variant: VariantType, additionalProps: any = {}) => {
    // Build props string dynamically
    const props: string[] = [
        `variant="${variant}"`,
        `layout="${demoType === 'centered' ? 'centered' : demoType === 'split' ? 'split' : 'centered'}"`,
        `contentAlign="${demoType === 'split' ? 'left' : 'center'}"`,
    ];

    if (demoType === 'background-image') {
        props.push('backgroundType="image"');
        props.push('backgroundImage="https://images.unsplash.com/photo-1663427929868-3941f957bb36?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"');
    }

    if (demoType === 'gradient-background') {
        props.push('backgroundType="image"');
        props.push('backgroundImage="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"');
    }

    if (demoType === 'split') {
        props.push(`imagePosition="${additionalProps.imagePosition || 'right'}"`);
        props.push('imageVariant="default"');
    }

    const propsString = props.join('\n  ');

    // Build children content
    let childrenContent = '';

    if (demoType === 'gradient-background') {
        childrenContent += `  {/* Gradient overlay */}\n`;
        childrenContent += `  <div\n`;
        childrenContent += `    className="absolute inset-0"\n`;
        childrenContent += `    style={{\n`;
        childrenContent += `      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)',\n`;
        childrenContent += `    }}\n`;
        childrenContent += `  />\n\n`;
    }

    if (demoType === 'background-image') {
        if (variant === 'dark' || variant === 'light') {
            childrenContent += `  {/* Optional overlay for better contrast */}\n`;
            if (variant === 'dark') {
                childrenContent += `  <div className="absolute inset-0 bg-black/40" />\n\n`;
            } else if (variant === 'light') {
                childrenContent += `  <div className="absolute inset-0 bg-black/10" />\n\n`;
            }
        }
    }

    const contentClassName = (demoType === 'background-image' || demoType === 'gradient-background') ? ' className="relative z-10"' : '';
    childrenContent += `  <CTABannerContent${contentClassName}>\n`;
    childrenContent += `    ${getFormCode(formType).replace(/\n/g, '\n    ')}\n`;
    childrenContent += `  </CTABannerContent>\n`;

    if (demoType === 'split') {
        childrenContent += `\n  <CTABannerImage\n`;
        childrenContent += `    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"\n`;
        childrenContent += `    alt="Team collaboration"\n`;
        childrenContent += `    className="h-[420px] lg:h-[480px]"\n`;
        childrenContent += `  />\n`;
    }

    const importStatement = formType === 'banner' 
        ? `import { CTABanner, CTABannerContent } from '../UI/call-to-action';`
        : formType === 'newsletter'
            ? `import { CTABanner, CTABannerContent, CTABannerNewsletter, NewsletterHeading, NewsletterSubheading } from '../UI/call-to-action';`
            : formType === 'contact-form'
                ? `import { CTABanner, CTABannerContent, CTABannerContactForm, ContactFormHeading, ContactFormSubheading } from '../UI/call-to-action';`
                : `import { CTABanner, CTABannerContent, CTABannerDemoRequest, DemoFormHeading, DemoFormSubheading } from '../UI/call-to-action';`;

    const baseCode = `${importStatement}

<CTABanner
  ${propsString}
>
${childrenContent}</CTABanner>`;

    return baseCode;
};

const getFormCode = (formType: FormType) => {
    switch (formType) {
        case 'banner':
            return `    <>
      <CTABannerHeading>
        Let's Build Something Amazing
      </CTABannerHeading>
      
      <CTABannerSubheading>
        Join thousands of satisfied customers who have transformed their business with our platform.
        Get started today and see the difference.
      </CTABannerSubheading>
      
      <CTABannerActions>
        <CTABannerButton
          label="Get Started"
          variant="primary"
          icon={Zap}
        />
        <CTABannerButton
          label="Learn More"
          variant="outline"
        />
      </CTABannerActions>
    </>`;
        
        case 'newsletter':
            return `    <CTABannerNewsletter
      placeholder="Enter your email"
      submitText="Subscribe"
      privacyNote="We'll never share your email. Unsubscribe at any time."
      buttonVariant="primary"
      layout="inline"
      onSubmit={async (email) => {
        console.log('Newsletter subscription:', email);
      }}
    >
      <NewsletterHeading>Stay in the Loop</NewsletterHeading>
      <NewsletterSubheading>
        Subscribe to our newsletter for the latest updates, tips, and exclusive content.
        Join 10,000+ professionals already subscribed.
      </NewsletterSubheading>
    </CTABannerNewsletter>`;
        
        case 'contact-form':
            return `    <CTABannerContactForm
      namePlaceholder="Your name"
      emailPlaceholder="you@example.com"
      subjectPlaceholder="How can we help you?"
      messagePlaceholder="Tell us about your inquiry..."
      submitText="Send Message"
      successMessage="Thank you! We'll get back to you within 24 hours."
      requireSubject={true}
      maxMessageLength={1000}
      layout="vertical"
      onSubmit={async (data) => {
        console.log('Contact form submitted:', data);
      }}
    >
      <ContactFormHeading>Get In Touch</ContactFormHeading>
      <ContactFormSubheading>
        Have questions or need assistance? Our team is here to help you succeed.
      </ContactFormSubheading>
    </CTABannerContactForm>`;
        
        case 'demo-request':
            return `    <CTABannerDemoRequest
      namePlaceholder="John Doe"
      emailPlaceholder="john@company.com"
      companyPlaceholder="Acme Inc."
      phonePlaceholder="(555) 123-4567"
      submitText="Request Demo"
      successMessage="Thank you! We'll contact you within 24 hours to schedule your demo."
      requireCompany={true}
      requirePhone={false}
      layout="two-column"
      onSubmit={async (data) => {
        console.log('Demo request submitted:', data);
      }}
    >
      <DemoFormHeading>See Our Platform Live</DemoFormHeading>
      <DemoFormSubheading>
        Get a personalized demo tailored to your business needs.
        See firsthand how we can help you achieve your goals.
      </DemoFormSubheading>
    </CTABannerDemoRequest>`;
    }
};

// Generic Demo Component
const CTABannerDemo = ({ 
    title, 
    description, 
    demoType 
}: { 
    title: string; 
    description: string;
    demoType: 'centered' | 'split' | 'background-image' | 'gradient-background';
}) => {
    const { colorMode } = useColorMode();
    
    // Initialize variant based on theme
    const [variant, setVariant] = useState<VariantType>(
        getThemeAwareVariant(demoType, colorMode)
    );
    const [formType, setFormType] = useState<FormType>('banner');
    const [imagePosition, setImagePosition] = useState<ImagePositionType>('right');

    const theme = variant === 'dark' || variant === 'gradient' || (demoType === 'background-image' && variant === 'dark') ? 'dark' : 'light';

    // Update variant when color mode changes
    React.useEffect(() => {
        setVariant(getThemeAwareVariant(demoType, colorMode));
    }, [colorMode, demoType]);


    const renderBanner = () => {
        const bannerProps: any = {
            variant,
            layout: demoType === 'split' ? 'split' : 'centered',
            contentAlign: demoType === 'split' ? 'left' : 'center',
        };

        if (demoType === 'split') {
            bannerProps.imagePosition = imagePosition;
            bannerProps.imageVariant = 'default';
        }

        if (demoType === 'background-image') {
            bannerProps.backgroundType = 'image';
            bannerProps.backgroundImage = 'https://images.unsplash.com/photo-1663427929868-3941f957bb36?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
        }

        if (demoType === 'gradient-background') {
            bannerProps.backgroundType = 'image';
            bannerProps.backgroundImage = 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3';
        }

        return (
            <CTABanner {...bannerProps}>
                {(demoType === 'gradient-background') && (
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)',
                        }}
                    />
                )}

                {(demoType === 'background-image') && (
                    <div className={`absolute inset-0 ${variant === 'dark' ? 'bg-black/40' : 'bg-white/20'}`} />
                )}

                <CTABannerContent className={(demoType === 'background-image' || demoType === 'gradient-background') ? "relative z-10" : ""}>
                    {renderFormContent(formType, theme)}
                </CTABannerContent>

                {demoType === 'split' && (
                    <CTABannerImage
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                        alt="Team collaboration"
                        className="h-[420px] lg:h-[480px]"
                    />
                )}
            </CTABanner>
        );
    };

    return (
        <div className="space-y-6">
            <div className="pb-4">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{description}</p>
            </div>

            <div className="flex flex-wrap gap-4 justify-end items-center">
                

                <div className="flex flex-row items-center gap-2">
                   
                    <VariantSelector
                        variants={['banner', 'newsletter', 'contact-form', 'demo-request']}
                        selectedVariant={formType}
                        onSelectVariant={(value) => setFormType(value as FormType)}
                        type="Form Type"
                        variantLabels={{
                            'banner': 'Basic Banner',
                            'newsletter': 'Newsletter Form',
                            'contact-form': 'Contact Form',
                            'demo-request': 'Demo Request Form'
                        }}
                    />
                    {demoType === 'split' && (
                        <div className="space-y-2">
                            <VariantSelector
                                variants={['left', 'right']}
                                selectedVariant={imagePosition}
                                onSelectVariant={(value) => setImagePosition(value as ImagePositionType)}
                                type="Image Position"
                            />
                        </div>
                    )}

                </div>
            </div>

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden mt-4">
                        {renderBanner()}
                    </div>
                </TabItem>

                <TabItem value="code" label="Code">
                    <div className="mt-4">
                        <CodeBlock language="tsx" className="text-sm">
                            {getCodeSnippet(formType, demoType, variant, 
                            {
                                imagePosition,
                            })}
                        </CodeBlock>
                    </div>
                </TabItem>
            </Tabs>
        </div>
    );
};

// Export the four demos
export const CenteredDemo = () => (
    <CTABannerDemo
        // title="1. Centered Layout"
        // description="Classic centered layout perfect for most use cases. Content is centered with equal padding on all sides."
        demoType="centered"
    />
);

export const SplitDemo = () => (
    <CTABannerDemo
        // title="2. Split Layout"
        // description="Split layout with content on one side and an image on the other. Great for visual storytelling."
        demoType="split"
    />
);

export const BackgroundImageDemo = () => (
    <CTABannerDemo
        // title="3. Background Image"
        // description="Full-width background image with optional overlay. Creates a visually striking call-to-action."
        demoType="background-image"
    />
);

export const GradientBackgroundDemo = () => (
    <CTABannerDemo
        // title="4. Gradient Background"
        // description="Gradient overlay over a background image for modern, eye-catching designs."
        demoType="gradient-background"
    />
);