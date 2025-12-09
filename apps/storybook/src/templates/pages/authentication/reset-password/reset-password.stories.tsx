import { ResetPasswordPage } from "./index";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof ResetPasswordPage> = {
  title: "Templates/Pages/Authentication/Reset Password",
  component: ResetPasswordPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A comprehensive reset password page with token validation, password strength indicator, and form validation. Includes all the features needed for a secure password reset flow.",
      },
    },
  },
  argTypes: {
    token: {
      control: { type: "text" },
      description: "Pre-filled reset token/code (optional)",
    },
    inputVariant: {
      control: { type: "select" },
      options: [
        "clean",
        "underline",
        "floating",
        "borderGlow",
        "shimmer",
        "particles",
        "slide",
        "scale",
        "rotate",
        "bounce",
        "elastic",
        "glow",
        "shake",
        "wave",
        "typewriter",
        "magnetic",
        "pulse",
        "flip",
        "morph",
        "spotlight",
        "liquid",
        "neon",
        "origami",
        "glitch",
        "hologram",
        "cosmic",
        "borderBeam",
        "gradientBorder",
        "ripple",
        "materialFloat",
        "neonPulse",
        "typewriterReveal",
        "morphing",
        "liquidBorder",
        "particleField",
        "glassmorphism",
        "holographic3D",
        "quantumParticles",
        "premiumGlass",
        "luxuryShimmer",
        "materialRipple",
        "cosmicField",
        "premiumGradient",
      ],
      description: "Visual variant for input fields",
    },
    onSubmit: {
      action: "submitted",
      description: "Callback when form is submitted with valid data",
    },
    onTokenValidate: {
      action: "token-validated",
      description: "Custom token validation function (optional)",
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ResetPasswordPage>;

// Default Story
export const Default: Story = {
  args: {
    inputVariant: "clean",
    onSubmit: (password: string, token: string) => {
      // Storybook action placeholder – replace with real handler in your app
      // eslint-disable-next-line no-console
      console.log("password-reset-submitted", { password, token });
    },
  },
};

// With Pre-filled Token
export const WithToken: Story = {
  args: {
    token: "ABC123XYZ",
    inputVariant: "clean",
    onSubmit: (password: string, token: string) => {
      // eslint-disable-next-line no-console
      console.log("password-reset-submitted", { password, token });
    },
  },
};

// Custom Token Validation
export const CustomTokenValidation: Story = {
  args: {
    inputVariant: "clean",
    onTokenValidate: (token: string) => {
      // Custom validation: token must start with "RESET" and be 10 characters
      return token.startsWith("RESET") && token.length === 10;
    },
    onSubmit: (password: string, token: string) => {
      // eslint-disable-next-line no-console
      console.log("password-reset-submitted", { password, token });
    },
  },
};

// Different Input Variants
export const FloatingInput: Story = {
  args: {
    inputVariant: "floating",
    onSubmit: (password: string, token: string) => {
      // eslint-disable-next-line no-console
      console.log("password-reset-submitted", { password, token });
    },
  },
};

export const BorderGlowInput: Story = {
  args: {
    inputVariant: "borderGlow",
    onSubmit: (password: string, token: string) => {
      // eslint-disable-next-line no-console
      console.log("password-reset-submitted", { password, token });
    },
  },
};

export const ShimmerInput: Story = {
  args: {
    inputVariant: "shimmer",
    onSubmit: (password: string, token: string) => {
      // eslint-disable-next-line no-console
      console.log("password-reset-submitted", { password, token });
    },
  },
};

export const ParticlesInput: Story = {
  args: {
    inputVariant: "particles",
    onSubmit: (password: string, token: string) => {
      // eslint-disable-next-line no-console
      console.log("password-reset-submitted", { password, token });
    },
  },
};

export const GlassmorphismInput: Story = {
  args: {
    inputVariant: "glassmorphism",
    onSubmit: (password: string, token: string) => {
      // eslint-disable-next-line no-console
      console.log("password-reset-submitted", { password, token });
    },
  },
};

export const PremiumGradientInput: Story = {
  args: {
    inputVariant: "premiumGradient",
    onSubmit: (password: string, token: string) => {
      // eslint-disable-next-line no-console
      console.log("password-reset-submitted", { password, token });
    },
  },
};

// Dark Theme Example (via className override)
export const DarkTheme: Story = {
  args: {
    inputVariant: "clean",
    className: "dark",
    onSubmit: (password: string, token: string) => {
      // eslint-disable-next-line no-console
      console.log("password-reset-submitted", { password, token });
    },
  },
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
};

// Interactive Example
export const Interactive: Story = {
  args: {
    inputVariant: "clean",
    onSubmit: (password: string, token: string) => {
      // eslint-disable-next-line no-console
      console.log("password-reset-submitted", {
        password,
        token,
        passwordLength: password.length,
      });
    },
    onTokenValidate: (token: string) => {
      const isValid = token.length >= 6 && token.length <= 32;
      // eslint-disable-next-line no-console
      console.log("token-validated", { token, isValid });
      return isValid;
    },
  },
};

