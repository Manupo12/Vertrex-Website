"use server";

function escapeCsvCell(value: unknown): string {
  const cell = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(cell)) {
    return `"${cell.replace(/"/g, '""')}"`;
  }
  return cell;
}

function buildCsvRow(values: unknown[]): string {
  return values.map(escapeCsvCell).join(",") + "\r\n";
}

export type CsvColumn<T> = {
  header: string;
  accessor: (row: T) => unknown;
};

export function buildCsvContent<T>(columns: CsvColumn<T>[], rows: T[]): string {
  const header = buildCsvRow(columns.map((column) => column.header));
  const body = rows.map((row) => buildCsvRow(columns.map((column) => column.accessor(row)))).join("");
  return "\uFEFF" + header + body;
}

export function buildCsvResponse(content: string, filename: string): Response {
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
