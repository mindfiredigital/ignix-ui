import type { Meta, StoryObj } from "@storybook/react";
import { ContactForm } from "./index";

const meta: Meta<typeof ContactForm> = {
  title: "Templates/Forms/ContactForm",
  component: ContactForm,
};

export default meta;

type Story = StoryObj<typeof ContactForm>;

export const Default: Story = {
  render: () => (
    <ContactForm>
      <ContactForm.Header />

      <ContactForm.Content>
        <ContactForm.Field name="name" label="Name" />
        <ContactForm.Field name="email" label="Email" type="email" />
        <ContactForm.Field name="subject" label="Subject" />
        <ContactForm.Textarea name="message" label="Message" />
        <ContactForm.FileUpload />
      </ContactForm.Content>

      <ContactForm.Actions />
    </ContactForm>
  ),
};

export const BackgroundImage: Story = {
  render: () => (
    <ContactForm
      variant="background"
      backgroundImage="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
    >
      <ContactForm.Header />

      <ContactForm.Content>
        <ContactForm.Field name="name" label="Name" />
        <ContactForm.Field name="email" label="Email" />
        <ContactForm.Textarea name="message" label="Message" />
      </ContactForm.Content>

      <ContactForm.Actions />
    </ContactForm>
  ),
};

export const SplitLayout: Story = {
  render: () => (
    <ContactForm
      variant="split"
      sideImage="https://images.unsplash.com/photo-1492724441997-5dc865305da7"
    >
      <ContactForm.Header />

      <ContactForm.Content>
        <ContactForm.Field name="name" label="Name" />
        <ContactForm.Field name="email" label="Email" />
        <ContactForm.Textarea name="message" label="Message" />
      </ContactForm.Content>

      <ContactForm.Actions />
    </ContactForm>
  ),
};