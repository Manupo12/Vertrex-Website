import "server-only";

import path from "node:path";

import { getGeneratedDocumentTemplate, type GeneratedDocumentType } from "@/lib/docs/generated-template-registry";

export function getGeneratedTemplateFilePath(type: GeneratedDocumentType) {
  return path.join(
    process.cwd(),
    "src",
    "app",
    "_os",
    "(os)",
    "docs",
    "generator",
    "plantillas",
    "universales",
    getGeneratedDocumentTemplate(type).fileName,
  );
}

export function getGeneratedTemplateTokensPath() {
  return path.join(
    process.cwd(),
    "src",
    "app",
    "_os",
    "(os)",
    "docs",
    "generator",
    "plantillas",
    "universales",
    "vertrex-design-tokens.css",
  );
}

export function getGeneratedTemplateAssetsPath() {
  return path.join(
    process.cwd(),
    "src",
    "app",
    "_os",
    "(os)",
    "docs",
    "generator",
    "plantillas",
    "vaul",
  );
}
