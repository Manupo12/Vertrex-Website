"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Ban,
  Check,
  KeyRound,
  RefreshCw,
  Save,
  ShieldCheck,
  ShieldPlus,
  ScrollText,
  UserPlus,
  Users,
} from "lucide-react";

import { OperationalStatsGrid } from "@/components/dashboard/operational-stats-grid";
import {
  teamCapabilityLabels,
  teamCapabilityValues,
  teamSubroleLabels,
  teamSubroleValues,
} from "@/lib/admin/access-governance";
import type { AccessManagementSnapshot, ManagedAccessUser } from "@/lib/admin/access-service";
import { operationalMetricMeta } from "@/lib/dashboard/operational-metric-meta";
import type { OperationalMetricKey, OperationalMetricOverrides } from "@/lib/dashboard/operational-stats";

const metricOrder: OperationalMetricKey[] = ["activeProjects", "activeUsers", "community", "upcomingLaunches"];

type AccessSettingsPanelProps = {
  initialSnapshot: AccessManagementSnapshot;
};

type CreateAccessForm = {
  name: string;
  email: string;
  password: string;
  role: "team" | "client";
  teamSubrole: (typeof teamSubroleValues)[number];
  capabilities: string[];
  clientSlug: string;
  clientName: string;
  clientBrand: string;
  clientEmail: string;
};

const defaultCreateAccessForm: CreateAccessForm = {
  name: "",
  email: "",
  password: "",
  role: "team",
  teamSubrole: "ops",
  capabilities: [],
  clientSlug: "",
  clientName: "",
  clientBrand: "",
  clientEmail: "",
};

export function AccessSettingsPanel({ initialSnapshot }: AccessSettingsPanelProps) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [createForm, setCreateForm] = useState<CreateAccessForm>(defaultCreateAccessForm);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "team" | "client">("all");
  const [createError, setCreateError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSavingStats, setIsSavingStats] = useState(false);
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);
  const [statsDraft, setStatsDraft] = useState<OperationalMetricOverrides>(initialSnapshot.stats.overrides);

  useEffect(() => {
    setStatsDraft(snapshot.stats.overrides);
  }, [snapshot.stats.overrides]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return snapshot.users.filter((user) => {
      if (roleFilter !== "all" && user.role !== roleFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [user.name, user.email, user.clientName ?? "", user.clientSlug ?? ""].some((value) =>
        value.toLowerCase().includes(query),
      );
    });
  }, [roleFilter, search, snapshot.users]);
  const riskyUsers = useMemo(() => snapshot.users.filter((user) => user.sessionRiskStatus !== "healthy"), [snapshot.users]);
  const criticalRiskUsers = useMemo(() => riskyUsers.filter((user) => user.sessionRiskStatus === "critical"), [riskyUsers]);

  const manualMetricsCount = metricOrder.filter((key) => statsDraft[key].mode === "manual").length;

  async function handleCreateAccess(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);
    setIsCreating(true);

    try {
      const response = await fetch("/api/admin/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: createForm.name,
          email: createForm.email,
          password: createForm.password,
          role: createForm.role,
          teamSubrole: createForm.role === "team" ? createForm.teamSubrole : undefined,
          capabilities: createForm.role === "team" ? createForm.capabilities : undefined,
          clientSlug: createForm.role === "client" ? createForm.clientSlug : undefined,
          clientName: createForm.role === "client" ? createForm.clientName : undefined,
          clientBrand: createForm.role === "client" ? createForm.clientBrand : undefined,
          clientEmail: createForm.role === "client" ? createForm.clientEmail || createForm.email : undefined,
        }),
      });

      const data = (await response.json()) as AccessManagementSnapshot & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "No fue posible crear el acceso.");
      }

      setSnapshot(data);
      setCreateForm(defaultCreateAccessForm);
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "No fue posible crear el acceso.");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleSaveStats(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatsError(null);
    setIsSavingStats(true);

    try {
      const response = await fetch("/api/admin/operational-stats", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...statsDraft,
          expectedUpdatedAt: snapshot.stats.updatedAt,
        }),
      });

      const data = (await response.json()) as typeof snapshot.stats & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "No fue posible guardar el override de métricas.");
      }

      setSnapshot((currentSnapshot) => ({
        ...currentSnapshot,
        stats: data,
      }));
    } catch (error) {
      setStatsError(error instanceof Error ? error.message : "No fue posible guardar el override de métricas.");
    } finally {
      setIsSavingStats(false);
    }
  }

  async function handleUserAction(user: ManagedAccessUser, payload: { action: "set-active"; isActive: boolean } | { action: "revoke-sessions" }) {
    const actionKey = `${user.id}:${payload.action}`;
    setActionError(null);
    setActiveActionKey(actionKey);

    try {
      const response = await fetch(`/api/admin/access/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          payload.action === "set-active"
            ? {
              ...payload,
              expectedUpdatedAt: user.updatedAt,
            }
            : payload,
        ),
      });

      const data = (await response.json()) as AccessManagementSnapshot & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "No fue posible actualizar el acceso.");
      }

      setSnapshot(data);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "No fue posible actualizar el acceso.");
    } finally {
      setActiveActionKey(null);
    }
  }

  function updateCreateForm<Field extends keyof CreateAccessForm>(field: Field, value: CreateAccessForm[Field]) {
    setCreateForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function toggleCapability(capability: string) {
    setCreateForm((currentForm) => ({
      ...currentForm,
      capabilities: currentForm.capabilities.includes(capability)
        ? currentForm.capabilities.filter((entry) => entry !== capability)
        : [...currentForm.capabilities, capability],
    }));
  }

  function updateMetricDraft(key: OperationalMetricKey, nextValue: Partial<(typeof statsDraft)[OperationalMetricKey]>) {
    setStatsDraft((currentDraft) => ({
      ...currentDraft,
      [key]: {
        ...currentDraft[key],
        ...nextValue,
      },
    }));
  }

  if (!snapshot.databaseConfigured) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
        Conecta Neon para administrar accesos y sincronizar estas cards con la base de datos.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <SummaryCard label="Accesos gestionados" value={snapshot.summary.managedUsers} detail="Usuarios visibles en settings" />
        <SummaryCard label="Clientes activos" value={snapshot.stats.values.activeUsers} detail="Solo clientes con acceso activo" />
        <SummaryCard label="Comunidad" value={snapshot.stats.values.community} detail="Clientes reales en Neon" />
        <SummaryCard label="Sesiones abiertas" value={snapshot.summary.activeSessions} detail="Sesiones vigentes" />
        <SummaryCard label="Sesiones en riesgo" value={riskyUsers.length} detail={criticalRiskUsers.length > 0 ? `${criticalRiskUsers.length} críticas` : "Sin señales críticas"} icon={AlertTriangle} tone={criticalRiskUsers.length > 0 ? "critical" : riskyUsers.length > 0 ? "warning" : "default"} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Cards sincronizadas</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Auto desde Neon cuando creas clientes/accesos, con override manual temporal cuando lo necesites.
            </p>
          </div>
          <div className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            {manualMetricsCount > 0 ? `${manualMetricsCount} card(s) en modo manual` : "Todas en modo auto"}
          </div>
        </div>

        <OperationalStatsGrid snapshot={snapshot.stats} />

        <form onSubmit={handleSaveStats} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {metricOrder.map((key) => {
              const metric = statsDraft[key];
              const meta = operationalMetricMeta[key];

              return (
                <div key={key} className="rounded-xl border border-border bg-background p-4">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{meta.label}</p>
                      <p className="text-xs text-muted-foreground">Auto actual: {snapshot.stats.autoValues[key]}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-1 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => updateMetricDraft(key, { mode: "auto", value: null })}
                        className={`rounded-lg px-3 py-1.5 transition-colors ${
                          metric.mode === "auto" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        Auto
                      </button>
                      <button
                        type="button"
                        onClick={() => updateMetricDraft(key, { mode: "manual", value: metric.value ?? snapshot.stats.values[key] })}
                        className={`rounded-lg px-3 py-1.5 transition-colors ${
                          metric.mode === "manual" ? "bg-amber-500 text-black" : "text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        Manual
                      </button>
                    </div>
                  </div>

                  <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Valor visible
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={metric.mode === "manual" ? metric.value ?? 0 : snapshot.stats.autoValues[key]}
                    disabled={metric.mode !== "manual"}
                    onChange={(event) => updateMetricDraft(key, { value: Number(event.target.value) })}
                    className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-white outline-none transition-all disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              );
            })}
          </div>

          {statsError ? <p className="text-sm text-destructive">{statsError}</p> : null}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingStats}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSavingStats ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Guardar overrides
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
        <form onSubmit={handleCreateAccess} className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-2 text-primary">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Dar acceso</h3>
              <p className="mt-1 text-sm text-muted-foreground">Crea credenciales para socios o clientes. Las cards se actualizarán solas.</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Tipo de acceso</span>
              <select
                value={createForm.role}
                onChange={(event) => updateCreateForm("role", event.target.value as "team" | "client")}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-white outline-none"
              >
                <option value="team">Socio / equipo</option>
                <option value="client">Cliente portal</option>
              </select>
            </label>

            {createForm.role === "team" ? (
              <label className="block space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Subrol principal</span>
                <select
                  value={createForm.teamSubrole}
                  onChange={(event) => updateCreateForm("teamSubrole", event.target.value as CreateAccessForm["teamSubrole"])}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-white outline-none"
                >
                  {teamSubroleValues.map((subrole) => (
                    <option key={subrole} value={subrole}>{teamSubroleLabels[subrole]}</option>
                  ))}
                </select>
              </label>
            ) : null}

            <Field
              label="Nombre"
              value={createForm.name}
              onChange={(value) => updateCreateForm("name", value)}
              placeholder={createForm.role === "team" ? "María Socia" : "Cliente Acme"}
            />
            <Field
              label="Correo"
              value={createForm.email}
              onChange={(value) => updateCreateForm("email", value)}
              placeholder={createForm.role === "team" ? "maria@empresa.com" : "cliente@empresa.com"}
            />
            <Field
              label="Contraseña inicial"
              value={createForm.password}
              onChange={(value) => updateCreateForm("password", value)}
              placeholder="Mínimo 6 caracteres"
              type="password"
            />

            {createForm.role === "team" ? (
              <div className="space-y-3 rounded-xl border border-border bg-background/40 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl border border-primary/20 bg-primary/10 p-2 text-primary">
                    <ShieldPlus className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Capacidades por módulo</p>
                    <p className="text-xs text-muted-foreground">Puedes dejarlo vacío para usar el set por defecto del subrol.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {teamCapabilityValues.map((capability) => {
                    const active = createForm.capabilities.includes(capability);

                    return (
                      <button
                        key={capability}
                        type="button"
                        onClick={() => toggleCapability(capability)}
                        className={`inline-flex items-center justify-between rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                          active
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}
                      >
                        <span>{teamCapabilityLabels[capability]}</span>
                        {active ? <Check className="h-3.5 w-3.5" /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {createForm.role === "client" ? (
              <>
                <Field
                  label="Slug del cliente"
                  value={createForm.clientSlug}
                  onChange={(value) => updateCreateForm("clientSlug", value)}
                  placeholder="acme-corp"
                />
                <Field
                  label="Nombre del cliente"
                  value={createForm.clientName}
                  onChange={(value) => updateCreateForm("clientName", value)}
                  placeholder="Acme Corp"
                />
                <Field
                  label="Marca / brand"
                  value={createForm.clientBrand}
                  onChange={(value) => updateCreateForm("clientBrand", value)}
                  placeholder="ACME"
                />
                <Field
                  label="Correo del cliente"
                  value={createForm.clientEmail}
                  onChange={(value) => updateCreateForm("clientEmail", value)}
                  placeholder="contacto@acme.com"
                />
              </>
            ) : null}
          </div>

          {createError ? <p className="mt-4 text-sm text-destructive">{createError}</p> : null}

          <button
            type="submit"
            disabled={isCreating}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isCreating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Crear credenciales
          </button>
        </form>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Accesos administrables</h3>
              <p className="mt-1 text-sm text-muted-foreground">Activa, revoca o cierra sesiones de clientes y socios visibles.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-[220px]">
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por nombre, correo o cliente"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-white outline-none"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value as "all" | "team" | "client")}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-white outline-none"
              >
                <option value="all">Todos</option>
                <option value="team">Socios / equipo</option>
                <option value="client">Clientes</option>
              </select>
            </div>
          </div>

          {actionError ? <p className="mb-4 text-sm text-destructive">{actionError}</p> : null}

          {riskyUsers.length > 0 ? (
            <div className={`mb-4 rounded-xl border p-4 ${criticalRiskUsers.length > 0 ? "border-destructive/30 bg-destructive/5" : "border-amber-500/30 bg-amber-500/5"}`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${criticalRiskUsers.length > 0 ? "text-destructive" : "text-amber-500"}`} />
                <div>
                  <p className="text-sm font-semibold text-foreground">Sesiones sospechosas detectadas</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {criticalRiskUsers.length > 0
                      ? `${criticalRiskUsers.length} usuario(s) están en riesgo crítico y deberían revisar o cerrar sesiones ahora.`
                      : `${riskyUsers.length} usuario(s) requieren revisión preventiva de sesiones.`}
                    {` ${riskyUsers.slice(0, 3).map((user) => user.name).join(", ")}`}
                    {riskyUsers.length > 3 ? ` y ${riskyUsers.length - 3} más.` : "."}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] text-left text-sm">
              <thead className="bg-secondary/10 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Usuario</th>
                  <th className="px-4 py-3 font-medium">Rol</th>
                  <th className="px-4 py-3 font-medium">Gobierno</th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Último acceso</th>
                  <th className="px-4 py-3 font-medium">Sesiones</th>
                  <th className="px-4 py-3 font-medium">Riesgo sesión</th>
                  <th className="px-4 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredUsers.map((user) => {
                  const isToggling = activeActionKey === `${user.id}:set-active`;
                  const isRevoking = activeActionKey === `${user.id}:revoke-sessions`;
                  const rowTone = user.sessionRiskStatus === "critical" ? "bg-destructive/5" : user.sessionRiskStatus === "warning" ? "bg-amber-500/5" : "";

                  return (
                    <tr key={user.id} className={`${rowTone} transition-colors hover:bg-secondary/10`}>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {user.name}
                            {user.isOwner ? (
                              <span className="ml-2 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                                Owner
                              </span>
                            ) : null}
                          </p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-4 py-4">
                        {user.role === "team" ? (
                          <div className="space-y-2">
                            <div className="text-xs font-semibold text-foreground">
                              {user.teamSubrole ? teamSubroleLabels[user.teamSubrole] : "Sin subrol"}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {user.capabilities.length > 0 ? user.capabilities.map((capability) => (
                                <span
                                  key={capability}
                                  className="rounded-full border border-border bg-background px-2 py-1 text-[10px] font-medium text-muted-foreground"
                                >
                                  {teamCapabilityLabels[capability]}
                                </span>
                              )) : (
                                <span className="text-xs text-muted-foreground">Por defecto del subrol</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Portal individual</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-xs text-muted-foreground">
                        {user.role === "client" ? user.clientName ?? user.clientSlug ?? "Sin cliente" : "—"}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
                            user.isActive
                              ? "border border-primary/20 bg-primary/10 text-primary"
                              : "border border-destructive/20 bg-destructive/10 text-destructive"
                          }`}
                        >
                          {user.isActive ? "Activo" : "Revocado"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-muted-foreground">{formatLastAccess(user.lastLoginAt)}</td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-foreground">{user.activeSessionCount}</p>
                          <p className="text-[11px] text-muted-foreground">{user.lastSessionStartedAt ? `Última: ${formatDateTime(user.lastSessionStartedAt)}` : "Sin sesiones vigentes"}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          <SessionRiskBadge status={user.sessionRiskStatus} />
                          <p className="max-w-[220px] text-xs text-muted-foreground">{user.sessionRiskReasons[0] ?? "Sin señales atípicas"}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={user.isOwner || isToggling}
                            onClick={() => handleUserAction(user, { action: "set-active", isActive: !user.isActive })}
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isToggling ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Ban className="h-3.5 w-3.5" />}
                            {user.isActive ? "Quitar acceso" : "Dar acceso"}
                          </button>
                          <button
                            type="button"
                            disabled={user.activeSessionCount === 0 || isRevoking}
                            onClick={() => handleUserAction(user, { action: "revoke-sessions" })}
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isRevoking ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <KeyRound className="h-3.5 w-3.5" />}
                            Cerrar sesiones
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No hay accesos que coincidan con el filtro actual.
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-xl border border-primary/20 bg-primary/10 p-2 text-primary">
            <ScrollText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Auditoría reciente</h3>
            <p className="mt-1 text-sm text-muted-foreground">Eventos sensibles ya conectados a auth y access para dejar trazabilidad real de la operación.</p>
          </div>
        </div>

        <div className="space-y-3">
          {snapshot.recentAuditEvents.length > 0 ? snapshot.recentAuditEvents.map((event) => (
            <div key={event.id} className="rounded-xl border border-border bg-background p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span>{event.module}</span>
                    <span className="rounded-full border border-border px-2 py-0.5">{event.action}</span>
                    <span>{event.entityType}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{event.summary}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.actorName ?? "Sistema"}
                    {event.actorEmail ? ` · ${event.actorEmail}` : ""}
                    {event.clientName ? ` · Cliente: ${event.clientName}` : ""}
                    {event.projectName ? ` · Proyecto: ${event.projectName}` : ""}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">{formatDateTime(event.createdAt)}</div>
              </div>
            </div>
          )) : (
            <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Aún no hay eventos auditados visibles en este entorno.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-white outline-none"
        required={type === "password" ? true : undefined}
      />
    </label>
  );
}

function RoleBadge({ role }: { role: ManagedAccessUser["role"] }) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
        role === "client"
          ? "border border-blue-500/20 bg-blue-500/10 text-blue-400"
          : "border border-primary/20 bg-primary/10 text-primary"
      }`}
    >
      {role === "client" ? "Cliente" : "Socio / equipo"}
    </span>
  );
}

function SessionRiskBadge({ status }: { status: ManagedAccessUser["sessionRiskStatus"] }) {
  const className =
    status === "critical"
      ? "border-destructive/20 bg-destructive/10 text-destructive"
      : status === "warning"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-500"
        : "border-primary/20 bg-primary/10 text-primary";
  const label = status === "critical" ? "Crítico" : status === "warning" ? "En revisión" : "Normal";

  return <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${className}`}>{label}</span>;
}

function SummaryCard({
  label,
  value,
  detail,
  icon: Icon = Users,
  tone = "default",
}: {
  label: string;
  value: number;
  detail: string;
  icon?: typeof Users;
  tone?: "default" | "warning" | "critical";
}) {
  const iconToneClassName = tone === "critical" ? "text-destructive" : tone === "warning" ? "text-amber-500" : "text-primary";

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className={`rounded-lg border border-border bg-background p-2 ${iconToneClassName}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-foreground">{new Intl.NumberFormat("es-CO").format(value)}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function formatLastAccess(value: string | null) {
  if (!value) {
    return "Sin acceso";
  }

  return formatDateTime(value);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}
