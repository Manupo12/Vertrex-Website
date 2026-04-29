import type { WorkspaceSnapshot } from "@/lib/ops/workspace-service";

export type HubItemType = "document" | "file" | "link";
export type HubCollectionIntent = "publishable" | "reusable";
export type HubCollectionScope = "project" | "client" | "category";

export type HubItem = {
  id: string;
  type: HubItemType;
  title: string;
  description: string;
  href: string | null;
  category: string;
  clientId: string | null;
  clientName: string | null;
  projectId: string | null;
  projectName: string | null;
  updatedAt: string;
};

export type HubCollection = {
  id: string;
  title: string;
  intent: HubCollectionIntent;
  scope: HubCollectionScope;
  primaryLabel: string;
  description: string;
  itemCount: number;
  linkedItemCount: number;
  latestUpdate: string | null;
  typeSummary: string;
  shareReady: boolean;
  itemIds: string[];
};

type HubCollectionDraft = {
  id: string;
  title: string;
  intent: HubCollectionIntent;
  scope: HubCollectionScope;
  primaryLabel: string;
};

const hubItemTypeLabels: Record<HubItemType, string> = {
  document: "documentos",
  file: "archivos",
  link: "links",
};

export function buildHubIndex(snapshot: WorkspaceSnapshot) {
  const items = buildHubItems(snapshot);
  const collections = buildHubCollections(items);

  return {
    items,
    collections,
  };
}

function buildHubItems(snapshot: WorkspaceSnapshot): HubItem[] {
  const documents = snapshot.documents.map<HubItem>((document) => ({
    id: `document-${document.id}`,
    type: "document",
    title: document.title,
    description: document.summary ?? `${document.category} · ${document.status}`,
    href: document.href,
    category: document.category,
    clientId: document.clientId,
    clientName: document.clientName,
    projectId: document.projectId,
    projectName: document.projectName,
    updatedAt: document.updatedAt,
  }));

  const files = snapshot.files.map<HubItem>((file) => ({
    id: `file-${file.id}`,
    type: "file",
    title: file.name,
    description: `${file.provider} · ${file.category ?? "Sin categoría"}`,
    href: file.href,
    category: file.category ?? "Archivo",
    clientId: file.clientId,
    clientName: file.clientName,
    projectId: file.projectId,
    projectName: file.projectName,
    updatedAt: file.uploadedAt,
  }));

  const credentialLinks = snapshot.credentials
    .filter((credential) => credential.linkUrl)
    .map<HubItem>((credential) => ({
      id: `link-${credential.id}`,
      type: "link",
      title: credential.title,
      description: credential.scope ?? credential.status,
      href: credential.linkUrl,
      category: credential.scope ?? "Link",
      clientId: credential.clientId,
      clientName: credential.clientName,
      projectId: credential.projectId,
      projectName: credential.projectName,
      updatedAt: credential.updatedAt,
    }));

  const entityLinks = snapshot.links.map<HubItem>((link) => ({
    id: `entity-link-${link.id}`,
    type: "link",
    title: link.title,
    description: link.description ?? link.kind,
    href: link.url,
    category: link.kind,
    clientId: link.clientId,
    clientName: link.clientName,
    projectId: link.projectId,
    projectName: link.projectName,
    updatedAt: link.updatedAt,
  }));

  return [...documents, ...files, ...credentialLinks, ...entityLinks].sort(compareHubItems);
}

function buildHubCollections(items: HubItem[]) {
  const projectCollections = buildCollectionsFromGroups(
    items,
    (item) => {
      if (!item.projectName) {
        return null;
      }

      return {
        id: `project:${item.projectId ?? normalize(item.projectName)}`,
        title: item.projectName,
        intent: "publishable",
        scope: "project",
        primaryLabel: "Proyecto",
      } satisfies HubCollectionDraft;
    },
  );

  const clientCollections = buildCollectionsFromGroups(
    items,
    (item) => {
      if (!item.clientName || item.projectName) {
        return null;
      }

      return {
        id: `client:${item.clientId ?? normalize(item.clientName)}`,
        title: item.clientName,
        intent: "publishable",
        scope: "client",
        primaryLabel: "Cliente",
      } satisfies HubCollectionDraft;
    },
  );

  const categoryCollections = buildCollectionsFromGroups(
    items,
    (item) => {
      if (!item.category) {
        return null;
      }

      return {
        id: `category:${normalize(item.category)}`,
        title: item.category,
        intent: "reusable",
        scope: "category",
        primaryLabel: "Categoría",
      } satisfies HubCollectionDraft;
    },
    { minItems: 2 },
  );

  return [...projectCollections, ...clientCollections, ...categoryCollections].sort(compareHubCollections);
}

function buildCollectionsFromGroups(
  items: HubItem[],
  getDraft: (item: HubItem) => HubCollectionDraft | null,
  options?: { minItems?: number },
) {
  const grouped = new Map<string, { draft: HubCollectionDraft; items: HubItem[] }>();

  for (const item of items) {
    const draft = getDraft(item);

    if (!draft) {
      continue;
    }

    const existing = grouped.get(draft.id);

    if (existing) {
      existing.items.push(item);
      continue;
    }

    grouped.set(draft.id, {
      draft,
      items: [item],
    });
  }

  return Array.from(grouped.values())
    .filter((group) => group.items.length >= (options?.minItems ?? 1))
    .map(({ draft, items: groupItems }) => finalizeHubCollection(draft, groupItems));
}

function finalizeHubCollection(draft: HubCollectionDraft, items: HubItem[]): HubCollection {
  const orderedItems = [...items].sort(compareHubItems);
  const linkedItemCount = orderedItems.filter((item) => Boolean(item.href)).length;

  return {
    id: draft.id,
    title: draft.title,
    intent: draft.intent,
    scope: draft.scope,
    primaryLabel: draft.primaryLabel,
    description: buildHubCollectionDescription(draft, orderedItems, linkedItemCount),
    itemCount: orderedItems.length,
    linkedItemCount,
    latestUpdate: orderedItems[0]?.updatedAt ?? null,
    typeSummary: buildHubCollectionTypeSummary(orderedItems),
    shareReady: linkedItemCount === orderedItems.length,
    itemIds: orderedItems.map((item) => item.id),
  };
}

function buildHubCollectionDescription(draft: HubCollectionDraft, items: HubItem[], linkedItemCount: number) {
  if (draft.scope === "project") {
    return `${items.length} activos del proyecto ${draft.title}. ${linkedItemCount} con acceso directo para consulta o handoff.`;
  }

  if (draft.scope === "client") {
    return `${items.length} activos transversales del cliente ${draft.title}. ${linkedItemCount} con acceso directo para compartir.`;
  }

  return `${items.length} recursos reutilizables agrupados en ${draft.title}. ${linkedItemCount} abribles desde el hub.`;
}

function buildHubCollectionTypeSummary(items: HubItem[]) {
  const labels = Array.from(new Set(items.map((item) => hubItemTypeLabels[item.type])));

  if (labels.length === 0) {
    return "Sin activos tipados";
  }

  if (labels.length === 1) {
    return labels[0]!;
  }

  if (labels.length === 2) {
    return `${labels[0]} y ${labels[1]}`;
  }

  return `${labels.slice(0, -1).join(", ")} y ${labels.at(-1)}`;
}

function compareHubCollections(left: HubCollection, right: HubCollection) {
  if (left.intent !== right.intent) {
    return left.intent === "publishable" ? -1 : 1;
  }

  if (left.itemCount !== right.itemCount) {
    return right.itemCount - left.itemCount;
  }

  return left.title.localeCompare(right.title, "es");
}

function compareHubItems(left: HubItem, right: HubItem) {
  const leftTime = parseComparableTime(left.updatedAt);
  const rightTime = parseComparableTime(right.updatedAt);

  if (leftTime !== null && rightTime !== null && leftTime !== rightTime) {
    return rightTime - leftTime;
  }

  if (leftTime !== null && rightTime === null) {
    return -1;
  }

  if (leftTime === null && rightTime !== null) {
    return 1;
  }

  return left.title.localeCompare(right.title, "es");
}

function parseComparableTime(value: string | null) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
}

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}
