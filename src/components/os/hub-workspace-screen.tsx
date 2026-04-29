"use client";

import { Folder, Globe, Layers3, Link2, Plus, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import {
  EmptyWorkspacePanel,
  ErrorWorkspacePanel,
  LoadingWorkspacePanel,
  formatDateTime,
  formatNumber,
} from "@/components/os/workspace-ui";
import { buildHubIndex, type HubCollection } from "@/lib/ops/hub-collections";
import { useWorkspaceSnapshot } from "@/lib/ops/use-workspace-snapshot";
import { useUIStore } from "@/lib/store/ui";

export default function HubWorkspaceScreen() {
  const open = useUIStore((store) => store.open);
  const { snapshot, loading, error, refresh } = useWorkspaceSnapshot();
  const [query, setQuery] = useState("");
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);

  const { items, collections } = useMemo(() => buildHubIndex(snapshot), [snapshot]);

  const normalizedQuery = query.trim().toLowerCase();
  const activeCollection = useMemo(
    () => collections.find((collection) => collection.id === activeCollectionId) ?? null,
    [activeCollectionId, collections],
  );
  const queryFilteredItems = useMemo(() => {
    return items.filter((item) => {
      if (!normalizedQuery) {
        return true;
      }

      return matchesQuery([item.title, item.description, item.category, item.clientName, item.projectName], normalizedQuery);
    });
  }, [items, normalizedQuery]);
  const queryFilteredItemIds = useMemo(() => new Set(queryFilteredItems.map((item) => item.id)), [queryFilteredItems]);
  const visibleCollections = useMemo(() => {
    return collections.filter((collection) => {
      if (!normalizedQuery) {
        return true;
      }

      return (
        matchesQuery([collection.title, collection.description, collection.primaryLabel, collection.typeSummary], normalizedQuery)
        || collection.itemIds.some((itemId) => queryFilteredItemIds.has(itemId))
      );
    });
  }, [collections, normalizedQuery, queryFilteredItemIds]);
  const filteredItems = useMemo(() => {
    if (!activeCollection) {
      return queryFilteredItems;
    }

    const itemIds = new Set(activeCollection.itemIds);
    return queryFilteredItems.filter((item) => itemIds.has(item.id));
  }, [activeCollection, queryFilteredItems]);

  const categoryBreakdown = Array.from(
    filteredItems.reduce<Map<string, number>>((accumulator, item) => {
      accumulator.set(item.category, (accumulator.get(item.category) ?? 0) + 1);
      return accumulator;
    }, new Map()),
  ).sort((left, right) => right[1] - left[1]);

  if (loading) {
    return <LoadingWorkspacePanel label="Cargando knowledge hub operativo..." />;
  }

  if (error) {
    return <ErrorWorkspacePanel message={error} onRetry={refresh} />;
  }

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyWorkspacePanel
          title="Hub todavía no tiene conocimiento operativo"
          description="Sube archivos, genera documentos o conecta credenciales con links para alimentar el hub unificado del OS."
        />
        <div className="flex gap-3">
          <button className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground" onClick={refresh}>
            Actualizar
          </button>
          <button className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground" onClick={() => open("createLink")}>
            Nuevo link
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => open("templateSelector")}>
            Crear activo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Knowledge Hub</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Índice vivo de documentos, archivos y enlaces operativos relacionado con clientes, proyectos y credenciales del OS.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/api/admin/export/links"
            className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
            download
          >
            Exportar CSV
          </a>
          <button className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80" onClick={refresh}>
            Actualizar
          </button>
          <button className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground" onClick={() => open("createLink")}>
            <span className="inline-flex items-center gap-2">
              <Link2 className="h-4 w-4" /> Nuevo link
            </span>
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => open("templateSelector")}>
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Nuevo activo
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
            placeholder="Buscar por título, cliente, proyecto, categoría, descripción o colección..."
            className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/40"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard title="Activos de conocimiento" value={String(filteredItems.length)} subtitle={`${formatNumber(items.length)} registrados`} icon={Sparkles} />
        <MetricCard
          title="Colecciones"
          value={String(visibleCollections.length)}
          subtitle={`${formatNumber(collections.filter((collection) => collection.intent === "publishable").length)} publicables · ${formatNumber(collections.filter((collection) => collection.intent === "reusable").length)} reutilizables`}
          icon={Layers3}
        />
        <MetricCard title="Documentos" value={String(filteredItems.filter((item) => item.type === "document").length)} subtitle="Contratos, minutas y specs" icon={Folder} />
        <MetricCard title="Archivos" value={String(filteredItems.filter((item) => item.type === "file").length)} subtitle="Assets y anexos operativos" icon={Globe} />
        <MetricCard title="Links" value={String(filteredItems.filter((item) => item.type === "link").length)} subtitle="SaaS, referencias y accesos" icon={Link2} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Colecciones compatibles</h2>
                <p className="mt-1 text-xs text-muted-foreground">Derivadas del snapshot actual para preparar colecciones publicables o reutilizables sin nueva entidad todavía.</p>
              </div>
              {activeCollection ? (
                <button
                  className="rounded-lg border border-border bg-background px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  onClick={() => setActiveCollectionId(null)}
                >
                  Limpiar filtro
                </button>
              ) : null}
            </div>
          </div>
          <div className="space-y-3 p-4">
            {visibleCollections.length > 0 ? (
              visibleCollections.map((collection) => {
                const isActive = collection.id === activeCollectionId;

                return (
                  <button
                    key={collection.id}
                    className={`w-full rounded-xl border p-4 text-left transition-colors ${isActive ? "border-primary/40 bg-primary/5" : "border-border/60 bg-secondary/20 hover:border-primary/30 hover:bg-primary/5"}`}
                    onClick={() => setActiveCollectionId(isActive ? null : collection.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{collection.title}</p>
                          <CollectionBadge label={collection.intent === "publishable" ? "Publicable" : "Reutilizable"} tone={collection.intent === "publishable" ? "primary" : "secondary"} />
                          <CollectionBadge label={collection.primaryLabel} tone="secondary" />
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{collection.description}</p>
                      </div>
                      <span className="text-sm font-semibold text-primary">{formatNumber(collection.itemCount)}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{collection.typeSummary}</span>
                      <span>·</span>
                      <span>{collection.linkedItemCount}/{collection.itemCount} abribles</span>
                      <span>·</span>
                      <span>{collection.shareReady ? "Lista para compartir" : "Requiere completar accesos"}</span>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">Última actividad: {formatDateTime(collection.latestUpdate)}</p>
                  </button>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">Todavía no hay suficientes activos relacionados para derivar colecciones útiles.</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold text-foreground">Categorías activas</h2>
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
                      style={{ width: `${Math.max(8, Math.round((count / Math.max(filteredItems.length, 1)) * 100))}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No hay categorías visibles con el filtro actual.</p>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Activos recientes</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {activeCollection ? `Filtrando por colección ${activeCollection.title}.` : "Vista operativa unificada de documentos, archivos y links."}
              </p>
            </div>
            {activeCollection ? <CollectionBadge label={activeCollection.title} tone="primary" /> : null}
          </div>
        </div>
        <div className="grid gap-3 p-4 md:grid-cols-2">
          {filteredItems.length > 0 ? (
            filteredItems.slice(0, 10).map((item) => {
              const content = (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.clientName ?? "Sin cliente"}
                        {item.projectName ? ` · ${item.projectName}` : ""}
                      </p>
                    </div>
                    <span className="rounded-full border border-border bg-background px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                      {item.type}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{item.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.category}</span>
                    <span>·</span>
                    <span>{formatDateTime(item.updatedAt)}</span>
                  </div>
                </>
              );

              if (!item.href) {
                return (
                  <div key={item.id} className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                    {content}
                  </div>
                );
              }

              return (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-border/60 bg-secondary/20 p-4 transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  {content}
                </a>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No hay activos visibles con el filtro actual.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon }: { title: string; value: string; subtitle: string; icon: typeof Sparkles }) {
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

function CollectionBadge({ label, tone }: { label: string; tone: "primary" | "secondary" }) {
  return (
    <span
      className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${tone === "primary" ? "border-primary/20 bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground"}`}
    >
      {label}
    </span>
  );
}

function matchesQuery(values: Array<string | null | undefined>, normalizedQuery: string) {
  return values.filter(Boolean).some((value) => value!.toLowerCase().includes(normalizedQuery));
}
