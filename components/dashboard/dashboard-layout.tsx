"use client";

import { useAppStore } from "@/lib/store";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { PipelineModule } from "./modules/pipeline-module";
import { WorkflowModule } from "./modules/workflow-module";
import { PeopleModule } from "./modules/people-module";
import { VaultModule } from "./modules/vault-module";
import { SettingsModule } from "./modules/settings-module";
import { cn } from "@/lib/utils";

export function DashboardLayout() {
  const { currentModule, sidebarCollapsed } = useAppStore();

  const renderModule = () => {
    switch (currentModule) {
      case "pipeline":
        return <PipelineModule />;
      case "workflow":
        return <WorkflowModule />;
      case "people":
        return <PeopleModule />;
      case "vault":
        return <VaultModule />;
      case "settings":
        return <SettingsModule />;
      default:
        return <PipelineModule />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64",
        )}
      >
        <TopBar />
        {/* mt-16 pushes the content down below the fixed header */}
        <main className="p-6 mt-16">{renderModule()}</main>
      </div>
    </div>
  );
}
