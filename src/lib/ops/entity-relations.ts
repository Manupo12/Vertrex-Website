import { and, eq } from "drizzle-orm";

import { getDb, isDatabaseConfigured, schema } from "@/lib/db";

export type EntityType =
  | "client"
  | "project"
  | "task"
  | "milestone"
  | "document"
  | "invoice"
  | "deal"
  | "ticket"
  | "credential"
  | "link"
  | "file"
  | "user"
  | "automation_playbook"
  | "automation_run";

export type RelationType =
  | "depends_on"
  | "blocks"
  | "relates_to"
  | "duplicates"
  | "parent_of"
  | "child_of"
  | "references"
  | "member_of"
  | "has_member";

export type CreateEntityRelationInput = {
  sourceType: EntityType;
  sourceId: string;
  targetType: EntityType;
  targetId: string;
  relationType: RelationType;
  metadata?: Record<string, unknown>;
  createdById?: string | null;
};

export type EntityRelation = {
  id: string;
  sourceType: EntityType;
  sourceId: string;
  targetType: EntityType;
  targetId: string;
  relationType: RelationType;
  metadata: Record<string, unknown>;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
};

function mapDbToRelation(row: typeof schema.entityRelations.$inferSelect): EntityRelation {
  return {
    id: row.id,
    sourceType: row.sourceType as EntityType,
    sourceId: row.sourceId,
    targetType: row.targetType as EntityType,
    targetId: row.targetId,
    relationType: row.relationType as RelationType,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    createdById: row.createdById,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function createEntityRelation(
  input: CreateEntityRelationInput,
): Promise<EntityRelation | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const db = getDb();

  const [row] = await db
    .insert(schema.entityRelations)
    .values({
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      targetType: input.targetType,
      targetId: input.targetId,
      relationType: input.relationType,
      metadata: input.metadata ?? {},
      createdById: input.createdById ?? null,
    })
    .onConflictDoNothing({
      target: [
        schema.entityRelations.sourceType,
        schema.entityRelations.sourceId,
        schema.entityRelations.targetType,
        schema.entityRelations.targetId,
        schema.entityRelations.relationType,
      ],
    })
    .returning();

  if (!row) {
    return null;
  }

  return mapDbToRelation(row);
}

export async function deleteEntityRelation(id: string): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    return false;
  }

  const db = getDb();

  const rows = await db
    .delete(schema.entityRelations)
    .where(eq(schema.entityRelations.id, id))
    .returning({ id: schema.entityRelations.id });

  return rows.length > 0;
}

export async function getEntityRelations(
  entityType: EntityType,
  entityId: string,
  direction: "outgoing" | "incoming" | "both" = "both",
): Promise<EntityRelation[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const db = getDb();
  const rows: (typeof schema.entityRelations.$inferSelect)[] = [];

  if (direction === "outgoing" || direction === "both") {
    const outgoing = await db
      .select()
      .from(schema.entityRelations)
      .where(
        and(
          eq(schema.entityRelations.sourceType, entityType),
          eq(schema.entityRelations.sourceId, entityId),
        ),
      );
    rows.push(...outgoing);
  }

  if (direction === "incoming" || direction === "both") {
    const incoming = await db
      .select()
      .from(schema.entityRelations)
      .where(
        and(
          eq(schema.entityRelations.targetType, entityType),
          eq(schema.entityRelations.targetId, entityId),
        ),
      );
    rows.push(...incoming);
  }

  return rows.map(mapDbToRelation);
}

export async function getRelatedEntities(
  entityType: EntityType,
  entityId: string,
  targetType: EntityType,
  relationType?: RelationType,
): Promise<Array<{ relationId: string; relationType: RelationType; targetId: string }>> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const db = getDb();

  const conditions = [
    eq(schema.entityRelations.sourceType, entityType),
    eq(schema.entityRelations.sourceId, entityId),
    eq(schema.entityRelations.targetType, targetType),
  ];

  if (relationType) {
    conditions.push(eq(schema.entityRelations.relationType, relationType));
  }

  const rows = await db
    .select()
    .from(schema.entityRelations)
    .where(and(...conditions));

  return rows.map((row) => ({
    relationId: row.id,
    relationType: row.relationType as RelationType,
    targetId: row.targetId,
  }));
}

export async function hasRelation(
  sourceType: EntityType,
  sourceId: string,
  targetType: EntityType,
  targetId: string,
  relationType?: RelationType,
): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    return false;
  }

  const db = getDb();

  const conditions = [
    eq(schema.entityRelations.sourceType, sourceType),
    eq(schema.entityRelations.sourceId, sourceId),
    eq(schema.entityRelations.targetType, targetType),
    eq(schema.entityRelations.targetId, targetId),
  ];

  if (relationType) {
    conditions.push(eq(schema.entityRelations.relationType, relationType));
  }

  const rows = await db
    .select({ id: schema.entityRelations.id })
    .from(schema.entityRelations)
    .where(and(...conditions))
    .limit(1);

  return rows.length > 0;
}

export function getInverseRelationType(relationType: RelationType): RelationType | null {
  const inverseMap: Record<RelationType, RelationType | null> = {
    depends_on: null,
    blocks: null,
    relates_to: "relates_to",
    duplicates: "duplicates",
    parent_of: "child_of",
    child_of: "parent_of",
    references: null,
    member_of: "has_member",
    has_member: "member_of",
  };

  return inverseMap[relationType] ?? null;
}

export async function createBidirectionalRelation(
  input: CreateEntityRelationInput & { createInverse?: boolean },
): Promise<{ forward: EntityRelation | null; inverse: EntityRelation | null }> {
  const forward = await createEntityRelation(input);

  let inverse: EntityRelation | null = null;

  if (input.createInverse !== false) {
    const inverseType = getInverseRelationType(input.relationType);

    if (inverseType) {
      inverse = await createEntityRelation({
        sourceType: input.targetType,
        sourceId: input.targetId,
        targetType: input.sourceType,
        targetId: input.sourceId,
        relationType: inverseType,
        metadata: input.metadata,
        createdById: input.createdById,
      });
    }
  }

  return { forward, inverse };
}
