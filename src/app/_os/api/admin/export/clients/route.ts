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
    const clients = await db.select().from(schema.clients).orderBy(schema.clients.createdAt);

    const columns: CsvColumn<(typeof clients)[number]>[] = [
      { header: "ID", accessor: (row) => row.id },
      { header: "Slug", accessor: (row) => row.slug },
      { header: "Nombre", accessor: (row) => row.name },
      { header: "Marca", accessor: (row) => row.brand },
      { header: "Email", accessor: (row) => row.email },
      { header: "Teléfono", accessor: (row) => row.phone },
      { header: "Empresa", accessor: (row) => row.company },
      { header: "Estado", accessor: (row) => row.status },
      { header: "Fase", accessor: (row) => row.phase },
      { header: "Progreso", accessor: (row) => row.progress },
      { header: "Creado", accessor: (row) => row.createdAt?.toISOString() ?? "" },
      { header: "Actualizado", accessor: (row) => row.updatedAt?.toISOString() ?? "" },
    ];

    const csv = buildCsvContent(columns, clients);
    return buildCsvResponse(csv, `vertrex-clients-${new Date().toISOString().slice(0, 10)}.csv`);
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible exportar clientes.");
  }
}
