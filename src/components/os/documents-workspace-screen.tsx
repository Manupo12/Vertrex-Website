"use client";

import { FileText, FolderOpen, Plus, Search, UploadCloud } from "lucide-react";
import { useMemo, useState } from "react";

import {
  EmptyWorkspacePanel,
  ErrorWorkspacePanel,
  LoadingWorkspacePanel,
  formatDateTime,
  formatNumber,
} from "@/components/os/workspace-ui";
import { useWorkspaceSnapshot } from "@/lib/ops/use-workspace-snapshot";
import { useUIStore } from "@/lib/store/ui";

export default function DocumentsWorkspaceScreen() {
  const open = useUIStore((store) => store.open);
  const { snapshot, loading, error, refresh } = useWorkspaceSnapshot();
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredDocuments = useMemo(() => {
    return snapshot.documents.filter((document) => {
      if (!normalizedQuery) {
        return true;
      }

      return [
        document.title,
        document.summary,
        document.clientName,
        document.projectName,
        document.category,
        document.code,
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedQuery));
    });
  }, [normalizedQuery, snapshot.documents]);

  const relatedFiles = useMemo(() => {
    return snapshot.files.filter((file) => {
      if (!normalizedQuery) {
        return true;
      }

      return [file.name, file.category, file.clientName, file.projectName, file.provider]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedQuery));
    });
  }, [normalizedQuery, snapshot.files]);

  const recentDocuments = [...filteredDocuments]
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .slice(0, 8);
  const categoryBreakdown = Array.from(
    filteredDocuments.reduce<Map<string, number>>((accumulator, document) => {
      accumulator.set(document.category, (accumulator.get(document.category) ?? 0) + 1);
      return accumulator;
    }, new Map()),
  ).sort((left, right) => right[1] - left[1]);
  const linkedDocuments = filteredDocuments.filter((document) => document.clientId || document.projectId).length;

  if (loading) {
    return <LoadingWorkspacePanel label="Cargando documentos conectados al workspace..." />;
  }

  if (error) {
    return <ErrorWorkspacePanel message={error} onRetry={refresh} />;
  }

  if (snapshot.documents.length === 0 && snapshot.files.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyWorkspacePanel
          title="Documentos todavía no tiene base viva"
          description="Genera o importa documentos reales para conectar conocimiento, archivos, clientes y proyectos en un mismo repositorio operativo."
        />
        <div className="flex gap-3">
          <button className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground" onClick={refresh}>
            Actualizar
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => open("templateSelector")}>
            Nuevo documento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Documentos</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Repositorio vivo de documentos y archivos operativos conectado con clientes, proyectos y delivery real.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80" onClick={refresh}>
            Actualizar
          </button>
          <button className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground" onClick={() => open("importDocument")}>
            <span className="inline-flex items-center gap-2">
              <UploadCloud className="h-4 w-4" /> Importar
            </span>
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => open("templateSelector")}>
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Nuevo documento
            </span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por documento, cliente, proyecto, código o categoría..."
            className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/40"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Documentos" value={String(filteredDocuments.length)} subtitle={`${formatNumber(snapshot.documents.length)} totales en el workspace`} icon={FileText} />
        <MetricCard title="Categorías" value={String(categoryBreakdown.length)} subtitle="Clasificación viva del repositorio" icon={FolderOpen} />
        <MetricCard title="Relacionales" value={String(linkedDocuments)} subtitle="Con cliente o proyecto enlazado" icon={FileText} />
        <MetricCard title="Archivos soporte" value={String(relatedFiles.length)} subtitle="Assets y anexos conectados" icon={UploadCloud} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold text-foreground">Carpetas vivas</h2>
          </div>
          <div className="space-y-3 p-4">
            {categoryBreakdown.length > 0 ? (
              categoryBreakdown.map(([category, count]) => (
                <div key={category} className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-foreground">{category}</span>
                    <span className="text-sm font-semibold text-primary">{formatNumber(count)}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${Math.max(8, Math.round((count / Math.max(filteredDocuments.length, 1)) * 100))}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No hay categorías disponibles para la búsqueda actual.</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold text-foreground">Editados recientemente</h2>
          </div>
          <div className="grid gap-3 p-4 md:grid-cols-2">
            {recentDocuments.length > 0 ? (
              recentDocuments.map((document) => (
                <a
                  key={document.id}
                  href={document.href}
                  className="block rounded-xl border border-border/60 bg-secondary/20 p-4 transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{document.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {document.clientName ?? "Sin cliente"}
                        {document.projectName ? ` · ${document.projectName}` : ""}
                      </p>
                    </div>
                    <span className="rounded-full border border-border bg-background px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                      {document.status}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{document.summary ?? "Sin resumen operativo."}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{document.category}</span>
                    <span>·</span>
                    <span>{document.code}</span>
                    <span>·</span>
                    <span>{`v${document.currentVersion}`}</span>
                    <span>·</span>
                    <span>{formatDateTime(document.updatedAt)}</span>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No hay documentos para mostrar con el filtro actual.</p>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold text-foreground">Archivos relacionados</h2>
        </div>
        <div className="space-y-3 p-4">
          {relatedFiles.length > 0 ? (
            relatedFiles.slice(0, 8).map((file) => (
              <div key={file.id} className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{file.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {file.clientName ?? "Sin cliente"}
                      {file.projectName ? ` · ${file.projectName}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>{file.category ?? "Sin categoría"}</span>
                    <span>{file.provider}</span>
                    <span>{file.sizeLabel ?? "Tamaño no disponible"}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No hay archivos relacionados para el filtro actual.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon }: { title: string; value: string; subtitle: string; icon: typeof FileText }) {
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
