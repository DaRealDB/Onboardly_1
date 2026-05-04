"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Building2,
  BarChart3,
  Shield,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: "/admin", label: "Activity", icon: Activity },
  { path: "/admin/workspaces", label: "Workspaces", icon: Building2 },
  { path: "/admin/global-usage", label: "Global Usage", icon: BarChart3 },
  { path: "/admin/vault", label: "Vault", icon: Shield },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={`fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out ${collapsed ? "w-[68px]" : "w-[240px]"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border flex-shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span
              className={`font-bold text-lg text-sidebar-foreground whitespace-nowrap transition-opacity duration-200 ${collapsed ? "opacity-0 w-0 hidden" : "opacity-100"}`}
            >
              Onboardly
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-hidden">
          <p
            className={`text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-2 transition-opacity duration-200 ${collapsed ? "opacity-0 hidden" : "opacity-100"}`}
          >
            Platform
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            const linkContent = (
              <Link
                href={item.path}
                className={`flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 group
                  ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? "text-sidebar-primary" : ""}`}
                />
                <span
                  className={`whitespace-nowrap transition-opacity duration-200 ${collapsed ? "opacity-0 w-0 hidden" : "opacity-100"}`}
                >
                  {item.label}
                </span>
                {isActive && !collapsed && (
                  <div
                    className={`ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary flex-shrink-0 transition-opacity duration-200`}
                  />
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={12}>
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.path}>{linkContent}</div>;
          })}
        </nav>

        <div className="py-4" />

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      </aside>
    </TooltipProvider>
  );
}
