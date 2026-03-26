import type { Meta, StoryObj } from "@storybook/react";
import { ContactForm } from ".";
import { ToastProvider } from "../../../../components/toast";

const meta: Meta<typeof ContactForm> = {
  title: "Templates/Pages/Forms/ContactForm",
  component: ContactForm,
};

export default meta;

type Story = StoryObj<typeof ContactForm>;

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <ContactForm>
        <ContactForm.Header />
        <ContactForm.Content>
          <ContactForm.Field name="name" label="Name" />
          <ContactForm.Field name="email" label="Email" />
          <ContactForm.Field name="subject" label="Subject" />
          <ContactForm.Textarea name="message" maxMessageLength={500}/>
          <ContactForm.FileUpload />
          <ContactForm.Actions />
        </ContactForm.Content>
      </ContactForm>
    </ToastProvider>
  ),
};

export const WithBackground: Story = {
  render: () => (
    <ToastProvider>
      <ContactForm
        variant="background"
        backgroundImage="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
      >
        <ContactForm.Header />
        <ContactForm.Content>
          <ContactForm.Field name="name" label="Name" />
          <ContactForm.Field name="email" label="Email" />
          <ContactForm.Field name="subject" label="Subject" />
          <ContactForm.Textarea name="message" />
          <ContactForm.FileUpload />
          <ContactForm.Actions />
        </ContactForm.Content>
      </ContactForm>
    </ToastProvider>
  ),
};

export const SplitLayout: Story = {
  render: () => (
    <ToastProvider>
      <ContactForm
        variant="split"
        sideImage="https://images.unsplash.com/photo-1492724441997-5dc865305da7"
      >
        <ContactForm.Header />
        <ContactForm.Content>
          <ContactForm.Field name="name" label="Name" />
          <ContactForm.Field name="email" label="Email" />
          <ContactForm.Textarea name="message" />
          <ContactForm.FileUpload />
          <ContactForm.Actions />
        </ContactForm.Content>
      </ContactForm>
    </ToastProvider>
  ),
};