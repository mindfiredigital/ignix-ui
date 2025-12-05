import type { Meta, StoryObj } from "@storybook/react-vite";
import { ForgotPasswordPage, FormHeader } from ".";


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
    formType: {
      control: "select",
      options: ["split", "center"],
      description: "Form Types"
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
    variant: "dark",
    inputVariant: "bounce",
    animationVariant: "bounceSlow",
    formType: "center",
    headerAnimation: "slideLeft",
    formCardHeader: (
      <FormHeader 
        head="Forgot Password" 
        para="Enter your email to reset your password."
        animationVariant= "fadeUp"
      />
    )
  },
};

// Dark Mode
export const UnderlineSplit: Story = {
  args: {
    ...BasicCenter.args,
    inputVariant: "underline",
    animationVariant: "fadeInOut",
    formType: "split",
    formSplitHeader: (
      <FormHeader 
        head="Account Recovery" 
        para="Enter your email to receive a secure link and restore access to your account."
      />
    )
  },
};

export const SplitGradient: Story = {
  args: {
    ...UnderlineSplit.args,
    variant: "gradientAurora"
  }
}


