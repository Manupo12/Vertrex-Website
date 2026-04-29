import { z } from "zod";

export const lineItemSchema = z.object({
  label: z.string().min(1),
  description: z.string().min(1),
  amount: z.string().min(1),
});

export const documentDraftSchema = z.object({
  code: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
  city: z.string().min(1),
  subject: z.string().min(1),
  intro: z.string().min(1),
  summary: z.string().min(1),
  closing: z.string().min(1),
  client: z.object({
    name: z.string().min(1),
    nit: z.string().min(1),
    address: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().min(1),
  }),
  scope: z.array(z.string().min(1)).min(1),
  requirements: z.array(z.string().min(1)).min(1),
  lineItems: z.array(lineItemSchema),
  signatory: z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    documentId: z.string().min(1),
    phone: z.string().min(1),
  }),
});
