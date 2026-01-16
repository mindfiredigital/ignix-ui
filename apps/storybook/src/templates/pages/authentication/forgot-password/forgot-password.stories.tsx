import type { Meta, StoryObj } from "@storybook/react-vite";
import { ForgotPasswordPage, FormHeader } from ".";
import { useState } from "react";
import { Button } from "../../../../components/button";

const meta: Meta<typeof ForgotPasswordPage> = {
  title: "Templates/Pages/Authentication/ForgotPassword",
  component: ForgotPasswordPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Forgot Password page built with theme buttonVariants (default, dark, light, glass, gradient).",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "dark", "gradientAurora", "gradientEmeraldWave", "gradientRoyal", "gradientOceanNight"],
      description: "Visual theme for Forgot Password page",
    },
    inputVariant: {
      control: "select",
      options: ["clean", "underline", "floating", "borderGlow", "shimmer", "particles",
                "slide", "scale", "rotate", "bounce", "elastic", "glow", "shake", "wave",
                "typewriter", "magnetic", "pulse", "borderBeam", "ripple", "particleField", "tilt3D"],
      description: "Input box animated theme",
    },
    animationVariant: {
      control: "select",
      options: ["bounce", "bounceSlow", "bounceFast", "bounceSmooth", "bounceJelly", "rotateClockwiseSlow" , "rotateClockwiseFast", "rotateAntiClockwiseSlow", "rotateAntiClockwiseFast", "rotatePingPong", "scaleUp", "scaleDown", "scaleHeartBeat", "flipX", "flipY", "flipY", "flipCard", "fadeBlink", "fadeInOut", "press3D", "press3DSoft", "press3DHard", "press3DPop", "press3DDepth", "spinSlow"],
      description: "Animation Variant for button" 
    },
    headerAnimation: {
      control: "select",
      options: ["fadeUp", "scaleIn", "slideLeft", "slideRight", "flipIn"],
      description: "Animation Variant for button" 
    },
  },
};

export default meta;
type Story = StoryObj<typeof ForgotPasswordPage>;

// -------------------------------------
// STORIES
// -------------------------------------
export const BasicCenter: Story = {
  args: {
    inputVariant: "clean",
    animationVariant: "bounceSlow",
    headerAnimation: "slideLeft",
    navigateToLabel: "Return to Login",
    formCardHeader: (
      <FormHeader 
        head="Forgot Password" 
        para="Enter your email and create a new secure password."
        animationVariant= "fadeUp"
      />
    )
  },
};

const MockCaptcha = ({
  onVerify,
  verified,
}: {
  onVerify: () => void;
  verified: boolean;
}) => {
  return (
    <div className="flex flex-col items-center gap-2 border border-gray-300 rounded-lg p-4 w-full max-w-md">
      <p className="text-sm text-muted-foreground">
        CAPTCHA (Mock)
      </p>
      {verified ? (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <span>✓ Verified</span>
        </div>
      ) : (
        <Button size="sm" onClick={onVerify}>
          Verify
        </Button>
      )}
    </div>
  );
};

// With Captcha
export const WithCaptcha: Story = {
  render: () => {
    const [verified, setVerified] = useState(false);

    return (
      <ForgotPasswordPage
        forgotPasswordHeader={{
          head: "Forgot password?",
          para: "Please verify before requesting a reset link.",
        }}
        submitbuttonLabel="Send Reset Link"
        navigateToLabel="Back to Login"
        captcha={
          <MockCaptcha 
            onVerify={() => setVerified(true)} 
            verified={verified}
          />
        }
        captchaVerified={verified}
        onSubmit={(email) => {
          console.log("Submitted email:", email);
        }}
        onNavigateTo={() => {
          console.log("Navigate to login");
        }}
      />
    );
  },
};

// Dark Theme Example
export const DarkTheme: Story = {
  args: {
    variant: "dark",
    inputVariant: "clean",
    animationVariant: "press3D",
    headerAnimation: "fadeUp",
    forgotPasswordHeader: {
      head: "Forgot Password",
      para: "Enter your email address and we'll send you a reset link."
    },
    onSubmit: (email) => {
      console.log("Submitted email:", email);
    },
    onNavigateTo: () => {
      console.log("Navigate to login");
    }
  },
};

// Interactive 
export const Interactive: Story = {
  args: {
    inputVariant: "shimmer",
    animationVariant: "press3D",
    headerAnimation: "scaleIn",
    forgotPasswordHeader: {
      head: "Forgot Password?",
      para: "No worries! Enter your email and we'll help you reset it."
    },
    submitbuttonLabel: "Send Reset Email",
    navigateToLabel: "Return to Login",
    onSubmit: (email) => {
      console.log("Submitted email:", email);
    },
    onNavigateTo: () => {
      console.log("Navigate to login");
    }
  },
};

// Loading State Demo
export const LoadingState: Story = {
  render: () => {
    return (
      <ForgotPasswordPage
        variant="default"
        inputVariant="clean"
        animationVariant="press3D"
        headerAnimation="fadeUp"
        forgotPasswordHeader={{
          head: "Forgot Password",
          para: "Enter your email address and we'll send you a reset link. Click submit to see the loading state."
        }}
        submitbuttonLabel="Send Reset Link"
        navigateToLabel="Back to Login"
        onSubmit={async (email) => {
          console.log("Submitting email:", email);
          // Simulate API call with 3 second delay
          await new Promise((resolve) => setTimeout(resolve, 3000));
          console.log("Email sent successfully!");
        }}
        onNavigateTo={() => {
          console.log("Navigate to login");
        }}
      />
    );
  },
};

// Loading State with Dark Theme
export const LoadingStateDark: Story = {
  render: () => {
    return (
      <ForgotPasswordPage
        variant="dark"
        inputVariant="borderGlow"
        animationVariant="press3D"
        headerAnimation="scaleIn"
        forgotPasswordHeader={{
          head: "Reset Your Password",
          para: "Watch the button show a loading spinner when you submit. The form will show success after 3 seconds."
        }}
        submitbuttonLabel="Send Reset Email"
        navigateToLabel="Back to Login"
        onSubmit={async (email) => {
          console.log("Submitting email:", email);
          // Simulate API call with 3 second delay
          await new Promise((resolve) => setTimeout(resolve, 3000));
          console.log("Email sent successfully!");
        }}
        onNavigateTo={() => {
          console.log("Navigate to login");
        }}
      />
    );
  },
};






