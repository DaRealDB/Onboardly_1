"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/lib/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Settings, LogOut, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const moduleTitles: Record<string, string> = {
  pipeline: "Pipeline",
  workflow: "Workflow Engine",
  people: "People & Directory",
  vault: "The Vault",
  settings: "Settings",
};

export function TopBar() {
  const { user, signOut: authSignOut } = useAuth();
  const {
    notifications,
    markNotificationRead,
    setCurrentModule,
    currentModule,
    theme,
    toggleTheme,
    sidebarCollapsed,
  } = useAppStore();

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const fullName =
    user?.user_metadata?.full_name || user?.user_metadata?.fullName || "User";
  const email = user?.email || "";
  const initial = fullName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await authSignOut();
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between px-6 transition-all duration-300",
        sidebarCollapsed ? "left-16" : "left-64",
      )}
    >
      {/* Dynamic Title */}
      <div>
        <h2 className="text-lg font-semibold text-foreground tracking-tight">
          {moduleTitles[currentModule as string] || "Dashboard"}
        </h2>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>

        {/* Notifications */}
        <DropdownMenu
          open={notificationsOpen}
          onOpenChange={setNotificationsOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4" />
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className="flex flex-col items-start p-3"
                  >
                    <span className="font-medium text-sm">{n.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {n.message}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-px bg-border mx-1" />

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-3 px-2">
              <div className="h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                {initial}
              </div>
              <span className="hidden md:block text-sm font-medium text-foreground">
                {fullName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{fullName}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setCurrentModule("settings")}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
