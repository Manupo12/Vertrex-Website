import { randomUUID } from "node:crypto";

import { openClawError } from "@/lib/openclaw/response";

export function getOpenClawRequestId(request: Request) {
  return request.headers.get("x-request-id") ?? randomUUID();
}

export function assertOpenClawAuthorized(request: Request, requestId: string) {
  const apiKey = process.env.OPENCLAW_API_KEY;

  if (!apiKey) {
    return openClawError("OPENCLAW_API_KEY no está configurado.", requestId, 503);
  }

  const authorization = request.headers.get("authorization");

  if (authorization !== `Bearer ${apiKey}`) {
    return openClawError("No autorizado para OpenClaw.", requestId, 401);
  }

  return null;
}

export function assertOpenClawWebhookAuthorized(request: Request, requestId: string) {
  const bearerResponse = assertOpenClawAuthorized(request, requestId);

  if (!bearerResponse) {
    return null;
  }

  const webhookSecret = process.env.OPENCLAW_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return bearerResponse;
  }

  const providedSecret = request.headers.get("x-openclaw-webhook-secret");

  if (providedSecret === webhookSecret) {
    return null;
  }

  return bearerResponse;
}
