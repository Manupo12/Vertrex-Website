import { redirect } from 'next/navigation'

import LoginScreen from '@os/components/auth/login-screen'
import { getCurrentSession, getLoginRedirectPath } from '@os/lib/auth/session'

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

  return <LoginScreen defaultRole={type === 'client' ? 'client' : 'team'} />
}
