import React, { useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  RotateCcw,
  Search,
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

const chartData = [
  { month: "Sep", candidates: 2100 },
  { month: "Oct", candidates: 2800 },
  { month: "Nov", candidates: 3200 },
  { month: "Dec", candidates: 2900 },
  { month: "Jan", candidates: 3800 },
  { month: "Feb", candidates: 4200 },
  { month: "Mar", candidates: 4600 },
  { month: "Apr", candidates: 5100 },
];

const allStuckCandidates = [
  {
    id: 1,
    name: "James Rivera",
    tenant: "Acme Corp",
    stage: "Background Check",
    days: 14,
  },
  {
    id: 2,
    name: "Priya Sharma",
    tenant: "Globex Corp",
    stage: "Document Signing",
    days: 9,
  },
  {
    id: 3,
    name: "Tom Nakamura",
    tenant: "CloudNine Inc",
    stage: "IT Provisioning",
    days: 7,
  },
  {
    id: 4,
    name: "Lisa Park",
    tenant: "NovaPay",
    stage: "Offer Review",
    days: 5,
  },
  {
    id: 5,
    name: "David Chen",
    tenant: "Acme Corp",
    stage: "I-9 Verification",
    days: 11,
  },
  {
    id: 6,
    name: "Maria Santos",
    tenant: "Vertex Labs",
    stage: "Equipment Setup",
    days: 6,
  },
  {
    id: 7,
    name: "Kevin Wright",
    tenant: "TechFlow Inc",
    stage: "Background Check",
    days: 8,
  },
  {
    id: 8,
    name: "Aisha Patel",
    tenant: "BrightPath HR",
    stage: "Document Signing",
    days: 5,
  },
];

export default function GlobalUsagePage() {
  const [search, setSearch] = useState("");
  const [resetStates, setResetStates] = useState<Record<number, string>>({});

  const filtered = allStuckCandidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.tenant.toLowerCase().includes(search.toLowerCase()),
  );

  const handleReset = (id: number) => {
    setResetStates((prev) => ({ ...prev, [id]: "resetting" }));
    setTimeout(() => {
      setResetStates((prev) => ({ ...prev, [id]: "done" }));
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Heading */}
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Global Usage Metrics
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Platform-wide candidate and onboarding statistics across all
          workspaces
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Workspaces"
          value="28,491"
          change={8.3}
          changeLabel="vs. last month"
          icon={Users}
          accentClass="bg-primary"
        />
        <KpiCard
          title="Total Candidates"
          value="19,847"
          change={12.1}
          changeLabel="vs. last month"
          icon={UserCheck}
        />
        <KpiCard
          title="Pending Onboardings"
          value="234"
          change={-18.4}
          changeLabel="vs. last month"
          icon={Clock}
        />
        <KpiCard
          title="Documents Processed"
          value="1,410"
          change={-5.2}
          changeLabel="vs. last month"
          icon={UserX}
        />
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Candidate Volume Trend
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Monthly candidate intake across all tenants
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            Last 8 months
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
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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

      {/* Individual Stuck Candidates */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            Individual Stuck Candidates
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Candidates idle for 5+ days — apply targeted Force Reset per record
          </p>
        </div>

        {/* Search */}
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

        {/* Table */}
        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No candidates match your search or filter.
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
                      disabled={state === "resetting" || state === "done"}
                      onClick={() => handleReset(c.id)}
                      className={`gap-1.5 h-7 text-xs min-w-[100px] transition-all ${
                        state === "done"
                          ? "border-success/30 text-success bg-success/5"
                          : "hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      <RotateCcw
                        className={`w-3 h-3 ${state === "resetting" ? "animate-spin" : ""}`}
                      />
                      {state === "resetting"
                        ? "Resetting…"
                        : state === "done"
                          ? "Reset ✓"
                          : "Force Reset"}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-5 py-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">
            {filtered.length} of {allStuckCandidates.length} candidates shown
          </p>
        </div>
      </div>
    </div>
  );
}
