import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import OSShell from '@/components/os/os-shell'
import { getCurrentSession } from '@/lib/auth/session'

export default async function OSLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentSession()

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'team') {
    redirect(`/portal/${session.user.clientSlug ?? 'budaphone'}`)
  }

  return (
    <OSShell
      user={{
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      }}
    >
      {children}
    </OSShell>
  )
}
