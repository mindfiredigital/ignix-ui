"use client";

import React, { useState } from "react";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Save,
  X,
  Activity,
} from "lucide-react";

// Utility to merge Tailwind class names
import { cn } from "../../../utils/cn";
// Ignix UI primitives used to compose the page
import { Button } from "@ignix-ui/button";
import { Switch } from "@ignix-ui/switch";
import { RadioGroup } from "@ignix-ui/radio";
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
} from "@ignix-ui/card";

/**
 * Props accepted by the NotificationPage template.
 *
 * - `title`: Main page heading.
 * - `description`: Short helper text under the heading.
 * - `variant`: Background theme (light/dark/auto).
 * - `layout`: Layout mode (two-column grid or accordion list).
 */
interface NotificationPageProps {
  title?: string;
  description?: string;
  /** Background theme */
  variant?: "light" | "dark" | "auto";
  /** Layout style for the main content */
  layout?: "grid" | "list";
}

/**
 * Background theme variants for the whole page.
 * Uses Tailwind gradients, similar to other account-management templates.
 */
const NotificationPageVariants = cva("", {
  variants: {
    variant: {
      auto: "bg-gradient-to-br from-background to-muted/30 text-foreground",
      light: "bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900",
      dark: "bg-gradient-to-br from-[#020617] via-slate-900 to-slate-950 text-foreground",
    },
  },
  defaultVariants: {
    variant: "auto",
  },
});

/**
 * How often notifications should be delivered.
 */
type NotificationFrequency = "realtime" | "daily" | "weekly";

/**
 * Single source of truth for all notification-related settings.
 */
interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: NotificationFrequency;
  marketing: boolean;
  updates: boolean;
  alerts: boolean;
}

/**
 * NotificationPage
 *
 * A full account-notification settings page with:
 * - Channel toggles (Email, Push, SMS).
 * - Frequency selection (real‑time, daily, weekly).
 * - Type preferences (Marketing, Updates, Alerts).
 * - “Unsubscribe from all” with confirmation.
 *
 * This is the version exported in the Ignix registry templates.
 */
const NotificationPage: React.FC<NotificationPageProps> = ({
  title = "Notifications",
  description = "Manage your notification preferences and stay informed about what matters to you.",
  variant,
  layout = "grid",
}) => {
  // All channel + type + frequency settings live in one object
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    push: true,
    sms: false,
    frequency: "realtime",
    marketing: true,
    updates: true,
    alerts: true,
  });

  // UI flags for saving + confirmation states
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false);

  /**
   * Toggle a single delivery channel (Email, Push, SMS).
   */
  const handleChannelToggle = (channel: "email" | "push" | "sms") => {
    setPreferences(prev => ({
      ...prev,
      [channel]: !prev[channel],
    }));
    setSaved(false);
  };

  /**
   * Update how often notifications are delivered.
   * Accepts `string` to match RadioGroup’s onChange API.
   */
  const handleFrequencyChange = (frequency: string) => {
    setPreferences(prev => ({
      ...prev,
      frequency: frequency as NotificationFrequency,
    }));
    setSaved(false);
  };

  /**
   * Toggle one of the logical notification types (Marketing / Updates / Alerts).
   */
  const handleTypeToggle = (type: "marketing" | "updates" | "alerts") => {
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
    setSaved(false);
  };

  /**
   * Simulate saving preferences to the server.
   * In real apps, replace setTimeout with an API call.
   */
  const handleSavePreferences = () => {
    setIsSaving(true);
    setSaved(false);

    // Demo: simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1200);
  };

  /**
   * Turn off all channels + types at once.
   * User still needs to click “Save preferences” afterwards.
   */
  const handleUnsubscribeAll = () => {
    setPreferences({
      email: false,
      push: false,
      sms: false,
      frequency: "weekly",
      marketing: false,
      updates: false,
      alerts: false,
    });
    setShowUnsubscribeConfirm(false);
    setSaved(false);
  };

  // Used for the header badge (“Active” vs “Inactive”)
  const hasAnyNotificationsEnabled =
    preferences.email || preferences.push || preferences.sms;

  // Options rendered in the RadioGroup for frequency
  const frequencyOptions = [
    { value: "realtime", label: "Real-time" },
    { value: "daily", label: "Daily digest" },
    { value: "weekly", label: "Weekly summary" },
  ];

  /**
   * Card: Email / Push / SMS toggles.
   */
  const renderNotificationChannelsSection = () => (
    <Card
      variant={layout === "grid" ? "premium" : "default"}
      animation="slideUp"
      className="w-full"
    >
      <CardHeader variant="spacious" className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 sm:p-3 flex-shrink-0">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle
              size="lg"
              gradient="blue"
              className="text-lg sm:text-xl md:text-2xl break-words"
            >
              Notification channels
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm break-words">
              Choose how you want to receive notifications across different
              channels.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent variant="spacious" className="p-4 sm:p-6 md:p-8 pt-0">
        <div className="space-y-4 sm:space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border/60 bg-background/50">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="rounded-lg bg-blue-500/10 p-2 flex-shrink-0">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium break-words">
                  Email notifications
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground break-words">
                  Receive notifications via email
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.email}
              onCheckedChange={() => handleChannelToggle("email")}
              variant="ios"
              animation="elastic"
              glowEffect
              aria-label="Toggle email notifications"
              className="flex-shrink-0"
            />
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border/60 bg-background/50">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="rounded-lg bg-purple-500/10 p-2 flex-shrink-0">
                <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium break-words">
                  Push notifications
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground break-words">
                  Receive push notifications on your device
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.push}
              onCheckedChange={() => handleChannelToggle("push")}
              variant="ios"
              animation="elastic"
              glowEffect
              aria-label="Toggle push notifications"
              className="flex-shrink-0"
            />
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border/60 bg-background/50">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="rounded-lg bg-green-500/10 p-2 flex-shrink-0">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium break-words">
                  SMS notifications
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground break-words">
                  Receive important alerts via SMS
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.sms}
              onCheckedChange={() => handleChannelToggle("sms")}
              variant="ios"
              animation="elastic"
              glowEffect
              aria-label="Toggle SMS notifications"
              className="flex-shrink-0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  /**
   * Card: notification frequency (real‑time / daily / weekly).
   */
  const renderFrequencySection = () => (
    <Card
      variant={layout === "grid" ? "premium" : "default"}
      animation="scaleIn"
      className="w-full"
    >
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle
              size="md"
              className="text-base sm:text-lg md:text-xl break-words"
            >
              Notification frequency
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm break-words">
              Choose how often you want to receive notifications.
            </CardDescription>
          </div>
          <Settings className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1 sm:mt-0" />
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <RadioGroup
            name="notification-frequency"
            options={frequencyOptions}
            value={preferences.frequency}
            onChange={handleFrequencyChange}
            variant="outline"
            size="md"
            labelPosition="right"
            checkedVariant="surface"
            animationVariant="bounce"
          />
          <p className="text-xs sm:text-sm text-muted-foreground break-words">
            {preferences.frequency === "realtime" &&
              "You'll receive notifications immediately as they happen."}
            {preferences.frequency === "daily" &&
              "You'll receive a daily summary of all notifications."}
            {preferences.frequency === "weekly" &&
              "You'll receive a weekly summary every Monday."}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  /**
   * Card: Marketing / Updates / Alerts type toggles.
   */
  const renderTypePreferencesSection = () => (
    <Card
      variant={layout === "grid" ? "premium" : "default"}
      animation="slideUp"
      className="w-full"
    >
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle
              size="md"
              className="text-base sm:text-lg md:text-xl break-words"
            >
              Notification types
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm break-words">
              Select which types of notifications you want to receive.
            </CardDescription>
          </div>
          <Activity className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-5">
          {/* Marketing */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border/60 bg-background/50">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="rounded-lg bg-orange-500/10 p-2 flex-shrink-0">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium break-words">
                  Marketing
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground break-words">
                  Promotional offers, product updates, and newsletters
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.marketing}
              onCheckedChange={() => handleTypeToggle("marketing")}
              variant="ios"
              animation="elastic"
              glowEffect
              aria-label="Toggle marketing notifications"
              className="flex-shrink-0"
            />
          </div>

          {/* Updates */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border/60 bg-background/50">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="rounded-lg bg-blue-500/10 p-2 flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium break-words">
                  Updates
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground break-words">
                  Account updates, feature announcements, and system changes
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.updates}
              onCheckedChange={() => handleTypeToggle("updates")}
              variant="ios"
              animation="elastic"
              glowEffect
              aria-label="Toggle update notifications"
              className="flex-shrink-0"
            />
          </div>

          {/* Alerts */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border/60 bg-background/50">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="rounded-lg bg-red-500/10 p-2 flex-shrink-0">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium break-words">
                  Alerts
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground break-words">
                  Security alerts, important warnings, and critical updates
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.alerts}
              onCheckedChange={() => handleTypeToggle("alerts")}
              variant="ios"
              animation="elastic"
              glowEffect
              aria-label="Toggle alert notifications"
              className="flex-shrink-0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  /**
   * Card: “Unsubscribe from all” + confirmation state.
   */
  const renderUnsubscribeSection = () => (
    <Card
      variant={layout === "grid" ? "premium" : "default"}
      animation="slideUp"
      className="w-full"
    >
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle
              size="md"
              className="text-base sm:text-lg md:text-xl break-words"
            >
              Unsubscribe from all
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm break-words">
              Disable all notifications at once. You can re-enable them anytime.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {showUnsubscribeConfirm ? (
          <div className="space-y-4">
            <div className="p-3 sm:p-4 rounded-lg border border-red-500/40 bg-red-500/10">
              <p className="text-xs sm:text-sm text-red-400 break-words leading-relaxed">
                Are you sure you want to unsubscribe from all notifications?
                This will disable all notification channels and types.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="danger"
                size="sm"
                onClick={handleUnsubscribeAll}
                className="w-full sm:w-auto whitespace-nowrap"
                animationVariant="press3D"
              >
                <X className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">Confirm unsubscribe</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUnsubscribeConfirm(false)}
                className="w-full sm:w-auto whitespace-nowrap"
                animationVariant="press3DSoft"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUnsubscribeConfirm(true)}
            className="w-full sm:w-auto"
            animationVariant="press3DSoft"
          >
            <X className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline">
              Unsubscribe from all notifications
            </span>
            <span className="sm:hidden">Unsubscribe all</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );

  // Top‑level page layout: header + grid/list content
  return (
    <div
      className={cn(
        "min-h-screen p-4 sm:p-6 md:p-10",
        NotificationPageVariants({ variant }),
      )}
    >
      {/* Header */}
      <div className="mb-6 sm:mb-8 md:mb-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className={variant === "dark" ? "text-white" : ""}>
              {title}
            </span>
            <span className="inline-flex items-center justify-center rounded-full bg-blue-500/10 px-2.5 sm:px-3 py-1 text-xs font-medium text-blue-400 border border-blue-500/40 w-fit">
              <Bell className="mr-1 h-3 w-3" />
              {hasAnyNotificationsEnabled ? "Active" : "Inactive"}
            </span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Button
            onClick={handleSavePreferences}
            disabled={isSaving || saved}
            size="md"
            className="w-full sm:w-auto"
            animationVariant={!isSaving && !saved ? "press3D" : undefined}
          >
            {isSaving ? (
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
                Saving…
              </>
            ) : saved ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save preferences
              </>
            )}
          </Button>
        </div>
      </div>

      {layout === "list" ? (
        <div
          className={`w-full max-w-4xl mx-auto ${
            variant === "dark" ? "text-white" : ""
          }`}
        >
          <Accordion type="single" collapsible defaultValue="channels">
            <AccordionItem value="channels">
              <AccordionTrigger className="text-sm sm:text-base">
                Notification channels
              </AccordionTrigger>
              <AccordionContent variant="slideDown">
                {renderNotificationChannelsSection()}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="frequency">
              <AccordionTrigger className="text-sm sm:text-base">
                Notification frequency
              </AccordionTrigger>
              <AccordionContent variant="slideDown">
                {renderFrequencySection()}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="types">
              <AccordionTrigger className="text-sm sm:text-base">
                Notification types
              </AccordionTrigger>
              <AccordionContent variant="slideDown">
                {renderTypePreferencesSection()}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="unsubscribe">
              <AccordionTrigger className="text-sm sm:text-base">
                Unsubscribe from all
              </AccordionTrigger>
              <AccordionContent variant="slideDown">
                {renderUnsubscribeSection()}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
          {/* Left column */}
          <div className="space-y-4 sm:space-y-6 w-full min-w-0">
            {renderNotificationChannelsSection()}
            {renderTypePreferencesSection()}
          </div>

          {/* Right column */}
          <div className="space-y-4 sm:space-y-6 w-full min-w-0">
            {renderFrequencySection()}
            {renderUnsubscribeSection()}
          </div>
        </div>
      )}
    </div>
  );
};

export { NotificationPage };
export default NotificationPage;


