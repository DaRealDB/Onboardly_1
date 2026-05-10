// Imports
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  CheckCircle2,
  Clock,
  FileText,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: Date;
  type: "info" | "success" | "warning" | "error";
};

// Component
export function PipelineModule() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const supabase = createClient();

  // Data Fetching
  useEffect(() => {
    const loadDashboard = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: teamData } = await supabase
        .from("team_members")
        .select("company_id")
        .eq("user_id", user.id)
        .single();

      if (!teamData) return;

      const { data: clientsData } = await supabase
        .from("clients")
        .select("*, client_documents(*)")
        .eq("company_id", teamData.company_id)
        .order("created_at", { ascending: false });

      if (clientsData) {
        setClients(clientsData);

        const allDocs = clientsData.flatMap((c) => c.client_documents || []);
        setDocuments(allDocs);

        const generatedActivities: ActivityItem[] = [];

        clientsData.forEach((client) => {
          generatedActivities.push({
            id: `client-created-${client.id}`,
            title: "New Client Added",
            description: `${client.full_name} was added to the pipeline`,
            time: new Date(client.created_at),
            type: "info",
          });

          if (client.status === "hired" && client.hired_at) {
            generatedActivities.push({
              id: `client-hired-${client.id}`,
              title: "Hire Finalized",
              description: `${client.full_name} completed onboarding`,
              time: new Date(client.hired_at),
              type: "success",
            });
          }

          (client.client_documents || []).forEach((doc: any) => {
            let title = "Document Uploaded";
            let type: ActivityItem["type"] = "info";
            let desc = `${client.full_name} uploaded ${doc.step_title}`;

            if (doc.status === "accepted") {
              title = "Document Approved";
              type = "success";
              desc = `${doc.step_title} for ${client.full_name} was approved`;
            } else if (doc.status === "change-requested") {
              title = "Change Requested";
              type = "warning";
              desc = `Changes requested for ${doc.step_title} (${client.full_name})`;
            }

            generatedActivities.push({
              id: `doc-${doc.id}-${doc.status}`,
              title,
              description: desc,
              time: new Date(doc.uploaded_at),
              type,
            });
          });
        });

        generatedActivities.sort((a, b) => b.time.getTime() - a.time.getTime());
        setActivities(generatedActivities.slice(0, 15));
      }

      setLoading(false);
    };

    loadDashboard();
  }, [supabase]);

  // Metrics
  const activeHires = clients.filter((c) => c.status === "pending").length;
  const completedHires = clients.filter((c) => c.status === "hired").length;
  const totalClients = clients.length;
  const completionRate =
    totalClients > 0 ? Math.round((completedHires / totalClients) * 100) : 0;
  const pendingDocs = documents.filter((d) => d.status === "pending").length;

  let avgDays = 0;
  const hiredWithDates = clients.filter(
    (c) => c.status === "hired" && c.hired_at,
  );
  if (hiredWithDates.length > 0) {
    const totalMs = hiredWithDates.reduce((acc, c) => {
      return (
        acc +
        (new Date(c.hired_at).getTime() - new Date(c.created_at).getTime())
      );
    }, 0);
    avgDays =
      Math.round(
        (totalMs / hiredWithDates.length / (1000 * 60 * 60 * 24)) * 10,
      ) / 10;
  }

  const kpiCards = [
    {
      title: "Total Active Hires",
      value: activeHires.toString(),
      subtext: "Pending clients",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      subtext: `${completedHires} of ${totalClients} hired`,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Documents",
      value: pendingDocs.toString(),
      subtext: "Requires review",
      icon: FileText,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Avg. Onboarding Time",
      value: `${avgDays} days`,
      subtext: "For hired clients",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  // Handlers
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Render
  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Onboarding Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor onboarding progress, completion rates, and recent activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={cn("p-2 rounded-lg", card.bgColor)}>
                    <Icon className={cn("h-5 w-5", card.color)} />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-foreground">
                    {card.value}
                  </p>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {card.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.subtext}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Live Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {activities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No activity found yet
                </div>
              ) : (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full mt-2 flex-shrink-0",
                        activity.type === "success" && "bg-green-500",
                        activity.type === "warning" && "bg-yellow-500",
                        activity.type === "error" && "bg-red-500",
                        activity.type === "info" && "bg-blue-500",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.title}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {activity.description}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatTime(activity.time)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Recent Additions
              <Link
                href="/tenantdashboard/people"
                className="text-sm font-normal text-primary flex items-center gap-1 hover:underline"
              >
                View all
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {clients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No clients onboarded yet
                </div>
              ) : (
                clients.slice(0, 5).map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
                      {client.full_name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {client.full_name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {client.email}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full font-medium",
                        client.status === "hired" &&
                          "bg-green-100 text-green-700",
                        client.status === "pending" &&
                          "bg-amber-100 text-amber-700",
                      )}
                    >
                      {client.status.charAt(0).toUpperCase() +
                        client.status.slice(1)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
