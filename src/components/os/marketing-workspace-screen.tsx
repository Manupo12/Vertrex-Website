"use client";

import { BarChart3, Megaphone, Plus, Target, TrendingUp, Users } from "lucide-react";

import {
  EmptyWorkspacePanel,
  ErrorWorkspacePanel,
  LoadingWorkspacePanel,
  formatMoney,
  formatNumber,
} from "@/components/os/workspace-ui";
import { getDealStageLabel, normalizeDealStage } from "@/lib/ops/deal-stages";
import { useWorkspaceSnapshot } from "@/lib/ops/use-workspace-snapshot";
import { useUIStore } from "@/lib/store/ui";

export default function MarketingWorkspaceScreen() {
  const open = useUIStore((store) => store.open);
  const { snapshot, loading, error, refresh } = useWorkspaceSnapshot();

  const pipelineValue = snapshot.deals.reduce((total, deal) => total + deal.valueCents, 0);
  const weightedPipeline = snapshot.deals.reduce((total, deal) => total + Math.round((deal.valueCents * deal.probability) / 100), 0);
  const marketingSpend = snapshot.transactions
    .filter((transaction) => transaction.type === "expense" && /(marketing|ads|growth|paid|media)/i.test(transaction.category ?? transaction.description ?? ""))
    .reduce((total, transaction) => total + transaction.amountCents, 0);
  const estimatedRoas = marketingSpend > 0 ? weightedPipeline / marketingSpend : null;
  const topDeals = [...snapshot.deals]
    .sort((left, right) => right.probability - left.probability || right.valueCents - left.valueCents)
    .slice(0, 6);
  const topClients = [...snapshot.clients]
    .sort((left, right) => right.totalInvestmentCents - left.totalInvestmentCents || right.projectCount - left.projectCount)
    .slice(0, 5);
  const stageBreakdown = Object.entries(
    snapshot.deals.reduce<Record<string, number>>((accumulator, deal) => {
      const stage = normalizeDealStage(deal.stage);
      accumulator[stage] = (accumulator[stage] ?? 0) + 1;
      return accumulator;
    }, {}),
  ).sort((left, right) => right[1] - left[1]);

  if (loading) {
    return <LoadingWorkspacePanel label="Cargando marketing conectado al workspace..." />;
  }

  if (error) {
    return <ErrorWorkspacePanel message={error} onRetry={refresh} />;
  }

  if (snapshot.deals.length === 0 && snapshot.clients.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyWorkspacePanel
          title="Marketing todavía no tiene señales operativas"
          description="Crea clientes, deals o transacciones para que growth trabaje sobre pipeline, caja y conversión reales."
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
            onClick={() => open("createDeal")}
          >
            Nuevo trato
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Marketing & Growth</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Growth ya opera con deals, clientes y caja reales del OS en lugar de campañas aisladas.
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
            onClick={() => open("createDeal")}
          >
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Nuevo deal
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Pipeline total" value={formatMoney(pipelineValue)} subtitle={`${formatNumber(snapshot.deals.length)} oportunidades`} icon={Megaphone} />
        <MetricCard title="Pipeline ponderado" value={formatMoney(weightedPipeline)} subtitle="Valor ajustado por probabilidad" icon={Target} />
        <MetricCard title="Clientes en juego" value={String(snapshot.summary.activeClients)} subtitle={`${formatNumber(topClients.length)} cuentas prioritarias`} icon={Users} />
        <MetricCard
          title="ROAS operativo"
          value={estimatedRoas == null ? "N/D" : `${estimatedRoas.toFixed(1)}x`}
          subtitle={marketingSpend > 0 ? `Spend detectado ${formatMoney(marketingSpend)}` : "Sin gasto categorizado en marketing"}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Oportunidades prioritarias</h2>
              <p className="text-sm text-muted-foreground">Las campañas y acciones deben responder al pipeline real.</p>
            </div>
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-3 p-4">
            {topDeals.map((deal) => (
              <button
                key={deal.id}
                className="w-full rounded-xl border border-border/60 bg-secondary/20 p-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
                onClick={() => open("dealDetail", deal.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{deal.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {deal.clientName ?? "Sin cliente"}
                      {deal.projectName ? ` · ${deal.projectName}` : ""}
                    </p>
                  </div>
                  <span className="rounded-full border border-border bg-background px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {deal.probability}%
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{getDealStageLabel(deal.stage)}</span>
                  <span>·</span>
                  <span>{formatMoney(deal.valueCents)}</span>
                  <span>·</span>
                  <span>{deal.owner ?? "Sin owner"}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold text-foreground">Embudo comercial</h2>
            </div>
            <div className="space-y-3 p-4">
              {stageBreakdown.length > 0 ? (
                stageBreakdown.map(([stage, count]) => (
                  <div key={stage} className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-foreground">{getDealStageLabel(stage)}</span>
                      <span className="text-sm font-semibold text-primary">{count}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${Math.max(8, Math.round((count / Math.max(snapshot.deals.length, 1)) * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Todavía no hay etapas que analizar.</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold text-foreground">Cuentas objetivo</h2>
            </div>
            <div className="space-y-3 p-4">
              {topClients.map((client) => (
                <button
                  key={client.id}
                  className="w-full rounded-xl border border-border/60 bg-secondary/20 p-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
                  onClick={() => open("clientDetail", client.id)}
                >
                  <p className="text-sm font-semibold text-foreground">{client.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {client.company ?? client.phase ?? client.status}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{client.projectCount} proyectos</span>
                    <span>·</span>
                    <span>{formatMoney(client.totalInvestmentCents)}</span>
                    <span>·</span>
                    <span>{client.portalUserId ? "Portal listo" : "Portal pendiente"}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon }: { title: string; value: string; subtitle: string; icon: typeof Megaphone }) {
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
