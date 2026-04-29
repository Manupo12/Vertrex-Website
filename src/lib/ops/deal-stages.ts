export const canonicalDealStageValues = [
  "sin_contactar",
  "contactado",
  "pendiente",
  "interesado",
  "propuesta_enviada",
  "pendiente_anticipo_50",
  "cliente_activo",
  "pausado",
  "perdido",
] as const;

export type CanonicalDealStage = (typeof canonicalDealStageValues)[number];

export const dealPipelineGroupKeys = ["contacto", "calificado", "propuesta", "activacion", "activo", "cerrado"] as const;

export type DealPipelineGroupKey = (typeof dealPipelineGroupKeys)[number];

type DealStageDefinition = {
  value: CanonicalDealStage;
  label: string;
  description: string;
  pipeline: DealPipelineGroupKey;
  aliases: readonly string[];
  isActiveClient?: boolean;
  isClosed?: boolean;
};

export const canonicalDealStageDefinitions: readonly DealStageDefinition[] = [
  {
    value: "sin_contactar",
    label: "Sin contactar",
    description: "Lead detectado, sin interacción real todavía.",
    pipeline: "contacto",
    aliases: ["sin_contactar", "sin contactar", "lead", "new", "cold"],
  },
  {
    value: "contactado",
    label: "Contactado",
    description: "Ya hubo alcance inicial o primer contacto.",
    pipeline: "contacto",
    aliases: ["contactado", "contacted", "reached_out", "reachout", "outreach"],
  },
  {
    value: "pendiente",
    label: "Pendiente",
    description: "Se espera respuesta, validación o siguiente paso.",
    pipeline: "contacto",
    aliases: ["pendiente", "pending", "follow_up", "follow-up", "followup", "waiting"],
  },
  {
    value: "interesado",
    label: "Interesado",
    description: "Cuenta calificada para entrar al grafo operativo.",
    pipeline: "calificado",
    aliases: ["interesado", "interested", "interest", "qualified", "warm"],
  },
  {
    value: "propuesta_enviada",
    label: "Propuesta enviada",
    description: "Ya existe propuesta, oficio, SOW u oferta entregada.",
    pipeline: "propuesta",
    aliases: [
      "propuesta_enviada",
      "propuesta enviada",
      "proposal",
      "proposal sent",
      "proposal_sent",
      "quoted",
      "quote",
      "quote_sent",
    ],
  },
  {
    value: "pendiente_anticipo_50",
    label: "Pendiente anticipo 50%",
    description: "Relación encaminada, pendiente activación formal por anticipo.",
    pipeline: "activacion",
    aliases: [
      "pendiente_anticipo_50",
      "pendiente anticipo 50",
      "pending_upfront_50",
      "deposit_pending",
      "awaiting_deposit",
      "anticipo_50",
      "negotiation",
      "negotiation_review",
      "negociacion",
      "negociación",
      "legal",
      "procurement",
      "review",
    ],
  },
  {
    value: "cliente_activo",
    label: "Cliente activo",
    description: "La cuenta ya cruzó activación comercial y puede operar formalmente.",
    pipeline: "activo",
    aliases: [
      "cliente_activo",
      "cliente activo",
      "active",
      "won",
      "signed",
      "closed won",
      "closed_won",
      "closed-won",
    ],
    isActiveClient: true,
  },
  {
    value: "pausado",
    label: "Pausado",
    description: "La relación está detenida temporalmente.",
    pipeline: "cerrado",
    aliases: ["pausado", "paused", "pause", "on_hold", "on-hold"],
    isClosed: true,
  },
  {
    value: "perdido",
    label: "Perdido",
    description: "La oportunidad cerró sin avance.",
    pipeline: "cerrado",
    aliases: ["perdido", "lost", "closed lost", "closed_lost", "closed-lost"],
    isClosed: true,
  },
] as const;

export const dealPipelineGroups = [
  {
    key: "contacto",
    title: "Contacto",
    subtitle: "Sin contactar, contactado o pendiente",
  },
  {
    key: "calificado",
    title: "Interés",
    subtitle: "Cuenta validada para entrar al sistema",
  },
  {
    key: "propuesta",
    title: "Propuesta",
    subtitle: "Oferta o documento comercial enviado",
  },
  {
    key: "activacion",
    title: "Anticipo 50%",
    subtitle: "Pendiente activación formal del servicio",
  },
  {
    key: "activo",
    title: "Cliente activo",
    subtitle: "Cuenta activada y lista para operar",
  },
  {
    key: "cerrado",
    title: "Cierre",
    subtitle: "Deals pausados o perdidos",
  },
] as const;

export function normalizeDealStage(stage: string | null | undefined): CanonicalDealStage {
  const normalized = stage?.trim().toLowerCase();

  if (!normalized) {
    return "sin_contactar";
  }

  const match = canonicalDealStageDefinitions.find((item) => item.value === normalized || item.aliases.includes(normalized));
  return match?.value ?? "sin_contactar";
}

export function getDealStageDefinition(stage: string | null | undefined) {
  const normalized = normalizeDealStage(stage);
  return canonicalDealStageDefinitions.find((item) => item.value === normalized) ?? canonicalDealStageDefinitions[0];
}

export function getDealStageLabel(stage: string | null | undefined) {
  return getDealStageDefinition(stage).label;
}

export function getDealPipelineGroup(stage: string | null | undefined) {
  const pipelineKey = getDealStageDefinition(stage).pipeline;
  return dealPipelineGroups.find((g) => g.key === pipelineKey) ?? dealPipelineGroups[0];
}

export const canonicalDealStageOptions = canonicalDealStageDefinitions.map((d) => ({ value: d.value, label: d.label }));

export function isActiveClientDealStage(stage: string | null | undefined) {
  return getDealStageDefinition(stage).isActiveClient === true;
}

export function isClosedDealStage(stage: string | null | undefined) {
  return getDealStageDefinition(stage).isClosed === true;
}
