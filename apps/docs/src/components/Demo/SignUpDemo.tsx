import React, { useState } from 'react';
import { SignUp, type SignUpFormData } from '@site/src/components/UI/sign-up';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Shield, BarChart, Award, CheckCircle } from 'lucide-react';


// Demo : Centered Dark Theme
const CenteredDarkDemo = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [requireEmailConfirmation, setRequireEmailConfirmation] = useState(true);

    const handleSubmit = async (data: SignUpFormData) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (!showError) {
            alert(`Welcome ${data.firstName}! Your account has been created.`);
        }

        setIsLoading(false);
    };

    const codeString = `
const handleSubmit = async (data) => {
    console.log('Registration data:', data);
    // Your registration logic here
    console.log('firstName:', data.firstName);
    console.log('lastName:', data.lastName);
    console.log('email:', data.email);
    console.log('password:', data.password);
};

<SignUp
  type="centered"
  variant="dark"
  companyName="DarkCorp"
  requireEmailConfirmation={${requireEmailConfirmation}}
  onSubmit={handleSubmit}
  onGoogleSignUp={() => console.log('Google sign-up')}
  onGitHubSignUp={() => console.log('GitHub sign-up')}
  onMicrosoftSignUp={() => console.log('Microsoft sign-up')}
  loading={isLoading}
  error={showError ? 'Please check your information' : ''}
  showSocialSignUp={true}
  showLoginLink={true}
  onLogin={() => console.log('Navigate to login')}
  passwordStrength={{
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    showStrengthMeter: true,
  }}
  buttonStyle={{
    gradient: "bg-gradient-to-r from-green-700 to-emerald-800",
    hoverGradient: "hover:from-green-800 hover:to-emerald-900",
    shadow: "shadow-lg shadow-green-900/30",
    hoverShadow: "hover:shadow-xl hover:shadow-emerald-900/50",
    className: "font-bold",
  }}
/>`;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
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
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={requireEmailConfirmation}
                            onChange={(e) => setRequireEmailConfirmation(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        Email Confirmation
                    </label>
                </div>
            </div>

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="border rounded-lg overflow-hidden">
                        <div className="h-[1000px] scale-80 flex items-center justify-center">
                            <SignUp
                                type="centered"
                                variant="dark"
                                companyName="DarkCorp"
                                onSubmit={handleSubmit}
                                onGoogleSignUp={() => alert('Google sign-up clicked')}
                                onGitHubSignUp={() => alert('GitHub sign-up clicked')}
                                onMicrosoftSignUp={() => alert('Microsoft sign-up clicked')}
                                onLogin={() => alert('Navigate to login')}
                                loading={isLoading}
                                error={showError ? 'Please check your information and try again.' : ''}
                                showSocialSignUp={true}
                                showLoginLink={true}
                                requireEmailConfirmation={requireEmailConfirmation}
                                passwordStrength={{
                                    minLength: 8,
                                    requireUppercase: true,
                                    requireLowercase: true,
                                    requireNumbers: true,
                                    requireSpecialChars: true,
                                    showStrengthMeter: true,
                                }}
                                buttonStyle={{
                                    gradient: "bg-gradient-to-r from-green-700 to-emerald-800",
                                    hoverGradient: "hover:from-green-800 hover:to-emerald-900",
                                    shadow: "shadow-lg shadow-green-900/30",
                                    hoverShadow: "hover:shadow-xl hover:shadow-emerald-900/50",
                                    className: "font-bold",
                                }}
                                termsConfig={{
                                    onTermsClick: () => alert('Viewing Terms & Conditions'),
                                    onPrivacyClick: () => alert('Viewing Privacy Policy'),
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

// Demo : Split Dark Theme
const SplitDarkDemo = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: SignUpFormData) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert(`Welcome to SecureApp, ${data.firstName}! Your enterprise account is being created.`);
        setIsLoading(false);
    };

    const codeString = `<SignUp
  type="split"
  variant="dark"
  companyName="SecureApp"
  requireEmailConfirmation={false}
  onSubmit={handleSubmit}
  showSocialSignUp={true}
  loading={isLoading}
  splitBackground={{
    gradient: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
    textColor: "text-white",
    companyNameColor: "text-emerald-400",
    descriptionColor: "text-gray-300",
  }}
  leftPanelContent={{
    title: "Join Our Secure Platform",
    description: "Enterprise-grade security meets intuitive design. Create your account to access exclusive features.",
    subtitle: "Trusted by 10,000+ security-conscious companies",
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
  passwordStrength={{
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    showStrengthMeter: true,
    strengthLabels: {
      weak: "Too Weak",
      medium: "Medium",
      strong: "Strong"
    }
  }}
  buttonStyle={{
    gradient: "bg-gradient-to-r from-emerald-700 to-emerald-900",
    hoverGradient: "hover:from-emerald-800 hover:to-emerald-950",
    shadow: "shadow-lg shadow-emerald-900/50",
    hoverShadow: "hover:shadow-xl hover:shadow-emerald-900/70",
  }}
/>`;

    return (
        <div className="space-y-6">
            {/* <div className="flex justify-end mb-2">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={requireEmailConfirmation}
                        onChange={(e) => setRequireEmailConfirmation(e.target.checked)}
                        className="rounded border-gray-300"
                    />
                    Require Email Confirmation
                </label>
            </div> */}

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="border rounded-lg overflow-hidden">
                        <div className="h-[750px] overflow-y-auto flex items-center justify-center">
                            <SignUp
                                type="split"
                                variant="dark"
                                companyName="SecureApp"
                                onSubmit={handleSubmit}
                                onGoogleSignUp={() => alert('Google sign-up clicked')}
                                onGitHubSignUp={() => alert('GitHub sign-up clicked')}
                                onLogin={() => alert('Already have an account?')}
                                loading={isLoading}
                                showSocialSignUp={true}
                                showLoginLink={true}
                                requireEmailConfirmation={false}
                                splitBackground={{
                                    gradient: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
                                    textColor: "text-white",
                                    companyNameColor: "text-emerald-400",
                                    descriptionColor: "text-gray-300",
                                }}
                                leftPanelContent={{
                                    title: (
                                        <div className="space-y-2">
                                            <div className="text-4xl font-bold">Join Our</div>
                                            <div className="text-3xl font-bold text-emerald-400">Secure Platform</div>
                                        </div>
                                    ),
                                    description: "Enterprise-grade security meets intuitive design. Create your account to access exclusive features and join thousands of security-conscious companies.",
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
                                passwordStrength={{
                                    minLength: 12,
                                    requireUppercase: true,
                                    requireLowercase: true,
                                    requireNumbers: true,
                                    requireSpecialChars: true,
                                    showStrengthMeter: true,
                                    strengthLabels: {
                                        weak: "Too Weak",
                                        medium: "Medium",
                                        strong: "Strong"
                                    }
                                }}
                                buttonStyle={{
                                    gradient: "bg-gradient-to-r from-emerald-700 to-emerald-900",
                                    hoverGradient: "hover:from-emerald-800 hover:to-emerald-950",
                                    shadow: "shadow-lg shadow-emerald-900/50",
                                    hoverShadow: "hover:shadow-xl hover:shadow-emerald-900/70",
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

// Demo : Complete Registration with CAPTCHA
const CompleteRegistrationDemo = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showCaptcha, setShowCaptcha] = useState(true);
    const [captchaVerified, setCaptchaVerified] = useState(false);

    const handleSubmit = async (data: SignUpFormData) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (showCaptcha && !captchaVerified) {
            alert('Please complete the CAPTCHA verification.');
            setIsLoading(false);
            return;
        }

        alert(`Registration complete! Welcome ${data.firstName}. Check your email to verify your account.`);
        setIsLoading(false);
    };

    const handleCaptchaVerify = (_token: string) => {
        // console.log('CAPTCHA token:', token);
        setCaptchaVerified(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">Complete Registration with CAPTCHA</div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showCaptcha}
                            onChange={(e) => setShowCaptcha(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        Enable CAPTCHA
                    </label>
                </div>
            </div>

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="border rounded-lg overflow-hidden">
                        <div className="h-[800px] scale-85 flex items-center justify-center">
                            <SignUp
                                type="centered"
                                variant="dark"
                                companyName="SecurePortal"
                                requireEmailConfirmation={false}
                                onSubmit={handleSubmit}
                                loading={isLoading}
                                showSocialSignUp={true}
                                showLoginLink={true}
                                onLogin={() => alert('Navigate to login')}
                                passwordStrength={{
                                    minLength: 8,
                                    requireUppercase: true,
                                    requireLowercase: true,
                                    requireNumbers: true,
                                    requireSpecialChars: true,
                                    showStrengthMeter: false,
                                }}
                                captchaConfig={showCaptcha ? {
                                    enabled: true,
                                    siteKey: "demo-site-key",
                                    type: "checkbox",
                                    theme: "light",
                                    size: "normal",
                                    onVerify: handleCaptchaVerify,
                                } : undefined}
                                termsConfig={{
                                    termsText: "By creating an account, you agree to our Terms and Privacy Policy",
                                    onTermsClick: () => alert('Viewing Terms & Conditions'),
                                    onPrivacyClick: () => alert('Viewing Privacy Policy'),
                                }}
                                buttonStyle={{
                                    gradient: "bg-gradient-to-r from-blue-600 to-indigo-600",
                                    hoverGradient: "hover:from-blue-700 hover:to-indigo-700",
                                    shadow: "shadow-lg shadow-blue-200",
                                    hoverShadow: "hover:shadow-xl hover:shadow-blue-300",
                                    className: "font-bold",
                                }}
                            />
                        </div>
                    </div>
                </TabItem>

                <TabItem value="code" label="Code">
                    <div className="mt-4">
                        <CodeBlock language="tsx" className="text-sm">
                            {`<SignUp
  type="centered"
  variant="modern"
  companyName="SecurePortal"
  requireEmailConfirmation={false}
  onSubmit={handleSubmit}
  loading={isLoading}
  showSocialSignUp={true}
  showLoginLink={true}
  onLogin={() => console.log('Navigate to login')}
  passwordStrength={{
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    showStrengthMeter: false,
  }}
  captchaConfig={{
    enabled: ${showCaptcha},
    siteKey: "your-site-key",
    type: "checkbox",
    theme: "light",
    size: "normal",
    onVerify: (token) => console.log('CAPTCHA verified:', token),
  }}
  termsConfig={{
    termsText: "By creating an account, you agree to our Terms and Privacy Policy",
    onTermsClick: () => console.log('Viewing Terms & Conditions'),
    onPrivacyClick: () => console.log('Viewing Privacy Policy'),
  }}
  buttonStyle={{
    gradient: "bg-gradient-to-r from-blue-600 to-indigo-600",
    hoverGradient: "hover:from-blue-700 hover:to-indigo-700",
    shadow: "shadow-lg shadow-blue-200",
    hoverShadow: "hover:shadow-xl hover:shadow-blue-300",
    className: "font-bold",
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
export {
    CenteredDarkDemo,
    SplitDarkDemo,
    CompleteRegistrationDemo
};