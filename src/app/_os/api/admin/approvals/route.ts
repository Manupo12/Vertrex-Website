import { eq } from "drizzle-orm";
import { z } from "zod";

import { buildJsonErrorResponse } from "@/lib/api/error-response";
import { requireTeamSession } from "@/lib/auth/session";
import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import {
  createPendingApproval,
  readApprovalFromMetadata,
  resolveApproval,
  writeApprovalToMetadata,
} from "@/lib/ops/approval-governance";

export const runtime = "nodejs";

const createApprovalSchema = z.object({
  entityType: z.enum(["milestone", "ticket"]),
  entityId: z.string().uuid(),
  reason: z.string().nullable().optional(),
});

const resolveApprovalSchema = z.object({
  entityType: z.enum(["milestone", "ticket"]),
  entityId: z.string().uuid(),
  status: z.enum(["approved", "rejected"]),
  reason: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await requireTeamSession();
    const payload = createApprovalSchema.parse(await request.json());

    if (!isDatabaseConfigured) {
      return Response.json({ error: "Base de datos no configurada." }, { status: 503 });
    }

    const db = getDb();

    if (payload.entityType === "milestone") {
      const [milestone] = await db.select().from(schema.milestones).where(eq(schema.milestones.id, payload.entityId)).limit(1);
      if (!milestone) {
        return Response.json({ error: "Milestone no encontrado." }, { status: 404 });
      }

      const approval = createPendingApproval(session.user.name, payload.reason ?? null);
      const nextMetadata = writeApprovalToMetadata((milestone.metadata as Record<string, unknown>) ?? {}, approval);

      await db.update(schema.milestones).set({ metadata: nextMetadata, updatedAt: new Date() }).where(eq(schema.milestones.id, payload.entityId));
    } else {
      const [ticket] = await db.select().from(schema.tickets).where(eq(schema.tickets.id, payload.entityId)).limit(1);
      if (!ticket) {
        return Response.json({ error: "Ticket no encontrado." }, { status: 404 });
      }

      const approval = createPendingApproval(session.user.name, payload.reason ?? null);
      const nextMetadata = writeApprovalToMetadata((ticket.metadata as Record<string, unknown>) ?? {}, approval);

      await db.update(schema.tickets).set({ metadata: nextMetadata, updatedAt: new Date() }).where(eq(schema.tickets.id, payload.entityId));
    }

    return Response.json({ success: true });
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible solicitar la aprobación.");
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireTeamSession();
    const payload = resolveApprovalSchema.parse(await request.json());

    if (!isDatabaseConfigured) {
      return Response.json({ error: "Base de datos no configurada." }, { status: 503 });
    }

    const db = getDb();

    if (payload.entityType === "milestone") {
      const [milestone] = await db.select().from(schema.milestones).where(eq(schema.milestones.id, payload.entityId)).limit(1);
      if (!milestone) {
        return Response.json({ error: "Milestone no encontrado." }, { status: 404 });
      }

      const currentApproval = readApprovalFromMetadata((milestone.metadata as Record<string, unknown>) ?? {});
      if (!currentApproval || currentApproval.status !== "pending") {
        return Response.json({ error: "No hay una aprobación pendiente para este milestone." }, { status: 409 });
      }

      const nextApproval = resolveApproval(currentApproval, payload.status, session.user.name, payload.reason ?? null);
      const nextMetadata = writeApprovalToMetadata((milestone.metadata as Record<string, unknown>) ?? {}, nextApproval);

      await db.update(schema.milestones).set({ metadata: nextMetadata, updatedAt: new Date() }).where(eq(schema.milestones.id, payload.entityId));
    } else {
      const [ticket] = await db.select().from(schema.tickets).where(eq(schema.tickets.id, payload.entityId)).limit(1);
      if (!ticket) {
        return Response.json({ error: "Ticket no encontrado." }, { status: 404 });
      }

      const currentApproval = readApprovalFromMetadata((ticket.metadata as Record<string, unknown>) ?? {});
      if (!currentApproval || currentApproval.status !== "pending") {
        return Response.json({ error: "No hay una aprobación pendiente para este ticket." }, { status: 409 });
      }

      const nextApproval = resolveApproval(currentApproval, payload.status, session.user.name, payload.reason ?? null);
      const nextMetadata = writeApprovalToMetadata((ticket.metadata as Record<string, unknown>) ?? {}, nextApproval);

      await db.update(schema.tickets).set({ metadata: nextMetadata, updatedAt: new Date() }).where(eq(schema.tickets.id, payload.entityId));
    }

    return Response.json({ success: true });
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible resolver la aprobación.");
  }
}
