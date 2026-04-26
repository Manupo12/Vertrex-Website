import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { getCurrentSession } from '@os/lib/auth/session'

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentSession()

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'client') {
    redirect('/os')
  }

  return <>{children}</>
}
