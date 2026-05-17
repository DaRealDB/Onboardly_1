import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  RotateCcw,
  Search,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
} from "recharts";
import KpiCard from "../kpi-card";
import { createClient } from "@/lib/supabase/client";

// Placeholder data for chart until monthly tracking is added to DB
const chartData = [
  { month: "Sep", candidates: 120 },
  { month: "Oct", candidates: 180 },
  { month: "Nov", candidates: 200 },
];

export default function GlobalUsagePage() {
  const [search, setSearch] = useState("");
  const [resetStates, setResetStates] = useState<Record<string, string>>({});
  const [stuckCandidates, setStuckCandidates] = useState<any[]>([]);
  const [stats, setStats] = useState({
    workspaces: 0,
    total: 0,
    pending: 0,
    docs: 0,
  });

  // Modal state
  const [confirmResetId, setConfirmResetId] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // KPIs
      const { count: workspaces } = await supabase
        .from("companies")
        .select("*", { count: "exact", head: true });
      const { count: total } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true });
      const { count: pending } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      const { count: docs } = await supabase
        .from("client_documents")
        .select("*", { count: "exact", head: true });

      setStats({
        workspaces: workspaces || 0,
        total: total || 0,
        pending: pending || 0,
        docs: docs || 0,
      });

      // Candidates stuck for >= 2 days
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const { data, error } = await supabase
        .from("clients")
        .select("id, full_name, status, created_at, companies(name)")
        .eq("status", "pending")
        .lte("created_at", twoDaysAgo.toISOString()) // Strict filter for 2+ days
        .order("created_at", { ascending: true })
        .limit(20);

      if (error) {
        console.error("Error fetching stuck candidates:", error);
      }

      if (data) {
        const mapped = data.map((c: any) => {
          const created = new Date(c.created_at);
          const days = Math.floor(
            (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24),
          );
          return {
            id: c.id,
            name: c.full_name,
            tenant: c.companies?.name || "Unknown Tenant",
            stage: "Pending Actions",
            days: days > 0 ? days : 1,
          };
        });
        setStuckCandidates(mapped);
      }
    };
    fetchData();
  }, [supabase]);

  const filtered = stuckCandidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.tenant.toLowerCase().includes(search.toLowerCase()),
  );

  const executeReset = async () => {
    if (!confirmResetId) return;
    setIsResetting(true);

    // Delete all uploaded documents for this specific client
    const { error } = await supabase
      .from("client_documents")
      .delete()
      .eq("client_id", confirmResetId);

    if (error) {
      console.error("Error resetting documents:", error);
    } else {
      // Mark as done visually
      setResetStates((prev) => ({ ...prev, [confirmResetId]: "done" }));
    }

    setIsResetting(false);
    setConfirmResetId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl relative">
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Global Usage Metrics
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Platform-wide candidate and onboarding statistics across all
          workspaces
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Workspaces"
          value={stats.workspaces.toString()}
          change={0}
          changeLabel="vs. last month"
          icon={Users}
          accentClass="bg-primary"
        />
        <KpiCard
          title="Total Candidates"
          value={stats.total.toString()}
          change={0}
          changeLabel="vs. last month"
          icon={UserCheck}
        />
        <KpiCard
          title="Pending Onboardings"
          value={stats.pending.toString()}
          change={0}
          changeLabel="vs. last month"
          icon={Clock}
        />
        <KpiCard
          title="Documents Processed"
          value={stats.docs.toString()}
          change={0}
          changeLabel="vs. last month"
          icon={UserX}
        />
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Candidate Volume Trend
            </h2>
          </div>
          <Badge variant="secondary" className="text-xs">
            Historical
          </Badge>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="candidateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <RTooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="candidates"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#candidateGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            Stuck Candidates Overview (2+ Days)
          </h2>
        </div>

        <div className="px-5 py-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search candidate or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No pending candidates stuck for more than 2 days.
            </div>
          ) : (
            filtered.map((c) => {
              const state = resetStates[c.id];
              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {c.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {c.tenant} · {c.stage}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge
                      variant="outline"
                      className="bg-warning/10 text-warning border-warning/20 text-[11px]"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {c.days}d stuck
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={state === "done"}
                      onClick={() => setConfirmResetId(c.id)}
                      className={`gap-1.5 h-7 text-xs min-w-[100px] transition-all ${
                        state === "done"
                          ? "border-success/30 text-success bg-success/5 hover:bg-success/5 hover:text-success"
                          : "hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      <RotateCcw className="w-3 h-3" />
                      {state === "done" ? "Reset ✓" : "Force Reset"}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Force Reset Confirmation Modal */}
      {confirmResetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border p-6 rounded-xl shadow-lg max-w-sm w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Reset Candidate Documents?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to force reset this candidate? This will
              permanently delete any documents they have uploaded and revert
              their progress.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setConfirmResetId(null)}
                disabled={isResetting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={executeReset}
                disabled={isResetting}
              >
                {isResetting ? "Resetting..." : "Yes, Reset Documents"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
