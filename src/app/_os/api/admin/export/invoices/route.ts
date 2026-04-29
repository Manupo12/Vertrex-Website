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
    const invoices = await db.select().from(schema.invoices).orderBy(schema.invoices.createdAt);

    const columns: CsvColumn<(typeof invoices)[number]>[] = [
      { header: "ID", accessor: (row) => row.id },
      { header: "Cliente ID", accessor: (row) => row.clientId },
      { header: "Documento ID", accessor: (row) => row.documentId },
      { header: "Label", accessor: (row) => row.label },
      { header: "Número", accessor: (row) => row.invoiceNumber },
      { header: "Monto (cents)", accessor: (row) => row.amountCents },
      { header: "Estado", accessor: (row) => row.status },
      { header: "Vencimiento", accessor: (row) => row.dueDate?.toISOString() ?? "" },
      { header: "Creado", accessor: (row) => row.createdAt?.toISOString() ?? "" },
      { header: "Actualizado", accessor: (row) => row.updatedAt?.toISOString() ?? "" },
    ];

    const csv = buildCsvContent(columns, invoices);
    return buildCsvResponse(csv, `vertrex-invoices-${new Date().toISOString().slice(0, 10)}.csv`);
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible exportar invoices.");
  }
}
