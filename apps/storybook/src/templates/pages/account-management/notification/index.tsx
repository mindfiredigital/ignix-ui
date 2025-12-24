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

import { cn } from "../../../../../utils/cn";
import { Button } from "../../../../components/button";
import { Switch } from "../../../../components/switch";
import { RadioGroup } from "../../../../components/radio";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../../../components/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/card";

/**
 * Props interface for the NotificationPage component
 * 
 * @property title - Optional page title (default: "Notifications")
 * @property description - Optional page description text
 * @property variant - Background theme variant: "light", "dark", or "auto" (default: "dark")
 * @property layout - Layout style: "grid" (two-column) or "list" (accordion) (default: "grid")
 */
interface NotificationPageProps {
  title?: string;
  description?: string;
  /** Background theme */
  variant?: "light" | "dark" | "auto";
  /** Layout style for the main content */
  layout?: "grid" | "list";
}

const NotificationPageVariants = cva("", {
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

/**
 * Type definition for notification frequency options
 * - "realtime": Notifications sent immediately as they occur
 * - "daily": All notifications bundled into a daily digest
 * - "weekly": All notifications bundled into a weekly summary
 */
type NotificationFrequency = "realtime" | "daily" | "weekly";

/**
 * Interface defining the structure of notification preferences
 * 
 * @property email - Whether email notifications are enabled
 * @property push - Whether push notifications are enabled
 * @property sms - Whether SMS notifications are enabled
 * @property frequency - How often notifications are delivered (realtime/daily/weekly)
 * @property marketing - Whether marketing notifications are enabled
 * @property updates - Whether update notifications are enabled
 * @property alerts - Whether alert notifications are enabled
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
 * NotificationPage Component
 * 
 * A comprehensive notification preferences management page that allows users to:
 * - Toggle notification channels (Email, Push, SMS)
 * - Set notification frequency (Real-time, Daily, Weekly)
 * - Control notification types (Marketing, Updates, Alerts)
 * - Unsubscribe from all notifications
 * - Save preferences with visual feedback
 * 
 * Features:
 * - Responsive design (mobile, tablet, desktop)
 * - Two layout modes: grid (default) and list (accordion)
 * - Three theme variants: light, dark, auto
 * - Real-time state management
 * - Visual feedback for save operations
 * - Confirmation dialog for unsubscribe action
 * 
 * @param props - NotificationPageProps object containing component configuration
 * @returns JSX element representing the complete notification preferences page
 */
const NotificationPage: React.FC<NotificationPageProps> = ({
  title = "Notifications",
  description = "Manage your notification preferences and stay informed about what matters to you.",
  variant,
  layout = "grid",
}) => {
  // ---------------------------------------------------------------------------
  // Notification preferences state
  // ---------------------------------------------------------------------------
  
  /**
   * Main state object storing all notification preferences
   * 
   * Default values:
   * - Email: enabled (true)
   * - Push: enabled (true)
   * - SMS: disabled (false)
   * - Frequency: realtime (immediate notifications)
   * - Marketing: enabled (true)
   * - Updates: enabled (true)
   * - Alerts: enabled (true)
   * 
   * Updated by: handleChannelToggle, handleFrequencyChange, handleTypeToggle, handleUnsubscribeAll
   */
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    push: true,
    sms: false,
    frequency: "realtime",
    marketing: true,
    updates: true,
    alerts: true,
  });

  // State to track if preferences are currently being saved to the server
  const [isSaving, setIsSaving] = useState(false);
  // State to show success message after saving preferences
  const [saved, setSaved] = useState(false);
  // State to control the visibility of unsubscribe confirmation dialog
  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false);

  /**
   * Handles toggling notification channels (Email, Push, SMS)
   * 
   * @param channel - The notification channel to toggle: "email", "push", or "sms"
   * 
   * This function:
   * 1. Toggles the specified channel's enabled state (true/false)
   * 2. Resets the saved state to false to indicate unsaved changes
   * 3. Uses functional update to ensure state consistency
   */
  const handleChannelToggle = (channel: "email" | "push" | "sms") => {
    setPreferences(prev => ({
      ...prev,
      [channel]: !prev[channel],
    }));
    setSaved(false);
  };

  /**
   * Handles changing the notification frequency preference
   * 
   * @param frequency - The selected frequency as a string: "realtime", "daily", or "weekly"
   * 
   * This function:
   * 1. Updates the frequency preference in the state
   * 2. Resets the saved state to indicate unsaved changes
   * 3. Affects how often notifications are delivered (immediate, daily digest, or weekly summary)
   * 
   * Note: Accepts string type to match RadioGroup's onChange signature, then casts to NotificationFrequency
   */
  const handleFrequencyChange = (frequency: string) => {
    setPreferences(prev => ({
      ...prev,
      frequency: frequency as NotificationFrequency,
    }));
    setSaved(false);
  };

  /**
   * Handles toggling notification type preferences (Marketing, Updates, Alerts)
   * 
   * @param type - The notification type to toggle: "marketing", "updates", or "alerts"
   * 
   * This function:
   * 1. Toggles the specified notification type's enabled state
   * 2. Resets the saved state to indicate unsaved changes
   * 3. Allows granular control over which types of notifications are received
   */
  const handleTypeToggle = (type: "marketing" | "updates" | "alerts") => {
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
    setSaved(false);
  };

  /**
   * Handles saving notification preferences to the server
   * 
   * This function:
   * 1. Sets isSaving to true to show loading state
   * 2. Resets saved state to false
   * 3. Simulates an API call with setTimeout (replace with actual API call in production)
   * 4. After 1.2 seconds, sets isSaving to false and saved to true
   * 5. After 3 seconds, hides the success message
   * 
   * In production, replace the setTimeout with:
   * await saveNotificationPreferences(preferences);
   */
  const handleSavePreferences = () => {
    setIsSaving(true);
    setSaved(false);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1200);
  };

  /**
   * Handles unsubscribing from all notifications
   * 
   * This function:
   * 1. Disables all notification channels (email, push, SMS)
   * 2. Sets frequency to "weekly" (least frequent option)
   * 3. Disables all notification types (marketing, updates, alerts)
   * 4. Hides the confirmation dialog
   * 5. Resets saved state to indicate changes need to be saved
   * 
   * Note: User must still click "Save preferences" to persist these changes
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

  /**
   * Computed value to check if any notification channel is enabled
   * Used to display "Active" or "Inactive" badge in the header
   * 
   * Returns true if at least one channel (email, push, or SMS) is enabled
   */
  const hasAnyNotificationsEnabled =
    preferences.email || preferences.push || preferences.sms;

  /**
   * Options for the notification frequency radio group
   * Each option has a value (used internally) and a label (displayed to user)
   */
  const frequencyOptions = [
    { value: "realtime", label: "Real-time" },
    { value: "daily", label: "Daily digest" },
    { value: "weekly", label: "Weekly summary" },
  ];

  // ---------------------------------------------------------------------------
  // Render helpers for sections
  // ---------------------------------------------------------------------------

  /**
   * Renders the notification channels section card
   * 
   * This section displays three notification channels:
   * - Email notifications (with Mail icon)
   * - Push notifications (with Smartphone icon)
   * - SMS notifications (with MessageSquare icon)
   * 
   * Each channel has:
   * - A toggle switch to enable/disable
   * - An icon with colored background
   * - Title and description text
   * 
   * @returns JSX element containing the notification channels card
   */
  const renderNotificationChannelsSection = () => (
    <Card
      variant={layout == "grid" ? "premium" : "default"}
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
   * Renders the notification frequency section card
   * 
   * This section allows users to choose how often they receive notifications:
   * - Real-time: Notifications sent immediately as they happen
   * - Daily digest: All notifications bundled and sent once per day
   * - Weekly summary: All notifications bundled and sent once per week
   * 
   * Uses RadioGroup component for single selection
   * Displays a description based on the selected frequency
   * 
   * @returns JSX element containing the frequency selection card
   */
  const renderFrequencySection = () => (
    <Card
      variant={layout == "grid" ? "premium" : "default"}
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
   * Renders the notification type preferences section card
   * 
   * This section allows users to control which types of notifications they receive:
   * - Marketing: Promotional offers, product updates, and newsletters
   * - Updates: Account updates, feature announcements, and system changes
   * - Alerts: Security alerts, important warnings, and critical updates
   * 
   * Each type has:
   * - A toggle switch to enable/disable
   * - A colored icon (orange for marketing, blue for updates, red for alerts)
   * - Title and description explaining what the type includes
   * 
   * @returns JSX element containing the notification types card
   */
  const renderTypePreferencesSection = () => (
    <Card
      variant={layout == "grid" ? "premium" : "default"}
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
   * Renders the unsubscribe from all notifications section card
   * 
   * This section provides a quick way to disable all notifications:
   * - Shows a button to initiate unsubscribe process
   * - When clicked, shows a confirmation dialog with warning message
   * - Provides "Confirm unsubscribe" and "Cancel" buttons
   * - On confirmation, disables all channels and types (user must still save)
   * 
   * Uses conditional rendering:
   * - If showUnsubscribeConfirm is false: Shows the unsubscribe button
   * - If showUnsubscribeConfirm is true: Shows confirmation dialog
   * 
   * @returns JSX element containing the unsubscribe section card
   */
  const renderUnsubscribeSection = () => (
    <Card
      variant={layout == "grid" ? "premium" : "default"}
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
            <span className="hidden sm:inline">Unsubscribe from all notifications</span>
            <span className="sm:hidden">Unsubscribe all</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );

  /**
   * Main render function for the NotificationPage component
   * 
   * Renders the complete notification preferences page with:
   * 1. Header section with title, description, status badge, and save button
   * 2. Content sections arranged in either grid or list layout
   * 
   * Layout options:
   * - "grid": Two-column responsive grid layout (default)
   *   - Left column: Notification channels + Notification types
   *   - Right column: Frequency + Unsubscribe section
   * - "list": Accordion-based collapsible sections for compact layouts
   * 
   * Theme variants:
   * - "dark": Dark gradient background (default)
   * - "light": Light gradient background
   * - "auto": Adapts to system/app theme
   * 
   * @returns JSX element containing the complete notification preferences page
   */
  return (
    <div
      className={cn(
        "min-h-screen p-4 sm:p-6 md:p-10",
        NotificationPageVariants({ variant }),
      )}
    >
      {/* Header Section */}
      {/* Contains page title, description, status badge, and save button */}
      <div className="mb-6 sm:mb-8 md:mb-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className={variant == "dark" ? "text-white" : ""}>
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

      {/* Content Layout */}
      {/* Conditionally renders either list (accordion) or grid layout based on layout prop */}
      {layout === "list" ? (
        // List / Accordion Layout
        // Uses collapsible accordion sections for compact, mobile-friendly display
        // Each section can be expanded/collapsed independently
        <div
          className={`w-full max-w-4xl mx-auto ${
            variant == "dark" ? "text-white" : ""
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
        // Default Grid Layout
        // Two-column responsive grid: 2fr left column, 1.4fr right column
        // Stacks vertically on smaller screens
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
          {/* Left Column - Wider column for main content */}
          {/* Contains notification channels and notification types sections */}
          <div className="space-y-4 sm:space-y-6 w-full min-w-0">
            {renderNotificationChannelsSection()}
            {renderTypePreferencesSection()}
          </div>

          {/* Right Column - Narrower column for secondary content */}
          {/* Contains frequency selection and unsubscribe sections */}
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

