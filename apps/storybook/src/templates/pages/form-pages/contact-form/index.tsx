"use client";

import React, { createContext, useContext, useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import AnimatedInput from "../../../../components/input";
import { Button } from "../../../../components/button";
import FileUpload from "../../../../components/file-upload";
import AnimatedTextarea from "../../../../components/textarea";
import { useToast } from "../../../../components/toast";
import { InfoCircledIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';

/* ================= TYPES ================= */

type FormData = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  file?: File | null;
};

type ValidationErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

type ContactFormProps = 
  | {
      children: React.ReactNode;
      variant: "default";
      backgroundImage?: never;
      sideImage?: never;
      sideImagePosition?: never;
      onSubmit: (data: FormData) => Promise<void> | void;
      onError?: (err: unknown) => void;
      onSuccess?: () => void;
    }
  | {
      children: React.ReactNode;
      variant: "background";
      backgroundImage: string;
      sideImage?: never;
      sideImagePosition?: never;
      onSubmit: (data: FormData) => Promise<void> | void;
      onError?: (err: unknown) => void;
      onSuccess?: () => void;
    }
  | {
      children: React.ReactNode;
      variant: "split";
      backgroundImage?: never;
      sideImage: string;
      sideImagePosition?: "left" | "right";
      onSubmit: (data: FormData) => Promise<void> | void;
      onError?: (err: unknown) => void;
      onSuccess?: () => void;
};


type FieldName = keyof ValidationErrors;

const VALIDATION_FIELDS: (keyof ValidationErrors)[] = [
  "name",
  "email",
  "subject",
];

/* ================= CONTEXT ================= */

type ContextType = {
  data: FormData;
  errors: ValidationErrors;
  updateField: <K extends keyof FormData>(
    name: K,
    value: FormData[K]
  ) => void;
  status: "idle" | "loading" | "success" | "error";
};

const ContactFormContext = createContext<ContextType | null>(null);

const useContactForm = () => {
  const ctx = useContext(ContactFormContext);
  if (!ctx) throw new Error("ContactForm must be used inside provider");
  return ctx;
};

/* ================= ANIMATION ================= */

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

/* ================= BASE (LOGIC) ================= */

const validateField = (name: keyof FormData, value?: string) => {
  const normalized = value?.trim() ?? "";

  if (!normalized) {
    const label = name ? name[0].toUpperCase() + name.slice(1) : "";
    return `${label} is required`;
  }

  if (name === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalized)) {
      return "Enter a valid email address";
    }
  }

  return undefined;
};

const validateForm = (data: FormData) => {
  const newErrors: ValidationErrors = {};
  let isValid = true;

  VALIDATION_FIELDS.forEach((field) => {
    const error = validateField(field, data[field]);

    if (error) {
      newErrors[field] = error;
      isValid = false;
    }
  });

  return { isValid, newErrors };
};

const isErrorField = (name: keyof FormData): name is keyof ValidationErrors => {
  return VALIDATION_FIELDS.includes(name as keyof ValidationErrors);
};

function ContactFormBase({
  children,
  onSubmit,
  onError,
  onSuccess,
}: {
  children: React.ReactNode;
  onSubmit: (data: FormData) => Promise<void> | void;
  onError?: (err: unknown) => void;
  onSuccess?: () => void;
}) {
  const [data, setData] = useState<FormData>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  let toast;
  try {
    toast = useToast();
  } catch {
    toast = null;
  }

  const updateField = <K extends keyof FormData>(
    name: K,
    value: FormData[K]
  ) => {
    setData((prev) => ({ ...prev, [name]: value }));
  
    if (isErrorField(name) && errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }

    if (status === "error") {
      setStatus("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    const { isValid, newErrors } = validateForm(data);
    setErrors(newErrors);

    if (!isValid) return;

    const normalizedData: FormData = {
      ...data,
      name: data.name?.trim(),
      email: data.email?.trim(),
      subject: data.subject?.trim(),
      message: data.message?.trim(),
    };
    
    setStatus("loading");
    try {
      await onSubmit(normalizedData);
    } catch (err) {
      setStatus("error");
      if (onError) {
        onError(err);
      } else {
        toast?.addToast({
          message: "Failed to send message. Please try again.",
          variant: "error",
          animation: "slide",
          icon: <InfoCircledIcon className="w-5 h-5" />
        });
      }
      return;
    }

    setStatus("success");
    if (onSuccess) {
      onSuccess();
    } else {
      toast?.addToast({
        message: "Message sent successfully!",
        variant: "success",
        animation: "slide",
        icon: <InfoCircledIcon className="w-5 h-5" />
      });
    }
  };

  return (
    <ContactFormContext.Provider value={{ data, errors, updateField, status }}>
      <form onSubmit={handleSubmit}>{children}</form>
    </ContactFormContext.Provider>
  );
}

/* ================= WRAPPER ================= */

function Root({
  children,
  variant = "default",
  backgroundImage,
  sideImage,
  sideImagePosition = "left",
  onSubmit,
  onError,
  onSuccess,
}: ContactFormProps) {
  const baseCard = "rounded-2xl p-8 shadow-xl w-full max-w-xl space-y-6";

  const variantStyles = {
    default: `
      backdrop-blur-xl
      bg-white/10
      border border-white/20
      ${baseCard}
    `,
    background: `
      bg-background/90
      border
      ${baseCard}
    `,
  };

  if (variant === "split") {
    const ImageBlock = (
      <div
        className="hidden md:block bg-cover bg-center"
        style={{ backgroundImage: `url(${sideImage})` }}
      />
    );
  
    const FormBlock = (
      <ContactFormBase onSubmit={onSubmit} onError={onError} onSuccess={onSuccess}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-background p-10 space-y-6"
        >
          {children}
        </motion.div>
      </ContactFormBase>
    );
  
    return (
      <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-xl max-w-5xl mx-auto">
        {sideImagePosition === "left" ? (
          <>
            {ImageBlock}
            {FormBlock}
          </>
        ) : (
          <>
            {FormBlock}
            {ImageBlock}
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center p-10"
      style={
        variant === "background"
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <ContactFormBase onSubmit={onSubmit} onError={onError} onSuccess={onSuccess}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={variantStyles[variant]}
        >
          {children}
        </motion.div>
      </ContactFormBase>
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

function Header({
  title = "Contact Us",
  description = "We would love to hear from you",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <motion.div variants={itemVariants} className="text-center space-y-2">
     <p className="text-3xl font-bold text-primary bg-clip-text">
        {title}
      </p>
      <span className="text-sm text-muted-foreground max-w-sm mx-auto">{description}</span>
    </motion.div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5">{children}</div>;
}

function Field({
  name,
  label,
  type = "text",
}: {
  name: FieldName;
  label: string;
  type?: string;
}) {
  const { data, updateField, errors } = useContactForm();
  const error = errors[name];

  return (
    <motion.div variants={itemVariants} className="pt-4">
      <AnimatedInput
        placeholder={label}
        variant="clean"
        type={type}
        value={(data[name] as string) ?? ""}
        onChange={(value: string) => updateField(name, value)}
      />
      {error && (
        <div className="text-sm text-red-700 flex items-center gap-2">
          <ExclamationTriangleIcon/>
          {error}
        </div>
      )}
    </motion.div>
  );
}


function Textarea({ name, maxMessageLength }: { name: keyof FormData, maxMessageLength?: number }) {
  const { data, updateField } = useContactForm();

  return (
    <motion.div variants={itemVariants} className="pt-4">
      <AnimatedTextarea
        placeholder="Enter your message"
        variant="clean"
        maxLength={maxMessageLength}
        value={(data[name] as string) ?? ""}
        onChange={(value) => updateField(name, value)}
      />
    </motion.div>
  );
}

function FileUploadField() {
  const { updateField } = useContactForm();

  return (
    <FileUpload
      buttonVariant="primary"
      onFilesChange={(files) => {
        const file = files?.[0] ?? null;
        updateField("file", file);
      }}
    />
  );
}

function Actions() {
  const { status } = useContactForm();
  return (
    <motion.div variants={itemVariants}>
     <Button
        type="submit"
        className="w-full text-white shadow-lg"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </Button>
    </motion.div>
  );
}

/* ================= EXPORT ================= */

export const ContactForm = Object.assign(Root, {
  Header,
  Content,
  Field,
  Textarea,
  FileUpload: FileUploadField,
  Actions,
  Base: ContactFormBase,
});
