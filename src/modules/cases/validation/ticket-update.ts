import { z } from 'zod';

import { impactValues, statusValues } from './ticket-fields';

export const ticketUpdateSchema = z.object({
  status: z.enum(statusValues).optional(),
  owner: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  priority: z.number().int().min(1).max(4).optional(),
  impact: z.enum(impactValues).optional(),
  noteValue: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  file: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
});

export type TicketUpdateInput = z.input<typeof ticketUpdateSchema>;
export type TicketUpdateOutput = z.output<typeof ticketUpdateSchema>;
