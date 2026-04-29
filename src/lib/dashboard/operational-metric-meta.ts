import type { OperationalMetricKey } from "@/lib/dashboard/operational-stats";

export const operationalMetricMeta: Record<
  OperationalMetricKey,
  {
    label: string;
    detail: string;
    manualDetail: string;
  }
> = {
  activeProjects: {
    label: "Proyectos Activos",
    detail: "SaaS y software activos",
    manualDetail: "Override manual aplicado",
  },
  activeUsers: {
    label: "Usuarios Activos",
    detail: "Clientes con acceso activo",
    manualDetail: "Override manual aplicado",
  },
  community: {
    label: "Comunidad",
    detail: "Proyectos comunitarios activos",
    manualDetail: "Override manual aplicado",
  },
  upcomingLaunches: {
    label: "Próximos lanzamientos",
    detail: "Roadmap marcado como próximo",
    manualDetail: "Override manual aplicado",
  },
};
