"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AlignLeft,
  ArrowRight,
  Building2,
  Download,
  FileSignature,
  FileText,
  ListChecks,
  Receipt,
  Save,
  Scale,
  Settings2,
  Zap,
} from "lucide-react";

import {
  getDocumentGeneratorHref,
  getDocumentTemplateById,
  getDocumentTemplateDraft,
  getTemplatesForClient,
  type DocumentDraft,
  type DocumentLineItem,
  type DocumentTemplateDefinition,
} from "@/lib/docs/template-catalog";
import { useUIStore, type UIStore } from "@/lib/store/ui";

type DocumentGeneratorScreenProps = {
  templateId?: string | null;
  clientId?: string | null;
  source?: string | null;
};

export default function DocumentGeneratorScreen({ templateId, clientId, source }: DocumentGeneratorScreenProps) {
  const router = useRouter();
  const open: UIStore["open"] = useUIStore((store) => store.open);
  const template = useMemo(() => getDocumentTemplateById(templateId, clientId), [templateId, clientId]);
  const resolvedClientId = clientId ?? (template.clientId !== "universales" ? template.clientId : null);
  const availableTemplates = useMemo(
    () => getTemplatesForClient(resolvedClientId ?? template.clientId),
    [resolvedClientId, template.clientId],
  );
  const [draft, setDraft] = useState<DocumentDraft>(() => getDocumentTemplateDraft(template.id, resolvedClientId));
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewState, setPreviewState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [versionNumber, setVersionNumber] = useState<number | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setPreviewState("loading");

      try {
        const response = await fetch("/api/docs/render", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            templateId: template.id,
            clientId: resolvedClientId,
            draft,
            format: "html",
          }),
          signal: controller.signal,
        });

        const data = (await response.json()) as { html?: string; error?: string };

        if (!response.ok || !data.html) {
          throw new Error(data.error ?? "No fue posible generar la vista previa.");
        }

        setPreviewHtml(data.html);
        setPreviewState("ready");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setPreviewState("error");
        setPreviewHtml("");
        setFeedbackMessage(error instanceof Error ? error.message : "No fue posible generar la vista previa.");
      }
    }, 200);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [draft, resolvedClientId, template.id]);

  const openTemplateSelector = () => {
    open("templateSelector", {
      onSelect: (id) => {
        router.push(
          getDocumentGeneratorHref({
            templateId: id,
            clientId: resolvedClientId,
            source: source ?? "generator",
          }),
        );
      },
    });
  };

  const handleTemplateCardSelect = (id: string) => {
    router.push(
      getDocumentGeneratorHref({
        templateId: id,
        clientId: resolvedClientId,
        source: source ?? "generator",
      }),
    );
  };

  const handleSave = async () => {
    setSaveState("saving");
    setFeedbackMessage(null);

    try {
      const response = await fetch("/api/docs/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId,
          templateId: template.id,
          clientId: resolvedClientId,
          source: source ?? "generator",
          draft,
        }),
      });

      const data = (await response.json()) as {
        documentId?: string;
        versionNumber?: number;
        error?: string;
      };

      if (!response.ok || !data.documentId) {
        throw new Error(data.error ?? "No fue posible guardar el documento en Neon.");
      }

      setDocumentId(data.documentId);
      setVersionNumber(data.versionNumber ?? null);
      setSaveState("saved");
      setFeedbackMessage(`Documento guardado${data.versionNumber ? ` · v${data.versionNumber}` : ""}`);
    } catch (error) {
      setSaveState("error");
      setFeedbackMessage(error instanceof Error ? error.message : "No fue posible guardar el documento.");
    }
  };

  const handleExportPdf = async () => {
    setFeedbackMessage(null);

    try {
      if (documentId) {
        window.open(`/api/docs/documents/${documentId}/pdf`, "_blank", "noopener,noreferrer");
        return;
      }

      const response = await fetch("/api/docs/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: template.id,
          clientId: resolvedClientId,
          draft,
          format: "pdf",
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "No fue posible exportar el PDF.");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
    } catch (error) {
      setFeedbackMessage(error instanceof Error ? error.message : "No fue posible exportar el PDF.");
    }
  };

  const updateDraft = <K extends keyof DocumentDraft>(key: K, value: DocumentDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const updateClientField = (field: keyof DocumentDraft["client"]) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDraft((current) => ({
      ...current,
      client: {
        ...current.client,
        [field]: value,
      },
    }));
  };

  const updateSignatoryField = (field: keyof DocumentDraft["signatory"]) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDraft((current) => ({
      ...current,
      signatory: {
        ...current.signatory,
        [field]: value,
      },
    }));
  };

  const openPortal = () => {
    if (resolvedClientId) {
      router.push(`/portal/${resolvedClientId}/documents`);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-0 overflow-hidden rounded-2xl border border-border/30 bg-[#0A0A0A] shadow-2xl animate-fade-in print:h-auto print:border-0 print:bg-transparent print:shadow-none">
      <div className="relative z-10 flex w-[460px] shrink-0 flex-col border-r border-border/30 bg-[#0A0A0A] print:hidden">
        <div className="shrink-0 border-b border-border/30 bg-[#050505] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
                <Zap className="h-5 w-5 text-[#00FA82]" /> Motor de Documentos
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">Flujo unificado para legales, oficios, cuentas de cobro y requerimientos.</p>
            </div>
            <TemplateBadge template={template} />
          </div>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto p-6 custom-scrollbar">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#00FA82]">
              <FileText className="h-3.5 w-3.5" /> Plantilla activa
            </label>
            <button
              className="flex w-full items-center justify-between rounded-xl border border-[#222] bg-[#111] p-3 text-left transition-colors hover:border-[#00FA82]/50"
              onClick={openTemplateSelector}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[#00FA82]/10 p-2 text-[#00FA82]">{getTemplateIcon(template.type)}</div>
                <div>
                  <p className="text-sm font-bold text-white">{template.title}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{template.kind} · {template.type}</p>
                </div>
              </div>
              <Settings2 className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="grid gap-2">
              {availableTemplates.slice(0, 5).map((item) => (
                <QuickTemplateCard
                  key={item.id}
                  template={item}
                  active={item.id === template.id}
                  onClick={() => handleTemplateCardSelect(item.id)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 border-b border-border/30 pb-2 text-[10px] font-bold uppercase tracking-widest text-[#00FA82]">
              <Building2 className="h-3.5 w-3.5" /> Metadatos y cliente
            </label>
            <div className="grid grid-cols-2 gap-4">
              <GeneratorInput label="Código" value={draft.code} onChange={(event) => updateDraft("code", event.target.value)} />
              <GeneratorInput label="Ciudad" value={draft.city} onChange={(event) => updateDraft("city", event.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <GeneratorInput label="Fecha" value={draft.date} onChange={(event) => updateDraft("date", event.target.value)} />
              <GeneratorInput label="Cliente" value={draft.client.name} onChange={updateClientField("name")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <GeneratorInput label="NIT" value={draft.client.nit} onChange={updateClientField("nit")} />
              <GeneratorInput label="Teléfono" value={draft.client.phone} onChange={updateClientField("phone")} />
            </div>
            <GeneratorInput label="Correo" value={draft.client.email} onChange={updateClientField("email")} />
            <GeneratorInput label="Dirección" value={draft.client.address} onChange={updateClientField("address")} />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 border-b border-border/30 pb-2 text-[10px] font-bold uppercase tracking-widest text-[#00FA82]">
              <AlignLeft className="h-3.5 w-3.5" /> Contenido
            </label>
            <GeneratorTextArea label="Asunto" value={draft.subject} onChange={(event) => updateDraft("subject", event.target.value)} rows={3} />
            <GeneratorTextArea label="Introducción" value={draft.intro} onChange={(event) => updateDraft("intro", event.target.value)} rows={4} />
            <GeneratorTextArea label="Resumen" value={draft.summary} onChange={(event) => updateDraft("summary", event.target.value)} rows={4} />
            <GeneratorTextArea
              label={template.scopeLabel}
              value={draft.scope.join("\n")}
              onChange={(event) => updateDraft("scope", splitLines(event.target.value))}
              rows={5}
            />
            <GeneratorTextArea
              label={template.requirementsLabel}
              value={draft.requirements.join("\n")}
              onChange={(event) => updateDraft("requirements", splitLines(event.target.value))}
              rows={4}
            />
            {template.type === "Finanzas" ? (
              <GeneratorTextArea
                label={template.lineItemsLabel}
                value={serializeLineItems(draft.lineItems)}
                onChange={(event) => updateDraft("lineItems", parseLineItems(event.target.value))}
                rows={5}
              />
            ) : null}
            <GeneratorTextArea label="Cierre" value={draft.closing} onChange={(event) => updateDraft("closing", event.target.value)} rows={3} />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 border-b border-border/30 pb-2 text-[10px] font-bold uppercase tracking-widest text-[#00FA82]">
              <FileSignature className="h-3.5 w-3.5" /> Firma
            </label>
            <GeneratorInput label="Nombre" value={draft.signatory.name} onChange={updateSignatoryField("name")} />
            <div className="grid grid-cols-2 gap-4">
              <GeneratorInput label="Cargo" value={draft.signatory.role} onChange={updateSignatoryField("role")} />
              <GeneratorInput label="Documento" value={draft.signatory.documentId} onChange={updateSignatoryField("documentId")} />
            </div>
            <GeneratorInput label="Teléfono" value={draft.signatory.phone} onChange={updateSignatoryField("phone")} />
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col overflow-hidden bg-[#1A1A1A] print:bg-transparent">
        <div className="z-20 flex h-16 shrink-0 items-center justify-between border-b border-border/20 bg-[#0A0A0A]/80 px-8 shadow-lg backdrop-blur-md print:hidden">
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold text-[#00FA82]">VISTA PREVIA EN VIVO</span>
            <span className="text-[10px] text-muted-foreground">
              {draft.code}.pdf · {source ?? "generator"} · {previewState === "ready" ? "HTML real" : "renderizando"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 rounded-none border border-white/10 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-white/5"
              onClick={handleSave}
            >
              <Save className="h-4 w-4" /> {saveState === "saving" ? "Guardando..." : "Guardar en Neon"}
            </button>
            {resolvedClientId ? (
              <button
                className="rounded-none border border-white/10 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-white/5"
                onClick={openPortal}
              >
                Abrir portal
              </button>
            ) : null}
            <button
              className="flex items-center gap-2 rounded-none border border-[#00FA82] bg-[#00FA82] px-5 py-2.5 text-xs font-bold text-black shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:bg-[#00FA82]/90"
              onClick={handleExportPdf}
            >
              <Download className="h-4 w-4" /> Exportar a PDF
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#1A1A1A] p-8 custom-scrollbar md:p-12 print:overflow-visible print:bg-transparent print:p-0">
          <div className="mx-auto w-[210mm] min-h-[297mm] overflow-hidden bg-white shadow-2xl print:min-h-0 print:shadow-none">
            <div className="border-b border-black/5 bg-[#050505] px-6 py-3 text-[10px] font-mono text-gray-400 print:hidden">
              {feedbackMessage ?? `${template.title} · ${template.type} · ${template.htmlPath}`}
              {documentId ? ` · ${documentId}` : ""}
              {versionNumber ? ` · v${versionNumber}` : ""}
            </div>
            {previewState === "ready" && previewHtml ? (
              <iframe
                title={`Preview ${draft.code}`}
                srcDoc={previewHtml}
                className="h-[calc(297mm+3rem)] w-full border-0 bg-white"
                sandbox="allow-same-origin allow-scripts"
              />
            ) : (
              <div className="flex h-[calc(297mm+3rem)] items-center justify-center bg-[#F4F5F7] px-8 text-center text-sm text-gray-500">
                {previewState === "error"
                  ? feedbackMessage ?? "No fue posible renderizar la plantilla HTML."
                  : "Renderizando plantilla HTML real..."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GeneratorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-[#222] bg-[#111] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#00FA82] font-sans"
      />
    </div>
  );
}

function GeneratorTextArea({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  rows: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full resize-none rounded-xl border border-[#222] bg-[#111] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#00FA82] font-sans"
      />
    </div>
  );
}

function QuickTemplateCard({
  template,
  active,
  onClick,
}: {
  template: DocumentTemplateDefinition;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left transition-colors ${
        active ? "border-[#00FA82]/50 bg-[#00FA82]/10" : "border-[#222] bg-[#111] hover:border-[#00FA82]/40"
      }`}
      onClick={onClick}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-white">{template.title}</p>
        <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{template.type}</p>
      </div>
      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#00FA82]" />
    </button>
  );
}

function TemplateBadge({ template }: { template: DocumentTemplateDefinition }) {
  return (
    <span className="rounded-full border border-white/10 bg-[#111] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
      {template.kind}
    </span>
  );
}

function getTemplateIcon(type: DocumentTemplateDefinition["type"]) {
  if (type === "Legal") {
    return <Scale className="h-4 w-4" />;
  }
  if (type === "Finanzas") {
    return <Receipt className="h-4 w-4" />;
  }
  if (type === "Requerimientos") {
    return <ListChecks className="h-4 w-4" />;
  }
  return <FileText className="h-4 w-4" />;
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function serializeLineItems(items: DocumentLineItem[]) {
  return items.map((item) => `${item.label} | ${item.description} | ${item.amount}`).join("\n");
}

function parseLineItems(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [label, description, amount] = item.split("|").map((part) => part.trim());
      return {
        label: label || "Concepto",
        description: description || "Detalle operativo",
        amount: amount || "$0",
      };
    });
}
