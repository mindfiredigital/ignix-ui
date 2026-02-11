
import React, { useState } from 'react';
import { SingleColumnLayout } from '@site/src/components/UI/single-column-layout';
import { Button } from '@site/src/components/UI/button';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Card } from '@site/src/components/UI/card';
import { Home, Search, Bell, User, Shield, Globe, Mail, Phone, MapPin } from 'lucide-react';


const SingleColumnLayoutDemo = () => {
    const [customizationType, setCustomizationType] = useState('basic');

    const handleNavClick = (_href, _label) => {
        // console.log(`Navigating to ${label}: ${href}`);
    };

    const handleSignIn = () => {
        // console.log("Sign in clicked");
        alert("Sign In clicked!");
    };

    const handleSignUp = () => {
        // console.log("Sign up clicked");
        alert("Sign Up clicked!");
    };

    // Custom Logo Component
    const CustomLogo = (
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
                <div className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    CustomBrand
                </div>
                <div className="text-xs text-slate-500">Premium Service</div>
            </div>
        </div>
    );

    // Custom Navigation Links with Icons
    const customNavLinks = [
        { label: "Home", href: "#", icon: <Home className="w-4 h-4" /> },
        { label: "Discover", href: "#", icon: <Search className="w-4 h-4" /> },
        { label: "Notifications", href: "#", icon: <Bell className="w-4 h-4" /> },
        { label: "Profile", href: "#", icon: <User className="w-4 h-4" /> },
    ];

    // Custom Auth Components
    const customAuthComponents = {
        signIn: (
            <Button variant="ghost" size="sm" className="text-slate-700" onClick={handleSignIn}>
                <User className="w-4 h-4 mr-2" />
                Login
            </Button>
        ),
        signUp: (
            <Button
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={handleSignUp}
            >
                Get Started Free
            </Button>
        ),
    };

    // Custom Footer Content
    const customFooterContent = (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto py-8">
            <div>
                <h3 className="font-bold text-lg mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white">About Us</a></li>
                    <li><a href="#" className="hover:text-white">Careers</a></li>
                    <li><a href="#" className="hover:text-white">Press</a></li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold text-lg mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white">Help Center</a></li>
                    <li><a href="#" className="hover:text-white">Community</a></li>
                    <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold text-lg mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold text-lg mb-4">Connect</h3>
                <div className="flex space-x-4">
                    <Globe className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                    <Mail className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                    <Phone className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                    <MapPin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                </div>
            </div>
        </div>
    );

    // Content Wrapper Example
    const contentWrapper = (children) => (
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/50" />
            <div className="relative z-10">{children}</div>
        </div>
    );

    const mainContent = (
        <div className="space-y-8">
            <div className="text-center py-8">
                <h1 className="text-4xl font-bold mb-4">Welcome to Single Column Layout</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    A clean, responsive layout perfect for marketing pages, documentation sites,
                    and applications that need a simple yet powerful layout solution.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-blue-600 text-xl font-bold">1</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Responsive Design</h3>
                    <p className="text-sm text-muted-foreground">
                        Optimized for all screen sizes with mobile-first approach
                    </p>
                </Card>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-green-600 text-xl font-bold">2</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Multiple Variants</h3>
                    <p className="text-sm text-muted-foreground">
                        Choose from 8 different theme variants to match your brand
                    </p>
                </Card>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-purple-600 text-xl font-bold">3</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Smooth Animations</h3>
                    <p className="text-sm text-muted-foreground">
                        Beautiful entrance animations for enhanced user experience
                    </p>
                </Card>
            </div>

            <div className="max-w-4xl mx-auto">
                <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Current Configuration</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Variant:</span>
                            <div className="text-muted-foreground capitalize">default</div>
                        </div>
                        <div>
                            <span className="font-medium">Animation:</span>
                            <div className="text-muted-foreground capitalize">fade</div>
                        </div>
                        <div>
                            <span className="font-medium">Customization:</span>
                            <div className="text-muted-foreground capitalize">{customizationType}</div>
                        </div>
                        <div>
                            <span className="font-medium">Active Link:</span>
                            <div className="text-muted-foreground">"Home"</div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="max-w-4xl mx-auto">
                <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Customization Options</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Button
                            variant={customizationType === 'basic' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCustomizationType('basic')}
                        >
                            Basic
                        </Button>
                        <Button
                            variant={customizationType === 'header' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCustomizationType('header')}
                        >
                            Custom Header
                        </Button>
                        <Button
                            variant={customizationType === 'footer' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCustomizationType('footer')}
                        >
                            Custom Footer
                        </Button>
                        <Button
                            variant={customizationType === 'full' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCustomizationType('full')}
                        >
                            Full Custom
                        </Button>
                    </div>
                    <p className="text-muted-foreground">
                        {customizationType === 'basic' && 'Using default configuration with basic props.'}
                        {customizationType === 'header' && 'Custom logo, navigation links, and auth components.'}
                        {customizationType === 'footer' && 'Custom footer with multiple sections and links.'}
                        {customizationType === 'full' && 'Full customization with content wrapper and callbacks.'}
                    </p>
                </Card>
            </div>
        </div>
    );

    const layoutProps = {
        variant: 'default' as any,
        animation: 'fade' as any,
        stickyHeader: true,
        stickyFooter: false,
        onNavLinkClick: handleNavClick,
        onSignInClick: handleSignIn,
        onSignUpClick: handleSignUp,
        children: mainContent,
        activeNavLink: "#",
    };

    // Apply customization based on selected type
    if (customizationType === 'header') {
        Object.assign(layoutProps, {
            logo: CustomLogo,
            navLinks: customNavLinks,
            authComponents: customAuthComponents,
            className: {
                header: "shadow-lg",
                main: "pt-12",
            },
        });
    } else if (customizationType === 'footer') {
        Object.assign(layoutProps, {
            variant: 'dark' as any,
            footerContent: customFooterContent,
            showFooter: true,
            stickyFooter: true,
        });
    } else if (customizationType === 'full') {
        Object.assign(layoutProps, {
            variant: 'transparent' as any,
            logo: CustomLogo,
            navLinks: customNavLinks,
            authComponents: customAuthComponents,
            footerContent: customFooterContent,
            contentWrapper: contentWrapper,
            className: {
                root: "bg-gradient-to-br from-blue-50 to-indigo-100",
                header: "shadow-none border-none",
            },
        });
    }

    const generateCodeString = () => {
        const baseCode = `
<SingleColumnLayout
  variant="default"
  animation="fade"
  stickyHeader={true}
  stickyFooter={false}
  activeNavLink="#"
  onNavLinkClick={handleNavClick}
  onSignInClick={handleSignIn}
  onSignUpClick={handleSignUp}`;

        let customizationCode = '';

        if (customizationType === 'header') {
            customizationCode = `
  logo={${JSON.stringify(CustomLogo, null, 2)}}
  navLinks={${JSON.stringify(customNavLinks.map(l => ({ label: l.label, href: l.href })), null, 2)}}
  authComponents={{
    signIn: ${JSON.stringify(customAuthComponents.signIn.props, null, 2)},
    signUp: ${JSON.stringify(customAuthComponents.signUp.props, null, 2)}
  }}
  className={{
    header: "shadow-lg",
    main: "pt-12"
  }}`;
        } else if (customizationType === 'footer') {
            customizationCode = `
  footerContent={${JSON.stringify(customFooterContent.props, null, 2)}}
  showFooter={true}
  stickyFooter={true}`;
        } else if (customizationType === 'full') {
            customizationCode = `
  logo={${JSON.stringify(CustomLogo, null, 2)}}
  navLinks={${JSON.stringify(customNavLinks.map(l => ({ label: l.label, href: l.href })), null, 2)}}
  authComponents={{
    signIn: ${JSON.stringify(customAuthComponents.signIn.props, null, 2)},
    signUp: ${JSON.stringify(customAuthComponents.signUp.props, null, 2)}
  }}
  footerContent={${JSON.stringify(customFooterContent.props, null, 2)}}
  contentWrapper={(children) => (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/50" />
      <div className="relative z-10">{children}</div>
    </div>
  )}
  className={{
    root: "bg-gradient-to-br from-blue-50 to-indigo-100",
    header: "shadow-none border-none"
  }}`;
        }

        const contentCode = `
>
  <div className="space-y-6">
    {/* Your content here */}
    <div className="text-center py-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Single Column Layout</h1>
      <p className="text-lg text-muted-foreground">
        A clean, responsive layout for modern web applications
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Feature cards and content */}
    </div>
  </div>
</SingleColumnLayout>`;

        return baseCode + customizationCode + contentCode;
    };

    return (
        <div className="space-y-6 mb-8">
            <Tabs groupId="demo-tabs">
                <TabItem value="preview" label="Preview" default>
                    <div className="h-[800px] overflow-y-auto border rounded-lg overflow-hidden shadow-lg">
                        <SingleColumnLayout {...layoutProps} />
                    </div>
                </TabItem>
                <TabItem value="code" label="Code">
                    <CodeBlock language="tsx" className="whitespace-pre-wrap max-h-[500px] overflow-y-auto text-sm">
                        {generateCodeString()}
                    </CodeBlock>
                </TabItem>
                <TabItem value="props" label="Available Props">
                    <div className="space-y-4">
                        <Card className="p-4">
                            <h4 className="font-bold mb-2">Slot Customization</h4>
                            <ul className="text-sm space-y-1">
                                <li><code>header</code>: Replace entire header</li>
                                <li><code>footer</code>: Replace entire footer</li>
                                <li><code>children</code>: Main content area</li>
                            </ul>
                        </Card>

                        <Card className="p-4">
                            <h4 className="font-bold mb-2">Configuration Props</h4>
                            <ul className="text-sm space-y-1">
                                <li><code>logo</code>: Custom logo component</li>
                                <li><code>navLinks</code>: Array of navigation links</li>
                                <li><code>authComponents</code>: Custom auth buttons</li>
                                <li><code>footerContent</code>: Custom footer content</li>
                                <li><code>className</code>: Object with classes for each section</li>
                            </ul>
                        </Card>

                        <Card className="p-4">
                            <h4 className="font-bold mb-2">Render Functions</h4>
                            <ul className="text-sm space-y-1">
                                <li><code>renderHeader</code>: Function to render custom header layout</li>
                                <li><code>renderFooter</code>: Function to render custom footer layout</li>
                                <li><code>contentWrapper</code>: Function to wrap main content</li>
                            </ul>
                        </Card>

                        <Card className="p-4">
                            <h4 className="font-bold mb-2">Event Callbacks</h4>
                            <ul className="text-sm space-y-1">
                                <li><code>onNavLinkClick</code>: When navigation link is clicked</li>
                                <li><code>onSignInClick</code>: When sign in button is clicked</li>
                                <li><code>onSignUpClick</code>: When sign up button is clicked</li>
                            </ul>
                        </Card>
                    </div>
                </TabItem>
            </Tabs>
        </div>
    );
};

export default SingleColumnLayoutDemo;