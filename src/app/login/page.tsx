import { redirect } from 'next/navigation'

import LoginScreen from '@/components/auth/login-screen'
import { getCurrentSession, getLoginRedirectPath } from '@/lib/auth/session'
import { getOperationalStatsSnapshot } from '@/lib/dashboard/operational-stats'

type LoginPageProps = {
  searchParams?: Promise<{
    type?: string | string[]
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getCurrentSession()

  if (session) {
    redirect(getLoginRedirectPath(session.user))
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const rawType = resolvedSearchParams?.type
  const type = Array.isArray(rawType) ? rawType[0] : rawType
  const statsSnapshot = await getOperationalStatsSnapshot()

  return <LoginScreen defaultRole={type === 'client' ? 'client' : 'team'} statsSnapshot={statsSnapshot} />
}
