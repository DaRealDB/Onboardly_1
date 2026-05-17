// Imports
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
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Types
interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

// Navigation config
const navItems = [
  { path: "/admin", label: "Activity", icon: Activity },
  { path: "/admin/workspaces", label: "Workspaces", icon: Building2 },
  { path: "/admin/global-usage", label: "Global Usage", icon: BarChart3 },
  { path: "/admin/vault", label: "Vault", icon: Shield },
];

// Component
export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={`fixed left-0 top-0 z-40 h-screen bg-white dark:bg-[#110505] border-r border-red-200 dark:border-red-900/60 flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? "w-[68px]" : "w-[240px]"
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center px-4 border-b border-red-200 dark:border-red-900/60 flex-shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-red-600 dark:bg-red-700 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white font-bold text-lg leading-none">
                O
              </span>
            </div>
            <span
              className={`font-bold text-lg text-slate-900 dark:text-red-50 whitespace-nowrap transition-opacity duration-200 ${
                collapsed ? "opacity-0 w-0 hidden" : "opacity-100"
              }`}
            >
              Onboardly
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-x-hidden overflow-y-auto">
          <p
            className={`text-[10px] font-semibold uppercase tracking-widest text-red-400 dark:text-red-500/70 mb-3 px-2 transition-opacity duration-200 ${
              collapsed ? "opacity-0 hidden" : "opacity-100"
            }`}
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
                      ? "bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-100 shadow-sm"
                      : "text-slate-600 dark:text-red-400/80 hover:text-red-700 dark:hover:text-red-200 hover:bg-red-50/50 dark:hover:bg-red-950/20"
                  }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-blue-500"
                      : "text-slate-400 dark:text-red-500/60 group-hover:text-blue-500 dark:group-hover:text-blue-400"
                  }`}
                />
                <span
                  className={`whitespace-nowrap transition-opacity duration-200 ${
                    collapsed ? "opacity-0 w-0 hidden" : "opacity-100"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 flex-shrink-0" />
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent
                    side="right"
                    sideOffset={12}
                    className="bg-red-950 text-red-50 border-red-900"
                  >
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.path}>{linkContent}</div>;
          })}
        </nav>

        {/* Toggle */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-[#1a0f0f] border border-red-200 dark:border-red-800 shadow-sm flex items-center justify-center text-slate-400 dark:text-red-500/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
