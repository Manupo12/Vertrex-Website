import { NextRequest, NextResponse } from "next/server";

import { requireTeamSession } from "@/lib/auth/session";
import { getDb, schema } from "@/lib/db";
import { recordBusinessEvent } from "@/lib/ops/business-event-service";

export async function POST(request: NextRequest) {
  const session = await requireTeamSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const url = formData.get("url") as string | null;
    const file = formData.get("file") as File | null;
    const name = (formData.get("name") as string) || "Imported Document";
    const clientSlug = formData.get("clientSlug") as string | null;
    const projectName = formData.get("projectName") as string | null;

    if (!url && !file) {
      return NextResponse.json(
        { error: "URL or file required" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Find client if provided
    let clientId: string | null = null;
    if (clientSlug) {
      const client = await db.query.clients.findFirst({
        where: (clients, { eq }) => eq(clients.slug, clientSlug),
      });
      if (client) {
        clientId = client.id;
      }
    }

    // Create document record
    const [document] = await db
      .insert(schema.documents)
      .values({
        title: name,
        status: "draft",
        origin: "os",
        category: "Operativo",
        code: `IMP-${Date.now()}`,
        clientId,
        createdById: session.user.id,
        payload: {
          importedAt: new Date().toISOString(),
          importedBy: session.user.id,
          sourceUrl: url,
          fileName: file?.name,
          projectName,
        },
      })
      .returning();

    // Record business event
    await recordBusinessEvent({
      actor: { userId: session.user.id, name: session.user.name },
      eventType: "document_imported",
      module: "documents",
      action: "import",
      entityType: "document",
      entityId: document.id,
      summary: `Document imported: ${name}`,
      clientId: clientId ?? undefined,
    });

    return NextResponse.json({
      success: true,
      documentId: document.id,
      message: "Document imported successfully",
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Failed to import document" },
      { status: 500 }
    );
  }
}
