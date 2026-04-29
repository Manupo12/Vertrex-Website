import { buildJsonErrorResponse } from "@/lib/api/error-response";
import { requireTeamSession } from "@/lib/auth/session";
import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import { buildCsvContent, buildCsvResponse, type CsvColumn } from "@/lib/export/csv-export";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireTeamSession();

    if (!isDatabaseConfigured) {
      return Response.json({ error: "Base de datos no configurada." }, { status: 503 });
    }

    const db = getDb();
    const links = await db.select().from(schema.links).orderBy(schema.links.createdAt);

    const columns: CsvColumn<(typeof links)[number]>[] = [
      { header: "ID", accessor: (row) => row.id },
      { header: "Cliente ID", accessor: (row) => row.clientId },
      { header: "Proyecto ID", accessor: (row) => row.projectId },
      { header: "Título", accessor: (row) => row.title },
      { header: "URL", accessor: (row) => row.url },
      { header: "Tipo", accessor: (row) => row.kind },
      { header: "Descripción", accessor: (row) => row.description },
      { header: "Dominio", accessor: (row) => row.domain },
      { header: "Creado", accessor: (row) => row.createdAt?.toISOString() ?? "" },
      { header: "Actualizado", accessor: (row) => row.updatedAt?.toISOString() ?? "" },
    ];

    const csv = buildCsvContent(columns, links);
    return buildCsvResponse(csv, `vertrex-links-${new Date().toISOString().slice(0, 10)}.csv`);
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible exportar links.");
  }
}
