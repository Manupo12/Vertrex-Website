import { requireTeamSession } from "@/lib/auth/session";
import { buildJsonErrorResponse } from "@/lib/api/error-response";
import {
  createWorkspaceAutomationPlaybook,
  createWorkspaceAutomationRun,
  createWorkspaceClient,
  createWorkspaceCredential,
  createWorkspaceDeal,
  createWorkspaceEvent,
  createWorkspaceInvoice,
  createWorkspaceLink,
  createWorkspaceMilestone,
  createWorkspaceMessage,
  createWorkspaceProject,
  createWorkspaceTask,
  createWorkspaceTicket,
  createWorkspaceTransaction,
  getWorkspaceSnapshot,
} from "@/lib/ops/workspace-service";
import { workspaceAdminCommandSchema } from "@/lib/ops/workspace-schemas";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireTeamSession();
    const snapshot = await getWorkspaceSnapshot();
    return Response.json(snapshot);
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible consultar el workspace operativo.");
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireTeamSession();
    const command = workspaceAdminCommandSchema.parse(await request.json());
    enforceRateLimit({
      request,
      namespace: "admin-workspace-command",
      max: 60,
      windowMs: 5 * 60 * 1000,
      identifier: `${session.user.id}:${command.kind}`,
      message: "Demasiadas acciones operativas en poco tiempo. Espera un momento antes de seguir ejecutando comandos del workspace.",
    });
    const options = {
      actor: {
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
      },
    };

    switch (command.kind) {
      case "client":
        return Response.json(await createWorkspaceClient(command.payload, options), { status: 201 });
      case "project":
        return Response.json(await createWorkspaceProject(command.payload, options), { status: 201 });
      case "task":
        return Response.json(await createWorkspaceTask(command.payload, options), { status: 201 });
      case "milestone":
        return Response.json(await createWorkspaceMilestone(command.payload, options), { status: 201 });
      case "deal":
        return Response.json(await createWorkspaceDeal(command.payload, options), { status: 201 });
      case "event":
        return Response.json(await createWorkspaceEvent(command.payload, options), { status: 201 });
      case "transaction":
        return Response.json(await createWorkspaceTransaction(command.payload, options), { status: 201 });
      case "invoice":
        return Response.json(await createWorkspaceInvoice(command.payload, options), { status: 201 });
      case "credential":
        return Response.json(await createWorkspaceCredential(command.payload, options), { status: 201 });
      case "link":
        return Response.json(await createWorkspaceLink(command.payload, options), { status: 201 });
      case "ticket":
        return Response.json(await createWorkspaceTicket(command.payload, options), { status: 201 });
      case "message":
        return Response.json(await createWorkspaceMessage(command.payload, options), { status: 201 });
      case "automationPlaybook":
        return Response.json(await createWorkspaceAutomationPlaybook(command.payload, options), { status: 201 });
      case "automationRun":
        return Response.json(await createWorkspaceAutomationRun(command.payload, options), { status: 201 });
      default:
        return Response.json({ error: "Comando no soportado." }, { status: 400 });
    }
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible ejecutar la acción operativa.");
  }
}
