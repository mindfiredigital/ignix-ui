import { useState } from "react";
import { Button } from "../../../../components/button";
import { Dropdown, DropdownItem } from "../../../../components/dropdown";
import { Switch } from "../../../../components/switch"; // Assuming you have a Switch component
import { cva } from "class-variance-authority";
import { cn } from "../../../../../utils/cn";

// type animationKeys = keyof typeof animationVariant;

interface SettingPageProps {
  title?: string;
  description?: string;
  variant?: "light"| "dark"| "auto";
}

const SettingsPageVariants = cva("", {
  variants: {
    variant: {
      auto: "bg-white text-black",
      light: "bg-white text-black",
      dark: "bg-black text-white",
    },
  },
  defaultVariants: {
    variant: "light",
  },
});

// ---------- LANGUAGE LIST ----------
const languages = [
  { "code": "Albanian", "name": "Albanian", "native": "shqiptar" },
  { "code": "Arabic", "name": "Arabic", "native": "العربى" },
  { "code": "Assamese", "name": "Assamese", "native": "Assamese" },
  { "code": "Azerbaijani", "name": "Azerbaijani", "native": "Azərbaycan" },
  { "code": "Bahasa Indonesia", "name": "Indonesian", "native": "Bahasa Indonesia" },
  { "code": "Basque", "name": "Basque", "native": "Euskal" },
  { "code": "Bengali (India)", "name": "Bengali (India)", "native": "বাঙালি" },
  { "code": "Bodo", "name": "Bodo", "native": "बड़ो" },
  { "code": "Bulgarian", "name": "Bulgarian", "native": "български" },
  { "code": "Burmese", "name": "Burmese", "native": "ဗမာ" },
  { "code": "Catalan", "name": "Catalan", "native": "Català" },
  { "code": "Chinese - Simplified", "name": "Chinese (Simplified)", "native": "中文 - 简体" },
  { "code": "Chinese - Traditional", "name": "Chinese (Traditional)", "native": "中文 - 繁體" },
  { "code": "Croatian", "name": "Croatian", "native": "Hrvatski" },
  { "code": "Czech", "name": "Czech", "native": "český" },
  { "code": "Danish", "name": "Danish", "native": "Dansk" },
  { "code": "Dogri", "name": "Dogri", "native": "डोगरी" },
  { "code": "Dutch", "name": "Dutch", "native": "Nederlands" },
  { "code": "English", "name": "English", "native": "English" },
  { "code": "Estonian", "name": "Estonian", "native": "Eestlane" },
  { "code": "Farsi", "name": "Farsi", "native": "فارسی" },
  { "code": "Filipino", "name": "Filipino", "native": "Pilipino" },
  { "code": "Finnish", "name": "Finnish", "native": "Suomalainen" },
  { "code": "French", "name": "French", "native": "Le français" },
  { "code": "Galician", "name": "Galician", "native": "galego" },
  { "code": "German", "name": "German", "native": "Deutsch" },
  { "code": "Greek", "name": "Greek", "native": "Ελληνικά" },
  { "code": "Gujarati", "name": "Gujarati", "native": "ગુજરાતી" },
  { "code": "Hebrew", "name": "Hebrew", "native": "עברית" },
  { "code": "Hindi", "name": "Hindi", "native": "हिन्दी" },
  { "code": "Hungarian", "name": "Hungarian", "native": "Magyar" },
  { "code": "Italian", "name": "Italian", "native": "Italiano" },
  { "code": "Japanese", "name": "Japanese", "native": "日本語" },
  { "code": "Javanese", "name": "Javanese", "native": "Basa Jawa" },
  { "code": "Kannada", "name": "Kannada", "native": "ಕನ್ನಡ" },
  { "code": "Kashmiri", "name": "Kashmiri", "native": "کٲشُر" },
  { "code": "Khmer", "name": "Khmer", "native": "ខ្មែរ" },
  { "code": "Konkani", "name": "Konkani", "native": "कोंकणी" },
  { "code": "Korean", "name": "Korean", "native": "한국어" },
  { "code": "Lao", "name": "Lao", "native": "ລາວ" },
  { "code": "Latvian", "name": "Latvian", "native": "Latvietis" },
  { "code": "Lithuanian", "name": "Lithuanian", "native": "Lietuvių" },
  { "code": "Macedonian", "name": "Macedonian", "native": "Македонски" },
  { "code": "Maithili", "name": "Maithili", "native": "मैथिली" },
  { "code": "Malay", "name": "Malay", "native": "Melayu" },
  { "code": "Malayalam", "name": "Malayalam", "native": "മലയാളം" },
  { "code": "Manipuri", "name": "Manipuri", "native": "ꯃꯅꯤꯄꯨꯔꯤꯗꯥ ꯂꯩꯕꯥ꯫" },
  { "code": "Marathi", "name": "Marathi", "native": "मराठी" },
  { "code": "Nepali", "name": "Nepali", "native": "नेपाली" },
  { "code": "Norwegian", "name": "Norwegian", "native": "Norsk" },
  { "code": "Oriya", "name": "Odia", "native": "ଓଡିଆ" },
  { "code": "Polish", "name": "Polish", "native": "Polski" },
  { "code": "Portuguese - Brazilian", "name": "Portuguese (Brazil)", "native": "Português - Brazilian" },
  { "code": "Portuguese - Portugal", "name": "Portuguese (Portugal)", "native": "Português - Portugal" },
  { "code": "Punjabi", "name": "Punjabi", "native": "ਪੰਜਾਬੀ" },
  { "code": "Romanian", "name": "Romanian", "native": "Română" },
  { "code": "Russian", "name": "Russian", "native": "русский" },
  { "code": "Sanskrit", "name": "Sanskrit", "native": "संस्कृत" },
  { "code": "Santhali", "name": "Santhali", "native": "संताली" },
  { "code": "Serbian", "name": "Serbian", "native": "Српски" },
  { "code": "Sindhi", "name": "Sindhi", "native": "سِنڌِي" },
  { "code": "Sinhala", "name": "Sinhala", "native": "සිංහල" },
  { "code": "Slovenian", "name": "Slovenian", "native": "Slovenščina" },
  { "code": "Spanish", "name": "Spanish", "native": "Español" },
  { "code": "Swedish", "name": "Swedish", "native": "Svenska" },
  { "code": "Tamil", "name": "Tamil", "native": "தமிழ்" },
  { "code": "Telugu", "name": "Telugu", "native": "తెలుగు" },
  { "code": "Thai", "name": "Thai", "native": "ไทย" },
  { "code": "Turkish", "name": "Turkish", "native": "Türkçe" },
  { "code": "Ukrainian", "name": "Ukrainian", "native": "український" },
  { "code": "Urdu", "name": "Urdu", "native": "اردو" },
  { "code": "Vietnamese", "name": "Vietnamese", "native": "Tiếng Việt" },
  { "code": "Welsh", "name": "Welsh", "native": "Cymraeg" }
];

// ---------- TIMEZONE LIST ----------
const timezones = Intl.supportedValuesOf("timeZone");

const SettingsContent: React.FC<SettingPageProps> = ({
  title= "Settings",
  description= "Manage your account & personalize your experience",
  variant
}) => {
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("auto");
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [marketingNotif, setMarketingNotif] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [profileDiscovery, setProfileDiscovery] = useState(true);

  const handleDataExport = () => {
    const confirmExport = window.confirm("Are you sure you want to export your data?");
    if (confirmExport) alert("Data exported (placeholder)");
  };

  return (
    <div className={cn("min-h-screen p-6 md:p-10",SettingsPageVariants({variant}))}>
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-2 text-lg">
          {description}
        </p>
      </div>

      <div className="grid gap-8 max-w-3xl">

        {/* CARD WRAPPER COMPONENT */}
        {/** Instead of repeating — we wrap all sections in a modern styled card */}
        {[
          {
            title: "Language Preference",
            content: (
              <Dropdown
                trigger={
                  <Button variant="outline">
                    {languages.find(l => l.code === language)?.native || "Select Language"}
                  </Button>
                }
              >
                {languages.map((lang) => (
                  <DropdownItem key={lang.code} onClick={() => setLanguage(lang.code)}>
                    {lang.native} — <span>{lang.name}</span>
                  </DropdownItem>
                ))}
              </Dropdown>
            )
          },

          {
            title: "Theme Preference",
            content: (
              <Dropdown trigger={<Button variant="outline">{theme.toUpperCase()}</Button>}>
                <DropdownItem onClick={() => setTheme("light")}>Light</DropdownItem>
                <DropdownItem onClick={() => setTheme("dark")}>Dark</DropdownItem>
                <DropdownItem onClick={() => setTheme("auto")}>Auto</DropdownItem>
              </Dropdown>
            )
          },

          {
            title: "Timezone",
            content: (
              <Dropdown trigger={<Button variant="outline">{timezone}</Button>}>
                {timezones.map((tz) => (
                  <DropdownItem key={tz} onClick={() => setTimezone(tz)}>
                    {tz}
                  </DropdownItem>
                ))}
              </Dropdown>
            )
          },

          {
            title: "Notification Preferences",
            content: (
              <div className="flex flex-col gap-4">
                <SettingToggle label="Email Notifications" value={emailNotif} onChange={setEmailNotif} />
                <SettingToggle label="Push Notifications" value={pushNotif} onChange={setPushNotif} />
                <SettingToggle label="Marketing Messages" value={marketingNotif} onChange={setMarketingNotif} />
              </div>
            )
          },

          {
            title: "Privacy Settings",
            content: (
              <div className="flex flex-col gap-4">
                <SettingToggle label="Show Online Status" value={onlineStatus} onChange={setOnlineStatus} />
                <SettingToggle label="Allow Profile Discovery" value={profileDiscovery} onChange={setProfileDiscovery} />
              </div>
            )
          },

          {
            title: "Data Export",
            content: (
              <>
                <p className="text-sm mb-4 leading-relaxed">
                  Download all your account data in a secure portable format.
                </p>
                <Button onClick={handleDataExport} className="mt-1">Export Data</Button>
              </>
            )
          }

        ].map((section, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl bg-zinc-800/40 backdrop-blur-xl border border-zinc-700/40 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            {section.content}
          </div>
        ))}

      </div>
    </div>
  );
};

interface SettingToggleProps {
  label?: string;
  value?: boolean;
  onChange?: (checked: boolean) => void;
}

const SettingToggle: React.FC<SettingToggleProps> = ({ label, value = false, onChange }) => (
  <label className="flex items-center justify-between text-lg">
    <span>{label}</span>
    <Switch checked={value} onCheckedChange={onChange} />
  </label>
);


export const SettingsPage = (props: SettingPageProps) => (
  <SettingsContent {...props} />
);