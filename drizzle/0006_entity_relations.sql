-- Migration: Entity Relations (Capa relacional avanzada)
-- Created: 2026-04-28

CREATE TYPE "public"."entity_relation_type" AS ENUM(
  'depends_on',
  'blocks',
  'relates_to',
  'duplicates',
  'parent_of',
  'child_of',
  'references',
  'member_of',
  'has_member'
);

CREATE TABLE "entity_relations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "source_type" text NOT NULL,
  "source_id" uuid NOT NULL,
  "target_type" text NOT NULL,
  "target_id" uuid NOT NULL,
  "relation_type" "public"."entity_relation_type" NOT NULL DEFAULT 'relates_to',
  "metadata" jsonb NOT NULL DEFAULT '{}',
  "created_by_id" uuid,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX "entity_relations_source_idx" ON "entity_relations" ("source_type", "source_id");
CREATE INDEX "entity_relations_target_idx" ON "entity_relations" ("target_type", "target_id");
CREATE UNIQUE INDEX "entity_relations_unique_idx" ON "entity_relations" ("source_type", "source_id", "target_type", "target_id", "relation_type");

ALTER TABLE "entity_relations" ADD CONSTRAINT "entity_relations_created_by_id_users_id_fk" 
  FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null;
