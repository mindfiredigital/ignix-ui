import React, { useEffect, useRef, useState } from "react";
import { Button } from "@ignix-ui/button";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { z } from "zod";
import { cn } from "../../../utils/cn";

type animationKeys = keyof typeof animationVariant;

export interface OTPVerificationProps {
  input?: React.ReactNode;
  navigateToLabel?: string;
  submitButtonLabel?: string;
  title?: string;
  contactType?: "email" | "phone";
  contactDetail?: string;
  resendCooldown?: number,
  length?: number
  onNavigateTo?: () => void; // open-source-friendly navigation callback
  onVerifyOtp?: (code: string) => Promise<{ success: boolean; message?: string }>
  onResendOtp?: (contact: string, contactType: "email" | "phone") 
    => Promise<{ success: boolean; message?: string }>;
  variant?: VariantProps<typeof OtpVerificationVariants>["variant"];
  animation?: animationKeys 
}

interface LinkButtonProps {
  label?: string;
  textColor?: string;
  onBack?: () => void;
}

/** Back To Login Link */
export const LinkButton = ({
  label = "Back to Login",
  onBack,
  textColor
}: LinkButtonProps) => {
  return (
    <Button
      variant="link"
      className={cn("hover:cursor-pointer", textColor)}
      onClick={onBack}
    >
      {label}
    </Button>
  );
};

const OtpVerificationVariants = cva("", {
  variants: {
    variant: {
      default: "bg-white text-black",
      gradientOceanNight:
        "bg-gradient-to-br from-blue-950 via-slate-900 to-black text-white",
      dark: "bg-gradient-to-br from-black via-neutral-900 to-neutral-800 text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const OtpVerificationCardVariants = cva("", {
  variants: {
    variant: {
      default: "bg-black text-white",
      gradientRoyal:
        "bg-gradient-to-br from-indigo-600 via-purple-700 to-fuchsia-700 text-white",
      gradientOceanNight:
        "bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-900 text-white",
      dark: "bg-white text-black",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const animationVariant = {
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
  },
  flipIn: {
    initial: { rotateX: -90, opacity: 0 },
    animate: { rotateX: 0, opacity: 1 },
  },
};

const OTPVerificationPageContent: React.FC<OTPVerificationProps> = ({
  title = "Enter Verification Code",
  contactType = "email",
  contactDetail = "user@example.com",
  navigateToLabel = "Back To Login",
  submitButtonLabel = "Verify Code",
  onNavigateTo,
  onVerifyOtp,
  onResendOtp,
  length = 6,
  variant = "dark",
  resendCooldown = 30,
  animation = "fadeUp"
}) => {
  const [cooldown, setCooldown] = useState(0);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const values = useRef<string[]>(Array(length).fill(""));
  const [isEditing, setIsEditing] = useState(false);
  const [contact, setContact] = useState(contactDetail);
  const handleNavigateTo = () => onNavigateTo?.();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [codeSuccess, setCodeSuccess] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [editValue, setEditValue] = useState(contactDetail);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    setContact(contactDetail);
    setEditValue(contactDetail);
  }, [contactDetail]);

  useEffect(() => {
    if (cooldown === 0) {
      setSuccess(null);
      setCodeSuccess(null);
      setCodeError(null);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (!onResendOtp) {
      // Fallback for open-source usage
      setCooldown(resendCooldown);
      return;
    }
    const result = await onResendOtp(contact, contactType);

    if (result.success) {
      setCooldown(resendCooldown);  // start cooldown only on success
      setSuccess(result.message || "OTP send Successfully!");
    } else {
      setCodeError(result.message || "Failed to resend code");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;
    // 🔥 update internal storage
    values.current[index] = value;  
    if (value && index < length - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const key = e.key;
    if (key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (key === "Delete") e.currentTarget.value = "";
    if (key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (key === "ArrowRight" && index < inputsRef.current.length - 1)
      inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();

    const pastedText = e.clipboardData.getData("text").replace(/\s+/g, "");

    if (!/^\d+$/.test(pastedText)) return;

    const digits = pastedText.split("");

    // Fill starting from the field where user pasted
    for (let i = 0; i < digits.length; i++) {
      const pos = i;
      values.current[pos] = digits[i];
      if (inputsRef.current[pos]) {
        inputsRef.current[pos]!.value = digits[i];
      }
    }

    // Move focus to the next unfilled index
    const nextIndex = Math.min(index + digits.length, length - 1);
    inputsRef.current[nextIndex]?.focus();
  };

  // Zod schemas
  const emailSchema = z.string().email({ message: "Invalid email address" });
  const phoneSchema = z
    .string()
    .regex(/^[0-9]{10}$/, { message: "Phone must be 10 digits (numbers only)" });

  const validateContact = (
    contactType: "email" | "phone",
    value: string
  ) => {
    const trimmed = value.trim();

    // EMAIL VALIDATION
    if (contactType === "email") {
      const result = emailSchema.safeParse(trimmed);
      if (result.success) {
        return { ok: true, type: "email" as const };
      }
      // return Zod's first error message
      return {
        ok: false,
        error: result.error.issues[0]?.message || "Invalid email",
      };
    }
    else{
      // PHONE VALIDATION
      const digits = trimmed.replace(/\D/g, "");
      const result = phoneSchema.safeParse(digits);

      if (result.success) {
        return { ok: true, type: "phone" as const };
      }

      // return Zod's first error message
      return {
        ok: false,
        error: result.error.issues[0]?.message || "Invalid phone number",
      };
    }
  };

  // called when finalizing edit (on blur or Enter)
  const finalizeEdit = (contactType: 'email' | 'phone', value: string) => {
    const val = value.trim();

    if (!val) {
      setError("Value cannot be empty");
      return;
    }

    const res = validateContact(contactType, val);

    if (res.ok) {
      if (contactType === "phone") {
        // Format phone
        const formatted = formatPhone(val);
        setContact(formatted);
        setEditValue(formatted);
      } else {
        setContact(val);
      }

      setError(null);
      setIsEditing(false);
    } else {
      setError(res.error ?? "Invalid contact");
      setContact(val);
    }
  };

  // Format phone to 999 999 9999
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, ""); // remove everything except digits

    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
  };

  // -------------- Verify Handler ------------------
  const handleVerify = async () => {
    const code = values.current.join("");

    setCodeError(null);
    setCodeSuccess(null);

    if (code.length !== length) {
      setCodeError("Please enter the full code");
      return;
    }

    if (!onVerifyOtp) return;

    const result = await onVerifyOtp(code);

    if (!result.success) {
      setCodeError(result.message || "Verification failed");
      return;
    }

    setCodeSuccess(result.message || "OTP verified successfully");
  };

  // Dynamic card width
  const inputWidth = 48; // w-12
  const gap = 12; // gap-3
  const padding = 64; // px-16
  const cardWidth = length * inputWidth + (length - 1) * gap + padding;

  return (
    <div className="w-full flex justify-center items-center py-10 px-4">
      <div
        className={cn(
          "shadow-lg rounded-2xl p-6 sm:p-8 w-full space-y-6",
          OtpVerificationVariants({ variant })
        )}
        style={{
          maxWidth: `${cardWidth}px`,
          minWidth: "280px", // mobile minimum width
        }}
      >
        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold">{title}</h2>
           <p
            className={cn(
              "flex flex-col items-center text-lg",
              variant === "default" ? "text-gray-800" : "text-gray-300"
            )}
          >
            We sent a code to your {contactType}

          {!isEditing ? (
            <span className="flex items-center gap-2" aria-label="contact">
              {contact}
              <Pencil
                aria-label="pencil"
                size={16}
                className="ml-1 cursor-pointer text-gray-400 hover:text-gray-200 transition"
                onClick={() => {
                  setEditValue(contact);  // prefill the edit value
                  setIsEditing(true);
                  setError(null);
                }}
              />
            </span>
          ) : (
            <input
              aria-label="editValue"
              value={editValue}
              onChange={(e) => {
                setEditValue(e.target.value);
                if (error) setError(null); // clear error while typing
              }}
              onBlur={() => finalizeEdit(contactType, editValue)}
              onKeyDown={(e) => {
                if (e.key === "Enter") finalizeEdit(contactType, editValue);
                if (e.key === "Escape") {
                  setIsEditing(false);
                  setEditValue(contact); // revert on escape
                  setError(null);
                }
              }}
              autoFocus
              className={cn(
                "mt-1 text-center px-2 py-1 border rounded-lg",
                error ? "border-red-500" : "border-gray-300",
                variant === "default" ? "text-black" : "text-white"
              )}
            />
          )}
          {error && <span className="text-red-500 text-sm mt-1" aria-label="error">{error}</span>}
          {success && <span className="text-green-500 text-sm mt-1" aria-label="success">{success}</span>}
          </p>
        </div>

        <p className={cn("text-lg py-4 text-center", variant === "default" ? "text-gray-800" : "text-gray-300")}>
          Enter {length} digit code
        </p>

        {/* OTP Inputs */}
        <motion.div
          key={animation}
          initial={animationVariant[animation].initial}
          animate={animationVariant[animation].animate}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-wrap gap-2 sm:gap-3 justify-center">
          {Array.from({ length }).map((_, i) => (
            <input
              key={i}
              aria-label="otp-input"
              type="text"
              maxLength={1}
              ref={(el) => {(inputsRef.current[i] = el)}}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={(e) => handlePaste(e, i)}
              className="w-10 sm:w-12 h-14 text-center text-xl font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            />
          ))}
        </motion.div>

        {codeError && <span className="text-red-500 text-sm mt-1">{codeError}</span>}
        {codeSuccess && <span className="text-green-500 text-sm mt-1">{codeSuccess}</span>}
        {/* Submit */}
        <div className="flex justify-center mt-5">
          <Button
            onClick={handleVerify}
            className={cn(
              "w-full h-12 rounded-xl text-base cursor-pointer",
              OtpVerificationCardVariants({ variant }),
              `hover:${OtpVerificationCardVariants({ variant })}`
            )}
          >
            {submitButtonLabel}
          </Button>
        </div>

        {/* Resend */}
        <div className="text-center text-md hover:cursor-pointer">
          {cooldown > 0 ? (
            <span className={cn("hover:underline", OtpVerificationVariants({ variant }))}>
              Didn't receive code? [ Resend in {cooldown}s ]
            </span>
          ) : (
            <button
              onClick={handleResend}
              className={cn("hover:underline cursor-pointer", OtpVerificationVariants({ variant }))}
            >
              Resend Code
            </button>
          )}
        </div>
        
        {/* Back Button */}
        <div className="flex justify-start">
          <LinkButton label={navigateToLabel} onBack={handleNavigateTo}  textColor={
            variant === "default" ? "text-black" : "text-white"
          }/>
        </div>
        
      </div>
    </div>
  );
};

export const OTPVerificationPage: React.FC<OTPVerificationProps> = (props) => {
  return <OTPVerificationPageContent {...props} />;
};
