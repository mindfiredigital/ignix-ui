import type { Meta, StoryObj } from "@storybook/react";
import { ContactForm } from ".";
import { ToastProvider } from "../../../../components/toast";

const meta: Meta<typeof ContactForm> = {
  title: "Templates/Pages/Forms/ContactForm",
  component: ContactForm,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "background", "split"],
    },
    sideImagePosition: {
      control: "select",
      options: ["left", "right"],
      if: { arg: "variant", eq: "split" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ContactForm>;

const Template: Story["render"] = (args) => (
  <ToastProvider>
    <ContactForm
      {...args}
      onSubmit={async (data) => {
        console.log("Form submitted:", data);
      }}
    >
      <ContactForm.Header />
      <ContactForm.Content>
        <ContactForm.Field name="name" label="Name" />
        <ContactForm.Field name="email" label="Email" />
        <ContactForm.Field name="subject" label="Subject" />
        <ContactForm.Textarea name="message" maxMessageLength={500} />
        <ContactForm.FileUpload />
        <ContactForm.Actions />
      </ContactForm.Content>
    </ContactForm>
  </ToastProvider>
);

export const Default: Story = {
  render: Template,
  args: {
    variant: "default",
  },
};

export const WithBackground: Story = {
  render: Template,
  args: {
    variant: "background",
    backgroundImage:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
  },
};

export const SplitLayout: Story = {
  render: Template,
  args: {
    variant: "split",
    sideImage:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    sideImagePosition: "right",
  },
};