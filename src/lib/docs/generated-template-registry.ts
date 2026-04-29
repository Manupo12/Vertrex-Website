export const generatedDocumentTypes = ["oficio", "contrato", "cuenta-de-cobro", "sow"] as const;

export type GeneratedDocumentType = (typeof generatedDocumentTypes)[number];

export type GeneratedDocumentTemplateDefinition = {
  type: GeneratedDocumentType;
  label: string;
  category: "Comercial" | "Legal" | "Finanzas" | "Requerimientos";
  description: string;
  fileName: string;
  downloadPrefix: string;
};

const generatedTemplateRegistry: Record<GeneratedDocumentType, GeneratedDocumentTemplateDefinition> = {
  oficio: {
    type: "oficio",
    label: "Oficio de presentación",
    category: "Comercial",
    description: "Documento formal para presentación, contexto y siguientes pasos con el cliente.",
    fileName: "oficio.hbs",
    downloadPrefix: "oficio",
  },
  contrato: {
    type: "contrato",
    label: "Contrato marco",
    category: "Legal",
    description: "Marco contractual de la relación entre Vertrex y el cliente.",
    fileName: "contrato.hbs",
    downloadPrefix: "contrato",
  },
  "cuenta-de-cobro": {
    type: "cuenta-de-cobro",
    label: "Cuenta de cobro",
    category: "Finanzas",
    description: "Documento financiero para cobro de entregables, fases o retainers.",
    fileName: "cuenta-de-cobro.hbs",
    downloadPrefix: "cuenta-de-cobro",
  },
  sow: {
    type: "sow",
    label: "Statement of Work",
    category: "Requerimientos",
    description: "Documento de alcance, entregables y condiciones operativas del proyecto.",
    fileName: "sow.hbs",
    downloadPrefix: "sow",
  },
};

export function listGeneratedDocumentTemplates() {
  return generatedDocumentTypes.map((type) => generatedTemplateRegistry[type]);
}

export function getGeneratedDocumentTemplate(type: GeneratedDocumentType) {
  return generatedTemplateRegistry[type];
}

export function isGeneratedDocumentType(value: string): value is GeneratedDocumentType {
  return generatedDocumentTypes.includes(value as GeneratedDocumentType);
}
