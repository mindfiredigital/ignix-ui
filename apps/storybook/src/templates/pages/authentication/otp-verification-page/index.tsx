import React, { useEffect, useRef, useState, useCallback, useMemo, memo } from "react";
import { Button } from "../../../../components/button";
import { cn } from "../../../../../utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { z } from "zod";

type animationKeys = keyof typeof animationVariant;

/** Interfaces */
export interface OTPVerificationProps {
  input?: React.ReactNode;
  navigateToLabel?: string;
  submitButtonLabel?: string;
  title?: string;
  statement?: string;
  contactType?: "email" | "phone";
  contactDetail?: string;
  length?: number
  resendCooldown?: number; // Cooldown duration in seconds for resend functionality
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
export const LinkButton = memo(({
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
});
LinkButton.displayName = "LinkButton";

/** Variants */
const OtpVerificationVariants = cva("", {
  variants: {
    variant: {
      default: "bg-white text-black",
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
      dark: "bg-white text-black",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/** Header Animation */
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

/** Common country codes for phone number selection */
const countryCodes = [
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+86", country: "CN", flag: "🇨🇳" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+39", country: "IT", flag: "🇮🇹" },
  { code: "+34", country: "ES", flag: "🇪🇸" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+55", country: "BR", flag: "🇧🇷" },
  { code: "+52", country: "MX", flag: "🇲🇽" },
  { code: "+82", country: "KR", flag: "🇰🇷" },
  { code: "+65", country: "SG", flag: "🇸🇬" },
  { code: "+971", country: "AE", flag: "🇦🇪" },
  { code: "+966", country: "SA", flag: "🇸🇦" },
  { code: "+27", country: "ZA", flag: "🇿🇦" },
  { code: "+31", country: "NL", flag: "🇳🇱" },
  { code: "+46", country: "SE", flag: "🇸🇪" },
  { code: "+47", country: "NO", flag: "🇳🇴" },
];

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
  resendCooldown = 30,
  variant = "dark",
  animation = "fadeUp"
}) => {
  const [cooldown, setCooldown] = useState<number>(0);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const values = useRef<string[]>(Array(length).fill(""));
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [contact, setContact] = useState<string>(contactDetail);
  const handleNavigateTo = useCallback(() => {
    onNavigateTo?.();
  }, [onNavigateTo]);
  const [error, setError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [codeSuccess, setCodeSuccess] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>(contactDetail);
  const [isCodeComplete, setIsCodeComplete] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<string>("+91"); // Default to US

  // Memoize regex patterns
  const emailRegex = useMemo(() => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])+)*\.[a-zA-Z]{2,}$/, []);
  const phoneRegex = useMemo(() => /^[0-9]{10}$/, []);

  // Memoize animation variant
  const currentAnimationVariant = useMemo(() => animationVariant[animation], [animation]);

  // Auto-dismiss success message after 3 seconds
  useEffect(() => {
    if (codeSuccess) {
      const timer = setTimeout(() => {
        setCodeSuccess(null);
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [codeSuccess]);

  // Auto-dismiss resend success message after 3 seconds
  useEffect(() => {
    if (resendSuccess) {
      const timer = setTimeout(() => {
        setResendSuccess(null);
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [resendSuccess]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Update contact and editValue when contactDetail prop changes
  useEffect(() => {
    setContact(contactDetail);
    setEditValue(contactDetail);
  }, [contactDetail]);

  // Memoize Zod schemas
  const emailSchema = useMemo(() => z.string().email({ message: "Invalid email address" }), []);
  const phoneSchema = useMemo(() => z.string().regex(/^[0-9]{10}$/, { message: "Phone must be 10 digits (numbers only)" }), []);

  const handleResend = useCallback(async (): Promise<void> => {
    // Don't allow resend if there's a validation error in contact field
    if (error) {
      return;
    }

    // Clear previous messages
    setCodeError(null);
    setResendSuccess(null);

    if (!onResendOtp) {
      // Fallback for open-source usage
      setCooldown(resendCooldown);
      setResendSuccess("Code has been resent successfully!");
      return;
    }

    try {
      const result: { success: boolean; message?: string } = await onResendOtp(contact, contactType);

      if (result.success) {
        setCooldown(resendCooldown);  // start cooldown only on success
        setResendSuccess(result.message || "Code has been resent successfully!");
      } else {
        setCodeError(result.message || "Failed to resend code");
      }
    } catch (err: unknown) {
      // Handle errors from user's onResendOtp function
      const errorMessage: string = err instanceof Error ? err.message : "Failed to resend code. Please try again.";
      setCodeError(errorMessage);
    }
  }, [contact, contactType, onResendOtp, resendCooldown, error]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;
    // 🔥 update internal storage
    values.current[index] = value;
    
    // Check if all inputs are filled (each must have exactly 1 digit)
    const allFilled = values.current.every((val) => val !== "" && val.length === 1);
    setIsCodeComplete(allFilled);
    
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }, [length]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const key = e.key;
    if (key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (key === "Backspace" && e.currentTarget.value) {
      // Clear current value on backspace
      values.current[index] = "";
      // Check if all inputs are filled after backspace
      const allFilled = values.current.every((val) => val !== "" && val.length === 1);
      setIsCodeComplete(allFilled);
    }
    if (key === "Delete") {
      e.currentTarget.value = "";
      values.current[index] = "";
      // Check if all inputs are filled after delete
      const allFilled = values.current.every((val) => val !== "" && val.length === 1);
      setIsCodeComplete(allFilled);
    }
    if (key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (key === "ArrowRight" && index < inputsRef.current.length - 1)
      inputsRef.current[index + 1]?.focus();
  }, [length]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();

    const pastedText = e.clipboardData.getData("text").replace(/\s+/g, "");

    if (!/^\d+$/.test(pastedText)) return;

    const digits = pastedText.split("");

    // Fill starting from the field where user pasted
    for (let i = 0; i < digits.length && i < length; i++) {
      const pos = i;
      values.current[pos] = digits[i];
      if (inputsRef.current[pos]) {
        inputsRef.current[pos]!.value = digits[i];
      }
    }

    // Check if all inputs are filled after paste
    const allFilled = values.current.every((val) => val !== "" && val.length === 1);
    setIsCodeComplete(allFilled);

    // Move focus to the next unfilled index
    const nextIndex = Math.min(index + digits.length, length - 1);
    inputsRef.current[nextIndex]?.focus();
  }, [length]);

  // Real-time validation function
  const validateInput = useCallback((contactType: "email" | "phone", value: string): string | null => {
    const trimmed = value.trim();
    
    // Don't show error if input is empty (user is still typing)
    if (!trimmed) {
      return null;
    }

    if (contactType === "email") {
      // Basic email format check
      if (!trimmed.includes("@")) {
        return "Email must include @ symbol";
      }
      if (trimmed.includes("@") && !trimmed.includes(".")) {
        return "Email must include a domain";
      }
      if (trimmed.startsWith("@") || trimmed.endsWith("@")) {
        return "Email cannot start or end with @";
      }
      if (trimmed.includes("@.") || trimmed.includes(".@")) {
        return "Invalid email format";
      }
      // Check that TLD (top-level domain) ends with letters
      const domainPart = trimmed.split("@")[1];
      if (domainPart) {
        const lastDotIndex = domainPart.lastIndexOf(".");
        if (lastDotIndex !== -1) {
          const tld = domainPart.substring(lastDotIndex + 1);
          // TLD must contain at least one letter and end with a letter
          if (!/[a-zA-Z]/.test(tld) || !/[a-zA-Z]$/.test(tld)) {
            return "Email domain must end with letters (e.g., .com, .org)";
          }
        }
      }
      // Full regex validation
      if (!emailRegex.test(trimmed)) {
        return "Please enter a valid email address";
      }
      return null; // Valid
    } else {
      // Phone validation - only digits, no alphabets or special chars
      // Check if input contains any non-digit characters
      if (/[a-zA-Z]/.test(trimmed)) {
        return "Phone number cannot contain letters";
      }
      if (/[^0-9\s-()]/.test(trimmed)) {
        return "Phone number can only contain digits";
      }
      
      const digits = trimmed.replace(/\D/g, "");
      if (digits.length === 0) {
        return "Phone number must contain digits";
      }
      if (digits.length < 10) {
        return "Phone number must be 10 digits";
      }
      if (digits.length > 10) {
        return "Phone number must be exactly 10 digits";
      }
      if (!phoneRegex.test(digits)) {
        return "Phone must be 10 digits (numbers only)";
      }
      return null; // Valid
    }
  }, [emailRegex, phoneRegex]);

  const validateContact = useCallback((
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
      // First check for invalid characters (letters, etc.) before stripping
      if (/[a-zA-Z]/.test(trimmed)) {
        return {
          ok: false,
          error: "Phone number cannot contain letters",
        };
      }
      
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
  }, [emailSchema, phoneSchema]);

  // called when finalizing edit (on blur or Enter)
  const finalizeEdit = useCallback((contactType: 'email'| 'phone', value: string ) => {
    const val = value.trim();
    if (!val) {
      setError("Value cannot be empty");
      // Keep editing mode active so error is visible
      return;
    }
    
    // For phone, extract just the number part (remove country code if included)
    let phoneNumber = val;
    if (contactType === "phone") {
      // Remove country code prefix if it exists
      phoneNumber = val.replace(/^\+\d+\s*/, "").trim();
      if (!phoneNumber) {
        setError("Phone number cannot be empty");
        // Keep editing mode active so error is visible
        return;
      }
    }
    
    const res = validateContact(contactType, phoneNumber);
    if (res.ok) {
      // Store phone with country code prefix for display
      const newContact = contactType === "phone" 
        ? `${countryCode} ${phoneNumber}` 
        : phoneNumber;
      setContact(newContact);
      setError(null);
      setIsEditing(false);
    } else {
      // Set error and keep editing mode active so error remains visible
      setError(res.error ?? "Invalid contact");
      // Keep editing mode active so error remains visible - don't exit edit mode
      setIsEditing(true);
    }
  }, [countryCode, validateContact]);

  const handleVerify = useCallback(async (): Promise<void> => {
    const code = values.current.join(""); // collect all digits

    setCodeError(null);
    setCodeSuccess(null);

    if (code.length !== length) {
      setCodeError("Please enter the full code");
      return;
    }
    
    // If onVerifyOtp is not provided (open-source scenario), show success message
    if (!onVerifyOtp) {
      setCodeSuccess("OTP verified successfully! 🎉");
      setCodeError(null);
      return;
    }

    // Call the user-provided verification function
    try {
      const result: { success: boolean; message?: string } = await onVerifyOtp(code);

      if (!result.success) {
        setCodeError(result.message || "Verification failed");
        setCodeSuccess(null);
        return;
      }

      // Show success message from API response or default
      setCodeSuccess(result.message || "OTP verified successfully! 🎉");
      setCodeError(null);
    } catch (err: unknown) {
      // Handle errors from user's onVerifyOtp function
      const errorMessage: string = err instanceof Error ? err.message : "Verification failed";
      setCodeError(errorMessage);
      setCodeSuccess(null);
    }
  }, [length, onVerifyOtp]);

  // Memoize edit handlers
  const handleEditClick = useCallback(() => {
    // Extract phone number without country code for editing
    let valueToEdit = contact;
    if (contactType === "phone") {
      // Remove country code prefix if it exists
      valueToEdit = contact.replace(/^\+\d+\s*/, "").trim();
      // Extract country code from contact if it exists
      const codeMatch = contact.match(/^(\+\d+)\s/);
      if (codeMatch) {
        setCountryCode(codeMatch[1]);
      }
    }
    setEditValue(valueToEdit);
    setIsEditing(true);
    setError(null);
  }, [contact, contactType]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEditValue(newValue);
    
    // Real-time validation while typing
    const validationError = validateInput(contactType, newValue);
    setError(validationError);
  }, [contactType, validateInput]);

  const handleInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    // Don't finalize if clicking on the select dropdown
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (relatedTarget && (relatedTarget.tagName === 'SELECT' || relatedTarget.closest?.('select'))) {
      return;
    }
    // Use setTimeout to avoid race condition with select dropdown
    setTimeout((): void => {
      const finalValue: string = contactType === "phone" 
        ? `${countryCode} ${editValue}` 
        : editValue;
      finalizeEdit(contactType, finalValue);
    }, 100);
  }, [contactType, countryCode, editValue, finalizeEdit]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const finalValue = contactType === "phone" 
        ? `${countryCode} ${editValue}` 
        : editValue;
      finalizeEdit(contactType, finalValue);
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(contact); // revert on escape
      setError(null);
    }
  }, [contactType, countryCode, editValue, contact, finalizeEdit]);

  const handleCountryCodeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    setCountryCode(newCode);
  }, []);

  // Generate unique IDs for ARIA attributes (must be before hooks that use them)
  const titleId = useMemo(() => `otp-title-${Math.random().toString(36).substr(2, 9)}`, []);
  const contactId = useMemo(() => `otp-contact-${Math.random().toString(36).substr(2, 9)}`, []);
  const otpInputsId = useMemo(() => `otp-inputs-${Math.random().toString(36).substr(2, 9)}`, []);
  const errorId = useMemo(() => `otp-error-${Math.random().toString(36).substr(2, 9)}`, []);
  const successId = useMemo(() => `otp-success-${Math.random().toString(36).substr(2, 9)}`, []);
  const resendSuccessId = useMemo(() => `otp-resend-success-${Math.random().toString(36).substr(2, 9)}`, []);

  // Handle pencil icon keyboard events
  const handlePencilKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleEditClick();
    }
  }, [handleEditClick]);

  // Handle select dropdown events
  const handleSelectMouseDown = useCallback((e: React.MouseEvent<HTMLSelectElement>) => {
    e.stopPropagation();
  }, []);

  const handleSelectClick = useCallback((e: React.MouseEvent<HTMLSelectElement>) => {
    e.stopPropagation();
  }, []);

  // Memoize country codes options
  const countryCodeOptions = useMemo(() => countryCodes.map((cc: { code: string; country: string; flag: string }) => (
    <option key={cc.code} value={cc.code}>
      {cc.flag} {cc.code}
    </option>
  )), []);

  // Memoize OTP inputs
  const otpInputs = useMemo(() => Array.from({ length }).map((_, i) => (
    <input
      key={i}
      type="text"
      inputMode="numeric"
      pattern="[0-9]"
      maxLength={1}
      ref={(el) => {(inputsRef.current[i] = el)}}
      onChange={(e) => handleChange(e, i)}
      onKeyDown={(e) => handleKeyDown(e, i)}
      onPaste={(e) => handlePaste(e, i)}
      aria-label={`Digit ${i + 1} of ${length}`}
      aria-describedby={otpInputsId}
      aria-invalid={codeError ? "true" : "false"}
      className="w-10 sm:w-12 h-14 text-center text-xl font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
    />
  )), [length, handleChange, handleKeyDown, handlePaste, otpInputsId, codeError]);

  return (
    <div className="w-full flex justify-center items-center py-10 px-4">
      <div
        role="main"
        aria-labelledby={titleId}
        className={cn(
          "shadow-lg rounded-2xl p-4 sm:p-6 md:p-8 w-full space-y-6 max-w-lg mx-auto",
          OtpVerificationVariants({ variant })
        )}
      >
        {/* Shield Icon - Top Center */}
        <div className="flex justify-center mb-4" role="img" aria-label="Security verification icon">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.2
            }}
            className="flex items-center justify-center"
          >
            <motion.div
              className={cn(
                "p-4 rounded-2xl relative",
                variant === "default" 
                  ? "bg-primary/10" 
                  : variant === "dark"
                  ? "bg-primary/20"
                  : "bg-primary/10",
                "shadow-lg shadow-primary/20"
              )}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Shield 
                className={cn(
                  "h-10 w-10",
                  variant === "default" ? "text-primary" : "text-primary-300"
                )}
                aria-hidden="true"
              />
              <motion.div
                className={cn(
                  "absolute inset-0 rounded-2xl",
                  variant === "default"
                    ? "bg-primary/5"
                    : "bg-white"
                )}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Title */}
        <div className="text-center space-y-1">
          <h2 id={titleId} className="text-2xl font-semibold">{title}</h2>
           <p
            id={contactId}
            className={cn(
              "flex flex-col items-center text-lg",
              variant === "default" ? "text-gray-800" : "text-gray-300"
            )}
            aria-live="polite"
          >
            We sent a code to your {contactType}

          {!isEditing ? (
            <span className="flex items-center gap-2" aria-label={`${contactType === "phone" ? "Phone number" : "Email address"}: ${contactType === "phone" ? `${countryCode} ${contact.replace(/^\+\d+\s*/, "").trim()}` : contact}`}>
              {contactType === "phone" && countryCode && (
                <span className="text-md font-medium" aria-label="Country code">{countryCode}</span>
              )}
              <span aria-label={contactType === "phone" ? "Phone number" : "Email address"}>
                {contactType === "phone" 
                  ? contact.replace(/^\+\d+\s*/, "").trim() 
                  : contact}
              </span>
              <Pencil
                size={16}
                className="ml-1 cursor-pointer text-gray-400 hover:text-gray-200 transition"
                onClick={handleEditClick}
                role="button"
                tabIndex={0}
                aria-label={`Edit ${contactType === "phone" ? "phone number" : "email address"}`}
                onKeyDown={handlePencilKeyDown}
              />
            </span>
          ) : (
            <div className="flex items-center gap-2 mt-2">
              {contactType === "phone" && (
                <select
                  value={countryCode}
                  onChange={handleCountryCodeChange}
                  onMouseDown={handleSelectMouseDown}
                  onClick={handleSelectClick}
                  aria-label="Country code"
                  className={cn(
                    "h-[38px] px-2 py-1 border rounded-lg text-sm cursor-pointer",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    error ? "border-red-500" : "border-gray-300",
                    variant === "default" 
                      ? "bg-white text-black" 
                      : "bg-neutral-800 text-white border-neutral-600"
                  )}
                >
                  {countryCodeOptions}
                </select>
              )}
              <input
                type={contactType === "email" ? "email" : "tel"}
                value={editValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                autoFocus
                placeholder={contactType === "phone" ? "Phone number" : "Email address"}
                aria-label={contactType === "phone" ? "Phone number" : "Email address"}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? errorId : undefined}
                className={cn(
                  "flex-1 h-[38px] text-center px-2 py-1 border rounded-lg",
                  error ? "border-red-500" : "border-gray-300",
                  variant === "default" 
                    ? "bg-white text-black" 
                    : "bg-neutral-800 text-white border-neutral-600"
                )}
              />
            </div>
          )}
          {error && (
            <span 
              id={errorId}
              className="text-red-500 text-sm mt-1"
              role="alert"
              aria-live="polite"
            >
              {error}
            </span>
          )}
          </p>
        </div>

        <p 
          id={otpInputsId}
          className={cn("text-lg py-4 text-center", variant === "default" ? "text-gray-800" : "text-gray-300")}
        >
          Enter {length} digit code
        </p>

        {/* OTP Inputs */}
        <motion.div
          key={animation}
          initial={currentAnimationVariant.initial}
          animate={currentAnimationVariant.animate}
          transition={{ duration: 0.5, ease: "easeOut" }}
          role="group"
          aria-labelledby={otpInputsId}
          className={cn(
            "flex justify-center gap-2 sm:gap-3",
            length > 5 && "flex-wrap"
          )}>
          {otpInputs}
        </motion.div>

        <AnimatePresence mode="wait">
          {codeError && (
            <motion.div
              key="error"
              id={errorId}
              role="alert"
              aria-live="assertive"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={cn(
                "flex items-center gap-2 text-sm p-3 rounded-lg border",
                variant === "dark"
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-red-50 border-red-200 text-red-600"
              )}
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span className="font-medium">{codeError}</span>
            </motion.div>
          )}
          {resendSuccess && (
            <motion.div
              key="resend-success"
              id={resendSuccessId}
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={cn(
                "flex items-center gap-2 text-sm p-3 rounded-lg border",
                variant === "dark"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-emerald-50 border-emerald-200 text-emerald-600"
              )}
            >
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span className="font-medium">{resendSuccess}</span>
            </motion.div>
          )}
          {codeSuccess && (
            <motion.div
              key="success"
              id={successId}
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={cn(
                "flex items-center gap-2 text-sm p-3 rounded-lg border",
                variant === "dark"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-emerald-50 border-emerald-200 text-emerald-600"
              )}
            >
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span className="font-medium">{codeSuccess}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <div className="flex justify-center mt-5">
          <Button
            onClick={handleVerify}
            disabled={!isCodeComplete}
            aria-label={submitButtonLabel}
            aria-describedby={codeError ? errorId : codeSuccess ? successId : undefined}
            className={cn(
              "w-full h-12 rounded-xl text-base",
              !isCodeComplete && "opacity-50 cursor-not-allowed",
              isCodeComplete && "cursor-pointer",
              OtpVerificationCardVariants({ variant }),
              isCodeComplete && `hover:${OtpVerificationCardVariants({ variant })}`
            )}
          >
            {submitButtonLabel}
          </Button>
        </div>

        {/* Resend */}
        <div className="text-center text-md hover:cursor-pointer">
          {cooldown > 0 ? (
            <span 
              className={cn("hover:underline", OtpVerificationVariants({ variant }))}
              role="status"
              aria-live="polite"
              aria-label={`Resend code available in ${cooldown} seconds`}
            >
              Didn't receive code? [ Resend in {cooldown}s ]
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={!!error}
              aria-label={error ? "Resend code unavailable due to validation error" : "Resend verification code"}
              className={cn(
                "hover:underline",
                error 
                  ? "cursor-not-allowed opacity-50" 
                  : "cursor-pointer",
                OtpVerificationVariants({ variant })
              )}
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

export const OTPVerificationPage: React.FC<OTPVerificationProps> = memo((props) => {
  return <OTPVerificationPageContent {...props} />;
});

OTPVerificationPage.displayName = "OTPVerificationPage";
