import { renderClientPortalPage } from '@/lib/portal/render-page'

type PortalPageProps = {
  params: Promise<{ clientId: string }>
}

export default async function PortalPage({ params }: PortalPageProps) {
  const { clientId } = await params

  return renderClientPortalPage(clientId)
}
