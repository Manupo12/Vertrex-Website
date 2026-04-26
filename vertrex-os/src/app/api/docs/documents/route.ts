import { desc, eq } from "drizzle-orm";

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
    const payload = saveDocumentPayloadSchema.parse(await request.json());
    const result = await saveDocument(payload);

    return Response.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible guardar el documento.";

    return Response.json({ error: message }, { status: 400 });
  }
}
