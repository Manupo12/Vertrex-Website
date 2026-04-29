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
    const deals = await db.select().from(schema.deals).orderBy(schema.deals.createdAt);

    const columns: CsvColumn<(typeof deals)[number]>[] = [
      { header: "ID", accessor: (row) => row.id },
      { header: "Cliente ID", accessor: (row) => row.clientId },
      { header: "Proyecto ID", accessor: (row) => row.projectId },
      { header: "Título", accessor: (row) => row.title },
      { header: "Stage", accessor: (row) => row.stage },
      { header: "Modelo", accessor: (row) => row.billingModel },
      { header: "Valor (cents)", accessor: (row) => row.valueCents },
      { header: "Probabilidad", accessor: (row) => row.probability },
      { header: "Owner", accessor: (row) => row.owner },
      { header: "Último contacto", accessor: (row) => row.lastContactAt?.toISOString() ?? "" },
      { header: "Cierre esperado", accessor: (row) => row.expectedCloseAt?.toISOString() ?? "" },
      { header: "Creado", accessor: (row) => row.createdAt?.toISOString() ?? "" },
      { header: "Actualizado", accessor: (row) => row.updatedAt?.toISOString() ?? "" },
    ];

    const csv = buildCsvContent(columns, deals);
    return buildCsvResponse(csv, `vertrex-deals-${new Date().toISOString().slice(0, 10)}.csv`);
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible exportar deals.");
  }
}
