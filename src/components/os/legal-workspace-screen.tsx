"use client";

import { FileSignature, FileText, Lock, Plus, ReceiptText } from "lucide-react";

import {
  EmptyWorkspacePanel,
  ErrorWorkspacePanel,
  LoadingWorkspacePanel,
  formatDate,
  formatDateTime,
  formatMoney,
  formatNumber,
} from "@/components/os/workspace-ui";
import { useWorkspaceSnapshot } from "@/lib/ops/use-workspace-snapshot";
import { useUIStore } from "@/lib/store/ui";
import { isDocumentAttentionStatus } from "@/lib/ops/status-catalog";

export default function LegalWorkspaceScreen() {
  const open = useUIStore((store) => store.open);
  const { snapshot, loading, error, refresh } = useWorkspaceSnapshot();

  const documentsNeedingAttention = snapshot.documents.filter((document) => isDocumentAttentionStatus(document.status));
  const pendingInvoices = snapshot.invoices.filter((invoice) => invoice.status === "pending" || invoice.status === "overdue");
  const clientsWithoutPortal = snapshot.clients.filter((client) => !client.portalUserId);
  const recentDocuments = [...snapshot.documents]
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .slice(0, 8);
  const invoiceCoverage = pendingInvoices.filter((invoice) => invoice.documentId).length;

  if (loading) {
    return <LoadingWorkspacePanel label="Cargando operación legal conectada..." />;
  }

  if (error) {
    return <ErrorWorkspacePanel message={error} onRetry={refresh} />;
  }

  if (snapshot.documents.length === 0 && snapshot.invoices.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyWorkspacePanel
          title="Legal todavía no tiene documentos ni cobros enlazados"
          description="Genera documentos desde el OS para que contratos, facturación y portal compartan el mismo contexto empresarial."
        />
        <div className="flex gap-3">
          <button
            className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground"
            onClick={refresh}
          >
            Actualizar
          </button>
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            onClick={() => open("templateSelector")}
          >
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
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Legal & Compliance</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Documentos, facturas, proyectos y accesos de portal ya viven sobre la misma operación real.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
            onClick={refresh}
          >
            Actualizar
          </button>
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            onClick={() => open("templateSelector")}
          >
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Nuevo documento
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Documentos activos" value={String(snapshot.documents.length)} subtitle={`${formatNumber(documentsNeedingAttention.length)} requieren atención`} icon={FileText} />
        <MetricCard title="Facturas pendientes" value={String(pendingInvoices.length)} subtitle={formatMoney(pendingInvoices.reduce((total, invoice) => total + invoice.amountCents, 0))} icon={ReceiptText} />
        <MetricCard title="Cobros con respaldo" value={`${invoiceCoverage}/${pendingInvoices.length || 0}`} subtitle="Facturas enlazadas a documento" icon={FileSignature} />
        <MetricCard title="Brechas de acceso" value={String(clientsWithoutPortal.length)} subtitle="Clientes sin portal provisionado" icon={Lock} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold text-foreground">Repositorio maestro</h2>
            <p className="text-sm text-muted-foreground">Cada documento mantiene su relación con cliente, proyecto y estado operativo.</p>
          </div>
          <div className="space-y-3 p-4">
            {recentDocuments.length > 0 ? (
              recentDocuments.map((document) => (
                <a
                  key={document.id}
                  href={document.href}
                  target="_blank"
                  rel="noreferrer"
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
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{document.category}</span>
                    <span>·</span>
                    <span>{document.origin}</span>
                    <span>·</span>
                    <span>{formatDateTime(document.updatedAt)}</span>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No hay documentos para mostrar todavía.</p>
            )}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold text-foreground">Cobros y contratos</h2>
            </div>
            <div className="space-y-3 p-4">
              {pendingInvoices.length > 0 ? (
                pendingInvoices.map((invoice) => (
                  <div key={invoice.id} className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{invoice.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {invoice.clientName ?? "Sin cliente"}
                          {invoice.projectName ? ` · ${invoice.projectName}` : ""}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-primary">{formatMoney(invoice.amountCents)}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{invoice.invoiceNumber}</span>
                      <span>·</span>
                      <span>{invoice.status}</span>
                      <span>·</span>
                      <span>{formatDate(invoice.dueDate)}</span>
                      <span>·</span>
                      <span>{invoice.documentId ? "Con documento" : "Sin documento"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay facturas pendientes u overdue ahora mismo.</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold text-foreground">Clientes con brecha operativa</h2>
            </div>
            <div className="space-y-3 p-4">
              {clientsWithoutPortal.slice(0, 5).map((client) => (
                <button
                  key={client.id}
                  className="w-full rounded-xl border border-border/60 bg-secondary/20 p-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
                  onClick={() => open("clientDetail", client.id)}
                >
                  <p className="text-sm font-semibold text-foreground">{client.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Portal pendiente · {client.projectCount} proyectos</p>
                </button>
              ))}
              {clientsWithoutPortal.length === 0 ? (
                <p className="text-sm text-muted-foreground">Todos los clientes visibles ya tienen acceso de portal provisionado.</p>
              ) : null}
            </div>
          </section>
        </div>
      </div>
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
