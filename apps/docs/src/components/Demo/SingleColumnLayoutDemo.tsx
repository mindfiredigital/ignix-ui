import React, { useState } from 'react';
import { SingleColumnLayout } from '@site/src/components/UI/single-column-layout';
// import { Button } from '@site/src/components/UI/button';
import VariantSelector from './VariantSelector';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import { Card } from '@site/src/components/UI/card';

const layoutVariants = ['default', 'glass', 'gradient', 'transparent', 'modern'];
const animations = ['none', 'fade', 'slide', 'scale'];

const SingleColumnLayoutDemo = () => {
    const [variant, setVariant] = useState('default');
    const [animation, setAnimation] = useState('fade');
    // const [stickyHeader, setStickyHeader] = useState(true);
    // const [stickyFooter, setStickyFooter] = useState(false);

    const navLinks = [
        { label: "Home", href: "#" },
        { label: "Features", href: "#" },
        { label: "Pricing", href: "#" },
        { label: "Contact", href: "#" },
    ];

    const mainContent = (
        <div className="space-y-6">
            <div className="text-center py-8">
                <h1 className="text-4xl font-bold mb-4">Welcome to Single Column Layout</h1>
                <p className="text-lg text-muted-foreground max-w-full mx-auto">
                    A clean, responsive layout perfect for marketing pages, documentation sites,
                    and applications that need a simple yet powerful layout solution.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <Card className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-blue-600 text-xl font-bold">1</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Responsive Design</h3>
                    <p className="text-sm text-muted-foreground">
                        Optimized for all screen sizes with mobile-first approach
                    </p>
                </Card>

                <Card className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-green-600 text-xl font-bold">2</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Multiple Variants</h3>
                    <p className="text-sm text-muted-foreground">
                        Choose from 8 different theme variants to match your brand
                    </p>
                </Card>

                <Card className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <span className="text-purple-600 text-xl font-bold">3</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Smooth Animations</h3>
                    <p className="text-sm text-muted-foreground">
                        Beautiful entrance animations for enhanced user experience
                    </p>
                </Card>
            </div>

            {/* <div className="max-w-4xl mx-auto">
                <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Current Configuration</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Variant:</span>
                            <div className="text-muted-foreground capitalize">{variant}</div>
                        </div>
                        <div>
                            <span className="font-medium">Animation:</span>
                            <div className="text-muted-foreground capitalize">{animation}</div>
                        </div>
                        <div>
                            <span className="font-medium">Sticky Header:</span>
                            <div className="text-muted-foreground">{stickyHeader ? 'Yes' : 'No'}</div>
                        </div>
                        <div>
                            <span className="font-medium">Sticky Footer:</span>
                            <div className="text-muted-foreground">{stickyFooter ? 'Yes' : 'No'}</div>
                        </div>
                    </div>
                </Card>
            </div> */}

            {/* <div className="max-w-4xl mx-auto">
                <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Interactive Demo</h3>
                    <p className="mb-4 text-muted-foreground">
                        Try the different configuration options above to see how the layout adapts.
                        The SingleColumnLayout provides a flexible foundation for your content.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Button variant="outline" size="sm">Learn More</Button>
                        <Button variant="default" size="sm">Get Started</Button>
                        <Button variant="ghost" size="sm">View Documentation</Button>
                    </div>
                </Card>
            </div> */}

            {/* <div className="max-w-4xl mx-auto">
                <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Content Flexibility</h3>
                    <p className="text-muted-foreground mb-4">
                        The layout maintains a consistent max-width while allowing full-width backgrounds.
                        This creates a balanced reading experience with visual impact.
                    </p>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                        <p className="text-center font-medium">
                            Full-width background sections work perfectly within the constrained content area
                        </p>
                    </div>
                </Card>
            </div> */}
        </div>
    );

    const codeString = `
<SingleColumnLayout
  variant="${variant}"
  animation="${animation}"
  stickyHeader={true}
  stickyFooter={false}
  navLinks={[
    { label: "Home", href: "#" },
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Contact", href: "#" }
  ]}
  showAuthControls={true}
  activeNavLink="#"
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

    return (
        <div className="space-y-6 mb-8">
            <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
                <VariantSelector
                    variants={layoutVariants}
                    selectedVariant={variant}
                    onSelectVariant={setVariant}
                    type="Variant"
                />
                <VariantSelector
                    variants={animations}
                    selectedVariant={animation}
                    onSelectVariant={setAnimation}
                    type="Animation"
                />
                {/* <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={stickyHeader}
                            onChange={(e) => setStickyHeader(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        Sticky Header
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={stickyFooter}
                            onChange={(e) => setStickyFooter(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        Sticky Footer
                    </label>
                </div> */}
            </div>

            <Tabs>
                <TabItem value="preview" label="Preview">
                    <div className="border rounded-lg overflow-hidden">
                        <SingleColumnLayout
                            variant={variant as any}
                            animation={animation as any}
                            stickyHeader={true}
                            stickyFooter={false}
                            navLinks={navLinks}
                            showAuthControls={true}
                            activeNavLink="#"
                        >
                            {mainContent}
                        </SingleColumnLayout>
                    </div>
                </TabItem>
                <TabItem value="code" label="Code">
                    <CodeBlock language="tsx" className="whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                        {codeString}
                    </CodeBlock>
                </TabItem>
            </Tabs>
        </div>
    );
};

export default SingleColumnLayoutDemo;