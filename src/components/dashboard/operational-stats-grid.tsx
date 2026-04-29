"use client";

import { FolderKanban, Heart, Rocket, Users } from "lucide-react";

import { operationalMetricMeta } from "@/lib/dashboard/operational-metric-meta";
import type { OperationalMetricKey, OperationalStatsSnapshot } from "@/lib/dashboard/operational-stats";

const metricOrder: OperationalMetricKey[] = ["activeProjects", "activeUsers", "community", "upcomingLaunches"];

const metricVisuals = {
  activeProjects: {
    color: "text-primary",
    icon: FolderKanban,
  },
  activeUsers: {
    color: "text-blue-400",
    icon: Users,
  },
  community: {
    color: "text-purple-400",
    icon: Heart,
  },
  upcomingLaunches: {
    color: "text-amber-400",
    icon: Rocket,
  },
} satisfies Record<
  OperationalMetricKey,
  {
    color: string;
    icon: typeof FolderKanban;
  }
>;

type OperationalStatsGridProps = {
  snapshot: OperationalStatsSnapshot;
  variant?: "login" | "dashboard";
};

export function OperationalStatsGrid({ snapshot, variant = "dashboard" }: OperationalStatsGridProps) {
  return (
    <div className={variant === "login" ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"}>
      {metricOrder.map((key) => {
        const meta = operationalMetricMeta[key];
        const visuals = metricVisuals[key];
        const source = snapshot.sources[key];
        const detail = source === "manual" ? meta.manualDetail : meta.detail;

        return (
          <div
            key={key}
            className={
              variant === "login"
                ? "group rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-sm transition-all hover:border-white/20"
                : "rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-[0_0_15px_rgba(0,255,135,0.05)]"
            }
          >
            <div className="mb-4 flex items-center justify-between">
              <div className={`rounded-lg border border-border bg-background p-2 ${visuals.color}`}>
                <visuals.icon className="h-5 w-5" />
              </div>
              <div
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                  source === "manual"
                    ? "border border-amber-500/20 bg-amber-500/10 text-amber-400"
                    : "border border-primary/20 bg-primary/10 text-primary"
                }`}
              >
                {source === "manual" ? "Manual" : "Auto"}
              </div>
            </div>
            <div>
              <div className="mb-1 text-3xl font-bold text-white">
                {new Intl.NumberFormat("es-CO").format(snapshot.values[key])}
              </div>
              <div
                className={
                  variant === "login"
                    ? "mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                    : "text-sm font-medium text-muted-foreground"
                }
              >
                {meta.label}
              </div>
              <div className={variant === "login" ? "text-[10px] text-muted-foreground/60" : "mt-1 text-xs text-muted-foreground"}>
                {detail}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
