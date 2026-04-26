import { redirect } from "next/navigation";

import ClientPortalScreen from "@/components/portal/client-portal-screen";
import { getCurrentSession } from "@/lib/auth/session";
import { getPortalPath, type PortalRouteView } from "@/lib/portal/routing";
import { getPortalClientBySlug } from "@/lib/portal/portal-service";

export async function renderClientPortalPage(clientId: string, view: PortalRouteView = "overview") {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "client") {
    redirect("/os");
  }

  if (session.user.role === "client" && session.user.clientSlug && session.user.clientSlug !== clientId) {
    redirect(getPortalPath(session.user.clientSlug));
  }

  const client = await getPortalClientBySlug(clientId);

  return <ClientPortalScreen clientId={clientId} view={view} initialClient={client} />;
}
