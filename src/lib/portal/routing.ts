import type { PortalView } from "@/lib/portal/client-portal-data";

export type PortalRouteView = PortalView | "chat";

const routeSegmentByView: Record<PortalRouteView, string | null> = {
  overview: null,
  progress: "progress",
  documents: "documents",
  billing: "payments",
  credentials: "access",
  files: "files",
  support: "support",
  chat: "chat",
};

export function getPortalPath(clientId: string, view: PortalRouteView = "overview") {
  const segment = routeSegmentByView[view];
  return segment ? `/portal/${clientId}/${segment}` : `/portal/${clientId}`;
}

export function coercePortalView(view: string | undefined): PortalRouteView {
  switch (view) {
    case "progress":
      return "progress";
    case "documents":
      return "documents";
    case "billing":
    case "payments":
      return "billing";
    case "credentials":
    case "access":
      return "credentials";
    case "files":
      return "files";
    case "support":
      return "support";
    case "chat":
      return "chat";
    default:
      return "overview";
  }
}
