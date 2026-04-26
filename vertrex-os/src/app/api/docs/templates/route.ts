import { documentTemplates } from "@/lib/docs/template-catalog";
import { syncTemplateCatalog } from "@/lib/docs/document-service";
import { isDatabaseConfigured } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  if (isDatabaseConfigured) {
    await syncTemplateCatalog();
  }

  return Response.json({
    templates: documentTemplates,
    databaseConfigured: isDatabaseConfigured,
  });
}
