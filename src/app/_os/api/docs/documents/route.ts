import { desc, eq } from "drizzle-orm";

import { buildJsonErrorResponse } from "@/lib/api/error-response";
import { requireTeamSession } from "@/lib/auth/session";
import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import { saveDocument, saveDocumentPayloadSchema } from "@/lib/docs/document-service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isDatabaseConfigured) {
    return Response.json({ documents: [], databaseConfigured: false });
  }

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");
  const db = getDb();

  if (clientId) {
    const [client] = await db
      .select({ id: schema.clients.id })
      .from(schema.clients)
      .where(eq(schema.clients.slug, clientId))
      .limit(1);

    if (!client) {
      return Response.json({ documents: [], databaseConfigured: true });
    }

    const documents = await db
      .select()
      .from(schema.documents)
      .where(eq(schema.documents.clientId, client.id))
      .orderBy(desc(schema.documents.updatedAt));

    return Response.json({ documents, databaseConfigured: true });
  }

  const documents = await db.select().from(schema.documents).orderBy(desc(schema.documents.updatedAt));

  return Response.json({ documents, databaseConfigured: true });
}

export async function POST(request: Request) {
  try {
    const session = await requireTeamSession();
    const payload = saveDocumentPayloadSchema.parse(await request.json());
    const result = await saveDocument(payload, {
      actor: {
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
      },
    });

    return Response.json(result, { status: 201 });
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible guardar el documento.");
  }
}
