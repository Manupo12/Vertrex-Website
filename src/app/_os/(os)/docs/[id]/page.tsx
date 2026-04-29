import { notFound } from "next/navigation";

import DocumentDetailScreen from "@/components/os/document-detail-screen";
import { getDocumentById } from "@/lib/docs/document-service";

export default async function DocumentEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const document = await getDocumentById(id);

  if (!document) {
    notFound();
  }

  return <DocumentDetailScreen document={document} />;
}