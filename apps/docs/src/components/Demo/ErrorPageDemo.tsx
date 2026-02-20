import React, { useState } from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import VariantSelector from './VariantSelector';
import {
  ErrorPage,
  ErrorPageErrorCode,
  ErrorPageHeading,
  ErrorPageDesc,
  ErrorPageIllustration,
  ErrorPageContent,
  ErrorPageSearch,
  ErrorPageFooter,
  ErrorPageLinks,
} from '@site/src/components/UI/error-page';
import { ButtonWithIcon } from '@site/src/components/UI/button-with-icon';
import { Home, ArrowLeft } from 'lucide-react';

type ErrorPageVariant = 'default' | 'minimal' | 'gradient' | 'dark';
type AnimationType = 'none' | 'pulse' | 'bounce' | 'glow' | 'shake' | 'rotate';
type IllustrationPosition = 'left' | 'right';

const variants: ErrorPageVariant[] = ['default', 'minimal', 'gradient', 'dark'];

const animationTypes: AnimationType[] = ['none', 'pulse', 'bounce', 'glow', 'shake', 'rotate'];

const illustrationPositions: IllustrationPosition[] = ['left', 'right'];

const ErrorPageDemo = () => {
  const [variant, setVariant] = useState<ErrorPageVariant>('default');
  const [animationType, setAnimationType] = useState<AnimationType>('none');
  const [illustrationPosition, setIllustrationPosition] = useState<IllustrationPosition>('left');
  const [showSearch, setShowSearch] = useState(true);
  const [showIllustration, setShowIllustration] = useState(true);
  const [showBackgroundImage, setShowBackgroundImage] = useState(false);

  const generateCodeString = () => {
    let code = `<ErrorPage variant="${variant}"${showBackgroundImage ? '\n  backgroundImage="https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&h=900&fit=crop&q=90"' : ''}>`;
    
    if (showIllustration) {
      code += `\n  <ErrorPageIllustration\n    position="${illustrationPosition}"\n    illustration="404-1.svg"\n  />`;
    }
    
    code += `\n  <ErrorPageContent>`;
    code += `\n    <ErrorPageErrorCode animationType="${animationType}">404</ErrorPageErrorCode>`;
    code += `\n    <ErrorPageHeading>Page Not Found</ErrorPageHeading>`;
    code += `\n    <ErrorPageDesc>The page you're looking for doesn't exist. It might have been moved, deleted, or the URL might be incorrect.</ErrorPageDesc>`;
    
    if (showSearch) {
      code += `\n    <ErrorPageSearch\n      showSearch={true}\n      searchPlaceholder="Search for something else..."\n    />`;
    }
    
    code += `\n    <ErrorPageLinks direction="row">`;
    code += `\n      <ButtonWithIcon`;
    code += `\n        variant="outline"`;
    code += `\n        size="lg"`;
    code += `\n        icon={<ArrowLeft className="h-4 w-4" />}`;
    code += `\n        iconPosition="left"`;
    code += `\n        onClick={() => window.history.back()}`;
    code += `\n      >`;
    code += `\n        Go back`;
    code += `\n      </ButtonWithIcon>`;
    code += `\n      <ButtonWithIcon`;
    code += `\n        variant="default"`;
    code += `\n        size="lg"`;
    code += `\n        icon={<Home className="h-4 w-4" />}`;
    code += `\n        iconPosition="left"`;
    code += `\n        onClick={() => (window.location.href = "/")}`;
    code += `\n      >`;
    code += `\n        Take me home`;
    code += `\n      </ButtonWithIcon>`;
    code += `\n    </ErrorPageLinks>`;
    code += `\n  </ErrorPageContent>`;
    code += `\n  <ErrorPageFooter>`;
    code += `\n    <p className="text-sm text-slate-500">ERROR 404 · PAGE NOT FOUND</p>`;
    code += `\n  </ErrorPageFooter>`;
    code += `\n</ErrorPage>`;
    
    return code;
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        {!showBackgroundImage && <VariantSelector
          variants={[...variants]}
          selectedVariant={variant}
          onSelectVariant={(v) => setVariant(v as ErrorPageVariant)}
          type="Variant"
        />}
        {!showIllustration && <VariantSelector
          variants={[...animationTypes]}
          selectedVariant={animationType}
          onSelectVariant={(v) =>setAnimationType(v as AnimationType)}
          type="Error Code Animation"
        />}
        {showIllustration && <VariantSelector
          variants={[...illustrationPositions]}
          selectedVariant={illustrationPosition}
          onSelectVariant={(v) => setIllustrationPosition(v as IllustrationPosition)}
          type="Illustration Position"
        />}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showSearch}
              onChange={(e) => setShowSearch(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Show Search</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showIllustration}
              onChange={(e) => setShowIllustration(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Show Illustration</span>
          </label>
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
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="border border-gray-300 rounded-lg overflow-hidden max-h-[600px] overflow-y-auto">
          <div className="p-3">
            <ErrorPage
              variant={variant}
              className="min-h-0"
              {...(showBackgroundImage && {
                backgroundImage:
                  "https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&h=900&fit=crop&q=90",

              })}
            >
              {showIllustration && (
                <ErrorPageIllustration
                  position={illustrationPosition}
                  illustration="/ignix-ui/img/404-1.svg"
                  className="w-90 h-90 mx-auto"
                />
              )}
              <ErrorPageContent>
                {!showIllustration && <ErrorPageErrorCode animationType={animationType}>
                  404
                </ErrorPageErrorCode>}
                <ErrorPageHeading>Page Not Found</ErrorPageHeading>
                <ErrorPageDesc>
                  The page you're looking for doesn't exist. It might have been moved, deleted, or the URL might be incorrect.
                </ErrorPageDesc>
                {showSearch && (
                  <ErrorPageSearch
                    showSearch={true}
                    searchPlaceholder="Search for something else..."
                  />
                )}
                <ErrorPageLinks direction="row">
                  <ButtonWithIcon
                    variant="primary"
                    size="lg"
                    icon={<ArrowLeft className="h-4 w-4" />}
                    iconPosition="left"
                    onClick={() => window.history.back()}
                  >
                    Go back
                  </ButtonWithIcon>
                  <ButtonWithIcon
                    variant="default"
                    size="lg"
                    icon={<Home className="h-4 w-4" />}
                    iconPosition="left"
                    onClick={() => (window.location.href = "/")}
                  >
                    Take me home
                  </ButtonWithIcon>
                </ErrorPageLinks>
              </ErrorPageContent>
              <ErrorPageFooter>
                <p className="text-sm text-slate-500">ERROR 404 · PAGE NOT FOUND</p>
              </ErrorPageFooter>
            </ErrorPage>
            </div>
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock language="tsx" className="whitespace-pre-wrap max-h-[500px] overflow-y-scroll">
            {generateCodeString()}
          </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

const CustomDesignDemo = () => {
  return (
    <div className="space-y-6 mb-8">
      <div>
        <h3 className="text-2xl font-bold mb-4">Custom Design Example</h3>
        <p className="text-muted-foreground mb-6">
          A custom space-themed error page with animated stars background and custom styling.
        </p>
        <Tabs>
          <TabItem value="custom-preview" label="Preview">
            <div className="border border-gray-300 rounded-lg overflow-hidden max-h-[600px] overflow-y-auto">
              <ErrorPage variant="default" className="bg-slate-950 relative overflow-hidden min-h-0">
                {/* Space background with stars */}
                <div className="absolute inset-0 bg-slate-950">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full bg-white"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${Math.random() * 2 + 1}px`,
                        height: `${Math.random() * 2 + 1}px`,
                        opacity: Math.random() * 0.8 + 0.2,
                      }}
                    />
                  ))}
                </div>
                
                {/* Content */}
                <ErrorPageContent>
                  {/* Error Code */}
                  <ErrorPageErrorCode
                    errorCode="404"
                    animationType="bounce"
                    className="text-center text-8xl sm:text-9xl lg:text-[12rem] font-bold text-cyan-400 mb-6 tracking-tight [text-shadow:0_0_20px_rgba(34,211,238,0.5),0_0_40px_rgba(34,211,238,0.3)]"
                  />
                  
                  {/* Illustration - Astronaut GIF */}
                  <ErrorPageIllustration
                    illustration="/ignix-ui/img/error-astranaut.gif"
                    className="w-64 h-64 mx-auto"
                  />
                  
                  {/* Heading */}
                  <ErrorPageHeading
                    title="Lost in space?"
                    className="text-white text-center text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
                  />
                  
                  {/* Description */}
                  <ErrorPageDesc
                    description="The page you're looking for drifted off into the void. Let's get you back on course."
                    className="text-center text-slate-300 mb-8 leading-relaxed text-lg"
                  />
                  
                  {/* Search */}
                  <ErrorPageSearch
                    showSearch={true}
                    searchPlaceholder="Search for something else..."
                  />
                  
                  {/* Navigation Links */}
                  <ErrorPageLinks direction="row">
                    <ButtonWithIcon
                      variant="outline"
                      size="lg"
                      icon={<ArrowLeft className="h-4 w-4" />}
                      iconPosition="left"
                      onClick={() => window.history.back()}
                      className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
                    >
                      Go back
                    </ButtonWithIcon>
                    <ButtonWithIcon
                      variant="default"
                      size="lg"
                      icon={<Home className="h-4 w-4" />}
                      iconPosition="left"
                      onClick={() => (window.location.href = "/")}
                      className="bg-cyan-400 hover:bg-cyan-500 text-slate-950"
                    >
                      Take me home
                    </ButtonWithIcon>
                  </ErrorPageLinks>
                </ErrorPageContent>
                
                {/* Footer */}
                <ErrorPageFooter>
                  <p className="text-sm text-slate-400">ERROR 404 • PAGE NOT FOUND</p>
                </ErrorPageFooter>
              </ErrorPage>
            </div>
          </TabItem>
          <TabItem value="custom-code" label="Code">
            <CodeBlock language="tsx" className="whitespace-pre-wrap max-h-[500px] overflow-y-scroll">
{`<ErrorPage variant="default" className="bg-slate-950 relative overflow-hidden">
  {/* Space background with stars */}
  <div className="absolute inset-0 bg-slate-950">
    {Array.from({ length: 100 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white"
        style={{
          left: \`\${Math.random() * 100}%\`,
          top: \`\${Math.random() * 100}%\`,
          width: \`\${Math.random() * 2 + 1}px\`,
          height: \`\${Math.random() * 2 + 1}px\`,
          opacity: Math.random() * 0.8 + 0.2,
        }}
      />
    ))}
  </div>
  
  {/* Content */}
  <ErrorPageContent>
    {/* Error Code */}
    <ErrorPageErrorCode
      errorCode="404"
      animationType="bounce"
      className="text-center text-8xl sm:text-9xl lg:text-[12rem] font-bold text-cyan-400 mb-6 tracking-tight [text-shadow:0_0_20px_rgba(34,211,238,0.5),0_0_40px_rgba(34,211,238,0.3)]"
    />
    
    {/* Illustration - Astronaut GIF */}
    <ErrorPageIllustration
      illustration="error-astranaut.gif"
      className="w-64 h-64 mx-auto"
    />
    
    {/* Heading */}
    <ErrorPageHeading
      title="Lost in space?"
      className="text-white text-center text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
    />
    
    {/* Description */}
    <ErrorPageDesc
      description="The page you're looking for drifted off into the void. Let's get you back on course."
      className="text-center text-slate-300 mb-8 leading-relaxed text-lg"
    />
    
    {/* Search */}
    <ErrorPageSearch
      showSearch={true}
      searchPlaceholder="Search for something else..."
    />
    
    {/* Navigation Links */}
    <ErrorPageLinks direction="row">
      <ButtonWithIcon
        variant="outline"
        size="lg"
        icon={<ArrowLeft className="h-4 w-4" />}
        iconPosition="left"
        onClick={() => window.history.back()}
        className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
      >
        Go back
      </ButtonWithIcon>
      <ButtonWithIcon
        variant="default"
        size="lg"
        icon={<Home className="h-4 w-4" />}
        iconPosition="left"
        onClick={() => (window.location.href = "/")}
        className="bg-cyan-400 hover:bg-cyan-500 text-slate-950"
      >
        Take me home
      </ButtonWithIcon>
    </ErrorPageLinks>
  </ErrorPageContent>
  
  {/* Footer */}
  <ErrorPageFooter>
    <p className="text-sm text-slate-400">ERROR 404 • PAGE NOT FOUND</p>
  </ErrorPageFooter>
</ErrorPage>`}
            </CodeBlock>
          </TabItem>
        </Tabs>
      </div>
    </div>
  );
};

export {ErrorPageDemo, CustomDesignDemo};

