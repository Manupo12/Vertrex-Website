import { z } from "zod";

import { buildJsonErrorResponse } from "@/lib/api/error-response";
import { requireTeamSession } from "@/lib/auth/session";
import { revokeManagedUserSessions, setManagedUserActive } from "@/lib/admin/access-service";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

const updateManagedUserSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("set-active"),
    isActive: z.boolean(),
    expectedUpdatedAt: z.string().datetime().nullable().optional(),
  }),
  z.object({
    action: z.literal("revoke-sessions"),
  }),
]);

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireTeamSession();
    const { id } = await context.params;
    const payload = updateManagedUserSchema.parse(await request.json());
    enforceRateLimit({
      request,
      namespace: "admin-access-user-patch",
      max: 24,
      windowMs: 10 * 60 * 1000,
      identifier: `${session.user.id}:${payload.action}`,
      message: "Demasiadas actualizaciones de acceso. Espera un momento antes de seguir administrando sesiones o usuarios.",
    });
    const snapshot =
      payload.action === "set-active"
        ? await setManagedUserActive(id, payload.isActive, {
          userId: session.user.id,
          role: session.user.role,
          name: session.user.name,
          email: session.user.email,
        }, payload.expectedUpdatedAt ?? null)
        : await revokeManagedUserSessions(id, {
          userId: session.user.id,
          role: session.user.role,
          name: session.user.name,
          email: session.user.email,
        });

    return Response.json(snapshot);
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible actualizar el acceso.");
  }
}
