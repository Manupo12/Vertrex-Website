export const workspaceRequestTypeValues = ["documento", "acceso", "asset", "aprobacion", "cambio", "soporte", "consulta"] as const;

export type WorkspaceRequestType = (typeof workspaceRequestTypeValues)[number];
export type WorkspaceSlaStatus = "on_track" | "at_risk" | "breached";

export const workspaceRequestTypeLabels: Record<WorkspaceRequestType, string> = {
  documento: "Documento",
  acceso: "Acceso",
  asset: "Asset",
  aprobacion: "Aprobación",
  cambio: "Cambio",
  soporte: "Soporte",
  consulta: "Consulta",
};

export const workspaceRequestTypeOptions = workspaceRequestTypeValues.map((value) => ({
  value,
  label: workspaceRequestTypeLabels[value],
}));

export const workspaceRequestSlaRules: Record<WorkspaceRequestType, { ackHours: number; resolutionHours: number }> = {
  documento: { ackHours: 24, resolutionHours: 48 },
  acceso: { ackHours: 24, resolutionHours: 48 },
  asset: { ackHours: 24, resolutionHours: 72 },
  aprobacion: { ackHours: 4, resolutionHours: 24 },
  cambio: { ackHours: 24, resolutionHours: 96 },
  soporte: { ackHours: 4, resolutionHours: 48 },
  consulta: { ackHours: 8, resolutionHours: 24 },
};

export function getWorkspaceRequestTypeLabel(type: WorkspaceRequestType) {
  return workspaceRequestTypeLabels[type];
}

export function parseWorkspaceRequestType(value: string | null | undefined): WorkspaceRequestType | null {
  return typeof value === "string" && workspaceRequestTypeValues.includes(value as WorkspaceRequestType)
    ? (value as WorkspaceRequestType)
    : null;
}

export function inferWorkspaceRequestType(input: {
  requestType?: string | null;
  title?: string | null;
  summary?: string | null;
  channel?: string | null;
}): WorkspaceRequestType {
  const explicit = parseWorkspaceRequestType(input.requestType);

  if (explicit) {
    return explicit;
  }

  const text = `${input.title ?? ""} ${input.summary ?? ""} ${input.channel ?? ""}`.toLowerCase();

  if (/(factura|invoice|pago|cobro|contrato|documento|pdf)/.test(text)) {
    return "documento";
  }

  if (/(acceso|credential|credencial|vpn|staging|login|dominio|dns|analytics|password)/.test(text)) {
    return "acceso";
  }

  if (/(logo|asset|archivo|media|vector|brand|figma|imagen)/.test(text)) {
    return "asset";
  }

  if (/(aproba|firm|signoff|review legal|msa)/.test(text)) {
    return "aprobacion";
  }

  if (/(cambio|ajuste|modific)/.test(text)) {
    return "cambio";
  }

  if (/(consulta|pregunta|duda|resumen|ia)/.test(text)) {
    return "consulta";
  }

  return (input.channel ?? "").toLowerCase() === "portal" ? "soporte" : "soporte";
}

export function evaluateWorkspaceTicketSla(input: {
  requestType: WorkspaceRequestType;
  status: string | null | undefined;
  createdAt: Date | string | null | undefined;
  updatedAt?: Date | string | null | undefined;
  now?: Date;
}) {
  const createdAt = toDate(input.createdAt);
  const updatedAt = toDate(input.updatedAt);
  const status = (input.status ?? "open").toLowerCase();
  const target = status === "open" ? "ack" : "resolution";
  const thresholdHours = target === "ack"
    ? workspaceRequestSlaRules[input.requestType].ackHours
    : workspaceRequestSlaRules[input.requestType].resolutionHours;
  const now = input.now ?? new Date();
  const reference = status === "resolved" || status === "closed" ? updatedAt ?? now : now;
  const start = createdAt ?? updatedAt ?? now;
  const elapsedHours = Math.max(0, (reference.getTime() - start.getTime()) / 3_600_000);
  const statusValue: WorkspaceSlaStatus = elapsedHours < thresholdHours * 0.7
    ? "on_track"
    : elapsedHours < thresholdHours
      ? "at_risk"
      : "breached";

  return {
    status: statusValue,
    label: getWorkspaceSlaLabel(statusValue),
    windowLabel: `${target === "ack" ? "Acuse" : "Resolución"} ${thresholdHours}h`,
    elapsedHours,
    thresholdHours,
    target,
  };
}

export function getWorkspaceSlaLabel(status: WorkspaceSlaStatus) {
  return status === "on_track"
    ? "SLA en tiempo"
    : status === "at_risk"
      ? "SLA en riesgo"
      : "SLA vencido";
}

function toDate(value: Date | string | null | undefined) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
