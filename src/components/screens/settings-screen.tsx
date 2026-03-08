"use client";

import { useTheme } from "next-themes";
import {
  AppearanceCard,
  CompanyProfileCard,
  DangerZoneCard,
  NotificationsCard,
  SecurityCard
} from "@/components/screens/settings/settings-sections";

export function SettingsScreen() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <CompanyProfileCard />
      <NotificationsCard />
      <AppearanceCard isDark={isDark} onThemeChange={(value) => setTheme(value ? "dark" : "light")} />
      <SecurityCard />
      <DangerZoneCard />
    </div>
  );
}
