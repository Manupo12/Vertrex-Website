import * as adminAccessRoute from '@/app/_os/api/admin/access/route'
import * as adminAccessUserByIdRoute from '@/app/_os/api/admin/access/users/[id]/route'
import * as adminHealthRoute from '@/app/_os/api/admin/health/route'
import * as adminOperationalStatsRoute from '@/app/_os/api/admin/operational-stats/route'
import * as adminWorkspaceFilesRoute from '@/app/_os/api/admin/workspace/files/route'
import * as adminWorkspaceRoute from '@/app/_os/api/admin/workspace/route'
import * as authLoginRoute from '@/app/_os/api/auth/login/route'
import * as authLogoutRoute from '@/app/_os/api/auth/logout/route'
import * as authSessionRoute from '@/app/_os/api/auth/session/route'
import * as documentsGenerateRoute from '@/app/_os/api/documents/generate/route'
import * as docsDocumentsByIdPdfRoute from '@/app/_os/api/docs/documents/[id]/pdf/route'
import * as docsDocumentsByIdRoute from '@/app/_os/api/docs/documents/[id]/route'
import * as docsDocumentsRoute from '@/app/_os/api/docs/documents/route'
import * as docsRenderRoute from '@/app/_os/api/docs/render/route'
import * as docsTemplatesRoute from '@/app/_os/api/docs/templates/route'
import * as helloRoute from '@/app/_os/api/hello/route'
import * as openClawAiChatRoute from '@/app/_os/api/openclaw/ai/chat/route'
import * as openClawClientByIdRoute from '@/app/_os/api/openclaw/clients/[id]/route'
import * as openClawClientsRoute from '@/app/_os/api/openclaw/clients/route'
import * as openClawDocumentsRoute from '@/app/_os/api/openclaw/documents/route'
import * as openClawFinanceSummaryRoute from '@/app/_os/api/openclaw/finance/summary/route'
import * as openClawFinanceRoute from '@/app/_os/api/openclaw/finance/route'
import * as openClawMemoryByIdRoute from '@/app/_os/api/openclaw/memory/[id]/route'
import * as openClawMemoryRoute from '@/app/_os/api/openclaw/memory/route'
import * as openClawProjectByIdRoute from '@/app/_os/api/openclaw/projects/[id]/route'
import * as openClawProjectsRoute from '@/app/_os/api/openclaw/projects/route'
import * as openClawStatusRoute from '@/app/_os/api/openclaw/status/route'
import * as openClawTaskByIdRoute from '@/app/_os/api/openclaw/tasks/[id]/route'
import * as openClawTasksRoute from '@/app/_os/api/openclaw/tasks/route'
import * as openClawWebhooksRoute from '@/app/_os/api/openclaw/webhooks/route'
import * as portalCredentialsRoute from '@/app/_os/api/portal/credentials/route'
import * as portalFilesRoute from '@/app/_os/api/portal/files/route'
import * as portalMeRoute from '@/app/_os/api/portal/me/route'
import * as portalMessagesRoute from '@/app/_os/api/portal/messages/route'
import * as portalTicketsRoute from '@/app/_os/api/portal/tickets/route'

type ParamsRecord = Record<string, string>

type RouteHandler = (request: Request, context?: { params: Promise<ParamsRecord> }) => Promise<Response> | Response

type RouteModule = Partial<Record<'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE', RouteHandler>>

type RouteDefinition = {
  pattern: readonly string[]
  module: RouteModule
}

const asRouteModule = (routeModule: unknown) => routeModule as RouteModule

const methodNames = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'] as const

const osApiRoutes: RouteDefinition[] = [
  { pattern: ['hello'], module: asRouteModule(helloRoute) },
  { pattern: ['admin', 'access'], module: asRouteModule(adminAccessRoute) },
  { pattern: ['admin', 'access', 'users', ':id'], module: asRouteModule(adminAccessUserByIdRoute) },
  { pattern: ['admin', 'health'], module: asRouteModule(adminHealthRoute) },
  { pattern: ['admin', 'operational-stats'], module: asRouteModule(adminOperationalStatsRoute) },
  { pattern: ['admin', 'workspace'], module: asRouteModule(adminWorkspaceRoute) },
  { pattern: ['admin', 'workspace', 'files'], module: asRouteModule(adminWorkspaceFilesRoute) },
  { pattern: ['auth', 'login'], module: asRouteModule(authLoginRoute) },
  { pattern: ['auth', 'logout'], module: asRouteModule(authLogoutRoute) },
  { pattern: ['auth', 'session'], module: asRouteModule(authSessionRoute) },
  { pattern: ['documents', 'generate'], module: asRouteModule(documentsGenerateRoute) },
  { pattern: ['docs', 'templates'], module: asRouteModule(docsTemplatesRoute) },
  { pattern: ['docs', 'render'], module: asRouteModule(docsRenderRoute) },
  { pattern: ['docs', 'documents'], module: asRouteModule(docsDocumentsRoute) },
  { pattern: ['docs', 'documents', ':id'], module: asRouteModule(docsDocumentsByIdRoute) },
  { pattern: ['docs', 'documents', ':id', 'pdf'], module: asRouteModule(docsDocumentsByIdPdfRoute) },
  { pattern: ['openclaw', 'status'], module: asRouteModule(openClawStatusRoute) },
  { pattern: ['openclaw', 'ai', 'chat'], module: asRouteModule(openClawAiChatRoute) },
  { pattern: ['openclaw', 'clients'], module: asRouteModule(openClawClientsRoute) },
  { pattern: ['openclaw', 'clients', ':id'], module: asRouteModule(openClawClientByIdRoute) },
  { pattern: ['openclaw', 'documents'], module: asRouteModule(openClawDocumentsRoute) },
  { pattern: ['openclaw', 'finance'], module: asRouteModule(openClawFinanceRoute) },
  { pattern: ['openclaw', 'finance', 'summary'], module: asRouteModule(openClawFinanceSummaryRoute) },
  { pattern: ['openclaw', 'memory'], module: asRouteModule(openClawMemoryRoute) },
  { pattern: ['openclaw', 'memory', ':id'], module: asRouteModule(openClawMemoryByIdRoute) },
  { pattern: ['openclaw', 'projects'], module: asRouteModule(openClawProjectsRoute) },
  { pattern: ['openclaw', 'projects', ':id'], module: asRouteModule(openClawProjectByIdRoute) },
  { pattern: ['openclaw', 'tasks'], module: asRouteModule(openClawTasksRoute) },
  { pattern: ['openclaw', 'tasks', ':id'], module: asRouteModule(openClawTaskByIdRoute) },
  { pattern: ['openclaw', 'webhooks'], module: asRouteModule(openClawWebhooksRoute) },
  { pattern: ['portal', 'me'], module: asRouteModule(portalMeRoute) },
  { pattern: ['portal', 'messages'], module: asRouteModule(portalMessagesRoute) },
  { pattern: ['portal', 'files'], module: asRouteModule(portalFilesRoute) },
  { pattern: ['portal', 'tickets'], module: asRouteModule(portalTicketsRoute) },
  { pattern: ['portal', 'credentials'], module: asRouteModule(portalCredentialsRoute) },
]

function getAllowedMethods(routeModule: RouteModule) {
  return methodNames.filter((method) => routeModule[method])
}

function matchRoutePattern(pattern: readonly string[], slug: string[]) {
  if (pattern.length !== slug.length) {
    return null
  }

  const params: ParamsRecord = {}

  for (let index = 0; index < pattern.length; index += 1) {
    const matcher = pattern[index]
    const segment = slug[index]

    if (matcher.startsWith(':')) {
      params[matcher.slice(1)] = decodeURIComponent(segment)
      continue
    }

    if (matcher !== segment) {
      return null
    }
  }

  return params
}

export async function handleOSApiRequest(method: typeof methodNames[number], request: Request, slug: string[]) {
  for (const route of osApiRoutes) {
    const params = matchRoutePattern(route.pattern, slug)

    if (!params) {
      continue
    }

    const handler = route.module[method]

    if (!handler) {
      const allowedMethods = getAllowedMethods(route.module)
      return Response.json(
        { error: 'Método no permitido.' },
        {
          status: 405,
          headers: allowedMethods.length > 0 ? { Allow: allowedMethods.join(', ') } : undefined,
        },
      )
    }

    return handler(request, { params: Promise.resolve(params) })
  }

  return Response.json({ error: 'Ruta API no encontrada.' }, { status: 404 })
}
