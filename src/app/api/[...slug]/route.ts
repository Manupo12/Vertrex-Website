import { handleOSApiRequest } from '@/lib/os-api-router'

export const runtime = 'nodejs'

type RouteContext = {
  params: Promise<{ slug: string[] }>
}

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params
  return handleOSApiRequest('GET', request, slug)
}

export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params
  return handleOSApiRequest('POST', request, slug)
}

export async function PATCH(request: Request, context: RouteContext) {
  const { slug } = await context.params
  return handleOSApiRequest('PATCH', request, slug)
}

export async function PUT(request: Request, context: RouteContext) {
  const { slug } = await context.params
  return handleOSApiRequest('PUT', request, slug)
}

export async function DELETE(request: Request, context: RouteContext) {
  const { slug } = await context.params
  return handleOSApiRequest('DELETE', request, slug)
}
