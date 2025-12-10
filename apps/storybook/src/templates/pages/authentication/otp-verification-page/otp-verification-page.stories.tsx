import type { Meta, StoryObj } from "@storybook/react-vite";
import { OTPVerificationPage } from ".";

const meta: Meta<typeof OTPVerificationPage> = {
  title: "Templates/Pages/Authentication/OTPVerificationPage",
    component: OTPVerificationPage,
    tags: ["autodocs"],
    parameters: {
      layout: "fullscreen",
      docs: {
        description: {
          component:
            "",
        },
      },
    },
  argTypes : {
    variant: {
      control: "select",
      options: ["default", "dark", "gradientOceanNight"],
      description: "Visual theme for Forgot Password page",
    },
    animation: {
      control: "select",
      options: ["fadeUp", "scaleIn", "slideLeft", "slideRight", "flipIn"],
      description: "Animation Variant" 
    },
  }
}                                   

export default meta;
type Story = StoryObj<typeof OTPVerificationPage>;

export const Basic: Story = {
  args : {
    navigateToLabel: "Back To Login"
  }
}

export const EightDigitWithPhoneNumber: Story = { 
  args : {
    length: 8,
    contactType: "phone",
    contactDetail: "777 333 6666"
  }
}

export const Autofill: Story = {
  render: (args) => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-6">
      <div className="text-center text-gray-600 text-sm">
        <p><strong>Paste Demo:</strong></p>
        <p>Copy <code>123456</code> and paste it (Ctrl+V / Cmd+V) into the first OTP field.</p>
        <p>The component will automatically fill all boxes.</p>
      </div>

      <OTPVerificationPage {...args} />
    </div>
  ),

  args: {
    ...Basic.args,
  },
}

export const Animation: Story = {
  args: {
    animation: "slideLeft"
  }
}


