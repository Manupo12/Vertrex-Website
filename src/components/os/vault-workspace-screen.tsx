"use client";

import Link from "next/link";
import { AlertTriangle, ArrowUpRight, FileText, FolderKanban, KeyRound, Lock, Plus, ShieldAlert, ShieldCheck } from "lucide-react";

import {
  EmptyWorkspacePanel,
  ErrorWorkspacePanel,
  LoadingWorkspacePanel,
  formatDateTime,
  formatNumber,
} from "@/components/os/workspace-ui";
import {
  buildWorkspaceHealthSnapshot,
  type WorkspaceHealthIssue,
  type WorkspaceHealthStatus,
} from "@/lib/ops/workspace-health";
import { useWorkspaceSnapshot } from "@/lib/ops/use-workspace-snapshot";
import { useUIStore } from "@/lib/store/ui";

export default function VaultWorkspaceScreen() {
  const open = useUIStore((store) => store.open);
  const { snapshot, loading, error, refresh } = useWorkspaceSnapshot();

  const sharedCredentials = snapshot.credentials.filter((credential) => credential.status === "shared" || credential.status === "updated");
  const encryptedCredentials = snapshot.credentials.filter((credential) => credential.secretStorage === "encrypted");
  const plaintextCredentials = snapshot.credentials.filter((credential) => credential.secretStorage === "plaintext");
  const linkedFiles = snapshot.files.filter((file) => file.projectId || file.clientId);
  const environmentFiles = snapshot.files.filter((file) => /(env|secret|credential|config)/i.test(file.category ?? file.name));
  const legalDocuments = snapshot.documents.filter((document) => ["Legal", "Finanzas", "Operativo"].includes(document.category));
  const requestedCredentials = snapshot.credentials.filter((credential) => ["requested", "pending"].includes(credential.status));
  const unsecuredCredentials = snapshot.credentials.filter((credential) => !credential.hasSecret);
  const orphanCredentials = snapshot.credentials.filter((credential) => !credential.clientId && !credential.projectId);
  const healthSnapshot = buildWorkspaceHealthSnapshot(snapshot);
  const vaultModule = healthSnapshot.modules.find((module) => module.key === "vault") ?? null;
  const vaultIssues = healthSnapshot.issues.filter((issue) => issue.module === "vault");

  if (loading) {
    return <LoadingWorkspacePanel label="Cargando vault conectado al workspace..." />;
  }

  if (error) {
    return <ErrorWorkspacePanel message={error} onRetry={refresh} />;
  }

  if (snapshot.credentials.length === 0 && snapshot.files.length === 0 && snapshot.documents.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyWorkspacePanel
          title="El vault todavía no tiene activos conectados"
          description="Guarda credenciales, archivos y documentos desde el OS para centralizar acceso, soporte, legal y operación."
        />
        <div className="flex gap-3">
          <button className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground" onClick={refresh}>
            Actualizar
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => open("connectCredential")}>
            Nueva credencial
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Vault</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Credenciales, archivos y documentos relacionados a clientes y proyectos desde un mismo backbone operativo.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80" onClick={refresh}>
            Actualizar
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => open("connectCredential")}>
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Nueva entrada
            </span>
          </button>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-border bg-secondary/40 p-2 text-primary">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">Vault Health</h2>
                <VaultStatusBadge status={vaultModule?.status ?? "healthy"} label={getVaultStatusLabel(vaultModule?.status ?? "healthy")} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {vaultModule?.summary ?? "Cobertura de secretos, accesos pendientes y contexto operativo del vault."}
              </p>
            </div>
          </div>
          <Link
            href="/os/health"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-primary/30 hover:text-primary"
          >
            Abrir salud global
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Issues vault" value={String(vaultIssues.length)} subtitle={vaultIssues[0]?.title ?? "Sin señales activas en este corte"} icon={ShieldAlert} />
          <MetricCard title="Pendientes" value={String(requestedCredentials.length)} subtitle="Credenciales solicitadas o en espera" icon={AlertTriangle} />
          <MetricCard title="Legacy plaintext" value={String(plaintextCredentials.length)} subtitle="Secretos aún visibles en texto plano" icon={Lock} />
          <MetricCard title="Sin secreto" value={String(unsecuredCredentials.length)} subtitle="Entradas activas sin secreto persistido" icon={FolderKanban} />
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Credenciales" value={String(snapshot.credentials.length)} subtitle={`${formatNumber(sharedCredentials.length)} compartidas o actualizadas`} icon={KeyRound} />
        <MetricCard title="Archivos ligados" value={String(linkedFiles.length)} subtitle={`${formatNumber(environmentFiles.length)} sensibles/config`} icon={FolderKanban} />
        <MetricCard title="Documentos legales" value={String(legalDocuments.length)} subtitle="Legal, finanzas y operación" icon={FileText} />
        <MetricCard title="Cobertura segura" value={`${encryptedCredentials.length}/${snapshot.credentials.length || 0}`} subtitle={plaintextCredentials.length > 0 ? `${formatNumber(plaintextCredentials.length)} secretos legacy por rotar` : "Entradas con secreto cifrado"} icon={ShieldCheck} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold text-foreground">Riesgos accionables del vault</h2>
          </div>
          <div className="space-y-3 p-4">
            {vaultIssues.length > 0 ? (
              vaultIssues.map((issue) => <VaultIssueCard key={issue.id} issue={issue} />)
            ) : (
              <EmptyWorkspacePanel
                title="Vault sin alertas activas"
                description="No hay señales de riesgo abiertas para credenciales o accesos en este corte compatible."
              />
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold text-foreground">Gobernanza & cobertura</h2>
          </div>
          <div className="space-y-3 p-4">
            <VaultHealthLine label="Secretos cifrados server-side" value={`${encryptedCredentials.length}/${snapshot.credentials.length || 0}`} tone={plaintextCredentials.length > 0 || unsecuredCredentials.length > 0 ? "warning" : "healthy"} />
            <VaultHealthLine label="Secretos legacy plaintext" value={String(plaintextCredentials.length)} tone={plaintextCredentials.length > 0 ? "critical" : "healthy"} />
            <VaultHealthLine label="Credenciales pendientes" value={String(requestedCredentials.length)} tone={requestedCredentials.length > 0 ? "warning" : "healthy"} />
            <VaultHealthLine label="Entradas sin contexto" value={String(orphanCredentials.length)} tone={orphanCredentials.length > 0 ? "warning" : "healthy"} />
            <VaultHealthLine label="Archivos sensibles detectados" value={String(environmentFiles.length)} tone="neutral" />
            <VaultHealthLine label="Documentos legales / operativos" value={String(legalDocuments.length)} tone="neutral" />
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold text-foreground">Credenciales por cliente/proyecto</h2>
          </div>
          <div className="space-y-3 p-4">
            {snapshot.credentials.length > 0 ? (
              snapshot.credentials.map((credential) => (
                <button
                  key={credential.id}
                  className="w-full rounded-xl border border-border/60 bg-secondary/20 p-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
                  onClick={() => open("vaultEntry", credential.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{credential.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {credential.clientName ?? "Sin cliente"}
                        {credential.projectName ? ` · ${credential.projectName}` : ""}
                      </p>
                    </div>
                    <span className="rounded-full border border-border bg-background px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                      {credential.status}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{credential.scope ?? "Sin scope"}</span>
                    <span>·</span>
                    <span>{credential.secretStorage === "encrypted" ? "Secreto cifrado" : credential.secretStorage === "plaintext" ? "Secreto legacy" : "Sin secreto"}</span>
                    {credential.linkUrl ? (
                      <>
                        <span>·</span>
                        <span>{credential.linkUrl}</span>
                      </>
                    ) : null}
                  </div>
                </button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No hay credenciales registradas todavía.</p>
            )}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold text-foreground">Archivos sensibles / operativos</h2>
            </div>
            <div className="space-y-3 p-4">
              {snapshot.files.slice(0, 6).map((file) => {
                const content = (
                  <>
                    <p className="text-sm font-semibold text-foreground">{file.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {file.clientName ?? "Sin cliente"}
                      {file.projectName ? ` · ${file.projectName}` : ""}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{file.category}</span>
                      <span>·</span>
                      <span>{file.provider}</span>
                      <span>·</span>
                      <span>{file.sizeLabel}</span>
                    </div>
                  </>
                );

                if (!file.href) {
                  return (
                    <div key={file.id} className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                      {content}
                    </div>
                  );
                }

                return (
                  <a
                    key={file.id}
                    href={file.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-border/60 bg-secondary/20 p-4 transition-colors hover:border-primary/30 hover:bg-primary/5"
                  >
                    {content}
                  </a>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold text-foreground">Trail documental</h2>
            </div>
            <div className="space-y-3 p-4">
              {legalDocuments.slice(0, 5).map((document) => (
                <a
                  key={document.id}
                  href={document.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-border/60 bg-secondary/20 p-4 transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  <p className="text-sm font-semibold text-foreground">{document.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {document.clientName ?? "Sin cliente"}
                    {document.projectName ? ` · ${document.projectName}` : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{document.category}</span>
                    <span>·</span>
                    <span>{document.status}</span>
                    <span>·</span>
                    <span>{formatDateTime(document.updatedAt)}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon }: { title: string; value: string; subtitle: string; icon: typeof Lock }) {
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

function VaultIssueCard({ issue }: { issue: WorkspaceHealthIssue }) {
  const styles = issue.severity === "critical" ? "border-destructive/30 bg-destructive/5" : "border-amber-500/30 bg-amber-500/5";
  const tone = issue.severity === "critical" ? "text-destructive" : "text-amber-500";

  return (
    <div className={`rounded-xl border p-4 ${styles}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className={`rounded-lg border border-current/15 bg-background/60 p-2 ${tone}`}>
            {issue.severity === "critical" ? <ShieldAlert className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{issue.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{issue.message}</p>
          </div>
        </div>
        <Link
          href={issue.actionPath}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-primary/30 hover:text-primary"
        >
          {issue.actionLabel}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function VaultHealthLine({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "healthy" | "warning" | "critical" | "neutral";
}) {
  const valueClassName = tone === "healthy" ? "text-primary" : tone === "warning" ? "text-amber-500" : tone === "critical" ? "text-destructive" : "text-foreground";

  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/20 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`font-mono text-sm font-semibold ${valueClassName}`}>{value}</span>
    </div>
  );
}

function VaultStatusBadge({ status, label }: { status: WorkspaceHealthStatus; label: string }) {
  const className =
    status === "critical"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : status === "warning"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
        : "border-primary/20 bg-primary/10 text-primary";

  return <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${className}`}>{label}</span>;
}

function getVaultStatusLabel(status: WorkspaceHealthStatus) {
  return status === "critical" ? "Crítico" : status === "warning" ? "En observación" : "Saludable";
}
