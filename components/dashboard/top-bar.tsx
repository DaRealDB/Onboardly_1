"use client";

// Imports
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/lib/providers/auth-provider";
import { useTenant } from "@/lib/providers/tenant-provider";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Settings,
  LogOut,
  Sun,
  Moon,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Component
export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut: authSignOut } = useAuth();
  const { tenant } = useTenant();
  const supabase = createClient();

  const { theme, toggleTheme, sidebarCollapsed } = useAppStore();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const fullName =
    user?.user_metadata?.full_name || user?.user_metadata?.fullName || "User";
  const email = user?.email || "";
  const initial = fullName.charAt(0).toUpperCase();

  // Fetch and Subscribe to Notifications
  useEffect(() => {
    if (!tenant?.id) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("company_id", tenant.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (data) setNotifications(data);
    };

    fetchNotifications();

    // Listen for new notifications in real-time
    const channel = supabase
      .channel("realtime-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `company_id=eq.${tenant.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tenant?.id, supabase]);

  const handleMarkRead = async (id: string) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    // Update DB
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  };

  // Handlers
  const handleSignOut = async () => {
    await authSignOut();
  };

  const getPageTitle = () => {
    if (pathname === "/tenantdashboard") return "Pipeline";
    if (pathname.includes("/workflow")) return "Workflow Engine";
    if (pathname.includes("/people")) return "People & Directory";
    if (pathname.includes("/vault")) return "The Vault";
    if (pathname.includes("/settings")) return "Settings";
    return "Dashboard";
  };

  // Render
  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between px-6 transition-all duration-300",
        sidebarCollapsed ? "left-16" : "left-64",
      )}
    >
      <div>
        <h2 className="text-lg font-semibold text-foreground tracking-tight">
          {getPageTitle()}
        </h2>
      </div>

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
                    onClick={() => handleMarkRead(n.id)}
                    className="flex flex-col items-start p-3"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <span
                        className={cn(
                          "font-medium text-sm",
                          !n.read && "text-primary",
                        )}
                      >
                        {n.title}
                      </span>
                      {!n.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary ml-auto" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {n.message}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-px bg-border mx-1" />

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
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{fullName}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {email}
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Workspaces
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => router.push("/tenantdashboard")}>
              <Briefcase className="h-4 w-4 mr-2" />
              Tenant Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-muted-foreground"
              onClick={() => {
                // Placeholder for portal
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Client Portal (Preview)
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => router.push("/tenantdashboard/settings")}
            >
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
