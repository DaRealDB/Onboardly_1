"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { OverviewSection } from "@/components/dashboard/sections/overview";
import { PipelinesSection } from "@/components/dashboard/sections/pipelines";
import { HiresSection } from "@/components/dashboard/sections/hires";
import { VaultSection } from "@/components/dashboard/sections/vault";
import { DomainsSection } from "@/components/dashboard/sections/domains";
import { ActivitySection } from "@/components/dashboard/sections/activity";

export default function AdminUnifiedDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection />;
      case "pipelines":
        return <PipelinesSection />;
      case "hires":
        return <HiresSection />;
      case "vault":
        return <VaultSection />;
      case "domains":
        return <DomainsSection />;
      case "activity":
        return <ActivitySection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-6">{renderSection()}</div>
      </main>
    </div>
  );
}
