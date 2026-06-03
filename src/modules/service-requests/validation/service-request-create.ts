import { z } from 'zod';

import {
  impactValues,
  ticketCreateBaseSchema,
} from '@/modules/cases/validation/ticket-fields';

export const serviceRequestCreateSchema = ticketCreateBaseSchema.extend({
  impact: z
    .enum(impactValues)
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export type ServiceRequestCreateInput = z.input<typeof serviceRequestCreateSchema>;
export type ServiceRequestCreateOutput = z.output<typeof serviceRequestCreateSchema>;
