import { z } from 'zod';

import { TICKET_STATUS } from '@/modules/cases/domain/status';

export const impactValues = ['one', 'two', 'many'] as const;
export const statusValues = Object.values(TICKET_STATUS) as [string, ...string[]];

export const IMPACT_VALUES = impactValues;
export type Impact = (typeof impactValues)[number];

export const ticketCreateBaseSchema = z.object({
  summary: z.string().trim().min(5, { message: 'Summary must be at least 5 characters' }),
  description: z
    .string()
    .trim()
    .min(5, { message: 'Description must be at least 5 characters' }),
  priority: z
    .number()
    .int()
    .min(1, { message: 'Select a priority' })
    .max(4, { message: 'Priority must be between 1 and 4' }),
  owner: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  file: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  noteValue: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
});
