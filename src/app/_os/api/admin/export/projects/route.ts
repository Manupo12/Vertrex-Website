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
    const projects = await db.select().from(schema.projects).orderBy(schema.projects.createdAt);

    const columns: CsvColumn<(typeof projects)[number]>[] = [
      { header: "ID", accessor: (row) => row.id },
      { header: "Cliente ID", accessor: (row) => row.clientId },
      { header: "Nombre", accessor: (row) => row.name },
      { header: "Descripción", accessor: (row) => row.description },
      { header: "Estado", accessor: (row) => row.status },
      { header: "Progreso", accessor: (row) => row.progress },
      { header: "Fecha inicio", accessor: (row) => row.startDate?.toISOString() ?? "" },
      { header: "Fecha fin", accessor: (row) => row.endDate?.toISOString() ?? "" },
      { header: "Creado", accessor: (row) => row.createdAt?.toISOString() ?? "" },
      { header: "Actualizado", accessor: (row) => row.updatedAt?.toISOString() ?? "" },
    ];

    const csv = buildCsvContent(columns, projects);
    return buildCsvResponse(csv, `vertrex-projects-${new Date().toISOString().slice(0, 10)}.csv`);
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible exportar proyectos.");
  }
}
