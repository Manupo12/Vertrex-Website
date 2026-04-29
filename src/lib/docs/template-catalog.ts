export type DocumentTemplateSlug = "oficio" | "contrato" | "cuenta-de-cobro" | "sow" | "avances";

export type DocumentTemplateCategory = "Comercial" | "Legal" | "Finanzas" | "Requerimientos";

export type DocumentLineItem = {
  label: string;
  description: string;
  amount: string;
};

export type DocumentDraft = {
  code: string;
  title: string;
  date: string;
  city: string;
  subject: string;
  intro: string;
  summary: string;
  closing: string;
  client: {
    name: string;
    nit: string;
    address: string;
    phone: string;
    email: string;
  };
  scope: string[];
  requirements: string[];
  lineItems: DocumentLineItem[];
  signatory: {
    name: string;
    role: string;
    documentId: string;
    phone: string;
  };
};

export type DocumentTemplateDefinition = {
  id: string;
  slug: DocumentTemplateSlug;
  clientId: string;
  clientLabel: string;
  title: string;
  kind: "Universal" | "Cliente";
  type: DocumentTemplateCategory;
  description: string;
  htmlPath: string;
  scopeLabel: string;
  requirementsLabel: string;
  lineItemsLabel: string;
};

type ClientKey = "universales" | "budaphone" | "emerson";

type ClientProfile = {
  code: string;
  name: string;
  nit: string;
  address: string;
  phone: string;
  email: string;
  city: string;
};

const clients: Record<ClientKey, { label: string; kind: "Universal" | "Cliente" }> = {
  universales: { label: "Universal", kind: "Universal" },
  budaphone: { label: "Budaphone", kind: "Cliente" },
  emerson: { label: "Emerson", kind: "Cliente" },
};

const templatesMeta: Record<DocumentTemplateSlug, Omit<DocumentTemplateDefinition, "id" | "slug" | "clientId" | "clientLabel" | "kind" | "title" | "htmlPath"> & { baseTitle: string }> = {
  oficio: {
    baseTitle: "Oficio de presentación",
    type: "Comercial",
    description: "Introducción formal del proyecto, servicio o fase actual.",
    scopeLabel: "Alcance del servicio",
    requirementsLabel: "Próximos requerimientos",
    lineItemsLabel: "Valores relacionados",
  },
  contrato: {
    baseTitle: "Contrato marco",
    type: "Legal",
    description: "Documento contractual base para acuerdos y formalización.",
    scopeLabel: "Cobertura contractual",
    requirementsLabel: "Condiciones y obligaciones",
    lineItemsLabel: "Valores del acuerdo",
  },
  "cuenta-de-cobro": {
    baseTitle: "Cuenta de cobro",
    type: "Finanzas",
    description: "Cuenta de cobro operativa para servicios, fases y entregables.",
    scopeLabel: "Conceptos cobrados",
    requirementsLabel: "Condiciones de pago",
    lineItemsLabel: "Detalle de cobro",
  },
  sow: {
    baseTitle: "SOW / Requerimientos",
    type: "Requerimientos",
    description: "Documento de alcance, requerimientos y entregables aprobados.",
    scopeLabel: "Alcance funcional",
    requirementsLabel: "Requerimientos y dependencias",
    lineItemsLabel: "Bloques estimados",
  },
  avances: {
    baseTitle: "Reporte de avances",
    type: "Requerimientos",
    description: "Actualización ejecutiva con hitos, bloqueos y requerimientos del cliente.",
    scopeLabel: "Avances consolidados",
    requirementsLabel: "Requerimientos de tu lado",
    lineItemsLabel: "Frentes priorizados",
  },
};

const profiles: Record<string, ClientProfile> = {
  default: {
    code: "GEN",
    name: "Cliente Vertrex",
    nit: "900000000-0",
    address: "Neiva, Huila - Colombia",
    phone: "+57 320 207 0445",
    email: "cliente@vertrex.co",
    city: "Neiva, Huila",
  },
  budaphone: {
    code: "BDP",
    name: "BUDAPHONE",
    nit: "1082215711-1",
    address: "Calle 3 #6-46 Centro, Yaguará – Huila",
    phone: "3144618379",
    email: "distribuidorabudaphone@gmail.com",
    city: "Neiva, Huila",
  },
  emerson: {
    code: "EMS",
    name: "Centro Educativo Emerson",
    nit: "900228321-4",
    address: "Cra 8 #10-52, Neiva – Huila",
    phone: "3186074412",
    email: "direccion@colegioemerson.edu.co",
    city: "Neiva, Huila",
  },
  globalbank: {
    code: "GLB",
    name: "GLOBALBANK",
    nit: "901554902-7",
    address: "Executive Tower, Bogotá D.C.",
    phone: "+57 601 745 8800",
    email: "procurement@globalbank.com",
    city: "Bogotá D.C.",
  },
};

const signatory = {
  name: "Manuel A. Villanueva",
  role: "Representante de Vertrex",
  documentId: "1077720099",
  phone: "3209586388",
};

const clientEntries = Object.entries(clients) as Array<[ClientKey, (typeof clients)[ClientKey]]>;
const templateEntries = Object.entries(templatesMeta) as Array<[DocumentTemplateSlug, (typeof templatesMeta)[DocumentTemplateSlug]]>;

export const documentTemplates: DocumentTemplateDefinition[] = clientEntries.flatMap(([clientId, client]) =>
  templateEntries.map(([slug, meta]) => ({
    id: `${clientId}/${slug}`,
    slug,
    clientId,
    clientLabel: client.label,
    title: clientId === "universales" ? meta.baseTitle : `${client.label} · ${meta.baseTitle}`,
    kind: client.kind,
    type: meta.type,
    description: meta.description,
    htmlPath: clientId === "universales" && (slug === "oficio" || slug === "contrato" || slug === "cuenta-de-cobro" || slug === "sow")
      ? `/docs/generator/plantillas/universales/${slug}.hbs`
      : `/docs/generator/plantillas/${clientId === "universales" ? `universales/${slug}` : `${clientId}-${slug}`}.html`,
    scopeLabel: meta.scopeLabel,
    requirementsLabel: meta.requirementsLabel,
    lineItemsLabel: meta.lineItemsLabel,
  })),
);

export function getDocumentTemplateById(templateId?: string | null, clientId?: string | null) {
  const directMatch = documentTemplates.find((template) => template.id === templateId);
  if (directMatch) {
    return directMatch;
  }
  if (templateId && !templateId.includes("/")) {
    return getTemplateForClientSlug(clientId, templateId as DocumentTemplateSlug);
  }
  return getTemplateForClientSlug(clientId, "oficio");
}

export function getTemplatesForClient(clientId?: string | null) {
  const normalizedClientId = normalizeClientId(clientId);
  return documentTemplates.filter(
    (template) => template.clientId === "universales" || template.clientId === normalizedClientId,
  );
}

export function getPortalQuickTemplates(clientId?: string | null) {
  return [
    getTemplateForClientSlug(clientId, "oficio"),
    getTemplateForClientSlug(clientId, "cuenta-de-cobro"),
    getTemplateForClientSlug(clientId, "sow"),
  ];
}

export function getDocumentGeneratorHref({ templateId, clientId, source }: { templateId?: string | null; clientId?: string | null; source?: string | null }) {
  const params = new URLSearchParams();
  if (templateId) params.set("template", templateId);
  if (clientId) params.set("client", clientId);
  if (source) params.set("source", source);
  const query = params.toString();
  return query ? `/os/docs/generator?${query}` : "/os/docs/generator";
}

export function getDocumentTemplateDraft(templateId?: string | null, clientId?: string | null): DocumentDraft {
  const template = getDocumentTemplateById(templateId, clientId);
  const profile = getProfile(clientId ?? (template.clientId === "universales" ? null : template.clientId));
  const now = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" }).format(new Date());

  return {
    code: `VTX-${getCodePrefix(template.slug)}-${profile.code}-001`,
    title: template.title,
    date: now,
    city: profile.city,
    subject: getSubject(template.slug, profile.name),
    intro: getIntro(template.slug, profile.name),
    summary: getSummary(template.slug, profile.name),
    closing: getClosing(template.slug),
    client: {
      name: profile.name,
      nit: profile.nit,
      address: profile.address,
      phone: profile.phone,
      email: profile.email,
    },
    scope: getScope(template.slug, profile.name),
    requirements: getRequirements(template.slug),
    lineItems: getLineItems(template.slug),
    signatory,
  };
}

function getTemplateForClientSlug(clientId: string | null | undefined, slug: DocumentTemplateSlug) {
  const normalizedClientId = normalizeClientId(clientId);
  return documentTemplates.find((template) => template.clientId === normalizedClientId && template.slug === slug)
    ?? documentTemplates.find((template) => template.clientId === "universales" && template.slug === slug)
    ?? documentTemplates[0];
}

function normalizeClientId(clientId?: string | null) {
  const normalized = clientId?.toLowerCase();
  return normalized === "budaphone" || normalized === "emerson" ? normalized : "universales";
}

function getProfile(clientId?: string | null) {
  return profiles[clientId?.toLowerCase() ?? ""] ?? profiles.default;
}

function getCodePrefix(slug: DocumentTemplateSlug) {
  return { oficio: "OFC", contrato: "CTR", "cuenta-de-cobro": "CDC", sow: "REQ", avances: "AVC" }[slug];
}

function getSubject(slug: DocumentTemplateSlug, clientName: string) {
  return {
    oficio: `Presentación y formalización del servicio para ${clientName}.`,
    contrato: `Formalización contractual del servicio prestado a ${clientName}.`,
    "cuenta-de-cobro": `Cuenta de cobro por servicios prestados a ${clientName}.`,
    sow: `Documento de alcance y requerimientos del proyecto de ${clientName}.`,
    avances: `Reporte de avances y requerimientos activos para ${clientName}.`,
  }[slug];
}

function getIntro(slug: DocumentTemplateSlug, clientName: string) {
  if (slug === "cuenta-de-cobro") {
    return `Por medio de la presente, Vertrex relaciona los conceptos cobrados correspondientes a la fase ejecutada para ${clientName}.`;
  }
  if (slug === "contrato") {
    return `Mediante este documento se consolidan las condiciones base para la prestación de servicios entre Vertrex y ${clientName}.`;
  }
  return `Compartimos este documento para dejar trazabilidad formal, claridad operativa y continuidad sobre el trabajo que se ejecuta con ${clientName}.`;
}

function getSummary(slug: DocumentTemplateSlug, clientName: string) {
  return {
    oficio: `Vertrex presenta el alcance actual y la estructura general del proyecto para ${clientName}.`,
    contrato: `El presente documento resume cobertura contractual, hitos y condiciones del servicio para ${clientName}.`,
    "cuenta-de-cobro": "La relación de cobro corresponde a entregables completados, soporte operativo y ejecución técnica del periodo actual.",
    sow: "Este documento define alcance funcional, entregables, exclusiones y requerimientos aprobados.",
    avances: "Se consolida el estado actual del proyecto, los avances logrados y los puntos que requieren respuesta del cliente.",
  }[slug];
}

function getClosing(slug: DocumentTemplateSlug) {
  return slug === "cuenta-de-cobro"
    ? "Agradecemos realizar el pago dentro de los plazos acordados y compartir el soporte correspondiente."
    : "Quedamos atentos a cualquier validación, ajuste o aprobación necesaria para continuar con el siguiente frente de trabajo.";
}

function getScope(slug: DocumentTemplateSlug, clientName: string) {
  if (slug === "sow") {
    return [
      "Portal del cliente con seguimiento, facturación y soporte.",
      "Shell operativo de Vertrex OS con módulos priorizados.",
      "Sistema documental con plantillas legales, oficios y cuentas de cobro.",
      "Entregables definidos por sprint y criterios de aprobación.",
    ];
  }
  if (slug === "cuenta-de-cobro") {
    return ["Portal cliente y subviews.", "Generador documental.", "Ajustes operativos y soporte de despliegue."];
  }
  if (slug === "contrato") {
    return ["Prestación de servicios de desarrollo.", "Soporte operativo y coordinación de entregables.", "Confidencialidad y tratamiento de información."];
  }
  return [
    `Seguimiento centralizado del proyecto de ${clientName}.`,
    "Entregables con trazabilidad documental.",
    "Acompañamiento técnico y operativo de Vertrex.",
  ];
}

function getRequirements(slug: DocumentTemplateSlug) {
  if (slug === "sow" || slug === "avances") {
    return [
      "Validación del alcance y prioridades de negocio.",
      "Entrega de accesos, materiales o aprobaciones pendientes.",
      "Respuesta sobre bloqueos para no afectar el siguiente sprint.",
    ];
  }
  if (slug === "cuenta-de-cobro") {
    return ["Pago dentro del plazo acordado.", "Envío del comprobante a Vertrex para conciliación."];
  }
  return ["Validación del documento por parte del cliente.", "Aprobación o respuesta sobre el siguiente paso operativo."];
}

function getLineItems(slug: DocumentTemplateSlug): DocumentLineItem[] {
  if (slug !== "cuenta-de-cobro") {
    return [];
  }
  return [
    { label: "Portal cliente y subviews", description: "Implementación y ajustes operativos del flujo de cliente.", amount: "$2,500" },
    { label: "Generador documental", description: "Configuración de plantillas legales, oficios y cuentas de cobro.", amount: "$1,800" },
    { label: "Soporte y despliegue", description: "Validación, pulido final y acompañamiento de salida.", amount: "$950" },
  ];
}
