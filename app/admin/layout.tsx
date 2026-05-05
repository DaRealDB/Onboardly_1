"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun, Bell, ChevronRight, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Sidebar from "@/components/admin_dashboard/sidebar";

// Routing configurations
const pageTitles: Record<string, { title: string; breadcrumb: string }> = {
  "/admin": { title: "Activity", breadcrumb: "Live Feed & Overview" },
  "/admin/workspaces": { title: "Workspaces", breadcrumb: "Tenant Management" },
  "/admin/global-usage": {
    title: "Global Usage",
    breadcrumb: "Platform Metrics",
  },
  "/admin/vault": { title: "Vault", breadcrumb: "Storage & Signatures" },
};

// Header
function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const page = pageTitles[pathname] || { title: "Dashboard", breadcrumb: "" };

  // 1. Hydration Fix State
  const [mounted, setMounted] = useState(false);

  // 2. Admin Data State
  const [adminName, setAdminName] = useState("Loading...");
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    setMounted(true); // Tells component it's safe to render theme icons

    // Fetch Admin Data
    const fetchAdminData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("super_admins")
          .select("full_name, email")
          .eq("id", user.id)
          .single();

        if (data) {
          setAdminName(data.full_name || "Super Admin");
          setAdminEmail(data.email);
        } else {
          setAdminName("Super Admin");
          setAdminEmail(user.email || "");
        }
      }
    };

    fetchAdminData();
  }, [supabase]);

  // Handle Sign Out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login"); // Adjust this to your login route if needed
  };

  return (
    <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Super Admin</span>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
        <span className="font-medium text-foreground">{page.title}</span>
        {page.breadcrumb && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
            <span className="text-muted-foreground">{page.breadcrumb}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse-dot" />
        </button>

        {/* Hydration fix: Only render icons after mount */}
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          {mounted ? (
            theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )
          ) : (
            <div className="w-4 h-4" /> /* Invisible placeholder during SSR */
          )}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 ml-2 pl-2 border-l border-border outline-none">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground leading-none">
                  {adminName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[120px]">
                  {adminEmail || "Super Admin"}
                </p>
              </div>
              <Avatar className="w-8 h-8 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {adminName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// Layout
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <div
        className={`transition-all duration-300 ease-in-out ${collapsed ? "ml-[68px]" : "ml-[240px]"}`}
      >
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
