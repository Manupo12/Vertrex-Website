import {
  Building2,
  CalendarDays,
  Download,
  FileText,
  FolderKanban,
  History,
  Layers3,
  Send,
  Sparkles,
} from "lucide-react";

import type { DocumentDetailRecord } from "@/lib/docs/document-service";

export default function DocumentDetailScreen({ document }: { document: DocumentDetailRecord }) {
  const latestVersion = document.latestVersion;

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge>{document.document.status}</Badge>
            <Badge>{document.document.category}</Badge>
            <Badge>{document.document.origin}</Badge>
            <Badge>{`v${document.document.currentVersion}`}</Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{document.document.code}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{document.document.title}</h1>
            <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
              {document.document.summary ?? "Documento operativo sin resumen registrado todavía."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>{document.client?.name ?? "Sin cliente"}</span>
            <span>{document.project?.name ?? "Sin proyecto"}</span>
            <span>{document.template?.title ?? "Sin plantilla"}</span>
            <span>{formatDateTime(document.document.updatedAt)}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={document.pdfHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
          >
            <Download className="h-4 w-4" /> Descargar PDF
          </a>
          <a
            href={`/api/docs/documents/${document.document.id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <History className="h-4 w-4" /> Ver JSON
          </a>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Versión actual"
          value={`v${document.document.currentVersion}`}
          subtitle={`${document.versions.length} snapshot(s) persistidos`}
          icon={Layers3}
        />
        <MetricCard
          title="Última edición"
          value={formatShortDate(document.document.updatedAt)}
          subtitle={formatDateTime(document.document.updatedAt)}
          icon={CalendarDays}
        />
        <MetricCard
          title="Plantilla"
          value={document.template?.slug ?? "manual"}
          subtitle={document.template?.title ?? "Sin plantilla vinculada"}
          icon={Sparkles}
        />
        <MetricCard
          title="Entrega"
          value={document.document.sentAt ? "Enviada" : "Interna"}
          subtitle={document.document.sentAt ? formatDateTime(document.document.sentAt) : "Aún no se registra envío"}
          icon={Send}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold text-foreground">Preview de la versión vigente</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {latestVersion ? `Snapshot v${latestVersion.versionNumber} guardado el ${formatDateTime(latestVersion.createdAt)}` : "Todavía no existe snapshot HTML persistido."}
            </p>
          </div>
          <div className="p-4">
            {latestVersion?.htmlContent ? (
              <iframe
                title={`Documento ${document.document.title}`}
                srcDoc={latestVersion.htmlContent}
                className="min-h-[760px] w-full rounded-xl border border-border bg-background"
              />
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-secondary/20 p-10 text-center text-sm text-muted-foreground">
                Este documento todavía no tiene HTML persistido para preview.
              </div>
            )}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold text-foreground">Contexto operativo</h2>
            </div>
            <div className="space-y-4 p-5 text-sm text-muted-foreground">
              <ContextRow icon={Building2} label="Cliente" value={document.client?.name ?? "Sin cliente"} />
              <ContextRow icon={FolderKanban} label="Proyecto" value={document.project?.name ?? "Sin proyecto"} />
              <ContextRow icon={Sparkles} label="Plantilla" value={document.template?.title ?? "Sin plantilla"} />
              <ContextRow icon={FileText} label="Origen" value={document.document.origin} />
              <ContextRow icon={CalendarDays} label="Creado" value={formatDateTime(document.document.createdAt)} />
              <ContextRow icon={CalendarDays} label="Actualizado" value={formatDateTime(document.document.updatedAt)} />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold text-foreground">Historial de versiones</h2>
            </div>
            <div className="space-y-3 p-4">
              {document.versions.length > 0 ? (
                document.versions.map((version) => (
                  <div key={version.id} className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{`Versión ${version.versionNumber}`}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(version.createdAt)}</p>
                      </div>
                      <span className="rounded-full border border-border bg-background px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {version.versionNumber === document.document.currentVersion ? "Actual" : "Histórica"}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {readDraftSummary(version.draft) ?? "Snapshot persistido sin resumen textual adicional."}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay versiones persistidas todavía.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof FileText;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</h3>
        </div>
        <div className="rounded-xl bg-secondary/60 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function ContextRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-secondary/20 p-3">
      <div className="rounded-lg bg-background p-2">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function Badge({ children }: { children: string }) {
  return <span className="rounded-full border border-border bg-background px-2.5 py-1 font-medium text-muted-foreground">{children}</span>;
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "Sin fecha";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatShortDate(value: string | null) {
  if (!value) {
    return "Sin fecha";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function readDraftSummary(draft: Record<string, unknown>) {
  const summary = typeof draft.summary === "string" ? draft.summary.trim() : "";

  if (summary) {
    return summary;
  }

  const title = typeof draft.title === "string" ? draft.title.trim() : "";

  return title || null;
}
