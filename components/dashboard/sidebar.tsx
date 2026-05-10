"use client";

// Imports
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useTenant } from "@/lib/providers/tenant-provider";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  GitBranch,
  Users,
  FolderLock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Nav Definitions
const navItems = [
  {
    id: "pipeline",
    label: "Pipeline",
    icon: LayoutDashboard,
    href: "/tenantdashboard",
  },
  {
    id: "workflow",
    label: "Workflow Engine",
    icon: GitBranch,
    href: "/tenantdashboard/workflow",
  },
  {
    id: "people",
    label: "People & Directory",
    icon: Users,
    href: "/tenantdashboard/people",
  },
  {
    id: "vault",
    label: "The Vault",
    icon: FolderLock,
    href: "/tenantdashboard/vault",
  },
];

// Sidebar
export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const { tenant } = useTenant();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out z-40",
        sidebarCollapsed ? "w-16" : "w-64",
      )}
    >
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent z-50 shadow-sm transition-transform hover:scale-105"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>

      <div className="h-16 flex-shrink-0 flex items-center px-4 border-b border-sidebar-border overflow-hidden">
        <div className="flex items-center gap-3 min-w-max">
          <div className="flex-shrink-0">
            {tenant?.logo_url ? (
              <img
                src={tenant.logo_url}
                alt="Logo"
                className="h-8 w-8 rounded object-contain"
              />
            ) : (
              <div
                className="h-8 w-8 rounded flex items-center justify-center text-white font-semibold text-sm"
                style={{ backgroundColor: tenant?.brand_color || "#3B82F6" }}
              >
                {tenant?.name?.[0]?.toUpperCase() || "O"}
              </div>
            )}
          </div>
          <span
            className={cn(
              "font-semibold text-sidebar-foreground whitespace-nowrap transition-all duration-300 ease-in-out",
              sidebarCollapsed
                ? "opacity-0 -translate-x-4 w-0 invisible"
                : "opacity-100 translate-x-0 w-auto visible",
            )}
          >
            {tenant?.name || "Onboardly"}
          </span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
        <p
          className={cn(
            "text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 px-3 transition-all duration-300",
            sidebarCollapsed
              ? "opacity-0 h-0 overflow-hidden"
              : "opacity-100 h-auto",
          )}
        >
          Platform
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/tenantdashboard" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.id}
              href={item.href}
              title={sidebarCollapsed ? item.label : undefined}
              className={cn(
                "w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(
                  "text-sm font-medium whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden",
                  sidebarCollapsed
                    ? "opacity-0 w-0 ml-0 invisible"
                    : "opacity-100 w-auto ml-3 visible",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div
        className={cn(
          "p-4 border-t border-sidebar-border flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
          sidebarCollapsed
            ? "opacity-0 h-0 p-0 pointer-events-none invisible"
            : "opacity-100 h-auto visible",
        )}
      >
        <div className="text-xs text-sidebar-muted whitespace-nowrap">
          <p className="font-medium text-sidebar-foreground">{tenant?.name}</p>
          {tenant?.slug && <p className="truncate">/{tenant.slug}</p>}
        </div>
      </div>
    </aside>
  );
}
