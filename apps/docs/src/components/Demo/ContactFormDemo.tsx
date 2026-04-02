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
type FormData = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  file?: File | null;
};

export const ContactFormDemo = () => {
  const [variant, setVariant] = useState<Variant>("default");
  const [sideImagePosition, setSideImagePosition] = useState<"left" | "right">("left");
  const [submitted, setSubmitted] = useState<FormData | null>(null);

  const handleSubmit = async (data: FormData) => {

    await new Promise((res) => setTimeout(res, 1200));

    setSubmitted(data);
  };

  const buildCode = () => {
    return `import { ContactForm } from "@ignix-ui/contact-form";
import { ToastProvider } from "@ignix-ui/toast";

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

  const getVariantProps = () => {
    switch (variant) {
      case "background":
        return {
          variant: "background" as const,
          backgroundImage:
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        };
  
      case "split":
        return {
          variant: "split" as const,
          sideImage:
            "https://images.unsplash.com/photo-1556761175-4b46a572b786",
          sideImagePosition,
        };
  
      default:
        return {
          variant: "default" as const,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-end flex-wrap gap-2">
          <div className="space-y-2 mx-1">
            <VariantSelector
              variants={["default", "background", "split"]}
              selectedVariant={variant}
              onSelectVariant={(v) => setVariant(v as Variant)}
              type="Variant"
            />
          </div>
        {variant === "split" && (
            <div className="space-y-2 mx-1">
              <VariantSelector
                variants={["left", "right"]}
                selectedVariant={sideImagePosition}
                onSelectVariant={(v) => setSideImagePosition(v as "left" | "right")}
                type="Image Position"
              />
            </div>
      )}
      </div>

      {/* Tabs */}
      <Tabs>
        <TabItem value="preview" label="Preview">
            <ToastProvider>
            <ContactForm
               {...getVariantProps()}
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