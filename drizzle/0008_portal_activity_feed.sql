-- Migration: Portal Activity Feed (Feed de actividad del cliente)
-- Created: 2026-04-28

CREATE TABLE "portal_activity_feed" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "client_id" uuid NOT NULL,
  "project_id" uuid,
  "actor_type" text NOT NULL,
  "actor_name" text,
  "actor_id" uuid,
  "action" text NOT NULL,
  "entity_type" text NOT NULL,
  "entity_id" uuid NOT NULL,
  "entity_name" text,
  "description" text NOT NULL,
  "metadata" jsonb NOT NULL DEFAULT '{}',
  "client_visible" boolean NOT NULL DEFAULT true,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX "portal_feed_client_idx" ON "portal_activity_feed" ("client_id");
CREATE INDEX "portal_feed_project_idx" ON "portal_activity_feed" ("project_id");
CREATE INDEX "portal_feed_entity_idx" ON "portal_activity_feed" ("entity_type", "entity_id");
CREATE INDEX "portal_feed_created_at_idx" ON "portal_activity_feed" ("created_at");

ALTER TABLE "portal_activity_feed" ADD CONSTRAINT "portal_feed_client_id_clients_id_fk" 
  FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade;

ALTER TABLE "portal_activity_feed" ADD CONSTRAINT "portal_feed_project_id_projects_id_fk" 
  FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null;
