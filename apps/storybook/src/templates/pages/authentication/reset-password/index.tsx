"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AnimatedInput } from "../../../../components/input";
import { Button } from "../../../../components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/card";
import { Lock, Key, CheckCircle2, Shield, XCircle } from "lucide-react";
import { cn } from "../../../../../utils/cn";

interface PasswordStrength {
  score: number; // 0-4
  label: "Very Weak" | "Weak" | "Fair" | "Good" | "Strong";
  color: string;
  requirements: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

interface ResetPasswordPageProps {
  token?: string;
  inputVariant?: string;
  onSubmit?: (password: string, token: string) => void;
  onTokenValidate?: (token: string) => boolean;
  className?: string;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  token: initialToken = "",
  inputVariant = "clean",
  onSubmit,
  onTokenValidate,
  className,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState(initialToken);
  const [tokenError, setTokenError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Calculate password strength
  const passwordStrength = useMemo((): PasswordStrength => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const metCount = Object.values(requirements).filter(Boolean).length;
    let score = 0;
    let label: PasswordStrength["label"] = "Very Weak";
    let color = "bg-red-500";

    if (password.length === 0) {
      score = 0;
      label = "Very Weak";
      color = "bg-gray-300";
    } else if (password.length < 6) {
      score = 1;
      label = "Very Weak";
      color = "bg-red-500";
    } else if (metCount <= 2) {
      score = 2;
      label = "Weak";
      color = "bg-orange-500";
    } else if (metCount === 3) {
      score = 3;
      label = "Fair";
      color = "bg-yellow-500";
    } else if (metCount === 4) {
      score = 4;
      label = "Good";
      color = "bg-blue-500";
    } else {
      score = 4;
      label = "Strong";
      color = "bg-green-500";
    }

    return { score, label, color, requirements };
  }, [password]);

  // Validate token (hint: this is where you'd integrate with your backend)
  const validateToken = (token: string): boolean => {
    if (onTokenValidate) {
      return onTokenValidate(token);
    }
    // Default validation hint: token should be 6-32 characters
    return token.length >= 6 && token.length <= 32;
  };

  const handleTokenChange = (value: string) => {
    setResetToken(value);
    if (value && !validateToken(value)) {
      setTokenError("Invalid or expired reset token. Please check your email.");
    } else {
      setTokenError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate token
    if (!resetToken || !validateToken(resetToken)) {
      setTokenError("Please enter a valid reset token");
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      return;
    }

    // Validate password strength
    if (passwordStrength.score < 2) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (onSubmit) {
        onSubmit(password, resetToken);
      }
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1500);
  };

  const passwordsMatch = password === confirmPassword || confirmPassword.length === 0;
  const canSubmit = 
    resetToken && 
    validateToken(resetToken) && 
    password && 
    passwordsMatch && 
    passwordStrength.score >= 2 &&
    !isSubmitting;

  return (
    <div className={cn("min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card variant="default" className="shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle size="lg" className="text-center">
              Reset Your Password
            </CardTitle>
            <CardDescription className="text-center">
              Enter your reset token and create a new secure password
            </CardDescription>
          </CardHeader>

          <CardContent>
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4"
                >
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">Password Reset Successful!</h3>
                <p className="text-muted-foreground">
                  Your password has been reset. You can now log in with your new password.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Reset Token Input */}
                <div>
                  <AnimatedInput
                    placeholder="Reset Token / Code"
                    variant={inputVariant}
                    value={resetToken}
                    onChange={handleTokenChange}
                    type="text"
                    icon={Key}
                    error={tokenError}
                    size="md"
                    labelClassName={cn("ms-5",tokenError?"top-1/4":"top-1/2")}
                  />
                  {/* {tokenError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-2 flex items-center gap-2"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {tokenError}
                    </motion.p>
                  )} */}
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Hint: Check your email for the reset token. Token validation checks format and length.
                  </p>
                </div>

                {/* New Password Input */}
                <div>
                  <AnimatedInput
                    placeholder="New Password"
                    variant={inputVariant}
                    value={password}
                    onChange={setPassword}
                    type="password"
                    icon={Lock}
                    showPasswordToggle
                    size="md"
                    labelClassName={cn("ms-5", 
                      (password.length > 0 && passwordStrength.score < 2)||(password.length > 0 && passwordStrength.score == 4) ?"top-1/4":"top-1/2")
                    }
                    error={
                      password.length > 0 && passwordStrength.score < 2
                        ? "Password is too weak"
                        : undefined
                    }
                    success={password.length > 0 && passwordStrength.score == 4}
                    successMessage="Strong password achieved"
                  />

                  {/* Password Strength Indicator */}
                  {password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 space-y-2"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Password Strength:</span>
                        <span className={cn("font-medium", {
                          "text-red-500": passwordStrength.score <= 1,
                          "text-orange-500": passwordStrength.score === 2,
                          "text-yellow-500": passwordStrength.score === 3,
                          "text-blue-500": passwordStrength.score === 4 && passwordStrength.label === "Good",
                          "text-green-500": passwordStrength.label === "Strong",
                        })}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="flex gap-1 h-2">
                        {[0, 1, 2, 3, 4].map((index) => (
                          <motion.div
                            key={index}
                            className={cn(
                              "flex-1 rounded-full transition-colors",
                              index <= passwordStrength.score
                                ? passwordStrength.color
                                : "bg-muted"
                            )}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: index <= passwordStrength.score ? 1 : 0.3 }}
                            transition={{ delay: index * 0.1 }}
                          />
                        ))}
                      </div>

                      {/* Password Requirements */}
                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                        {[
                          { key: "minLength", label: "At least 8 characters", icon: passwordStrength.requirements.minLength ? CheckCircle2 : XCircle },
                          { key: "hasUpperCase", label: "One uppercase letter", icon: passwordStrength.requirements.hasUpperCase ? CheckCircle2 : XCircle },
                          { key: "hasLowerCase", label: "One lowercase letter", icon: passwordStrength.requirements.hasLowerCase ? CheckCircle2 : XCircle },
                          { key: "hasNumber", label: "One number", icon: passwordStrength.requirements.hasNumber ? CheckCircle2 : XCircle },
                          { key: "hasSpecialChar", label: "One special character", icon: passwordStrength.requirements.hasSpecialChar ? CheckCircle2 : XCircle },
                        ].map((req) => {
                          const Icon = req.icon;
                          const met = passwordStrength.requirements[req.key as keyof typeof passwordStrength.requirements];
                          return (
                            <div
                              key={req.key}
                              className={cn(
                                "flex items-center gap-1.5",
                                met ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                              )}
                            >
                              <Icon className={cn("h-3.5 w-3.5", met ? "text-green-600 dark:text-green-400" : "text-muted-foreground")} />
                              <span>{req.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <AnimatedInput
                    placeholder="Confirm Password"
                    variant={inputVariant}
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    type="password"
                    icon={Lock}
                    showPasswordToggle
                    size="md"
                    labelClassName={cn(
                      "ms-5",
                      (confirmPassword.length > 0 && !passwordsMatch)||(confirmPassword.length > 0 && passwordsMatch && password.length > 0) ? "top-1/4" : "top-1/2"
                      )}
                    error={
                      confirmPassword.length > 0 && !passwordsMatch
                        ? "Passwords do not match"
                        : undefined
                    }
                    success={confirmPassword.length > 0 && passwordsMatch && password.length > 0}
                    successMessage="Passwords match successfully"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className={cn("w-full", className === "dark" ? "text-black" : "")}
                  disabled={!canSubmit}
                  animationVariant={canSubmit ? "press3D" : undefined}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;

