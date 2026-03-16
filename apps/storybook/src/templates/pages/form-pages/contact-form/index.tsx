"use client";

import React, { createContext, useContext, useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import AnimatedInput from "../../../../components/input";
import { Button } from "../../../../components/button";
import FileUpload from "../../../../components/file-upload";
import AnimatedTextarea from "../../../../components/textarea";



type FormData = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  file?: File | null;
};

type ContactFormProps = {
  children: React.ReactNode;
  variant?: "default" | "background" | "split";
  backgroundImage?: string;
  sideImage?: string;
  onSubmit?: (data: FormData) => void;
};

type ContextType = {
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
};

const ContactFormContext = createContext<ContextType | null>(null);

const useContactForm = () => {
  const ctx = useContext(ContactFormContext);
  if (!ctx) throw new Error("ContactForm must be used inside provider");
  return ctx;
};

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

function Root({
  children,
  variant = "default",
  backgroundImage,
  sideImage,
  onSubmit,
}: ContactFormProps) {
  const [data, setData] = useState<FormData>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(data);
  };

  const baseCard =
    "rounded-2xl p-8 shadow-xl w-full max-w-xl space-y-6";

  const variantStyles = {
    // default: `bg-background border ${baseCard}`,

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
    return (
      <ContactFormContext.Provider value={{ data, setData }}>
        <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-xl max-w-5xl mx-auto">
          <div
            className="hidden md:block bg-cover bg-center"
            style={{ backgroundImage: `url(${sideImage})` }}
          />

          <motion.form
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-background p-10 space-y-6"
          >
            {children}
          </motion.form>
        </div>
      </ContactFormContext.Provider>
    );
  }

  return (
    <ContactFormContext.Provider value={{ data, setData }}>
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
        <motion.form
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={variantStyles[variant]}
        >
          {children}
        </motion.form>
      </div>
    </ContactFormContext.Provider>
  );
}

function Header({
  title = "Contact Us",
  description = "We would love to hear from you",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <motion.div variants={itemVariants} className="text-center space-y-2">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
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
  name: keyof FormData;
  label: string;
  type?: string;
}) {
  const { data, setData } = useContactForm();

  return (
    <motion.div variants={itemVariants} className="pt-4">
      <AnimatedInput
        placeholder={label}
        variant="clean"
        type={type}
        value={(data[name] as string) ?? ""}
        // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        //   setData((p) => ({ ...p, [name]: e.target.value }))
        // }
        onChange={(value: string) =>
            setData((p) => ({ ...p, [name]: value }))
        }
      />
    </motion.div>
  );
}

function MessageTextarea({
  name,
  // label,
}: {
  name: keyof FormData;
  label: string;
}) {
  const { data, setData } = useContactForm();

  const handleChange = (value: string) => {
    setData((p) => ({ ...p, [name]: value }));
  };
  return (
    <motion.div variants={itemVariants} className="pt-4">
      {/* <label className="text-sm font-medium">{label}</label> */}
      <AnimatedTextarea
        placeholder="Enter your message"
        variant="clean"
        value={(data[name] as string) ?? ""}
        onChange={handleChange}
      />
    </motion.div>
  );
}
interface FileUploadFieldProps {
    label?: string;
    multiple?: boolean;
    accept?: string;
    maxSize?: number;
  }
  
  const FileUploadField: React.FC<FileUploadFieldProps> = ({
    label = "Attachment (optional)",
    multiple = false,
    accept = "*/*",
    maxSize = 10 * 1024 * 1024,
  }) => {
    const { updateField } = useContactForm();
  
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">{label}</label>
  
        <FileUpload
          multiple={multiple}
          accept={accept}
          maxSize={maxSize}
          showFileList
          onFilesChange={(files) => {
            updateField("attachment", multiple ? files : files[0] ?? null);
          }}
        />
  
        <p className="text-xs text-muted-foreground">
          Optional file attachment
        </p>
      </div>
    );
  };
// function FileUpload() {
//   const { setData } = useContactForm();

//   return (
//     <motion.div variants={itemVariants}>
//       <input
//         type="file"
//         onChange={(e) =>
//           setData((p) => ({
//             ...p,
//             file: e.target.files?.[0] ?? null,
//           }))
//         }
//       />
//     </motion.div>
//   );
// }

function Actions() {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
    >
      <Button type="submit" className="w-full">
        Send Message
      </Button>
    </motion.div>
  );
}

export const ContactForm = Object.assign(Root, {
  Header,
  Content,
  Field,
  Textarea: MessageTextarea,
  FileUpload : FileUploadField,
  Actions,
});