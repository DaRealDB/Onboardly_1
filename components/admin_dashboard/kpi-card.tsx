import React, { ElementType } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel?: string;
  icon: ElementType;
  accentClass?: string;
}

export default function KpiCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  accentClass,
}: KpiCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-card rounded-xl border border-border p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${accentClass || "bg-primary/10"}`}
        >
          <Icon
            className={`w-5 h-5 ${accentClass ? "text-white" : "text-primary"}`}
          />
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground tracking-tight">
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        {changeLabel || title}
      </p>
    </div>
  );
}
