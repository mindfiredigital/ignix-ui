import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDialog } from "@ignix-ui/dialogbox/use-dialog";
import { Dropdown, DropdownItem } from "@ignix-ui/dropdown";
import { Button } from "@ignix-ui/button";
import { RadioGroup } from "@ignix-ui/radio";
import { Typography } from "@ignix-ui/typography";
import { Switch } from "@ignix-ui/switch";
import { DialogProvider } from "@ignix-ui/dialogbox";
import { useI18n } from "./i18n";
import { cn } from "../../../utils/cn";

type SettingsAnimationVariant =
  | "none"
  | "fade"
  | "slide"
  | "scale"
  | "spring"
  | "stagger";

interface NotificationOption {
  id: string;
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}

type PrivacyOption = NotificationOption;

export interface LanguageOption {
  code: string;
  name: string;
  native: string;
}

interface SettingPageProps {
  title?: string;
  description?: string;
  languages?: LanguageOption[];
  dialogAnimation?:
    | "popIn"
    | "springPop"
    | "backdropZoom"
    | "flip3D"
    | "skewSlide"
    | "glassBlur"
    | "skyDrop";
  dropDownAnimation?: "default" | "fade" | "scale" | "slide" | "flip";
  switchAnimation?:
    | "default"
    | "bounce"
    | "scale"
    | "rotate"
    | "fade"
    | "elastic"
    | "pulse"
    | "shake"
    | "flip"
    | "jelly"
    | "glow";
  animationVariant?: SettingsAnimationVariant;
  notificationTitle?: string;
  notificationOptions?: NotificationOption[];
  privacyOptions?: PrivacyOption[];
  onNotificationChange?: (
    id: string,
    checked: boolean,
    allNotifications: Record<string, boolean>
  ) => void;
  onPrivacyChange?: (
    id: string,
    checked: boolean,
    allNotifications: Record<string, boolean>
  ) => void;
  onNotificationsChange?: (notifications: Record<string, boolean>) => void;
  onPrivacysChange?: (privacy: Record<string, boolean>) => void;
  onExportData?: () => Promise<void> | void;
}

/* ---------------------------------- */
/* DEFAULT LANGUAGES (FALLBACK ONLY)   */
/* ---------------------------------- */
const DEFAULT_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", native: "English" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "ja", name: "Japanese", native: "日本語" },
];

/* =======================
   SETTINGS PAGE ANIMATIONS
======================= */
const SETTINGS_ANIMATIONS = {
  none: { page: {}, card: {} },
  fade: {
    page: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.3 } },
    },
    card: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.25 } },
    },
  },
  slide: {
    page: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    },
    card: {
      hidden: { opacity: 0, y: 12 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    },
  },
  scale: {
    page: {
      hidden: { opacity: 0, scale: 0.97 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
    },
    card: {
      hidden: { opacity: 0, scale: 0.96 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
    },
  },
  spring: {
    page: {
      hidden: { opacity: 0, y: 24 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 120, damping: 18 },
      },
    },
    card: {
      hidden: { opacity: 0, y: 16 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 140 },
      },
    },
  },
  stagger: {
    page: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
    },
    card: {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    },
  },
} as const;

/* =======================
  THEME TYPES
======================= */
const THEMES = ["auto", "light", "dark"] as const;
type Theme = (typeof THEMES)[number];
const isTheme = (value: string | null): value is Theme =>
  value !== null && THEMES.includes(value as Theme);
const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme");
  if (isTheme(stored)) return stored;
  return "light";
};

const getCurrentDateTimeForTimezone = (timezone: string) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    dateStyle: "full",
    timeStyle: "medium",
  }).format(new Date());

export function getSupportedTimezones(): string[] {
  try {
    if (
      typeof Intl !== "undefined" &&
      "supportedValuesOf" in Intl &&
      typeof (Intl as any).supportedValuesOf === "function"
    ) {
      return (Intl as any).supportedValuesOf("timeZone");
    }
  } catch(e) { console.log (e)}
  return [
    "UTC",
    "America/New_York",
    "Europe/London",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Asia/Kolkata",
  ];
}
const timezones = getSupportedTimezones();

/* =======================
   SETTINGS CONTENT
======================= */
const SettingsContent: React.FC<SettingPageProps> = ({
  dialogAnimation = "popIn",
  dropDownAnimation = "default",
  switchAnimation = "bounce",
  animationVariant = "slide",
  languages = DEFAULT_LANGUAGES,
  notificationOptions,
  onNotificationChange,
  onNotificationsChange,
  privacyOptions,
  onPrivacyChange,
  onPrivacysChange,
  onExportData,
}) => {
  const animation = SETTINGS_ANIMATIONS[animationVariant];
  const i18n = useI18n();
  const t = i18n.t;

  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || i18n.language
  );
  useEffect(() => {
    localStorage.setItem("language", language);
    i18n.setLanguage?.(language);
  }, [language]);

  const [timezone, setTimezone] = useState(
    () =>
      localStorage.getItem("timezone") ||
      Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [currentDateTime, setCurrentDateTime] = useState(
    getCurrentDateTimeForTimezone(timezone)
  );
  useEffect(() => {
    localStorage.setItem("timezone", timezone);
  }, [timezone]);
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentDateTime(getCurrentDateTimeForTimezone(timezone)),
      1000
    );
    return () => clearInterval(interval);
  }, [timezone]);

  const { openDialog } = useDialog();

  const DEFAULT_NOTIFICATION_OPTIONS: NotificationOption[] = [
    { id: "email", label: "Email Notification", defaultChecked: true },
  ];
  const DEFAULT_PRIVACY_OPTIONS: PrivacyOption[] = [
    { id: "everybody", label: "Everybody", defaultChecked: true },
  ];

  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    () =>
      (notificationOptions ?? DEFAULT_NOTIFICATION_OPTIONS).reduce(
        (acc, option) => {
          acc[option.id] = option.defaultChecked ?? false;
          return acc;
        },
        {} as Record<string, boolean>
      )
  );
  const [privacys, setPrivacys] = useState<Record<string, boolean>>(() =>
    (privacyOptions ?? DEFAULT_PRIVACY_OPTIONS).reduce((acc, option) => {
      acc[option.id] = option.defaultChecked ?? false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const [theme, setTheme] = useState<Theme>(getInitialTheme());
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = document.documentElement;
    if (theme === "auto") {
      root.classList.toggle(
        "dark",
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    } else {
      root.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);
  useEffect(() => {
    if (theme !== "auto") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle("dark", e.matches);
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  const handleChange = (value: string) => {
    if (isTheme(value)) setTheme(value);
  };
  const handleNotificationChange = (id: string, checked: boolean) => {
    setNotifications((prev) => {
      const next = { ...prev, [id]: checked };
      onNotificationChange?.(id, checked, next);
      onNotificationsChange?.(next);
      return next;
    });
  };
  const handlePrivacyChange = (id: string, checked: boolean) => {
    setPrivacys((prev) => {
      const next = { ...prev, [id]: checked };
      onPrivacyChange?.(id, checked, next);
      onPrivacysChange?.(next);
      return next;
    });
  };

  const selectedLanguage = languages.find((l) => l.code === language);
  const getLanguage = (option: LanguageOption) =>
    option.native && option.name
      ? `${option.native} (${option.name})`
      : option.native || option.name || option.code;

  const options = [
    { value: "dark", label: "Dark" },
    { value: "light", label: "Light" },
    { value: "auto", label: "Auto" },
  ];

  return (
    <motion.div
      variants={animation.page}
      initial="hidden"
      animate="visible"
      className="p-2 md:p-10 max-w-5xl mx-auto"
    >
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-5xl font-extrabold mb-2">{t("settings")}</h1>
        <p className="text-lg text-muted-foreground">{t("description")}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {[
          {
            title: t("languagePreference"),
            content: (
              <Dropdown
                animation={dropDownAnimation}
                trigger={
                  <Button variant="outline" className="w-full text-left">
                    {selectedLanguage
                      ? `${selectedLanguage.native} (${selectedLanguage.name})`
                      : "Select Language"}
                  </Button>
                }
              >
                <div className="max-h-60 w-full overflow-y-auto bg-white dark:bg-gray-800 rounded-md shadow-lg">
                  {languages.map((lang) => (
                    <DropdownItem
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                    >
                      {getLanguage(lang)}
                    </DropdownItem>
                  ))}
                </div>
              </Dropdown>
            ),
          },
          {
            title: t("themePreference"),
            content: (
              <RadioGroup
                name="theme-switch"
                options={options}
                value={theme}
                aria-label={theme}
                onChange={handleChange}
                className="flex gap-4"
              />
            ),
          },
          {
            title: t("timezone"),
            content: (
              <div className="flex flex-col gap-2">
                <Typography variant="h6">
                  {t("selectedTimezone")}: {timezone}
                </Typography>
                <p className="text-sm text-muted-foreground">
                  {currentDateTime}
                </p>
                <Dropdown
                  animation={dropDownAnimation}
                  trigger={
                    <Button variant="outline">{t("changeTimezone")}</Button>
                  }
                >
                  <div className="max-h-64 w-full overflow-y-auto bg-white dark:bg-gray-800 rounded-md shadow-lg">
                    {timezones.map((tz) => (
                      <DropdownItem key={tz} onClick={() => setTimezone(tz)}>
                        {tz}
                      </DropdownItem>
                    ))}
                  </div>
                </Dropdown>
              </div>
            ),
          },
          {
            title: t("notificationPreferences"),
            content: (
              <div className="flex flex-col gap-4">
                {(notificationOptions ?? DEFAULT_NOTIFICATION_OPTIONS).map(
                  (option) => (
                    <div
                      key={option.id}
                      className="flex justify-between items-center"
                    >
                      <Typography variant="h6">{option.label}</Typography>
                      <Switch
                        aria-label={option.label}
                        animation={switchAnimation}
                        checked={notifications[option.id]}
                        disabled={option.disabled}
                        onCheckedChange={(checked) =>
                          handleNotificationChange(option.id, checked)
                        }
                      />
                    </div>
                  )
                )}
              </div>
            ),
          },
          {
            title: t("privacySettings"),
            content: (
              <div className="flex flex-col gap-4">
                {(privacyOptions ?? DEFAULT_PRIVACY_OPTIONS).map((option) => (
                  <div
                    key={option.id}
                    className="flex justify-between items-center"
                  >
                    <Typography variant="h6">{option.label}</Typography>
                    <Switch
                      aria-label={option.label}
                      animation={switchAnimation}
                      checked={privacys[option.id]}
                      disabled={option.disabled}
                      onCheckedChange={(checked) =>
                        handlePrivacyChange(option.id, checked)
                      }
                    />
                  </div>
                ))}
              </div>
            ),
          },
          {
            title: t("dataExport"),
            content: (
              <Button
                variant="outline"
                className="w-full"
                aria-label="dataExport"
                onClick={() =>
                  openDialog({
                    title: "Alert",
                    content: "Do you really want to export data?",
                    dialogType: "confirm",
                    animationKey: dialogAnimation,
                    confirmationCallBack: async (confirmed) => {
                      if (!confirmed) return;
                      await onExportData?.();
                    },
                  })
                }
              >
                {t("exportData")}
              </Button>
            ),
          },
        ].map((section, idx) => (
          <motion.div
            key={idx}
            variants={animation.card}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
            }}
            className={cn(
              "p-6 rounded-2xl backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-lg transition-all duration-300",
              theme === "dark"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-900"
            )}
          >
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            {section.content}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export const SettingsPage = (props: SettingPageProps) => {
  return (
    <DialogProvider>
      <SettingsContent {...props} />
    </DialogProvider>
  );
};



