import { z } from "zod";

import { teamCapabilityValues, teamSubroleValues } from "@/lib/admin/access-governance";
import { buildJsonErrorResponse } from "@/lib/api/error-response";
import { requireTeamSession } from "@/lib/auth/session";
import { createManagedUser, getAccessManagementSnapshot } from "@/lib/admin/access-service";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

const createManagedUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["team", "client"]),
  teamSubrole: z.enum(teamSubroleValues).optional().nullable(),
  capabilities: z.array(z.enum(teamCapabilityValues)).optional().nullable(),
  clientSlug: z.string().trim().optional(),
  clientName: z.string().trim().optional(),
  clientBrand: z.string().trim().optional(),
  clientEmail: z.string().trim().optional(),
});

export async function GET() {
  try {
    await requireTeamSession();
    const snapshot = await getAccessManagementSnapshot();
    return Response.json(snapshot);
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible administrar los accesos.");
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireTeamSession();
    enforceRateLimit({
      request,
      namespace: "admin-access-create-user",
      max: 12,
      windowMs: 10 * 60 * 1000,
      identifier: session.user.id,
      message: "Demasiadas operaciones de acceso. Espera un momento antes de crear más usuarios.",
    });
    const payload = createManagedUserSchema.parse(await request.json());
    const snapshot = await createManagedUser(payload, {
      userId: session.user.id,
      role: session.user.role,
      name: session.user.name,
      email: session.user.email,
    });
    return Response.json(snapshot, { status: 201 });
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible administrar los accesos.");
  }
}
