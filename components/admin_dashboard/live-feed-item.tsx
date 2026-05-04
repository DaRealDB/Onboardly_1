import React, { ElementType } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  UserPlus,
  Trophy,
  AlertTriangle,
  FileCheck,
  Zap,
} from "lucide-react";

export interface ActivityEvent {
  type: string;
  message: string;
  time: string;
  id?: number;
}

interface LiveFeedItemProps {
  event: ActivityEvent;
}

const typeConfig: Record<
  string,
  { icon: ElementType; color: string; label: string }
> = {
  tenant: {
    icon: Building2,
    color: "bg-primary/10 text-primary",
    label: "Tenant",
  },
  hire: { icon: UserPlus, color: "bg-success/10 text-success", label: "Hire" },
  milestone: {
    icon: Trophy,
    color: "bg-warning/10 text-warning",
    label: "Milestone",
  },
  alert: {
    icon: AlertTriangle,
    color: "bg-destructive/10 text-destructive",
    label: "Alert",
  },
  document: {
    icon: FileCheck,
    color: "bg-chart-2/10 text-chart-2",
    label: "Document",
  },
  system: {
    icon: Zap,
    color: "bg-muted text-muted-foreground",
    label: "System",
  },
};

export default function LiveFeedItem({ event }: LiveFeedItemProps) {
  const config = typeConfig[event.type] || typeConfig.system;
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3.5 px-4 py-3.5 hover:bg-muted/50 transition-colors rounded-lg group cursor-default">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground leading-snug">{event.message}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[11px] text-muted-foreground">
            {event.time}
          </span>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 h-4 font-medium"
          >
            {config.label}
          </Badge>
        </div>
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
