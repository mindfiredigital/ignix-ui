"use client";

import React, { useState } from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import VariantSelector from "./VariantSelector";
import { ContactForm } from "../UI/contact-form";
import { cn } from "@site/src/utils/cn";
import { ToastProvider } from "../UI/toast";

type Variant = "default" | "background" | "split";

export const ContactFormDemo = () => {
  const [variant, setVariant] = useState<Variant>("default");
  const [submitted, setSubmitted] = useState<any>(null);

  const handleSubmit = async (data: any) => {

    await new Promise((res) => setTimeout(res, 1200));

    setSubmitted(data);
  };

  const buildCode = () => {
    return `import { ContactForm } from "@ignix-ui/contactform";

<ToastProvider>
    <ContactForm
      variant="${variant}"
      onSubmit={async (data) => {
        console.log(data);
      }}
    >
    <ContactForm.Header />
    <ContactForm.Content>
      <ContactForm.Field name="name" label="Name" />
      <ContactForm.Field name="email" label="Email" />
      <ContactForm.Field name="subject" label="Subject" />
      <ContactForm.Textarea name="message" />
      <ContactForm.FileUpload />
    </ContactForm.Content>
    <ContactForm.Actions />
  </ContactForm>
</ToastProvider>
`;
  };


  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-end">
        <VariantSelector
          variants={["default", "background", "split"]}
          selectedVariant={variant}
          onSelectVariant={(v) => setVariant(v as Variant)}
          type="Variant"
        />
      </div>

      {/* Tabs */}
      <Tabs>
        <TabItem value="preview" label="Preview">
            <ToastProvider>
            <ContactForm
              variant={variant}
              backgroundImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                sideImage="https://images.unsplash.com/photo-1556761175-4b46a572b786"
              onSubmit={handleSubmit}
            >
              <ContactForm.Header />
              <ContactForm.Content>
                <ContactForm.Field name="name" label="Name" />
                <ContactForm.Field name="email" label="Email" />
                <ContactForm.Field name="subject" label="Subject" />
                <ContactForm.Textarea name="message" />
                <ContactForm.FileUpload />
              </ContactForm.Content>
              <ContactForm.Actions />
            </ContactForm>
            </ToastProvider>

          {/* Submitted Data */}
          {submitted && (
            <div
              className={cn(
                "mt-4 p-4 rounded-lg",
              )}
            >
              <h3 className="font-semibold mb-2">Submitted Data</h3>
              <pre className="text-sm">
                {JSON.stringify(submitted, null, 2)}
              </pre>
            </div>
          )}
        </TabItem>

        <TabItem value="code" label="Code">
          <CodeBlock language="tsx">{buildCode()}</CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default ContactFormDemo;