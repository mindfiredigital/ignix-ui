import { useEffect, useState } from "react";
import { Button } from "../../../../components/button";
import { Dropdown, DropdownItem } from "../../../../components/dropdown";
import { Switch } from "../../../../components/switch"; // Assuming you have a Switch component
import { cva } from "class-variance-authority";
import { cn } from "../../../../../utils/cn";
import { Typography } from "../../../../components/typography";
import { RadioGroup } from "../../../../components/radio";
import { useDialog } from "../../../../components/dialog-box/use-dialog";
import { DialogProvider } from "../../../../components/dialog-box";
import { motion } from "framer-motion";
import { I18nProvider, useI18n } from "../../../../i18n/I18nProvider";
import en from "./i18n/demo/en.json";
import de from "./i18n/demo/de.json";
import ja from "./i18n/demo/ja.json";

const DEMO_TRANSLATIONS: Record<string, Record<string, string>> = {
  English: en,
  German: de,
  Japanese: ja,
};

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

type PrivacyOption = NotificationOption

interface SettingPageProps {
  title?: string;
  description?: string;
  theme?: "auto" | "light" | "dark";
  dialogAnimation?: "popIn"| "springPop"| "backdropZoom"| "flip3D"| "skewSlide"| "glassBlur"| "skyDrop";
  dropDownAnimation?: "default"| "fade"| "scale"| "slide"| "flip";
  switchAnimation?: "default"| "bounce"| "scale"| "rotate"| "fade"| "elastic"| "pulse"| "shake"| "flip"| "jelly"| "glow"
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

/* =======================
   SETTINGS PAGE ANIMATIONS
======================= */

const SETTINGS_ANIMATIONS = {
  none: {
    page: {},
    card: {},
  },

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
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
      },
    },
    card: {
      hidden: { opacity: 0, y: 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.25 },
      },
    },
  },
} as const;


const SettingsPageVariants = cva("", {
  variants: {
    theme: {
      auto: "bg-white text-black",
      light: "bg-white text-black",
      dark: "bg-black text-white",
    },
  },
  defaultVariants: {
    theme: "light",
  },
});

/* =======================
  NEW CODE – THEME TYPES
======================= */
const THEMES = ["auto", "light", "dark"] as const;
type Theme = typeof THEMES[number];

const isTheme = (value: string | null): value is Theme => {
  return value !== null && THEMES.includes(value as Theme);
};

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme");
  if (isTheme(stored)) return stored;
  return "light";
};

// ---------- LANGUAGE LIST ----------
const languages = [
  { "code": "English", "name": "English", "native": "English" },
  { "code": "German", "name": "German", "native": "Deutsch" },
  { "code": "Japanese", "name": "Japanese", "native": "日本語" },
];

const getCurrentDateTimeForTimezone = (timezone: string) => {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    dateStyle: "full",
    timeStyle: "medium",
  }).format(new Date());
};

// ---------- TIMEZONE LIST ----------
const timezones = Intl.supportedValuesOf("timeZone");

const SettingsContent: React.FC<SettingPageProps> = ({
  dialogAnimation = "popIn",
  dropDownAnimation = "default",
  switchAnimation = "bounce",
  animationVariant = "slide",
  notificationOptions,
  onNotificationChange,
  onNotificationsChange,
  privacyOptions,
  onPrivacyChange,
  onPrivacysChange,
  onExportData
}) => {
  const animation = SETTINGS_ANIMATIONS[animationVariant];
  const [currentDateTime, setCurrentDateTime] = useState("");
  const i18n = useI18n();
  const t = i18n.t;
  /* =======================
     LANGUAGE (NEW FEATURE)
  ======================= */
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || i18n.language
  );

  useEffect(() => {
    localStorage.setItem("language", language);
    i18n.setLanguage?.(language);
    i18n.onLanguageChange?.(language); // 🔥 EXTENSION POINT
  }, [language]);
  // ----------------------------
  // Timezone
  // ----------------------------
  const [timezone, setTimezone] = useState(
    () => localStorage.getItem("timezone") || Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  useEffect(() => localStorage.setItem("timezone", timezone), [timezone]);
  useEffect(() => {
    const updateTime = () => {
      setCurrentDateTime(getCurrentDateTimeForTimezone(timezone));
    };

    updateTime(); // run immediately
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [timezone]);

    const { openDialog } = useDialog();

  const DEFAULT_NOTIFICATION_OPTIONS: NotificationOption[] = [
    { id: "email", label: "Email Notification", defaultChecked: true },
  ];

  const DEFAULT_PRIVACY_OPTIONS: NotificationOption[] = [
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

  /* =======================
    UPDATED – typed theme
  ======================= */
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  /* ======================= */

  const options = [
    { value: "dark", label: "Dark" },
    { value: "light", label: "Light" },
    { value: "auto", label: "Auto" },
  ];

  /* =======================
     UPDATED – persistence
  ======================= */
  useEffect(() => {
    localStorage.setItem("theme", theme);

    const root = document.documentElement;

    if (theme === "auto") {
      const isDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      root.classList.toggle("dark", isDark);
    } else {
      root.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);
  /* ======================= */

  /* =======================
     NEW – auto theme sync
  ======================= */
  useEffect(() => {
    if (theme !== "auto") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle("dark", e.matches);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);
  /* ======================= */

  /* =======================
     UPDATED – safe narrowing
  ======================= */
  const handleChange = (value: string) => {
    if (isTheme(value)) {
      setTheme(value);
    }
  };

  const handleNotificationChange = (id: string, checked: boolean) => {
    setNotifications((prev) => {
      const next = {
        ...prev,
        [id]: checked,
      };

      onNotificationChange?.(id, checked, next);
      onNotificationsChange?.(next);

      return next;
    });
  };

  const handlePrivacyChange = (id: string, checked: boolean) => {
    setNotifications((prev) => {
      const next = {
        ...prev,
        [id]: checked,
      };

      onPrivacyChange?.(id, checked, next);
      onPrivacysChange?.(next);

      return next;
    });
  };

  // const handleSwitchChange = () => {
  //   console.log(155)
  // }
  /* ======================= */

  return (
    <motion.div
  variants={animation.page}
  initial="hidden"
  animate="visible"
  className={cn(
    "min-h-screen p-6 md:p-10",
    SettingsPageVariants({ theme })
  )}
>
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight">{t("settings")}</h1>
        <p className="mt-2 text-lg">{t("description")}</p>
      </div>

      <div className="grid gap-8 max-w-3xl">
        {/* CARD WRAPPER COMPONENT */}
        {[
          {
            title: t("languagePreference"),
            content: (
              <Dropdown
                animation= {dropDownAnimation}
                trigger={
                  <Button variant="outline">
                    {languages.find((l) => l.code === language)?.native ||
                      "Select Language"}
                  </Button>
                }
              >
                <div className="max-h-80 w-full overflow-y-auto bg-white dark:bg-black">
                {languages.map((lang) => (
                  <DropdownItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                  >
                    {lang.native} — <span>{lang.name}</span>
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
                onChange={handleChange}
              />
            ),
          },

          {
            title: t("timezone"),
            content: (
              <div className="flex flex-col md:flex-row justify-between">
                <div className="flex flex-col justify-between">
                  <Typography variant="h6">{t("selectedTimezone")}: {timezone}</Typography>
                  <p className="text-md text-muted-foreground">
                    {currentDateTime}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Dropdown animation= {dropDownAnimation} trigger={<Button variant="outline">{t("changeTimezone")}</Button>}>
                    <div className="max-h-64 w-full overflow-y-auto bg-white dark:bg-black">
                      {timezones.map((tz) => (
                        <DropdownItem key={tz} onClick={() => setTimezone(tz)}>
                          {tz}
                        </DropdownItem>
                      ))}
                    </div>
                  </Dropdown>
                </div>
              </div>
            ),
          },

          {
            title: t("notificationPreferences"),
            content: (
              <div className="flex flex-col gap-4">
                {(notificationOptions ?? DEFAULT_NOTIFICATION_OPTIONS).map((option) => (
                  <div
                    key={option.id}
                    className="flex flex-row items-end justify-between"
                  >
                    <Typography variant="h6">{option.label}</Typography>
                    <Switch
                      animation= {switchAnimation}
                      checked={notifications[option.id]}
                      disabled={option.disabled}
                      onCheckedChange={(checked) =>
                        handleNotificationChange(option.id, checked)
                      }
                    />
                  </div>
                ))}
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
                    className="flex flex-row items-end justify-between"
                  >
                    <Typography variant="h6">{option.label}</Typography>
                    <Switch
                      animation= {switchAnimation}
                      checked={notifications[option.id]}
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
                onClick={() =>
                  openDialog({
                    title: 'Alert',
                    content: 'Do you really want to export data?',
                    dialogType: 'confirm',
                    animationKey: dialogAnimation,

                    confirmationCallBack: async (confirmed) => {
                      if (!confirmed) return;

                      try {
                        await onExportData?.();
                      } catch (err) {
                        console.error('Export failed', err);
                      }
                    },
                  })
                }
              >
                {t('exportData')}
              </Button>

            ),
          },
        ].map((section, index) => (
         <motion.div
            key={index}
            variants={animation.card}
            whileHover={{ scale: 1.01 }}
            className={cn(
              "p-6 rounded-2xl backdrop-blur-xl border shadow-lg hover:shadow-2xl transition-all duration-300",
              theme === "auto"
                ? SettingsPageVariants({ theme: "dark" })
                : SettingsPageVariants({ theme })
            )}>
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            {section.content}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export const SettingsPage = (props: SettingPageProps) => {
  const [language, setLanguage] = useState("English");
  const t = (key: string) =>
    DEMO_TRANSLATIONS[language]?.[key] ?? key;

  return (
     <I18nProvider
      value={{
        language,
        setLanguage,
        t,
        onLanguageChange: (lang) =>
          console.log("[Storybook] language changed:", lang),
      }}
    >
      <DialogProvider>
        <SettingsContent {...props} />
      </DialogProvider>
    </I18nProvider>
  )
}