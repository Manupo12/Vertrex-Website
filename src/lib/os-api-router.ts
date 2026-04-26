import * as authLoginRoute from '@os/app/api/auth/login/route'
import * as authLogoutRoute from '@os/app/api/auth/logout/route'
import * as authSessionRoute from '@os/app/api/auth/session/route'
import * as docsDocumentsByIdPdfRoute from '@os/app/api/docs/documents/[id]/pdf/route'
import * as docsDocumentsByIdRoute from '@os/app/api/docs/documents/[id]/route'
import * as docsDocumentsRoute from '@os/app/api/docs/documents/route'
import * as docsRenderRoute from '@os/app/api/docs/render/route'
import * as docsTemplatesRoute from '@os/app/api/docs/templates/route'
import * as helloRoute from '@os/app/api/hello/route'
import * as openClawAiChatRoute from '@os/app/api/openclaw/ai/chat/route'
import * as openClawClientByIdRoute from '@os/app/api/openclaw/clients/[id]/route'
import * as openClawClientsRoute from '@os/app/api/openclaw/clients/route'
import * as openClawDocumentsRoute from '@os/app/api/openclaw/documents/route'
import * as openClawFinanceSummaryRoute from '@os/app/api/openclaw/finance/summary/route'
import * as openClawFinanceRoute from '@os/app/api/openclaw/finance/route'
import * as openClawMemoryByIdRoute from '@os/app/api/openclaw/memory/[id]/route'
import * as openClawMemoryRoute from '@os/app/api/openclaw/memory/route'
import * as openClawProjectByIdRoute from '@os/app/api/openclaw/projects/[id]/route'
import * as openClawProjectsRoute from '@os/app/api/openclaw/projects/route'
import * as openClawStatusRoute from '@os/app/api/openclaw/status/route'
import * as openClawTaskByIdRoute from '@os/app/api/openclaw/tasks/[id]/route'
import * as openClawTasksRoute from '@os/app/api/openclaw/tasks/route'
import * as openClawWebhooksRoute from '@os/app/api/openclaw/webhooks/route'

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
  { pattern: ['auth', 'login'], module: asRouteModule(authLoginRoute) },
  { pattern: ['auth', 'logout'], module: asRouteModule(authLogoutRoute) },
  { pattern: ['auth', 'session'], module: asRouteModule(authSessionRoute) },
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
