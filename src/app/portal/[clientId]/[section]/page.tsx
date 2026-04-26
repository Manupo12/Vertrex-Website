import { renderClientPortalPage } from '@os/lib/portal/render-page'
import { coercePortalView } from '@os/lib/portal/routing'

type PortalSectionPageProps = {
  params: Promise<{ clientId: string; section: string }>
}

export default async function PortalSectionPage({ params }: PortalSectionPageProps) {
  const { clientId, section } = await params

  return renderClientPortalPage(clientId, coercePortalView(section))
}
