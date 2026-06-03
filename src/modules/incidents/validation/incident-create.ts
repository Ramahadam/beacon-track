import { z } from 'zod';

import {
  impactValues,
  ticketCreateBaseSchema,
} from '@/modules/cases/validation/ticket-fields';

export const incidentCreateSchema = ticketCreateBaseSchema.extend({
  impact: z.enum(impactValues, { message: 'Select an impact' }),
});

export type IncidentCreateInput = z.input<typeof incidentCreateSchema>;
export type IncidentCreateOutput = z.output<typeof incidentCreateSchema>;
