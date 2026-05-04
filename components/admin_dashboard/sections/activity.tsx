import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity as ActivityIcon,
  Users,
  Building2,
  FileCheck,
  Radio,
} from "lucide-react";
import KpiCard from "../kpi-card";
import LiveFeedItem from "../live-feed-item";
import { Badge } from "@/components/ui/badge";

const initialEvents = [
  {
    id: 1,
    type: "tenant",
    message: "New tenant 'Acme Corp' signed up — auto-provisioning workspace.",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "milestone",
    message: "Platform-wide: 10,000th hire completed! 🎉",
    time: "8 min ago",
  },
  {
    id: 3,
    type: "hire",
    message:
      "Sarah Chen accepted offer at TechFlow Inc. Pipeline stage → Onboarding.",
    time: "15 min ago",
  },
  {
    id: 4,
    type: "document",
    message:
      "Bulk I-9 verification completed for Globex Corp — 47 documents processed.",
    time: "22 min ago",
  },
  {
    id: 5,
    type: "alert",
    message: "High latency detected on subdomain routing for NovaPay tenant.",
    time: "31 min ago",
  },
  {
    id: 6,
    type: "hire",
    message:
      "Marcus Johnson completed onboarding at Vertex Labs — all tasks signed off.",
    time: "45 min ago",
  },
  {
    id: 7,
    type: "system",
    message:
      "Scheduled maintenance window: Vault storage rebalancing completed.",
    time: "1 hr ago",
  },
  {
    id: 8,
    type: "tenant",
    message: "Workspace 'BrightPath HR' upgraded to Enterprise tier.",
    time: "1.5 hrs ago",
  },
  {
    id: 9,
    type: "document",
    message:
      "Digital signature batch processed — 120 offer letters signed across 8 tenants.",
    time: "2 hrs ago",
  },
  {
    id: 10,
    type: "hire",
    message: "Emily Rodriguez started Day 1 onboarding at CloudNine Inc.",
    time: "2.5 hrs ago",
  },
];

const newEvents = [
  {
    type: "hire",
    message: "Alex Kim completed background check at DataWave Corp.",
    time: "Just now",
  },
  {
    type: "tenant",
    message: "New tenant 'Horizon Labs' provisioned — subdomain active.",
    time: "Just now",
  },
  {
    type: "document",
    message: "NDA batch signed — 23 documents for QuantumHR.",
    time: "Just now",
  },
];

export default function ActivityPage() {
  const [events, setEvents] = useState(initialEvents);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const randomEvent =
        newEvents[Math.floor(Math.random() * newEvents.length)];
      setEvents((prev) => [
        {
          ...randomEvent,
          id: Date.now(),
          time: "Just now",
        },
        ...prev.slice(0, 14),
      ]);
    }, 6000);
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Heading */}
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Activity Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Real-time platform events across all tenants and workspaces
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Tenants"
          value="142"
          change={12}
          changeLabel="vs. last month"
          icon={Building2}
        />
        <KpiCard
          title="Total Candidates"
          value="28,491"
          change={8.3}
          changeLabel="vs. last month"
          icon={Users}
        />
        <KpiCard
          title="Hires This Week"
          value="347"
          change={-2.1}
          changeLabel="vs. last week"
          icon={ActivityIcon}
        />
        <KpiCard
          title="Documents Signed"
          value="1,204"
          change={15.7}
          changeLabel="vs. last month"
          icon={FileCheck}
        />
      </div>

      {/* Live Feed */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-foreground">
              Live Feed
            </h2>
            <Badge
              variant="secondary"
              className={`gap-1.5 text-[11px] cursor-pointer ${isLive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}
              onClick={() => setIsLive(!isLive)}
            >
              <Radio
                className={`w-3 h-3 ${isLive ? "animate-pulse-dot" : ""}`}
              />
              {isLive ? "Live" : "Paused"}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            {events.length} events
          </span>
        </div>
        <div className="divide-y divide-border/50 max-h-[520px] overflow-y-auto">
          <AnimatePresence initial={false}>
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LiveFeedItem event={event} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
