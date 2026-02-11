import React, { useState } from 'react';
import { SignIn, type SignInFormData } from '@site/src/components/UI/sign-in';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Shield, Users, Zap, BarChart, Award, CheckCircle } from 'lucide-react';

// Layout types
const layoutTypes = [
    { value: 'centered', label: 'Centered' },
    { value: 'split', label: 'Split' },
];

// Variants
const variants = [
    { value: 'default', label: 'Default' },
    { value: 'modern', label: 'Modern' },
    { value: 'glass', label: 'Glass' },
    { value: 'dark', label: 'Dark' },
];

// Button styles
const buttonStyles = [
    { value: 'default', label: 'Default' },
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'purple', label: 'Purple' },
    { value: 'gradient', label: 'Gradient' },
];

// Split background themes
const splitBackgrounds = [
    { value: 'none', label: 'None' },
    { value: 'nature', label: 'Nature' },
    { value: 'fire', label: 'Fire' },
    { value: 'purple', label: 'Purple' },
    { value: 'ocean', label: 'Ocean' },
];

const SignInDemo = () => {
    const [layoutType, setLayoutType] = useState('centered');
    const [variant, setVariant] = useState('default');
    const [buttonStyle, setButtonStyle] = useState('default');
    const [splitBackground, setSplitBackground] = useState('none');
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // const [formData, setFormData] = useState({
    //     email: '',
    //     password: '',
    //     rememberMe: false,
    // });

    // Get split background configuration
    const getSplitBackgroundConfig = () => {
        switch (splitBackground) {
            case 'nature':
                return {
                    gradient: "bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-600",
                    textColor: "text-white",
                    companyNameColor: "text-emerald-200",
                    descriptionColor: "text-teal-100",
                };
            case 'fire':
                return {
                    gradient: "bg-gradient-to-br from-red-700 via-orange-600 to-yellow-600",
                    textColor: "text-white",
                    companyNameColor: "text-yellow-300",
                    descriptionColor: "text-red-100",
                };
            case 'purple':
                return {
                    gradient: "bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600",
                    textColor: "text-white",
                    companyNameColor: "text-yellow-300",
                    descriptionColor: "text-purple-100",
                };
            case 'ocean':
                return {
                    gradient: "bg-gradient-to-br from-blue-800 via-indigo-700 to-purple-800",
                    textColor: "text-white",
                    companyNameColor: "text-cyan-200",
                    descriptionColor: "text-blue-100",
                };
            default:
                return undefined;
        }
    };

    // Get button style configuration
    const getButtonStyleConfig = () => {
        switch (buttonStyle) {
            case 'red':
                return {
                    gradient: "bg-gradient-to-r from-red-600 to-red-700",
                    hoverGradient: "hover:from-red-700 hover:to-red-800",
                    shadow: "shadow-lg shadow-red-200",
                    hoverShadow: "hover:shadow-xl hover:shadow-red-300",
                };
            case 'green':
                return {
                    gradient: "bg-gradient-to-r from-green-600 to-green-700",
                    hoverGradient: "hover:from-green-700 hover:to-green-800",
                    shadow: "shadow-lg shadow-green-200",
                    hoverShadow: "hover:shadow-xl hover:shadow-green-300",
                };
            case 'purple':
                return {
                    gradient: "bg-gradient-to-r from-purple-600 to-purple-700",
                    hoverGradient: "hover:from-purple-700 hover:to-purple-800",
                    shadow: "shadow-lg shadow-purple-200",
                    hoverShadow: "hover:shadow-xl hover:shadow-purple-300",
                };
            case 'gradient':
                return {
                    gradient: "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600",
                    hoverGradient: "hover:from-purple-700 hover:via-pink-700 hover:to-rose-700",
                    shadow: "shadow-lg shadow-purple-200",
                    hoverShadow: "hover:shadow-xl hover:shadow-pink-300",
                };
            default:
                return {
                    gradient: "bg-gradient-to-r from-blue-600 to-blue-700",
                    hoverGradient: "hover:from-blue-700 hover:to-blue-800",
                    shadow: "shadow-lg shadow-blue-200",
                    hoverShadow: "hover:shadow-xl hover:shadow-blue-300",
                };
        }
    };

    const handleSubmit = async (data: SignInFormData) => {
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (showError) {
            setIsLoading(false);
            return;
        }

        alert(`Sign In Successful!\n\nEmail: ${data.email}\nRemember Me: ${data.rememberMe ? 'Yes' : 'No'}`);
        setIsLoading(false);
    };

    const handleSocialSignIn = (provider: string) => {
        return async () => {
            alert(`Signing in with ${provider}...`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            alert(`Successfully signed in with ${provider}!`);
        };
    };

    const codeString = `
<SignIn 
  type="${layoutType}"
  variant="${variant}"
  companyName="TechCorp"
  ${splitBackground !== 'none' ? `
  splitBackground={{
    gradient: "${getSplitBackgroundConfig()?.gradient || ''}",
    textColor: "${getSplitBackgroundConfig()?.textColor || ''}",
    companyNameColor: "${getSplitBackgroundConfig()?.companyNameColor || ''}",
    descriptionColor: "${getSplitBackgroundConfig()?.descriptionColor || ''}",
  }}` : ''}
  ${buttonStyle !== 'default' ? `
  buttonStyle={{
    gradient: "${getButtonStyleConfig()?.gradient || ''}",
    hoverGradient: "${getButtonStyleConfig()?.hoverGradient || ''}",
    shadow: "${getButtonStyleConfig()?.shadow || ''}",
    hoverShadow: "${getButtonStyleConfig()?.hoverShadow || ''}",
  }}` : ''}
  onSubmit={handleSubmit}
  onGoogleSignIn={() => console.log('Google sign-in')}
  onGitHubSignIn={() => console.log('GitHub sign-in')}
  onMicrosoftSignIn={() => console.log('Microsoft sign-in')}
  loading={${isLoading}}
  error="${showError ? 'Invalid email or password. Please try again.' : ''}"
  showSocialLogin={true}
  showForgotPassword={true}
  showSignUpLink={true}
  onSignUp={() => console.log('Navigate to sign-up')}
/>
`;

    return (
        <div className="space-y-8 mb-8">
            {/* Controls */}
            <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
                <div className="space-y-2">
                    <VariantSelector
                        variants={layoutTypes.map((l) => l.value)}
                        selectedVariant={layoutType}
                        onSelectVariant={setLayoutType}
                        type="Layout"
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={variants.map((v) => v.value)}
                        selectedVariant={variant}
                        onSelectVariant={setVariant}
                    />
                </div>

                <div className="space-y-2">
                    <VariantSelector
                        variants={buttonStyles.map((b) => b.value)}
                        selectedVariant={buttonStyle}
                        onSelectVariant={setButtonStyle}
                        type="Button"
                    />
                </div>

                {layoutType === 'split' && (
                    <div className="space-y-2">
                        <VariantSelector
                            variants={splitBackgrounds.map((b) => b.value)}
                            selectedVariant={splitBackground}
                            onSelectVariant={setSplitBackground}
                            type="Background"
                        />
                    </div>
                )}
            </div>

            {/* Additional Controls */}
            <div className="flex flex-wrap gap-6 items-center">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={showError}
                        onChange={(e) => setShowError(e.target.checked)}
                        className="rounded border-gray-300"
                    />
                    Show Error
                </label>

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isLoading}
                        onChange={(e) => setIsLoading(e.target.checked)}
                        className="rounded border-gray-300"
                    />
                    Loading State
                </label>
            </div>

            {/* Demo */}
            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="p-6 border rounded-lg mt-4">
                        <div className={`${layoutType === 'split' ? 'h-[600px]' : 'h-[500px]'} flex items-center justify-center overflow-hidden`}>
                            <SignIn
                                type={layoutType as any}
                                variant={variant as any}
                                companyName="TechCorp"
                                onSubmit={handleSubmit}
                                onGoogleSignIn={handleSocialSignIn('Google')}
                                onGitHubSignIn={handleSocialSignIn('GitHub')}
                                onMicrosoftSignIn={handleSocialSignIn('Microsoft')}
                                loading={isLoading}
                                error={showError ? 'Invalid email or password. Please try again.' : ''}
                                showSocialLogin={true}
                                showForgotPassword={true}
                                showSignUpLink={true}
                                onSignUp={() => alert('Navigating to sign-up page...')}
                                splitBackground={layoutType === 'split' ? getSplitBackgroundConfig() : undefined}
                                buttonStyle={getButtonStyleConfig()}
                            />
                        </div>
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

// Demo 1: Centered Dark Layout
const CenteredDarkDemo = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleSubmit = async (data: SignInFormData) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (!showError) {
            alert(`Welcome back! Signed in as ${data.email}`);
        }

        setIsLoading(false);
    };

    const codeString = `<SignIn
  type="centered"
  variant="dark"
  companyName="DarkCorp"
  onSubmit={handleSubmit}
  onGoogleSignIn={() => console.log('Google sign-in')}
  onGitHubSignIn={() => console.log('GitHub sign-in')}
  onMicrosoftSignIn={() => console.log('Microsoft sign-in')}
  loading={isLoading}
  error={showError ? 'Invalid credentials' : ''}
  showSocialLogin={true}
  showForgotPassword={true}
  showSignUpLink={true}
  onSignUp={() => console.log('Navigate to sign up')}
  buttonStyle={{
    gradient: "bg-gradient-to-r from-blue-600 to-purple-600",
    hoverGradient: "hover:from-blue-700 hover:to-purple-700",
    shadow: "shadow-lg shadow-blue-900/30",
    hoverShadow: "hover:shadow-xl hover:shadow-purple-900/50",
    className: "font-bold",
  }}
/>`;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                {/* <div>
                    <h3 className="text-xl font-bold">Centered Dark Layout</h3>
                    <p className="text-gray-600">Elegant dark theme with centered form layout</p>
                </div> */}
                <div></div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showError}
                            onChange={(e) => setShowError(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        Show Error
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={isLoading}
                            onChange={(e) => setIsLoading(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        Loading
                    </label>
                </div>
            </div>

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="border rounded-lg overflow-hidden">
                        <div className="h-[700px] scale-80 flex items-center justify-center">
                            <SignIn
                                type="centered"
                                variant="dark"
                                companyName="DarkCorp"
                                onSubmit={handleSubmit}
                                onGoogleSignIn={() => alert('Google sign-in clicked')}
                                onGitHubSignIn={() => alert('GitHub sign-in clicked')}
                                onMicrosoftSignIn={() => alert('Microsoft sign-in clicked')}
                                loading={isLoading}
                                error={showError ? 'Invalid credentials. Please try again.' : ''}
                                showSocialLogin={true}
                                showForgotPassword={true}
                                showSignUpLink={true}
                                onSignUp={() => alert('Navigate to sign up')}
                                buttonStyle={{
                                    gradient: "bg-gradient-to-r from-blue-600 to-purple-600",
                                    hoverGradient: "hover:from-blue-700 hover:to-purple-700",
                                    shadow: "shadow-lg shadow-blue-900/30",
                                    hoverShadow: "hover:shadow-xl hover:shadow-purple-900/50",
                                    className: "font-bold",
                                }}
                            />
                        </div>
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

// Demo 2: Split Dark Layout
const SplitDarkDemo = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: SignInFormData) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert(`Welcome to SecureApp, ${data.email}!`);
        setIsLoading(false);
    };

    const codeString = `<SignIn
  type="split"
  variant="dark"
  companyName="SecureApp"
  onSubmit={handleSubmit}
  showSocialLogin={true}
  loading={isLoading}
  splitBackground={{
    gradient: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
    textColor: "text-white",
    companyNameColor: "text-blue-400",
    descriptionColor: "text-gray-300",
  }}
  leftPanelContent={{
    title: "Welcome Back to SecureApp",
    description: "Enterprise-grade security meets intuitive design.",
    subtitle: "Trusted by 10,000+ companies",
    features: [
      {
        text: "Military-grade encryption",
        icon: <Shield />,
        iconColor: "text-blue-500",
      },
      {
        text: "Zero-knowledge architecture",
        icon: <CheckCircle />,
        iconColor: "text-green-500",
      },
      {
        text: "SOC 2 Type II compliant",
        icon: <Award />,
        iconColor: "text-yellow-500",
      },
      {
        text: "99.99% uptime SLA",
        icon: <BarChart />,
        iconColor: "text-purple-500",
      },
    ],
    statistics: [
      { value: "10K+", label: "Companies" },
      { value: "99.9%", label: "Uptime" },
      { value: "24/7", label: "Support" },
    ],
  }}
  buttonStyle={{
    gradient: "bg-gradient-to-r from-blue-700 to-blue-900",
    hoverGradient: "hover:from-blue-800 hover:to-blue-950",
    shadow: "shadow-lg shadow-blue-900/50",
    hoverShadow: "hover:shadow-xl hover:shadow-blue-900/70",
  }}
/>`;

    return (
        <div className="space-y-6">
            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="border rounded-lg overflow-hidden">
                        <div className="h-[800px] scale-85 flex items-center justify-center">
                            <SignIn
                                type="split"
                                variant="dark"
                                companyName="SecureApp"
                                onSubmit={handleSubmit}
                                onGoogleSignIn={() => alert('Google sign-in clicked')}
                                onGitHubSignIn={() => alert('GitHub sign-in clicked')}
                                loading={isLoading}
                                showSocialLogin={true}
                                showForgotPassword={true}
                                showSignUpLink={true}
                                onSignUp={() => alert('Create an account')}
                                splitBackground={{
                                    gradient: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
                                    textColor: "text-white",
                                    companyNameColor: "text-blue-400",
                                    descriptionColor: "text-gray-300",
                                }}
                                leftPanelContent={{
                                    title: (
                                        <div className="space-y-2">
                                            <div className="text-4xl font-bold">Welcome Back</div>
                                            <div className="text-3xl font-bold text-blue-400">to SecureApp</div>
                                        </div>
                                    ),
                                    description: "Enterprise-grade security meets intuitive design. Access your secure workspace with confidence.",
                                    subtitle: "Trusted by 10,000+ security-conscious companies",
                                    features: [
                                        {
                                            text: "Military-grade encryption",
                                            icon: <Shield className="w-5 h-5" />,
                                            iconColor: "text-blue-500",
                                            textClassName: "font-bold text-white",
                                        },
                                        {
                                            text: "Zero-knowledge architecture",
                                            icon: <CheckCircle className="w-5 h-5" />,
                                            iconColor: "text-green-500",
                                            textClassName: "font-bold text-white",
                                        },
                                        {
                                            text: "SOC 2 Type II compliant",
                                            icon: <Award className="w-5 h-5" />,
                                            iconColor: "text-yellow-500",
                                            textClassName: "font-bold text-white",
                                        },
                                        {
                                            text: "99.99% uptime SLA",
                                            icon: <BarChart className="w-5 h-5" />,
                                            iconColor: "text-purple-500",
                                            textClassName: "font-bold text-white",
                                        },
                                    ],
                                    statistics: [
                                        {
                                            value: "10K+",
                                            label: "Companies",
                                            subtext: "Trust our platform",
                                        },
                                        {
                                            value: "99.9%",
                                            label: "Uptime",
                                            subtext: "Guaranteed SLA",
                                        },
                                        {
                                            value: "24/7",
                                            label: "Support",
                                            subtext: "Always available",
                                        },
                                    ],
                                    footerText: (
                                        <div className="text-sm">
                                            <span className="font-bold">© 2024 SecureApp Inc.</span>
                                            <span className="opacity-70 ml-2">• All rights reserved • ISO 27001 Certified</span>
                                        </div>
                                    ),
                                    animationConfig: {
                                        titleDelay: 0.1,
                                        descriptionDelay: 0.2,
                                        featuresDelay: 0.3,
                                        staggerChildren: 0.08,
                                    },
                                }}
                                buttonStyle={{
                                    gradient: "bg-gradient-to-r from-blue-700 to-blue-900",
                                    hoverGradient: "hover:from-blue-800 hover:to-blue-950",
                                    shadow: "shadow-lg shadow-blue-900/50",
                                    hoverShadow: "hover:shadow-xl hover:shadow-blue-900/70",
                                    textColor: "text-white",
                                    className: "font-bold tracking-wide",
                                }}
                            />
                        </div>
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

// Demo 3: Fully Customizable Layout
const FullyCustomizableDemo = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [companyName] = useState('InnovateCorp');
    const [background] = useState('gradient');
    const [showTestimonials] = useState(true);
    const [showStatistics] = useState(true);

    const handleSubmit = async (data: SignInFormData) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert(`Welcome to ${companyName}, ${data.email}!`);
        setIsLoading(false);
    };

    const getBackgroundConfig = () => {
        switch (background) {
            case 'gradient':
                return {
                    gradient: "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950",
                    textColor: "text-white",
                    companyNameColor: "text-pink-300",
                    descriptionColor: "text-indigo-100",
                };
            case 'blue':
                return {
                    gradient: "bg-gradient-to-br from-cyan-700 via-blue-700 to-indigo-800",
                    textColor: "text-white",
                    companyNameColor: "text-cyan-300",
                    descriptionColor: "text-blue-100",
                };
            case 'green':
                return {
                    gradient: "bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800",
                    textColor: "text-white",
                    companyNameColor: "text-emerald-300",
                    descriptionColor: "text-teal-100",
                };
            default:
                return {
                    gradient: "bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700",
                };
        }
    };

    const getCodeString = () => {
        const bgConfig = getBackgroundConfig();
        return `<SignIn
  type="split"
  variant="modern"
  companyName="${companyName}"
  onSubmit={handleSubmit}
  loading={isLoading}
  splitBackground={{
    gradient: "${bgConfig.gradient}",
    textColor: "${bgConfig.textColor}",
    companyNameColor: "${bgConfig.companyNameColor}",
    descriptionColor: "${bgConfig.descriptionColor}",
  }}
  leftPanelContent={{
    hideBranding: false,
    layout: {
      align: "left",
      maxWidth: "max-w-lg",
      animate: true,
    },
    title: (
      <div className="space-y-2">
        <div className="text-4xl font-bold">Welcome Back to</div>
        <div className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
          {companyName}
        </div>
      </div>
    ),
    description: "Experience the future of work with our AI-powered platform...",
    features: [
      {
        text: "AI-powered insights & automation",
        icon: <Zap />,
        iconColor: "bg-gradient-to-br from-yellow-400 to-orange-500",
      },
      {
        text: "Real-time team collaboration",
        icon: <Users />,
        iconColor: "bg-gradient-to-br from-green-400 to-teal-500",
      },
      {
        text: "Global cloud infrastructure",
        icon: <Globe />,
        iconColor: "bg-gradient-to-br from-blue-400 to-cyan-500",
      },
      {
        text: "Enterprise security standards",
        icon: <Shield />,
        iconColor: "bg-gradient-to-br from-purple-400 to-pink-500",
      },
    ],
    ${showStatistics ? `statistics: [
      { value: "15K+", label: "Teams", subtext: "Worldwide" },
      { value: "40%", label: "Faster", subtext: "Productivity gain" },
      { value: "24/7", label: "Support", subtext: "Always online" },
    ],` : ''}
    ${showTestimonials ? `testimonials: [
      {
        quote: "This platform transformed how our engineering team collaborates...",
        author: "Alex Chen",
        role: "CTO, TechStartup"
      },
      {
        quote: "The AI insights have helped us identify bottlenecks we never knew existed...",
        author: "Maria Rodriguez",
        role: "Product Lead, GrowthLabs"
      },
    ],` : ''}
  }}
  buttonStyle={{
    gradient: "bg-gradient-to-r from-pink-600 to-orange-600",
    hoverGradient: "hover:from-pink-700 hover:to-orange-700",
    shadow: "shadow-lg shadow-pink-500/30",
    hoverShadow: "hover:shadow-xl hover:shadow-orange-500/50",
  }}
/>`;
    };

    return (
        <div className="space-y-6">

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="border rounded-lg overflow-hidden">
                        <div className="h-[800px] scale-75 flex items-center justify-center">
                            <SignIn
                                type="split"
                                variant="modern"
                                companyName={companyName}
                                onSubmit={handleSubmit}
                                loading={isLoading}
                                showSocialLogin={true}
                                showForgotPassword={true}
                                showSignUpLink={true}
                                onSignUp={() => alert('Sign up now!')}
                                onGoogleSignIn={() => alert('Google sign-in')}
                                onGitHubSignIn={() => alert('GitHub sign-in')}
                                splitBackground={getBackgroundConfig()}
                                leftPanelContent={{
                                    hideBranding: false,
                                    layout: {
                                        align: "left",
                                        maxWidth: "max-w-lg",
                                        animate: true,
                                    },
                                    title: (
                                        <div className="space-y-2">
                                            <div className="text-4xl font-bold tracking-tight">Welcome Back to</div>
                                            <div className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                                                {companyName}
                                            </div>
                                        </div>
                                    ),
                                    description: "Experience the future of work with our AI-powered platform. Join thousands of innovative teams already transforming their workflow.",
                                    subtitle: "",
                                    features: [
                                        {
                                            text: "AI-powered insights & automation",
                                            icon: <Zap className="w-5 h-5" />,
                                            iconColor: "bg-gradient-to-br from-yellow-400 to-orange-500",
                                            textClassName: "font-bold text-lg text-white",
                                        },
                                        {
                                            text: "Real-time team collaboration",
                                            icon: <Users className="w-5 h-5" />,
                                            iconColor: "bg-gradient-to-br from-green-400 to-teal-500",
                                            textClassName: "font-bold text-lg text-white",
                                        },
                                    ],
                                    statistics: showStatistics ? [
                                        {
                                            value: "15K+",
                                            label: "Teams",
                                            subtext: "Worldwide",
                                        },
                                        {
                                            value: "40%",
                                            label: "Faster",
                                            subtext: "Productivity gain",
                                        },
                                        {
                                            value: "24/7",
                                            label: "Support",
                                            subtext: "Always online",
                                        },
                                    ] : undefined,
                                    testimonials: showTestimonials ? [
                                        {
                                            quote: "This platform transformed how our engineering team collaborates. We're shipping features 2x faster!",
                                            author: "Alex Chen",
                                            role: "CTO, TechStartup",
                                        },
                                    ] : undefined,
                                    footerText: (
                                        <div className="text-sm">
                                            <span className="font-bold">Transform your workflow today • </span>
                                            <span className="opacity-70">No credit card required • Free 14-day trial</span>
                                        </div>
                                    ),
                                    animationConfig: {
                                        titleDelay: 0.2,
                                        descriptionDelay: 0.3,
                                        featuresDelay: 0.4,
                                        staggerChildren: 0.1,
                                    },
                                }}
                                buttonStyle={{
                                    gradient: "bg-gradient-to-r from-pink-600 to-orange-600",
                                    hoverGradient: "hover:from-pink-700 hover:to-orange-700",
                                    shadow: "shadow-lg shadow-pink-500/30",
                                    hoverShadow: "hover:shadow-xl hover:shadow-orange-500/50",
                                    textColor: "text-white",
                                    className: "font-bold text-lg",
                                }}
                            />
                        </div>
                    </div>
                </TabItem>

                <TabItem value="code" label="Code">
                    <div className="mt-4">
                        <CodeBlock language="tsx" className="text-sm">
                            {getCodeString()}
                        </CodeBlock>
                    </div>
                </TabItem>
            </Tabs>

        </div>
    );
};

// Split Backgrounds Demo
const SplitBackgroundsDemo = () => {
    // const [selectedBackgrounds, setSelectedBackgrounds] = useState<string[]>(['nature']);

    // const handleBackgroundChange = (bg: string) => (checked: boolean) => {
    //     setSelectedBackgrounds(prev =>
    //         checked
    //             ? [...prev, bg]
    //             : prev.filter(item => item !== bg)
    //     );
    // };

    const getBackgroundConfig = (bg: string) => {
        switch (bg) {
            case 'nature':
                return {
                    gradient: "bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-600",
                    textColor: "text-white",
                    companyNameColor: "text-emerald-200",
                    descriptionColor: "text-teal-100",
                };
            case 'fire':
                return {
                    gradient: "bg-gradient-to-br from-red-700 via-orange-600 to-yellow-600",
                    textColor: "text-white",
                    companyNameColor: "text-yellow-300",
                    descriptionColor: "text-red-100",
                };
            case 'purple':
                return {
                    gradient: "bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600",
                    textColor: "text-white",
                    companyNameColor: "text-yellow-300",
                    descriptionColor: "text-purple-100",
                };
            case 'ocean':
                return {
                    gradient: "bg-gradient-to-br from-blue-800 via-indigo-700 to-purple-800",
                    textColor: "text-white",
                    companyNameColor: "text-cyan-200",
                    descriptionColor: "text-blue-100",
                };
            default:
                return undefined;
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Split Background Themes</h3>

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="p-6 border rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {splitBackgrounds.filter(bg => bg.value !== 'none').map((background) => (
                                <div key={background.value} className="space-y-3">
                                    <div className="h-[400px] border rounded overflow-hidden">
                                        <SignIn
                                            type="split"
                                            variant="modern"
                                            companyName={background.label}
                                            showSocialLogin={false}
                                            showForgotPassword={false}
                                            showSignUpLink={false}
                                            splitBackground={getBackgroundConfig(background.value)}
                                            buttonStyle={{
                                                gradient: "bg-gradient-to-r from-white to-gray-100",
                                                hoverGradient: "hover:from-gray-100 hover:to-gray-200",
                                                textColor: "text-gray-800",
                                                shadow: "shadow-lg",
                                                hoverShadow: "hover:shadow-xl",
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabItem>

                <TabItem value="code" label="Code">
                    <div className="mt-4">
                        <CodeBlock language="tsx" className="text-sm">
                            {`// Example of a nature-themed split layout
<SignIn 
  type="split"
  variant="modern"
  companyName="NatureCorp"
  splitBackground={{
    gradient: "bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-600",
    textColor: "text-white",
    companyNameColor: "text-emerald-200",
    descriptionColor: "text-teal-100",
  }}
  buttonStyle={{
    gradient: "bg-gradient-to-r from-white to-gray-100",
    hoverGradient: "hover:from-gray-100 hover:to-gray-200",
    textColor: "text-gray-800",
  }}
/>

// Example of a fire-themed split layout
<SignIn 
  type="split"
  variant="modern"
  companyName="FireCorp"
  splitBackground={{
    gradient: "bg-gradient-to-br from-red-700 via-orange-600 to-yellow-600",
    textColor: "text-white",
    companyNameColor: "text-yellow-300",
    descriptionColor: "text-red-100",
  }}
/>

// Example of a purple-themed split layout
<SignIn 
  type="split"
  variant="modern"
  companyName="PurpleCorp"
  splitBackground={{
    gradient: "bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600",
    textColor: "text-white",
    companyNameColor: "text-yellow-300",
    descriptionColor: "text-purple-100",
  }}
/>

// Example of an ocean-themed split layout
<SignIn 
  type="split"
  variant="modern"
  companyName="OceanCorp"
  splitBackground={{
    gradient: "bg-gradient-to-br from-blue-800 via-indigo-700 to-purple-800",
    textColor: "text-white",
    companyNameColor: "text-cyan-200",
    descriptionColor: "text-blue-100",
  }}
/>`}
                        </CodeBlock>
                    </div>
                </TabItem>
            </Tabs>
        </div>
    );
};

// Main export with all demos
export { SignInDemo, CenteredDarkDemo, SplitDarkDemo, FullyCustomizableDemo, SplitBackgroundsDemo };