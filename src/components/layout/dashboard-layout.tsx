"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PanelLeft,
  PanelLeftClose,
  Rocket,
  Search,
  Settings,
  Sun,
  TrendingUp,
  Users,
  X,
  Zap
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

const navItems: NavItem[] = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/job-cards", label: "Job Listings", icon: FileText },
  { href: "/sponsored", label: "Sponsored", icon: Rocket },
  { href: "/candidates", label: "Candidates", icon: Users },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/market-insights", label: "Market Insights", icon: TrendingUp, badge: "Pro" },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userInitials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "U";
  const userName = user?.displayName ?? user?.email ?? "User";

  const desktopSidebarWidth = sidebarOpen ? "md:ml-56" : "md:ml-16";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {mobileMenuOpen ? (
        <button
          aria-label="Close menu overlay"
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      ) : null}

      <aside
        className={[
          "fixed left-0 top-0 z-30 h-full border-r border-frame-border bg-frame transition-all duration-150 ease-in-out",
          sidebarOpen ? "w-56" : "w-16",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-[57px] items-center border-b border-frame-border px-4">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lynq-accent">
                  <Zap className="h-4 w-4 text-lynq-accent-foreground" />
                </div>
                {sidebarOpen ? (
                  <span className="relative font-semibold tracking-tight text-frame-foreground">
                    Lyn
                    <span className="relative">
                      q
                      <span className="absolute -bottom-0.5 left-0 h-[2px] w-full rounded-full bg-lynq-accent" />
                    </span>
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-frame-muted hover:bg-frame-hover hover:text-frame-foreground"
                  onClick={() => setSidebarOpen((current) => !current)}
                >
                  {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-frame-muted hover:bg-frame-hover hover:text-frame-foreground md:hidden"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-0.5 overflow-y-auto overflow-x-hidden px-2 py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={!sidebarOpen ? item.label : undefined}
                  className={[
                    "relative flex items-center gap-2.5 rounded-md px-2.5 py-2 transition-all duration-150",
                    sidebarOpen ? "" : "justify-center",
                    isActive
                      ? "bg-frame-active text-frame-foreground"
                      : "text-frame-muted hover:bg-frame-hover hover:text-frame-foreground"
                  ].join(" ")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isActive ? (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-lynq-accent" />
                  ) : null}
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  {sidebarOpen ? <span className="truncate text-sm">{item.label}</span> : null}
                  {sidebarOpen && item.badge ? (
                    <Badge className="ml-auto border-0 bg-lynq-accent-muted px-1.5 py-0 text-[10px] text-lynq-accent">
                      {item.badge}
                    </Badge>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {sidebarOpen ? (
            <div className="border-t border-frame-border px-3 py-3">
              <div className="flex items-center gap-2.5">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-frame-active text-xs text-frame-foreground">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-frame-foreground">{userName}</p>
                  <p className="truncate text-[10px] text-frame-muted">{user?.email ?? ""}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0 text-frame-muted hover:bg-frame-hover hover:text-frame-foreground"
                  onClick={signOut}
                  title="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </aside>

      <div className={`transition-all duration-150 ${desktopSidebarWidth}`}>
        <header className="sticky top-0 z-10 flex h-[57px] items-center border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="flex w-full items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">TechCorp Inc.</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-56 rounded-md border border-border bg-card py-1.5 pl-8 pr-3 text-sm text-foreground transition-all duration-150 placeholder:text-muted-foreground focus:border-lynq-accent/40 focus:outline-none focus:ring-2 focus:ring-lynq-accent/40"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
