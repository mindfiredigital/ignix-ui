// error-page.stories.tsx

import { ErrorPage, ErrorPageHead, ErrorPageErrorCode, ErrorPageHeading, ErrorPageDesc, ErrorPageIllustration, ErrorPageContent, ErrorPageSearch, ErrorPageFooter, ErrorPageLinks } from "./";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonWithIcon } from "../../../components/button-with-icon";
import {
  Home,
  FileQuestion,
  ArrowLeft,
} from "lucide-react";

const meta: Meta<typeof ErrorPage> = {
  title: "Templates/Pages/ErrorPage",
  component: ErrorPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A composable error page component with sub-components. Use `<ErrorPage>`, `<ErrorPageHead>`, `<ErrorPageIllustration>`, `<ErrorPageContent>`, and `<ErrorPageFooter>` to build custom error pages.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ErrorPage>;

// ============================================================================
// COMPOSABLE API EXAMPLES
// ============================================================================

/**
 * Basic usage with composable API.
 * Use ErrorPageHead, ErrorPageIllustration, and ErrorPageContent.
 */
export const Basic: Story = {
  render: () => (
    <ErrorPage variant="default">
      <ErrorPageContent>
        <ErrorPageErrorCode>404</ErrorPageErrorCode>
        <ErrorPageHeading>Lost in Space</ErrorPageHeading>
        <ErrorPageDesc>The page you're looking for drifted off into the void. Let's get you back on course.</ErrorPageDesc>
      
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
      
      {/* Footer */}
      <ErrorPageFooter>
        <p className="text-sm text-slate-500">ERROR 404 · PAGE NOT FOUND</p>
      </ErrorPageFooter>
    </ErrorPage>
  ),
};

export const CustomDesign: Story = {
  render: () => (
    <ErrorPage variant="default" className="bg-slate-950 relative overflow-hidden">
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
    </ErrorPage>
  ),
};

/**
 * Custom illustration using React component.
 */
export const WithBackgroundImage: Story = {
  render: () => (
    <ErrorPage backgroundImage="https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&h=900&fit=crop&q=90">
      <ErrorPageContent>
        <ErrorPageHead>
          <ErrorPageErrorCode>404</ErrorPageErrorCode>
          <ErrorPageHeading>Welcome to lost map page.</ErrorPageHeading>
          <ErrorPageDesc>The page /this-page-does-not-exist doesn't exist or has been moved. Let's get you back on track.</ErrorPageDesc>
        </ErrorPageHead>
        <ErrorPageSearch />
        <ErrorPageLinks direction="row">
          <ButtonWithIcon
            variant="default"
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
    </ErrorPage>
  ),
};

/**
 * Image URL as illustration.
 */
export const WithIllustration: Story = {
  render: () => (
    <ErrorPage variant="default">
      <ErrorPageIllustration
        position="left"
        illustration="404-1.svg"
      />
      <ErrorPageContent>
        <ErrorPageHeading>OOPS... PAGE NOT FOUND</ErrorPageHeading>
        <ErrorPageDesc>The page you're looking for doesn't exist. It might have been moved, deleted, or the URL might be incorrect.</ErrorPageDesc>
        <ErrorPageSearch
          showSearch={true}
          searchPlaceholder="Search for something else..."
        />
        <ErrorPageLinks direction="row">
          <ButtonWithIcon
            variant="outline"
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
    </ErrorPage>
  ),
};

/**
 * Illustration positioned at left.
 */
export const IllustrationRight: Story = {
  render: () => (
    <ErrorPage variant="default">
      <ErrorPageIllustration 
        position="right"
        illustration="404-2.png"
      />
      <ErrorPageContent>
        <ErrorPageErrorCode>404</ErrorPageErrorCode>
        <ErrorPageHeading>Page Not Found</ErrorPageHeading>
        <ErrorPageDesc>The requested page could not be found.</ErrorPageDesc>
        <ErrorPageSearch
          showSearch={true}
          searchPlaceholder="Search for something else..."
        />
        <ErrorPageLinks direction="row">
          <ButtonWithIcon
            variant="outline"
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
    </ErrorPage>
  ),
};

/**
 * Illustration positioned at right.
 */
export const DarkVariant: Story = {
  render: () => (
    <ErrorPage variant="dark">
      <ErrorPageIllustration 
        position="right"
        illustration="404-1.svg"
      />
      <ErrorPageContent>
        <ErrorPageErrorCode>404</ErrorPageErrorCode>
        <ErrorPageHeading>Page Not Found</ErrorPageHeading>
        <ErrorPageDesc>The requested page could not be found.</ErrorPageDesc>
        <ErrorPageSearch
          showSearch={true}
          searchPlaceholder="Search for something else..."
        />
        <ErrorPageLinks direction="row">
          <ButtonWithIcon
            variant="default"
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
    </ErrorPage>
  ),
};


/**
 * Completely custom using children in all components.
 */
export const WithCustomIcon: Story = {
  render: () => (
    <ErrorPage variant="dark">
      <ErrorPageIllustration>
        <FileQuestion className="h-48 w-48 text-purple-300" />
      </ErrorPageIllustration>
      <ErrorPageHead>
          <ErrorPageErrorCode className="text-9xl font-bold text-purple-400">404</ErrorPageErrorCode>
          <ErrorPageHeading className="text-5xl font-bold">Oops! This Page Got Lost</ErrorPageHeading>
          <ErrorPageDesc className="text-xl text-white">
            Don't worry, even the best explorers sometimes take a wrong turn.
          </ErrorPageDesc>
      </ErrorPageHead>
      <ErrorPageContent>
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
    </ErrorPage>
  ),
};

/**
 * Showcase all animation types for error code.
 */
export const ErrorCodeAnimations: Story = {
  name: "Error Code Animation Types",
  render: () => (
    <div className="space-y-16 p-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Error Code Animation Types</h2>
        <p className="text-muted-foreground">Different animation styles for error codes</p>
      </div>

      {/* Pulse Animation */}
      <ErrorPage variant="default" className="min-h-[300px]">
        <ErrorPageContent>
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-2">Pulse (Default)</h3>
            <ErrorPageErrorCode animationType="pulse">404</ErrorPageErrorCode>
          </div>
        </ErrorPageContent>
      </ErrorPage>

      {/* Bounce Animation */}
      <ErrorPage variant="default" className="min-h-[300px]">
        <ErrorPageContent>
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-2">Bounce</h3>
            <ErrorPageErrorCode animationType="bounce">404</ErrorPageErrorCode>
          </div>
        </ErrorPageContent>
      </ErrorPage>

      {/* Glow Animation */}
      <ErrorPage variant="default" className="min-h-[300px]">
        <ErrorPageContent>
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-2">Glow</h3>
            <ErrorPageErrorCode animationType="glow">404</ErrorPageErrorCode>
          </div>
        </ErrorPageContent>
      </ErrorPage>

      {/* Shake Animation */}
      <ErrorPage variant="default" className="min-h-[300px]">
        <ErrorPageContent>
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-2">Shake</h3>
            <ErrorPageErrorCode animationType="shake">404</ErrorPageErrorCode>
          </div>
        </ErrorPageContent>
      </ErrorPage>

      {/* Rotate Animation */}
      <ErrorPage variant="default" className="min-h-[300px]">
        <ErrorPageContent>
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-2">Rotate</h3>
            <ErrorPageErrorCode animationType="rotate">404</ErrorPageErrorCode>
          </div>
        </ErrorPageContent>
      </ErrorPage>

      {/* No Animation */}
      <ErrorPage variant="default" className="min-h-[300px]">
        <ErrorPageContent>
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold mb-2">None (No Animation)</h3>
            <ErrorPageErrorCode animationType="none">404</ErrorPageErrorCode>
          </div>
        </ErrorPageContent>
      </ErrorPage>
    </div>
  ),
};

