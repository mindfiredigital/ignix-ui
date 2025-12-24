"use client";

import React, { useMemo, useState } from "react";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  LogOut,
  Smartphone,
  MapPin,
  Clock,
  Activity,
  Key,
  CheckCircle2,
  Copy,
  History,
  Laptop,
  Tablet,
} from "lucide-react";

import { cn } from "../../../utils/cn";
import { Button } from "@ignix-ui/button";
import { AnimatedInput } from "@ignix-ui/input";
import { Switch } from "@ignix-ui/switch";
import { Table, type TableProps, type TableSortBy } from "@ignix-ui/table";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@ignix-ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@ignix-ui/card";

interface SecurityPageProps {
  title?: string;
  description?: string;
  /** Background theme */
  variant?: "light" | "dark" | "auto";
  /** Layout style for the main content */
  layout?: "grid" | "list";
}

const SecurityPageVariants = cva("", {
  variants: {
    variant: {
      auto: "bg-gradient-to-br from-background to-muted/30 text-foreground",
      light: "bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900",
      dark: "bg-gradient-to-br from-[#020617] via-slate-900 to-slate-950 text-foreground",
    },
  },
  defaultVariants: {
    variant: "dark",
  },
});

type Session = {
  id: string;
  device: string;
  device_type: "laptop" | "mobile" | "tablet";
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
};

type LoginEvent = {
  id: string;
  date: string;
  device: string;
  location: string;
  ip: string;
  status: "Success" | "Failed";
};

type PasswordStrengthLabel = "Very Weak" | "Weak" | "Fair" | "Good" | "Strong";

interface PasswordStrength {
  score: number; // 0-4
  label: PasswordStrengthLabel;
  color: string;
}

const computePasswordStrength = (password: string): PasswordStrength => {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const metCount = Object.values(requirements).filter(Boolean).length;

  let score = 0;
  let label: PasswordStrengthLabel = "Very Weak";
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

  return { score, label, color };
};

const SecurityPage: React.FC<SecurityPageProps> = ({
  title = "Security",
  description = "Manage account security, sessions, and two-factor authentication.",
  variant,
  layout = "grid",
}) => {
  // ---------------------------------------------------------------------------
  // Change password state
  // ---------------------------------------------------------------------------
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const passwordStrength = useMemo(
    () => computePasswordStrength(newPassword),
    [newPassword],
  );
  const passwordsMatch =
    newPassword === confirmPassword || confirmPassword.length === 0;

  const canUpdatePassword =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    passwordsMatch &&
    passwordStrength.score >= 2 &&
    !isUpdatingPassword;

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canUpdatePassword) return;

    setIsUpdatingPassword(true);
    setPasswordUpdated(false);

    // Demo: simulate API call
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setPasswordUpdated(true);
    }, 1200);
  };

  // ---------------------------------------------------------------------------
  // Active sessions & login history
  // ---------------------------------------------------------------------------
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      device: "MacBook Pro · Chrome",
      device_type: "laptop",
      location: "San Francisco, USA",
      ip: "192.168.0.24",
      lastActive: "Just now",
      current: true,
    },
    {
      id: "2",
      device: "iPhone 15 · Safari",
      device_type: "mobile",
      location: "San Francisco, USA",
      ip: "192.168.0.18",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      id: "3",
      device: "Windows · Edge",
      location: "Remote",
      device_type: "tablet",
      ip: "80.24.11.90",
      lastActive: "Yesterday · 21:14",
      current: false,
    },
  ]);

  const [sessionSortKey, setSessionSortKey] = useState<keyof Session>("lastActive");
  const [sessionSortDir, setSessionSortDir] = useState<TableSortBy>("asc");

  const applySessionSort: TableProps["applySort"] = (key, dir) => {
    setSessionSortKey(key as keyof Session);
    setSessionSortDir(dir);

    setSessions(prev => {
      const sorted = [...prev].sort((a, b) => {
        const av = String(a[key as keyof Session] ?? "");
        const bv = String(b[key as keyof Session] ?? "");
        if (av === bv) return 0;
        if (dir === "asc") return av > bv ? 1 : -1;
        return av < bv ? 1 : -1;
      });
      return sorted;
    });
  };

  const sessionHeadings: TableProps["headings"] = [
    { label: "Device", key: "device", sort: sessionSortKey === "device" ? sessionSortDir : "asc" },
    { label: "Location", key: "location", sort: sessionSortKey === "location" ? sessionSortDir : "asc" },
    { label: "IP Address", key: "ip", sort: sessionSortKey === "ip" ? sessionSortDir : "asc" },
    { label: "Last Active", key: "lastActive", sort: sessionSortKey === "lastActive" ? sessionSortDir : "asc" },
    { label: "Status", key: "status", sort: "asc" },
  ];

  const sessionRows = sessions.map(session => ({
    device: (
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        {session.device_type === "laptop" && (
          <Laptop className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
        )}
        {session.device_type === "mobile" && (
          <Smartphone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
        )}
        {session.device_type === "tablet" && (
          <Tablet className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
        )}
        <span className="truncate text-xs sm:text-sm">{session.device}</span>
      </div>
    ),
    location: (
      <div className="flex items-center gap-1 text-xs sm:text-sm min-w-0">
        <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
        <span className="truncate">{session.location}</span>
      </div>
    ),
    ip: <span className="font-mono text-[10px] sm:text-xs whitespace-nowrap">{session.ip}</span>,
    lastActive: (
      <div className="flex items-center gap-1 text-xs sm:text-sm min-w-0">
        <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
        <span className="truncate">{session.lastActive}</span>
      </div>
    ),
    status: (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium whitespace-nowrap",
          session.current
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/40"
            : "bg-zinc-800/40 text-zinc-300 border border-zinc-600/60",
        )}
      >
        {session.current ? "Current" : "Active"}
      </span>
    ),
  }));

  const [loginEvents] = useState<LoginEvent[]>([
    {
      id: "e1",
      date: "Today · 09:14",
      device: "MacBook Pro · Chrome",
      location: "San Francisco, USA",
      ip: "192.168.0.24",
      status: "Success",
    },
    {
      id: "e2",
      date: "Today · 07:02",
      device: "iPhone 15 · Safari",
      location: "San Francisco, USA",
      ip: "192.168.0.18",
      status: "Success",
    },
    {
      id: "e3",
      date: "Yesterday · 22:41",
      device: "Windows · Edge",
      location: "Remote",
      ip: "80.24.11.90",
      status: "Failed",
    },
    {
      id: "e4",
      date: "2 days ago · 18:22",
      device: "iPad · Safari",
      location: "Remote",
      ip: "77.202.144.10",
      status: "Success",
    },
  ]);

  const [loginSortKey, setLoginSortKey] = useState<keyof LoginEvent>("date");
  const [loginSortDir, setLoginSortDir] = useState<TableSortBy>("desc");

  const [loginData, setLoginData] = useState<LoginEvent[]>(() => [...loginEvents]);

  const applyLoginSort: TableProps["applySort"] = (key, dir) => {
    setLoginSortKey(key as keyof LoginEvent);
    setLoginSortDir(dir);

    setLoginData(prev => {
      const sorted = [...prev].sort((a, b) => {
        const av = String(a[key as keyof LoginEvent] ?? "");
        const bv = String(b[key as keyof LoginEvent] ?? "");
        if (av === bv) return 0;
        if (dir === "asc") return av > bv ? 1 : -1;
        return av < bv ? 1 : -1;
      });
      return sorted;
    });
  };

  const loginHeadings: TableProps["headings"] = [
    { label: "Date & Time", key: "date", sort: loginSortKey === "date" ? loginSortDir : "asc" },
    { label: "Device", key: "device", sort: loginSortKey === "device" ? loginSortDir : "asc" },
    { label: "Location", key: "location", sort: loginSortKey === "location" ? loginSortDir : "asc" },
    { label: "IP Address", key: "ip", sort: loginSortKey === "ip" ? loginSortDir : "asc" },
    { label: "Status", key: "status", sort: loginSortKey === "status" ? loginSortDir : "asc" },
  ];

  const loginRows = loginData.map(event => ({
    date: (
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
        <span className="truncate text-xs sm:text-sm">{event.date}</span>
      </div>
    ),
    device: <span className="text-xs sm:text-sm truncate block min-w-0">{event.device}</span>,
    location: (
      <div className="flex items-center gap-1 text-xs sm:text-sm min-w-0">
        <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
        <span className="truncate">{event.location}</span>
      </div>
    ),
    ip: <span className="font-mono text-[10px] sm:text-xs whitespace-nowrap">{event.ip}</span>,
    status: (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium whitespace-nowrap",
          event.status === "Success"
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/40"
            : "bg-red-500/10 text-red-400 border border-red-500/40",
        )}
      >
        {event.status}
      </span>
    ),
  }));

  const handleLogoutAll = () => {
    if (typeof window !== "undefined") {
      const ok = window.confirm(
        "Are you sure you want to log out from all other sessions? This will sign you out on all devices except this one.",
      );
      if (!ok) return;
    }

    setSessions(prev => prev.filter(session => session.current));
  };

  // ---------------------------------------------------------------------------
  // 2FA toggle & recovery codes
  // ---------------------------------------------------------------------------
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [backupCodes] = useState<string[]>([
    "ABCD-1234",
    "EFGH-5678",
    "IJKL-9012",
    "MNOP-3456",
    "QRST-7890",
    "UVWX-1357",
  ]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyBackupCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 1500);
    }
  };

  const copyAllBackupCodes = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(backupCodes.join("\n"));
      setCopiedCode("all");
      setTimeout(() => setCopiedCode(null), 1500);
    }
  };

  const strengthLabelColor =
    passwordStrength.score <= 1
      ? "text-red-400"
      : passwordStrength.score === 2
      ? "text-orange-400"
      : passwordStrength.score === 3
      ? "text-yellow-300"
      : passwordStrength.label === "Good"
      ? "text-blue-400"
      : "text-emerald-400";

  // ---------------------------------------------------------------------------
  // Render helpers for sections (reuse in grid & list layouts)
  // ---------------------------------------------------------------------------

  const renderChangePasswordSection = () => (
    <Card variant={layout=="grid"?"premium":"default"} animation="slideUp" className="w-full">
      <CardHeader variant="spacious" className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 sm:p-3 flex-shrink-0">
            <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle size="lg" gradient="blue" className="text-lg sm:text-xl md:text-2xl break-words">
              Change password
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm break-words">
              Use a strong, unique password and update it regularly to keep your
              account secure.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent variant="spacious" className="p-4 sm:p-6 md:p-8 pt-0">
        <form className="space-y-4 sm:space-y-6 md:space-y-8" onSubmit={handlePasswordUpdate}>
          <div className="w-full">
            <AnimatedInput
              placeholder="Current password"
              variant="clean"
              value={currentPassword}
              onChange={setCurrentPassword}
              type="password"
              icon={Lock}
              showPasswordToggle
              size="md"
              inputClassName="w-full"
              labelClassName={cn("ms-5")}
            />
          </div>

          <div className="space-y-4 sm:space-y-5">
            <div className="w-full">
              <AnimatedInput
                placeholder="New password"
                variant="clean"
                value={newPassword}
                onChange={setNewPassword}
                type="password"
                icon={Key}
                showPasswordToggle
                size="md"
                inputClassName="w-full"
                labelClassName={cn("ms-5")}
              />
            </div>

            {newPassword.length > 0 && (
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                  <span className="text-muted-foreground whitespace-nowrap">
                    Password strength:
                  </span>
                  <span className={cn("font-medium flex-shrink-0", strengthLabelColor)}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="flex h-1.5 gap-1">
                  {[0, 1, 2, 3, 4].map(index => (
                    <motion.div
                      key={index}
                      className={cn(
                        "flex-1 rounded-full transition-colors",
                        index <= passwordStrength.score
                          ? passwordStrength.color
                          : "bg-zinc-800/60",
                      )}
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX:
                          index <= passwordStrength.score ? 1 : 0.3,
                      }}
                      transition={{ delay: index * 0.08 }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-full">
            <AnimatedInput
              placeholder="Confirm new password"
              variant="clean"
              value={confirmPassword}
              onChange={setConfirmPassword}
              type="password"
              icon={Lock}
              showPasswordToggle
              size="md"
              inputClassName="w-full"
              error={
                confirmPassword.length > 0 && !passwordsMatch
                  ? "Passwords do not match"
                  : undefined
              }
              success={
                confirmPassword.length > 0 &&
                passwordsMatch &&
                newPassword.length > 0
              }
              successMessage="Passwords match"
              labelClassName={cn("ms-5",((confirmPassword.length > 0 && !passwordsMatch)||( confirmPassword.length > 0 &&
                passwordsMatch &&
                newPassword.length > 0))?"top-1/4":"top-1/2")}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <p className="text-xs sm:text-sm max-w-full sm:max-w-md break-words">
              Use at least 8 characters with a mix of letters, numbers, and
              symbols. Avoid using passwords you&apos;ve used elsewhere.
            </p>

            <Button
              type="submit"
              size="md"
              className="w-full sm:w-auto flex-shrink-0"
              disabled={!canUpdatePassword}
              animationVariant={canUpdatePassword ? "press3D" : undefined}
            >
              {isUpdatingPassword ? (
                <>
                  <motion.div
                    className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      ease: "linear",
                    }}
                  />
                  Updating…
                </>
              ) : (
                "Update password"
              )}
            </Button>
          </div>

          {passwordUpdated && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-xs md:text-sm text-emerald-400"
            >
              <CheckCircle2 className="h-4 w-4" />
              Password updated successfully.
            </motion.div>
          )}
        </form>
      </CardContent>
    </Card>
  );

  const renderActiveSessionsSection = () => (
    <Card variant={layout=="grid"?"premium":"default"} animation="slideUp" className="w-full">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle size="md" className="text-base sm:text-lg md:text-xl break-words">Active sessions</CardTitle>
            <CardDescription className="text-xs sm:text-sm break-words">
              Review devices that are currently signed in to your account.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogoutAll}
            animationVariant="press3DSoft"
            className="w-full sm:w-auto flex-shrink-0 whitespace-nowrap"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Logout all sessions</span>
            <span className="sm:hidden">Logout all</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent variant="flush" className="p-4">
        <div className="overflow-x-auto -mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0 pb-4">
          <div className="min-w-[600px] sm:min-w-0 w-full">
            <Table
              headings={sessionHeadings}
              data={sessionRows}
              applySort={applySessionSort}
              variant="ghost"
              size="sm"
              animationVariant="fade"
              showHoverEffects={false}
              showStripes={false}
              showBorders={false}
              glow={false}
              currentPage={1}
              totalPages={1}
              onPageChange={() => {
                console.log("Page change requested");
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTwoFactorSection = () => (
    <Card variant={layout=="grid"?"premium":"default"} animation="scaleIn" className="w-full">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle size="md" className="text-base sm:text-lg md:text-xl break-words">Two-factor authentication</CardTitle>
            <CardDescription className="text-xs sm:text-sm break-words">
              Add an extra layer of protection with a verification code from your
              authenticator app.
            </CardDescription>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={setTwoFactorEnabled}
            variant="ios"
            animation="elastic"
            glowEffect
            aria-label="Enable two-factor authentication"
            className="flex-shrink-0 mt-1 sm:mt-0"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {twoFactorEnabled ? (
          <div className="space-y-4 sm:space-y-5">
            <p className="text-xs sm:text-sm text-muted-foreground break-words">
              Two-factor authentication is <span className="font-medium text-emerald-400">enabled</span>.
              Use your authenticator app to approve new logins. Save your recovery
              codes in a safe place.
            </p>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Recovery codes
                </span>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={copyAllBackupCodes}
                    className="w-full sm:w-auto"
                  >
                    <Copy className="mr-1 h-3 w-3" />
                    {copiedCode === "all" ? "Copied" : "Copy all"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                {backupCodes.map(code => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => copyBackupCode(code)}
                    className={cn(
                      "flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-mono",
                      "bg-background/80 border-border/60 hover:border-primary/60 hover:bg-primary/5 transition-colors",
                      "w-full",
                    )}
                  >
                    <span className="truncate">{code}</span>
                    {copiedCode === code ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 ml-2" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>

              <p className="text-[11px] sm:text-xs break-words">
                Each recovery code can be used once. Store them securely in a
                password manager or print them and keep them in a safe place.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              asChild
            >
              <a href="#two-factor-management">
                Manage full 2FA setup
              </a>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-muted-foreground break-words">
              Two-factor authentication is currently{" "}
              <span className="font-medium text-red-400">disabled</span>. We
              strongly recommend enabling it to prevent unauthorized access.
            </p>
            <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1 break-words">
              <li>Protects you even if your password is compromised.</li>
              <li>
                Uses a time-based code from apps like Google Authenticator or
                1Password.
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderLoginActivitySection = () => (
    <Card variant={layout=="grid"?"premium":"default"} animation="slideUp" className="w-full">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle size="md" className="text-base sm:text-lg md:text-xl break-words">Login activity</CardTitle>
            <CardDescription className="text-xs sm:text-sm break-words">
              Recent sign-ins and security events for your account.
            </CardDescription>
          </div>
          <History className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
        </div>
      </CardHeader>
      <CardContent variant="flush" className="p-4">
        <div className="overflow-x-auto -mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0 pb-4">
          <div className="min-w-[600px] sm:min-w-0 w-full">
            <Table
              headings={loginHeadings}
              data={loginRows}
              applySort={applyLoginSort}
              variant="ghost"
              size="sm"
              animationVariant="fade"
              showHoverEffects={false}
              showStripes={false}
              showBorders={false}
              glow={false}
              currentPage={1}
              totalPages={1}
              onPageChange={() => {
                console.log("Page change requested");
              }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter variant="spacious" justify="between" className="p-4 sm:p-4 pt-0">
        <p className="text-[11px] sm:text-xs break-words">
          If you notice unfamiliar activity, change your password immediately and
          review active sessions.
        </p>
      </CardFooter>
    </Card>
  );

  return (
    <div
      className={cn(
        "min-h-screen p-4 sm:p-6 md:p-10",
        SecurityPageVariants({ variant }),
      )}
    >
      {/* Header */}
      <div className="mb-6 sm:mb-8 md:mb-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className={variant == "dark" ? "text-white" : ""}>{title}</span>
            <span className="inline-flex items-center justify-center rounded-full bg-emerald-500/10 px-2.5 sm:px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/40 w-fit">
              <Shield className="mr-1 h-3 w-3" />
              High security
            </span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground flex-shrink-0">
          <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="whitespace-nowrap">Last security review · 3 days ago</span>
        </div>
      </div>

      {layout === "list" ? (
        // List / accordion layout className={variant == "dark" ? "text-white" : ""}
        <div className={`w-full max-w-4xl mx-auto ${variant == "dark" ? "text-white" : ""}`}>
          <Accordion type="single" collapsible defaultValue="change-password">
            <AccordionItem value="change-password">
              <AccordionTrigger className="text-sm sm:text-base">
                Change password
              </AccordionTrigger>
              <AccordionContent variant="slideDown">
                {renderChangePasswordSection()}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="two-factor">
              <AccordionTrigger className="text-sm sm:text-base">
                Two-factor authentication
              </AccordionTrigger>
              <AccordionContent variant="slideDown">
                {renderTwoFactorSection()}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="active-sessions">
              <AccordionTrigger className="text-sm sm:text-base">
                Active sessions
              </AccordionTrigger>
              <AccordionContent variant="slideDown">
                {renderActiveSessionsSection()}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="login-activity">
              <AccordionTrigger className="text-sm sm:text-base">
                Login activity
              </AccordionTrigger>
              <AccordionContent variant="slideDown">
                {renderLoginActivitySection()}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ) : (
        // Default grid layout
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
          {/* Left column */}
          <div className="space-y-4 sm:space-y-6 w-full min-w-0">
            {renderChangePasswordSection()}
            {renderActiveSessionsSection()}
          </div>

          {/* Right column */}
          <div className="space-y-4 sm:space-y-6 w-full min-w-0">
            {renderTwoFactorSection()}
            {renderLoginActivitySection()}
          </div>
        </div>
      )}
    </div>
  );
};

export { SecurityPage };
export default SecurityPage;
