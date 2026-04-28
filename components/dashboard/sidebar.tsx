"use client";

import { cn } from "@/lib/utils";
import {
  Shield,
  LayoutDashboard,
  GitBranch,
  Users,
  Lock,
  Globe,
  Activity,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/providers";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "pipelines", label: "Pipelines", icon: GitBranch },
  { id: "hires", label: "Hires", icon: Users },
  { id: "vault", label: "Vault", icon: Lock },
  { id: "domains", label: "Domains", icon: Globe },
  { id: "activity", label: "Activity", icon: Activity },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();

  // Get first 2 letters of email for the avatar, fallback to 'SA'
  const initials = user?.email?.substring(0, 2).toUpperCase() || "SA";

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-sidebar rounded-lg border border-sidebar-border"
      >
        {mobileOpen ? (
          <X className="h-5 w-5 text-sidebar-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-sidebar-foreground" />
        )}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-200",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent">
            <Shield className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-sidebar-primary">
              Onboardly
            </h1>
            <p className="text-xs text-sidebar-foreground">Admin Console</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  setMobileOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Interactive User Menu Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent h-auto py-2"
              >
                <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                  {initials}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-sidebar-primary truncate">
                    Super Admin
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    {user?.email || "Loading..."}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={signOut}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
}
