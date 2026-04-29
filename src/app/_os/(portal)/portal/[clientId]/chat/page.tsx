import { renderClientPortalPage } from "@/lib/portal/render-page";

type ClientPortalRouteProps = {
  params: Promise<{ clientId: string }>;
};

export default async function ClientPortalChatPage({ params }: ClientPortalRouteProps) {
  const { clientId } = await params;
  return renderClientPortalPage(clientId, "chat");
}
