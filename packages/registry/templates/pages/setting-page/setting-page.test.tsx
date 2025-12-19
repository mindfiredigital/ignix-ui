/* =======================
   MOCKS (MUST BE FIRST)
======================= */

// Framer Motion
import React from "react";

vi.mock("framer-motion", () => {
  return {
    motion: {
      div: React.forwardRef(
        ({ children, ...props }: any, ref: any) => (
          <div ref={ref} {...props}>{children}</div>
        )
      ),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});


vi.mock("./i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
    language: "en",
    setLanguage: vi.fn(),
  }),
}));


// Ignix UI (manual mocks)
vi.mock("@ignix-ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@ignix-ui/dropdown", () => ({
  Dropdown: ({ children }: any) => <div>{children}</div>,
  DropdownItem: ({ children, onClick }: any) => (
    <div onClick={onClick}>{children}</div>
  ),
}));

vi.mock("@ignix-ui/switch", () => ({
  Switch: ({ checked, onCheckedChange, ...props }: any) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
  ),
}));

vi.mock("@ignix-ui/radio", () => ({
  RadioGroup: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@ignix-ui/typography", () => ({
  Typography: ({ children }: any) => <span>{children}</span>,
}));

vi.mock("@ignix-ui/dialogbox/use-dialog", () => ({
  useDialog: () => ({
    openDialog: ({ confirmationCallBack }: any) => {
      confirmationCallBack?.(true);
    },
  }),
}));


/* =======================
   IMPORTS
======================= */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SettingsPage } from ".";

/* =======================
   TESTS
======================= */

describe("SettingsPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders settings title and description", () => {
    render(<SettingsPage />);
    expect(screen.getByText("settings")).toBeInTheDocument();
    expect(screen.getByText("description")).toBeInTheDocument();
  });

  it("changes language and stores it in localStorage", () => {
    render(
      <SettingsPage
        languages={[
          { code: "en", name: "English", native: "English" },
          { code: "de", name: "German", native: "Deutsch" },
        ]}
      />
    );

    fireEvent.click(screen.getByText("Deutsch (German)"));
    expect(localStorage.getItem("language")).toBe("de");
  });

  it("exports data after confirmation dialog", () => {
    const onExportData = vi.fn();

    render(<SettingsPage onExportData={onExportData} />);

    fireEvent.click(
      screen.getByRole("button", { name: "dataExport" })
    );

    expect(onExportData).toHaveBeenCalledTimes(1);
  });

  it("changes language from dropdown", () => {
    render(
      <SettingsPage
        languages={[
          { code: "en", name: "English", native: "English" },
          { code: "de", name: "German", native: "Deutsch" },
        ]}
      />
    );

    fireEvent.click(screen.getByText("English (English)")); // open dropdown
    fireEvent.click(screen.getByText("Deutsch (German)")); // select German

    expect(localStorage.getItem("language")).toBe("de");
  });

  it("toggles notifications and fires callback", () => {
    const onNotificationChange = vi.fn();
    
    render(
      <SettingsPage
        notificationOptions={[
          { id: "email", label: "Email Notification", defaultChecked: true },
          { id: "sms", label: "SMS Notification" },
        ]}
        onNotificationChange={onNotificationChange}
      />
    );

    // Find checkbox for email
    const emailCheckbox = screen.getByLabelText("Email Notification");
    fireEvent.click(emailCheckbox);

    expect(onNotificationChange).toHaveBeenCalledWith(
      "email",
      false,
      expect.any(Object)
    );
  });

  it("toggles privacy options and fires callback", () => {
    const onPrivacyChange = vi.fn();

    render(
      <SettingsPage
        privacyOptions={[
          { id: "public", label: "Public Profile", defaultChecked: true },
        ]}
        onPrivacyChange={onPrivacyChange}
      />
    );

    const privacySwitch = screen.getByLabelText("Public Profile");
    fireEvent.click(privacySwitch);

    expect(onPrivacyChange).toHaveBeenCalledWith(
      "public",
      false,
      expect.any(Object)
    );
  });


});
