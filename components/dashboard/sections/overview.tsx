"use client"

import { StatsCard } from "@/components/dashboard/stats-card"
import {
  GitBranch,
  Users,
  Lock,
  Globe,
  Activity,
  TrendingUp,
} from "lucide-react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

const chartData = [
  { name: "Mon", hires: 12, signups: 24 },
  { name: "Tue", hires: 19, signups: 31 },
  { name: "Wed", hires: 15, signups: 28 },
  { name: "Thu", hires: 22, signups: 35 },
  { name: "Fri", hires: 28, signups: 42 },
  { name: "Sat", hires: 14, signups: 20 },
  { name: "Sun", hires: 18, signups: 26 },
]

const recentActivity = [
  { id: 1, type: "signup", domain: "acme.co", time: "2 min ago" },
  { id: 2, type: "hire", domain: "techcorp.io", time: "5 min ago" },
  { id: 3, type: "signup", domain: "startup.dev", time: "12 min ago" },
  { id: 4, type: "contract", domain: "enterprise.com", time: "18 min ago" },
  { id: 5, type: "hire", domain: "agency.co", time: "25 min ago" },
]

export function OverviewSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Overview</h2>
        <p className="text-sm text-muted-foreground">
          Platform-wide metrics and analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatsCard
          title="Active Pipelines"
          value={47}
          subtitle="Across 12 domains"
          icon={GitBranch}
          trend={{ value: 12, label: "vs last week" }}
        />
        <StatsCard
          title="Total Hires"
          value="1,284"
          subtitle="This month"
          icon={Users}
          trend={{ value: 8, label: "vs last month" }}
        />
        <StatsCard
          title="Vault Assets"
          value="3.2 GB"
          subtitle="842 documents"
          icon={Lock}
          trend={{ value: 15, label: "vs last month" }}
        />
        <StatsCard
          title="Active Domains"
          value={12}
          subtitle="3 pending setup"
          icon={Globe}
        />
        <StatsCard
          title="Events Today"
          value={156}
          subtitle="Real-time activity"
          icon={Activity}
          trend={{ value: 23, label: "vs yesterday" }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-medium text-foreground">
                Platform Activity
              </h3>
              <p className="text-xs text-muted-foreground">
                Hires and signups over time
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-muted-foreground">Signups</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-chart-2" />
                <span className="text-muted-foreground">Hires</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="signupsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.75 0.15 170)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.75 0.15 170)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="hiresGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.65 0.18 250)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0.005 260)",
                    border: "1px solid oklch(0.28 0.005 260)",
                    borderRadius: "8px",
                    color: "oklch(0.95 0 0)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="signups"
                  stroke="oklch(0.75 0.15 170)"
                  strokeWidth={2}
                  fill="url(#signupsGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="hires"
                  stroke="oklch(0.65 0.18 250)"
                  strokeWidth={2}
                  fill="url(#hiresGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">
              Recent Activity
            </h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.type === "signup"
                        ? "bg-accent"
                        : item.type === "hire"
                        ? "bg-chart-2"
                        : "bg-chart-3"
                    }`}
                  />
                  <div>
                    <p className="text-sm text-foreground font-mono">
                      {item.domain}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {item.type}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
