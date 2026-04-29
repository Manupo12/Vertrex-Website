import { ZodError } from "zod";

import { OptimisticLockError } from "@/lib/security/optimistic-lock";
import { RateLimitError } from "@/lib/security/rate-limit";

export function buildJsonErrorResponse(error: unknown, fallbackMessage: string) {
  const message =
    error instanceof ZodError
      ? error.issues.map((issue) => issue.message).join(" · ")
      : error instanceof Error
        ? error.message
        : fallbackMessage;
  const status =
    error instanceof RateLimitError
      ? 429
      : error instanceof OptimisticLockError
        ? 409
      : message === "Sesión inválida o expirada."
      ? 401
      : message === "Acceso restringido al equipo interno." || message === "Acceso restringido al portal del cliente."
        ? 403
        : 400;

  return Response.json({ error: message }, {
    status,
    headers: error instanceof RateLimitError ? error.headers : undefined,
  });
}
