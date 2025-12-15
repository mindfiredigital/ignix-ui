"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Copy, Download, CheckCircle2, XCircle, Key } from "lucide-react";
import { cn } from "../../../utils/cn";
import { Button } from "@ignix-ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ignix-ui/card";

export interface TwoFactorAuthSetupProps {
  secretKey?: string;
  accountName?: string;
  issuer?: string;
  backupCodes?: string[];
  onVerify?: (code: string) => Promise<{ success: boolean; message?: string }>;
  onSaveBackupCodes?: (codes: string[]) => void;
  variant?: "default" | "dark" | "gradient";
  className?: string;
}

type SetupStep = "qr" | "manual" | "backup" | "verify";

const TwoFactorAuthSetupPage: React.FC<TwoFactorAuthSetupProps> = ({
  secretKey = "JBSWY3DPEHPK3PXP",
  accountName = "user@example.com",
  issuer = "Your App",
  backupCodes: initialBackupCodes,
  onVerify,
  onSaveBackupCodes,
  variant = "default",
  className,
}) => {
  const [currentStep, setCurrentStep] = useState<SetupStep>("qr");
  const [showManualCode, setShowManualCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(""));
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [backupCodes] = useState<string[]>(
    initialBackupCodes || [
      "1234-5678",
      "2345-6789",
      "3456-7890",
      "4567-8901",
      "5678-9012",
      "6789-0123",
      "7890-1234",
      "8901-2345",
    ]
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secretKey}&issuer=${encodeURIComponent(issuer)}`
  )}`;

  const manualCode = secretKey.match(/.{1,4}/g)?.join(" ") || secretKey;

  useEffect(() => {
    if (currentStep === "verify") {
      inputsRef.current[0]?.focus();
    }
  }, [currentStep]);

  const handleVerificationChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setVerificationError(null);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleVerificationKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const key = e.key;
    if (key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (key === "Delete") e.currentTarget.value = "";
    if (key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (key === "ArrowRight" && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleVerificationPaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").replace(/\s+/g, "");
    if (!/^\d+$/.test(pastedText)) return;

    const digits = pastedText.split("").slice(0, 6);
    const newCode = [...verificationCode];
    digits.forEach((digit, i) => {
      if (i < 6) newCode[i] = digit;
    });
    setVerificationCode(newCode);

    const nextIndex = Math.min(index + digits.length, 5);
    inputsRef.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const code = verificationCode.join("");
    if (code.length !== 6) {
      setVerificationError("Please enter the full 6-digit code");
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    if (onVerify) {
      try {
        const result = await onVerify(code);
        if (result.success) {
          setVerificationSuccess(true);
          if (onSaveBackupCodes) {
            onSaveBackupCodes(backupCodes);
          }
        } else {
          setVerificationError(result.message || "Invalid code. Please try again.");
        }
      } catch (error) {
        setVerificationError("An error occurred. Please try again.");
        console.error("Verification error:", error);
      }
    } else {
      setTimeout(() => {
        setVerificationSuccess(true);
        if (onSaveBackupCodes) {
          onSaveBackupCodes(backupCodes);
        }
      }, 1000);
    }

    setIsVerifying(false);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyAllBackupCodes = () => {
    const codesText = backupCodes.join("\n");
    navigator.clipboard.writeText(codesText);
    setCopiedCode("all");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDownloadBackupCodes = () => {
    const codesText = `Two-Factor Authentication Backup Codes\n\n${backupCodes.join("\n")}\n\nSave these codes in a safe place. Each code can only be used once.`;
    const blob = new Blob([codesText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "2fa-backup-codes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const variantClasses = {
    default: "bg-gradient-to-br from-background to-muted/20",
    dark: "bg-gradient-to-br from-gray-900 via-gray-800 to-black",
    gradient: "bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900",
  } as const;

  const cardVariantClasses = {
    default: "bg-background",
    dark: "bg-gray-800 border-gray-700",
    gradient: "bg-gray-800/90 backdrop-blur-sm border-gray-700",
  } as const;

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center p-4",
        variantClasses[variant],
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card variant="default" className={cn("shadow-2xl", cardVariantClasses[variant])}>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle size="lg" className="text-center">
              Set Up Two-Factor Authentication
            </CardTitle>
            <CardDescription className="text-center">
              Secure your account with an extra layer of protection
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-2 mb-6">
              {[
                { key: "setup", label: "Setup" },
                { key: "backup", label: "Backup Codes" },
                { key: "verify", label: "Verify" },
              ].map((step, index) => {
                const isActive =
                  (step.key === "setup" && (currentStep === "qr" || currentStep === "manual")) ||
                  (step.key === "backup" && currentStep === "backup") ||
                  (step.key === "verify" && currentStep === "verify");

                const isCompleted =
                  (step.key === "setup" && (currentStep === "backup" || currentStep === "verify")) ||
                  (step.key === "backup" && currentStep === "verify");

                return (
                  <React.Fragment key={step.key}>
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                          isActive
                            ? "bg-primary text-white"
                            : isCompleted
                            ? "bg-primary/50 text-white"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {isCompleted ? "✓" : index + 1}
                      </div>
                      <span className="text-xs mt-1 text-muted-foreground hidden sm:block">
                        {step.label}
                      </span>
                    </div>
                    {index < 2 && (
                      <div
                        className={cn(
                          "h-1 w-12 transition-all mt-4",
                          isCompleted ? "bg-primary" : "bg-muted"
                        )}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {currentStep === "qr" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Set Up Authenticator App</h3>
                  <p className="text-muted-foreground">
                    Scan this QR code with your authenticator app to add this account.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Popular apps: Google Authenticator, Authy, Microsoft Authenticator, 1Password
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-lg border-2 border-border">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code for 2FA setup"
                      className="w-48 h-48"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    variant="default"
                    onClick={() => {
                      setCurrentStep("manual");
                      setShowManualCode(true);
                    }}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Enter Code Manually
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => setCurrentStep("backup")}
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === "manual" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Enter Code Manually</h3>
                  <p className="text-muted-foreground">
                    If you can't scan the QR code, enter this secret key manually in your authenticator app
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    In your app, select "Enter a setup key" or "Manual entry" and paste this code
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg border-2 border-dashed border-border">
                  <div className="flex items-center justify-between">
                    <code className="text-lg font-mono tracking-wider">{manualCode}</code>
                    <Button
                      variant="default"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(secretKey);
                        setCopiedCode("manual");
                        setTimeout(() => setCopiedCode(null), 2000);
                      }}
                    >
                      {copiedCode === "manual" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button variant="default" onClick={() => setCurrentStep("qr")}>
                    Back
                  </Button>
                  <Button variant="default" onClick={() => setCurrentStep("backup")}>
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === "backup" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Save Your Backup Codes</h3>
                  <p className="text-muted-foreground">
                    These one-time codes can be used to access your account if you lose access to
                    your authenticator app. Save them in a safe place.
                  </p>
                </div>

                <div className="bg-muted/50 p-6 rounded-lg border-2 border-dashed border-border">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {backupCodes.map((code, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-background rounded border"
                      >
                        <code className="text-sm font-mono">{code}</code>
                        <Button
                          variant="default"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopyCode(code)}
                        >
                          {copiedCode === code ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 justify-center flex-wrap">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleCopyAllBackupCodes}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {copiedCode === "all" ? "Copied!" : "Copy All"}
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleDownloadBackupCodes}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    variant="default"
                    onClick={() => {
                      setCurrentStep(showManualCode ? "manual" : "qr");
                    }}
                  >
                    Back
                  </Button>
                  <Button variant="default" onClick={() => setCurrentStep("verify")}>
                    I've Saved My Codes
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === "verify" && !verificationSuccess && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Verify Setup</h3>
                  <p className="text-muted-foreground">
                    Enter the 6-digit code from your authenticator app to confirm setup
                  </p>
                </div>

                <div className="flex gap-2 justify-center">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      ref={(el) => {
                        inputsRef.current[i] = el;
                      }}
                      value={verificationCode[i]}
                      onChange={(e) => handleVerificationChange(e, i)}
                      onKeyDown={(e) => handleVerificationKeyDown(e, i)}
                      onPaste={(e) => handleVerificationPaste(e, i)}
                      className={cn(
                        "w-12 h-14 text-center text-xl font-semibold border-2 rounded-lg",
                        "focus:outline-none focus:ring-2 focus:ring-primary transition-all",
                        verificationError
                          ? "border-red-500 focus:ring-red-500"
                          : "border-border focus:border-primary"
                      )}
                    />
                  ))}
                </div>

                {verificationError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 text-center flex items-center justify-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    {verificationError}
                  </motion.p>
                )}

                <div className="flex gap-3 justify-center">
                  <Button variant="default" onClick={() => setCurrentStep("backup")}>
                    Back
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleVerify}
                    disabled={isVerifying || verificationCode.join("").length !== 6}
                  >
                    {isVerifying ? "Verifying..." : "Verify & Complete Setup"}
                  </Button>
                </div>
              </motion.div>
            )}

            {verificationSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4"
                >
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </motion.div>
                <h3 className="text-xl font-semibold">Two-Factor Authentication Enabled!</h3>
                <p className="text-muted-foreground">
                  Your account is now protected with two-factor authentication. Make sure to keep
                  your backup codes safe.
                </p>
                <Button variant="default" onClick={() => window.location.reload()}>
                  Done
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TwoFactorAuthSetupPage;
export { TwoFactorAuthSetupPage };
