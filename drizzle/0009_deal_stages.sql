-- Migration: Deal Stages Enum Formalization
-- Created: 2026-04-28

CREATE TYPE "public"."deal_stage" AS ENUM(
  'sin_contactar',
  'contactado',
  'pendiente',
  'interesado',
  'propuesta_enviada',
  'pendiente_anticipo_50',
  'cliente_activo',
  'pausado',
  'perdido'
);

-- Add index for stage
CREATE INDEX "deals_stage_idx" ON "deals" ("stage");
