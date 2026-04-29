import { z } from "zod";

import { buildJsonErrorResponse } from "@/lib/api/error-response";
import { requireTeamSession } from "@/lib/auth/session";
import { getOperationalStatsSnapshot, updateOperationalStatsOverrides } from "@/lib/dashboard/operational-stats";

export const runtime = "nodejs";

const metricOverrideSchema = z.object({
  mode: z.enum(["auto", "manual"]),
  value: z.number().int().min(0).nullable(),
});

const updateOperationalStatsSchema = z.object({
  activeProjects: metricOverrideSchema.optional(),
  activeUsers: metricOverrideSchema.optional(),
  community: metricOverrideSchema.optional(),
  upcomingLaunches: metricOverrideSchema.optional(),
  expectedUpdatedAt: z.string().datetime().nullable().optional(),
});

export async function GET() {
  try {
    await requireTeamSession();
    const snapshot = await getOperationalStatsSnapshot();
    return Response.json(snapshot);
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible consultar las métricas operativas.");
  }
}

export async function PATCH(request: Request) {
  try {
    await requireTeamSession();
    const payload = updateOperationalStatsSchema.parse(await request.json());
    const { expectedUpdatedAt, ...overrides } = payload;
    const snapshot = await updateOperationalStatsOverrides(overrides, expectedUpdatedAt ?? null);
    return Response.json(snapshot);
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible actualizar las métricas operativas.");
  }
}
