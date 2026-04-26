export function buildOsHref(path = '') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return normalizedPath === '/' ? '/os' : `/os${normalizedPath}`
}

export function getLocalTeamLoginPath() {
  return '/login?type=team'
}

export function getLocalClientLoginPath() {
  return '/login?type=client'
}

export function getLocalDashboardPath() {
  return '/os'
}

export function getLocalClientPortalPath(clientId = 'budaphone') {
  return `/portal/${clientId}`
}

export function getTeamLoginHref() {
  return getLocalTeamLoginPath()
}

export function getClientLoginHref() {
  return getLocalClientLoginPath()
}

export function getDashboardHref() {
  return getLocalDashboardPath()
}

export function getClientPortalHref(clientId = 'budaphone') {
  return getLocalClientPortalPath(clientId)
}

export function getAuthSessionHref() {
  return '/api/auth/session'
}
