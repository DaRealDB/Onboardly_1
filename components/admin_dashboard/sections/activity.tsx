import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity as ActivityIcon,
  Users,
  Building2,
  FileCheck,
  Bell,
} from "lucide-react";
import KpiCard from "../kpi-card";
import LiveFeedItem from "../live-feed-item";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

// Format functions
function getTimeAgo(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export default function ActivityPage() {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    tenants: 0,
    candidates: 0,
    completed: 0,
    documents: 0,
  });

  // Fetch functions
  useEffect(() => {
    const fetchData = async () => {
      const { count: tenantsCount } = await supabase
        .from("companies")
        .select("*", { count: "exact", head: true });

      const { count: candidatesCount } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true });

      const { count: completedCount } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .not("hired_at", "is", null);

      const { count: docsCount } = await supabase
        .from("client_documents")
        .select("*", { count: "exact", head: true });

      setStats({
        tenants: tenantsCount || 0,
        candidates: candidatesCount || 0,
        completed: completedCount || 0,
        documents: docsCount || 0,
      });

      const { data: notifsData, error } = await supabase
        .from("admin_notifications")
        .select("id, title, message, type, created_at")
        .order("created_at", { ascending: false })
        .limit(25);

      if (error) console.error("Error fetching admin notifications:", error);

      if (notifsData) {
        const mappedNotifs = notifsData.map((n: any) => ({
          id: n.id,
          type: n.type || "system",
          message: `${n.title} — ${n.message}`,
          time: getTimeAgo(n.created_at),
        }));
        setNotifications(mappedNotifs);
      }
    };

    fetchData();

    // Real-time subscriptions targeting the new admin table
    const channel = supabase
      .channel("admin-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "admin_notifications",
        },
        (payload) => {
          const newAlert = {
            id: payload.new.id,
            type: payload.new.type || "system",
            message: `${payload.new.title} — ${payload.new.message}`,
            time: "Just now",
          };

          setNotifications((prev) => [newAlert, ...prev].slice(0, 25));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // View
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Activity Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time platform events across all tenants and workspaces
        </p>
      </div>

      {/* KPI Section */}
      <div className="pt-4">
        <h2 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
          Platform-Wide Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Active Workspaces"
            value={stats.tenants.toString()}
            change={0}
            changeLabel="vs. last month"
            icon={Building2}
          />
          <KpiCard
            title="Total Candidates"
            value={stats.candidates.toString()}
            change={0}
            changeLabel="vs. last month"
            icon={Users}
          />
          <KpiCard
            title="Completed Onboardings"
            value={stats.completed.toString()}
            change={0}
            changeLabel="vs. last week"
            icon={ActivityIcon}
          />
          <KpiCard
            title="Documents Uploaded"
            value={stats.documents.toString()}
            change={0}
            changeLabel="vs. last month"
            icon={FileCheck}
          />
        </div>
      </div>

      {/* Global Notifications Feed */}
      <div className="bg-card rounded-xl border border-border overflow-hidden mt-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-foreground">
              Global Notifications
            </h2>
            <Badge
              variant="secondary"
              className="gap-1.5 text-[11px] bg-primary/10 text-primary"
            >
              <Bell className="w-3 h-3 animate-pulse" />
              Live
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            {notifications.length} alerts
          </span>
        </div>

        <div className="divide-y divide-border/50 max-h-[520px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Listening for new events across the platform...
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {notifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <LiveFeedItem event={notif} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
